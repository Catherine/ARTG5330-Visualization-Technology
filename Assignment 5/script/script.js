var canvas_padding = 50;

var margin = {t:canvas_padding, l:canvas_padding, b:canvas_padding, r:canvas_padding},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform', "translate(" + margin.l + "," + margin.t + ")");

//Variables to hold nodes and links data
var dataByState = d3.map();
var latLngByState = d3.map();
var nodes = [];
var links = [];
var states_data;
var connections;

//scales
var scale = {};
scale.nodeSize = d3.scale.sqrt().domain([0,3e7]).range([0,35]);
scale.linkStroke = d3.scale.linear().domain([0,30000]).range([0,10]);
scale.linkStrength = d3.scale.linear().domain([0,80000]).range([0,1]);

var force = d3.layout.force()
    .size([width, height])
    .friction(0.1)     //velocity decay
    .gravity(0)
    .charge(-200)//;      //negative value => repulsion
    .linkStrength(0);

var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])
    .scale(1200);

var path = d3.geo.path()
    .projection(projection);

//import and parse data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.csv, "data/State_to_State_Migrations_Table_2012_clean.csv", parseData)
    .defer(d3.csv, "data/state_latlon.csv", parseLatLng)
    .await(function(err, states){

        links.forEach(function(link){
            link.source = dataByState.get(link.o);
            link.target = dataByState.get(link.d);
        })

        nodes = dataByState.values();

        nodes.forEach(function(node){
            node.x = projection(latLngByState.get(node.state))[0];
            node.y = projection(latLngByState.get(node.state))[1];
        });

        force
            .nodes(nodes)
            .links(links)
            .on('tick', onTick)
            .start();

        draw(states)
    });

function draw(states){

    console.log(states);

    svg.append('path')
        .attr('class','state')
        .datum(states)
        .attr('d',path);

    connections = svg.selectAll('.connection')
        .data(links)
        .enter()
        .append('line')
        .attr('class','connection')
        .style('stroke-width', '1px');

    states_data = svg.selectAll('.state_loc')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class','state_loc')
        .append('circle')
        .attr('r',function(d){ 
            return scale.nodeSize(d.population); 
        });
}

function onTick(e){

    svg.selectAll('.state_loc')
        .attr('transform', function(d){ 
            return 'translate('+ d.x + ',' + d.y + ')'; 
    });

    connections
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
}

function parseData(d){
    dataByState.set(d.State, {
        state: d.State,
        population: +(d["Total population"].replace(/[ ,]/g,"")),
        diffState: +(d["Different state a year ago, total"].replace(/[ ,]/g,"")),
        foreign: +(d["Outside the US a year ago, total"].replace(/[ ,]/g,""))
    });

    var dest = d.State;

    delete d.State;
    delete d["Total population"];
    delete d["Different state a year ago, total"];
    delete d["Outside the US a year ago, total"];
    delete d[dest];

    for(s in d){
        links.push({
            o: s,
            d: dest,
            v: +(d[s].replace(/[ ,]/g,""))
        })
    }
}

function parseLatLng(d){
    if(!d.state) return;
    latLngByState.set(d.state, [+d.longitude, +d.latitude]);
}
var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

//Variables to hold nodes and links data
var dataByState = d3.map(),
    latLngByState = d3.map();
var nodes = [], links = [];

//scales
var scale = {};
scale.nodeSize = d3.scale.sqrt().domain([0,3e7]).range([0,35]);
scale.linkStroke = d3.scale.linear().domain([0,30000]).range([0,10]);
scale.linkStrength = d3.scale.linear().domain([0,80000]).range([0,1]);

//TODO: write a force layout, with 0 gravity, -200 charge, and .1 friction
var force = d3.layout.force();

//TODO: write a d3.geo.albersUsa projection function,
//TODO: don't forget setting .translate()
var projection;


//import and parse data
queue()
    .defer(d3.csv, "data/State_to_State_Migrations_Table_2012_clean.csv", parseData)
    .defer(d3.csv, "data/state_latlon.csv", parseLatLng)
	.await(function(err, states){

        //TODO: look carefully at the content of these three variables to see how they are related
        console.log(dataByState);
        console.log(latLngByState);
        console.log(links);

        //TODO: links array does not yet have "source" and "target"
        //Use this iterative loop to set source and target
        //hint: link.o is the name of the "source" state
        //since dataByState is a d3.map()
        //you can use dataByState.get(link.o) to find the element in the nodes array
        links.forEach(function(link){
            link.source = dataByState.get(link.o);
            link.target = dataByState.get(link.d);
        })

        //TODO: we need to assign an initial x and y value for each node
        nodes = dataByState.values();
        nodes.forEach(function(node){
        });


        //start force layout
        force
            .nodes(nodes)
            .links(links)
            .on('tick', onTick)
            .start();

        draw()
    });

function draw(){
    //TODO: write the code to bind data to DOM elements
}

function onTick(e){
    //TODO: write the onTick function
    //hint: here you are supposed to set the visual attributes of DOM elements

}

function parseData(d){
    dataByState.set(d.State, {
        state: d.State,
        pop: +(d["Total population"].replace(/[ ,]/g,"")),
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
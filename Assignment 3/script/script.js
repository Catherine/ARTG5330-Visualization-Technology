// Catherine Patchell
// ARTG 5330 Visualization Technology
// Assignment 3 - Treemaps

var margin = {t:100,r:100,b:200,l:150},
    width = $('.canvas').width() - margin.l - margin.r,
    height = $('.canvas').height() - margin.t - margin.b;


//Set up SVG drawing elements
var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scales
var scales = {};
    scales.x = d3.scale.log().range([0,width]);
    scales.y = d3.scale.linear().range([height,0]);


//Global variables
var yVariable = "CO2 emissions (kt)",
    y0 = 1997,
    y1 = 2010;


//d3.map for metadata
var metaDataMap = d3.map();

//TODO: create a layout function for a treemap
var treemap = d3.layout.treemap()
    .size([width,height])
    .children(function(d){
        return d.values;
    })
    .value(function(d){
        return d.data.get(1997);
    });
    //.sticky(true)         //sticky treemap layout will preserve the relative arrangement of nodes across transitions
    //.padding(5, 5, 5, 5); //set the padding for each treemap cell, in pixels



//START!
queue()
    .defer(d3.csv, "data/00fe9052-8118-4003-b5c3-ce49dd36eac1_Data.csv",parse)
    .defer(d3.csv, "data/metadata.csv", parseMetaData)
    .await(dataLoaded);

function dataLoaded(err, rows, metadata){
    //TODO: consolidate data and meta data into the same object

    rows.forEach(function(rows){
        row.region = metaDataMap.get(row.key);  //row.key is country name
    })

    var data = d3.nest()  // nest to create heirarchy based on the region attribute
        .key(function(d){
            return d.region;
        })
        .entries(rows);

    var treeMapData = treemap({
        key: "regions",
        values: data
    });

    //console.log(data);

    //Then create hierarchy based on regions

    //TODO: create a layout function using d3.layout.treemap() at the top of the program

    //TODO: let's now layout the data

    draw(treeMapData);
}

function draw(data){
    svg.selectAll('.node')
        .data(data)
        .enter()
        .append('rect')
        .attr('class',"node")
        .attr('transform',function(d){
            return "translate("+d.x+','+d.y+')';
        })
        .attr('width',function(d){return d.dx})
        .attr('height',function(d){return d.dy})
        .style('fill','red')
        .style('stroke-width',"1px")
        .style('stroke','white');

    
}

function parse(d){
    var newRow = {
        key: d["Country Name"],
        series: d["Series Name"],
        data: d3.map()
    };
    for(var i=1990; i <= 2013; i++){
        var heading = i + " [YR" + i + "]";
        newRow.data.set(
            i,
            (d[heading] == ".." ) ? 0 : +d[heading]
        );
    }

    return newRow;
}

function parseMetaData(d){
    //TODO: we would like to put metadata into a map structure
    var countryName = d["Table Name"];
    var region = d["Region"];
    metaDataMap.set(countryName, region);
}
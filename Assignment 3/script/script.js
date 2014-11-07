//Assignment 3
//Due Wednesday November 7 at 5:00PM

var margin = {t:100,r:100,b:200,l:150},
    width = $('.canvas').width() - margin.l - margin.r,
    height = $('.canvas').height() - margin.t - margin.b;


//Set up SVG drawing elements -- already done
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
//TODO: use these variables in lieu of strings
var yVariable = "CO2 emissions (kt)",
    y0 = 1997,
    y1 = 2010;


//d3.map for metadata
var metaDataMap = d3.map();

//TODO: create a layout function for a treemap
var treemap = d3.layout.treemap()
    .children(function(d){
        return d.values;
    })
    .value(function(d){
        return d.data.get(1997);
    })
    .size([width,height])
    .sticky(true)         //extra added during class
    .padding(5, 5, 5, 5); //extra added during class



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
        .entries(rows)

    var root = {
        key: "regions",
        values: data
    };

    //Then create hierarchy based on regions

    //TODO: create a layout function using d3.layout.treemap() at the top of the program

    //TODO: let's now layout the data

    //draw(treeMapData);
}

function draw(data){
    
}

function parse(d){
    var newRow = {
        key: d["Country Name"],
        series: d["Series Name"],
        data:d3.map()
    };
    for(var i=1990; i<=2013; i++){
        var heading = i + " [YR" + i + "]";
        newRow.data.set(
            i,
            (d[heading]=="..")?0:+d[heading]
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
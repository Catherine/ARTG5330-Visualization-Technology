// Catherine Patchell
// ARTG 5330 Visualization Technology
// Assignment 3 - Treemaps

var paddingVal = 25;
var yVariable = "CO2 emissions (kt)";
var y0 = 1997;
var y1 = 2010;

var margin = {t:80, r:paddingVal, b:100, l:paddingVal},
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

//d3.map for metadata
var metaDataMap = d3.map();

//create a layout function using d3.layout.treemap()
var treemap = d3.layout.treemap()
    .size([width, height])
    .children(function(d){
        return d.values;
    })
    .value(function(d){
        return d.data.get(y0);
    })
    .sticky(true)//;         //sticky treemap layout will preserve the relative arrangement of nodes across transitions
    .padding(5, 5, 5, 5); //set the padding for each treemap cell, in pixels

queue()
    .defer(d3.csv, "data/00fe9052-8118-4003-b5c3-ce49dd36eac1_Data.csv",parse)
    .defer(d3.csv, "data/metadata.csv", parseMetaData)
    .await(dataLoaded);

function dataLoaded(err, rows, metadata){
    //consolidate data and meta data into the same object
    rows.forEach(function(row){
        row.region = metaDataMap.get(row.key);
    });

    //create hierarchy based on regions
    var nestedData = d3.nest()
        .key(function(d){ return d.region; })
        .entries(rows);

    console.log(nestedData);

    var summedData = treemap({ key: "regions", values: nestedData });

    //console.log(summedData);

    draw(summedData);
}

function draw(data){
    svg.selectAll('.node')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function(d){ 
            var assignRegion = "undefined_region";
            var setClass = d.region;
            console.log("region is: " + d.region);

            if(setClass == "Latin America & Caribbean"){
                    assignRegion = "la_c";
                }else if (setClass == "North America"){
                    assignRegion = "na";
                }else if (setClass == "Europe & Central North Africa"){
                    assignRegion = "ecna";
                }else if (setClass == "Middle East & North Africa"){
                    assignRegion = "mena";
                }else if (setClass == "East Asia & Pacific"){
                    assignRegion = "eap";
                }else if (setClass == "South Asia"){
                    assignRegion = "sa";
                }else if (setClass == "Europe & Central Asia"){
                    assignRegion = "eca";
                }else if (setClass == "Sub-Saharan Africa"){
                    assignRegion = "ssa";
                }

            return d.children ? "region" : "country "+assignRegion; })
        .attr('width', function(d){ return d.dx })
        .attr('height', function(d){ return d.dy })
        .attr('transform', function(d){ return "translate(" + d.x + ',' + d.y + ')'; })
        //.append('title')
        .text( function(d){ return d.children ? d.key : d.key; })//return d.region + "\n" + "CO2 emissions " + d.life})
        //.style('fill','none')
        //.style('stroke-width',"1px")
        //.style('stroke','white')
        ;


}

function parse(d){
    var newRow = {
        key: d["Country Name"],
        series: d["Series Name"],
        data: d3.map() //set data field as a d3.map so we can add all the values for each of the years
    };

    //populating the d3.map() for each year
    for(var i = y0; i <= y1; i++){
        //create a string based on the year to find in csv
        var yearHeading = i + " [YR" + i + "]";
        //set the data as value from corresponding yearHeading in csv
        newRow.data.set(i, (d[yearHeading] == "..") ? 0 : +d[yearHeading]);
    }
    return newRow;
}

function parseMetaData(d){
    var countryName = d["Table Name"];
    var region = d["Region"];
    metaDataMap.set(countryName, region);
}
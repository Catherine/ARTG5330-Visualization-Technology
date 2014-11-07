var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

//TODO: create a mercator projection function
//var projection = ...

//TODO: create a geo path generator function, with an appropriate projection
//var path = ...

//import data
queue()
	.defer(d3.json, "data/world-50m.json")
    .defer(d3.csv, "data/airports-utf.csv", function(d){
        return {
            IATA: d.iata,
            lngLat: [+d.lng, +d.lat]
        }
    })
	.await(function(err, world, airports){
        if(err) console.error(err);

		draw(world,airports);
	})

function draw(world,airports){
    console.log(world);
    //world data is in the Topojson specification
    //TODO: read topojson specification and usage here
    //https://github.com/mbostock/topojson/wiki/API-Reference
    //especially topojson.feature and topojson.mesh

    //TODO: draw country boundaries

    //TODO: draw land boundaries, with a thicker stroke

    //TODO: draw airports as circles


}
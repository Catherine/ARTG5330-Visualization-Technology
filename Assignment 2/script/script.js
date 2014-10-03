//Assignment 2
//Due Wednesday October 15 at 5:00PM

//Determine the size of the plot, as well as the margins
//This part is already done, but you should feel free to tweak these margins
var margin = {t:200,r:200,b:300,l:200},
    width = $('.canvas').width() - margin.l - margin.r,
    height = $('.canvas').height() - margin.t - margin.b;

//Set up SVG drawing elements -- already done
var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate('+margin.l+','+margin.t+')');

/* Task 2.1
 * Load data using d3.csv()
 * Consult documentation here: https://github.com/mbostock/d3/wiki/CSV
 * recall the syntax is d3.csv(url[, accessor][, callback]), where assessor and callback are both functions
 * YOU WILL NEED TO WRITE THE ASSESSOR FUNCTION
 *
 * HINT:
 * d3.csv("data/world_bank_2010.csv", function(d){ ... }, function(error, rows){ ... }
 *
 *
 */

/* Task 2.2
 * Once data is loaded, call the draw() function
 * YOU WILL NEED TO WRITE THE DRAW FUNCTION
 * The draw() function expects one argument, which is the array object representing the full dataset
 *
 * HINT:
 * function draw(rows){ ... }
 *
 */


/* Task 2.3
 * Mapping domain to range
 * Consult the readme document
 *
 */

/* Task 2.4
 *
 * Draw axes
 * Consult the readme document
 *
 */
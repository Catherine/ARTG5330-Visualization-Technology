//global vars
var min_literacy, max_literacy, min_life, max_life = 0;

//Determine the size of the plot, as well as the margins
var margin = {t:150,r:150,b:400,l:150};
var width = $('.canvas').width() - margin.l - margin.r;
var height = $('.canvas').height() - margin.t - margin.b;

// set up SVG drawing elements
var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate(' + margin.l + ',' + margin.t + ')');

// load data from csv
d3.csv(
  'data/world_bank_2010.csv', 
  function(d){
    return {
      country:d.Country,
      gdp: (d["GDP (constant 2005 US$)"] == "..") ? undefined: +d["GDP (constant 2005 US$)"],
      gdpPerCap: (d["GDP per capita (constant 2005 US$)"] == "..") ? undefined: +d["GDP per capita (constant 2005 US$)"],
      pop: (d["Population, total"] == "..") ? undefined: +d["Population, total"],
      life: (d["Life expectancy at birth, female (years)"] == "..") ? undefined: +d["Life expectancy at birth, female (years)"],
      literacy: (d["Literacy rate, adult total (% of people ages 15 and above)"] == "..") ? undefined: +d["Literacy rate, adult total (% of people ages 15 and above)"],
      malnutrition: (d["Malnutrition prevalence, weight for age (% of children under 5)"] == "..") ? undefined: +d["Malnutrition prevalence, weight for age (% of children under 5)"],
      hospitalBeds: (d["Hospital beds (per 1,000 people)"] == "..") ? undefined: +d["Hospital beds (per 1,000 people)"],
      healthExp: (d["Health expenditure, total (% of GDP)"] == "..") ? undefined: +d["Health expenditure, total (% of GDP)"],
    };
  },
  function(error,rows){
    // if there is an error, print the error in the console
    // also print all of the rows
    // TODO: better error handling implementation
  	if (error){
      console.log(error);
		  console.log(rows);
		}

    console.log(rows);   // for testing purposes

    min_literacy = d3.min(rows, function(d){ return d.literacy; });
    max_literacy = d3.max(rows, function(d){ return d.literacy; });
    min_life = d3.min(rows, function(d){ return d.life; });
    max_life = d3.max(rows, function(d){ return d.life; });

    console.log("min literacy rate: " + min_literacy);
    console.log("max literacy rate: " + max_literacy);
    console.log("min life expectancy: " + min_life);
    console.log("max life expectancy: " + max_life);
      
    // now that the data is parsed, we can draw it
    draw(rows);
  }
);

// scale factors
var x = d3.scale.log().range([0,width]);
var y = d3.scale.linear().range([height,0]);

// create axes
var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(-height,0) //second argument suppresses domain path
    .tickFormat(d3.format(",d"))
    .tickValues([35, 40, 45, 50, 55, 60, 65, 70, 75, 80])
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(5,0)
    .orient("left");


 function draw(rows){
  //plotting the points
  for(var i=0; i < rows.length; i++){
    if (rows[i].life != undefined && rows[i].literacy != undefined){
      svg.append('circle')
        .attr('class','country')
        .attr('cx', rows[i].life / max_life * width)
        .attr('cy', height - rows[i].literacy / max_literacy * height)
        .attr('r', 5) // put in an interesting scale here to make cirlces diff sizes
        .style('fill', '#21AD94')
        .append('title')
        .text(rows[i].country + ": " + rows[i].literacy);
      }
  }

  //drawing the axes
  svg.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate(' + 0 + ',' + height + ')')
    .call(xAxis);
  svg.append('g')
    .attr('class', 'axis y')
    .call(yAxis);
};


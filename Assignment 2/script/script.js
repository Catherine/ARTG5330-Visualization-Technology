//global vars
var min_literacy, max_literacy, min_life, max_life = 0;
var x;
var y;
var radius_scale;

//Determine the size of the plot, as well as the margins
var margin = {t:100,r:50,b:100,l:50};
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
      healthExpense: (d["Health expenditure, total (% of GDP)"] == "..") ? undefined: +d["Health expenditure, total (% of GDP)"],
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

    x = d3.scale.log().range([0,width]).domain([min_life, max_life]);
    y = d3.scale.linear().range([height,0]).domain([min_literacy, max_literacy]);
    radius_scale = d3.scale.sqrt().domain([0,1.3e9]).range([0,50]);

    console.log("min literacy rate: " + min_literacy);
    console.log("max literacy rate: " + max_literacy);
    console.log("min life expectancy: " + min_life);
    console.log("max life expectancy: " + max_life);

    // now that the data is parsed, we can draw it
    draw(rows);
  }
);

 function draw(rows){

  // create axes
  var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(-height, 0) //second argument suppresses domain path
    .tickFormat(d3.format(",d"))
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(7,0)
    .orient("left");

  // select all country
  var countries = svg.selectAll('.country').data(rows, function(d){ return d.country; });

  // append g and class based on country name
  countries.enter()
      .append('g')
      .attr('class', function(d){ return d.country + " country"; });
  
  // then filter out the ones that have undefined data (we don't want to plot those points)
  countries.filter(function(d){ return (d.life != undefined && d.literacy != undefined); })
    .sort(function(a,b){ return b.pop - a.pop; })
    // place on the plot based on the life and literacy values (scaled)
    .attr('transform',function(d){
        return "translate(" + x(d.life) + "," + y(d.literacy) + ")";
    })
    .append('circle')
    .style('fill', '#9F3647')
    .attr('r', function(d){ return radius_scale(d.pop) * 1.3; })
    .append('title')
    .text( function(d){ return d.country + "\n" +
                               "Life expectancy (years): " + d.life + "\n" +
                               "Literacy rate: " + d.life + "%"});

  //drawing the axes
  svg.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate(' + 0 + ',' + height + ')')
    .call(xAxis);
  svg.append('g')
    .attr('class', 'axis y')
    .call(yAxis);
};


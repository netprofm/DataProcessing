/*
d3line.js --- Chris Olberts

Het spijt me werkelijk dat ik de interactiviteit van Part 3 niet heb, maar de twee datasets van Part 4 heb ik wel!
Het plan was om een verticale lijn te maken die door de grafiek achter de cursor aanliep en daarbij op elk snijpunt
met de lijnen de bijbehorende waarde liet zien, en dan aan de bovenkant nog de exacte datum. Helaas heb ik deze 
week weer niet goed m'n tijd verdeeld en heb zodoende geen tijd/denk-energie meer over voor deze data opdracht. Zodoende
lukt het me ook niet meer om de labels in de legenda begrijpelijk te krijgen. Succes met nakijken! ;)
*/

// initialize margins
var margin = {top: 20, right: 60, bottom: 80, left: 60},
	padding = {top: 5, right: 1, bottom: 0, left: 1},
	fullWidth = 1500,
	fullHeight = 600,
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;

// make the date format	
var parse = d3.time.format("%Y/%m/%d").parse;

// set the scales
var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0])
	
// select the colors
var color = d3.scale.category10();

// make the entire chart element
var chartFull =d3.select("body")
	.append("svg")
		.attr("class", "chartFull")
		.attr("width", fullWidth)
		.attr("height", fullHeight)

// load the JSON
d3.json("KNMI.json", function(error, JSONdata) {
		if (error) throw error;
		
		// convert the data to the correct format
		JSONdata.forEach(function(d){
			d.Dates = parse(d.Dates);
			d.WindHigh = +d.WindHigh / 10;
			d.WindAvg = +d.WindAvg / 10;
			d.WindLow = +d.WindLow / 10;
		});
			
		// set the x and y domains to the ranges of the loaded data
		x.domain(d3.extent(JSONdata, function(d) { return d.Dates; }));
		y.domain([0, d3.max(JSONdata, function(d) { return d.WindHigh; })]);
		
		// make the X-axis template...
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(d3.time.format("%b"));
		
		// ... and append to the chart
		chartFull.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
			.call(xAxis);
		
		// X-axis title
		chartFull.append("g")
			.attr("class", "label")
			.attr("transform", "translate(15, " + (height / 2 + 80) + ") rotate(-90)" )
			.append("text")
			.text("Windspeed in M/S");
		
		// make the Y-axis template...
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
		
		// ... and append to the chart
		chartFull.append("g")
			.attr("class", "y-axis")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
			.call(yAxis);
		
		// Y-axis title
		chartFull.append("g")
			.attr("class", "label")
			.attr("transform", "translate(" + (width / 2) + ", " + (fullHeight) + ")")
			.append("text")
			.text("Date in 2015");
			
		
});

// function to draw the lines (called once on page load and when radio button is changed)
function drawGraph(type) {
d3.json("KNMI.json", function(error, JSONdata) {
	
	// since JSON is reloaded: reformat the data
	JSONdata.forEach(function(d){
		d.Dates = parse(d.Dates);
		d.WindHigh = +d.WindHigh / 10;
		d.WindAvg = +d.WindAvg / 10;
		d.WindLow = +d.WindLow / 10;
	});
	
	// clear the previous graph (doesn't do anything first time)
	d3.select(".chartArea").remove();
	
	// make the chartArea
	d3.select(".chartFull")
		.append("g")
			.attr("class", "chartArea")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	chartArea = d3.select(".chartArea");
	
	// differentiate between location IJmuiden and Maastricht
	var dataNest = d3.nest()
		.key(function(d) {return d.Location;})
		.entries(JSONdata);
	
	// make a list with the keys (because JSON is retarded)
	var speeds = ["WindHigh", "WindAvg", "WindLow"];
	
	// apply the colors
	color.domain(speeds);
	
	// for each dataset (high, avg and low) draw a line
	for (var i in speeds) {
			var speed = speeds[i];
			var lineData = d3.svg.line()
					.x(function(d) { return x(d.Dates); })
					.y(function(d) { return y(d[speed]); })
					.interpolate("linear");
			chartArea.append("path")
							.attr("d", function(d) { return lineData(dataNest[type].values);})
							.attr("stroke", color(speed))
							.attr("stroke-width", 1)
							.attr("fill", "none")
							.attr("data-legend", speed);
	}
	
	// make the legend
	legend = chartArea.append("g")
		.attr("class","legend")
		.attr("transform","translate(50,30)")
		.style("font-size","12px")
		.call(d3.legend)
});
}

// first time drawing of the line (0 = IJmuiden)
drawGraph(0);
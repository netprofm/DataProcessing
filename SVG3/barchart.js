// Chris Olberts

var margin = {top: 20, right: 60, bottom: 80, left: 60},
	padding = {top: 5, right: 1, bottom: 0, left: 1},
	fullWidth = 800,
	fullHeight = 600,
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;
	
var parse = d3.time.format("  %Y/%m/%d").parse;
var format = d3.time.format("%d %b");

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
	.range([height, 0])

d3.select("body")
	.append("svg")
		.attr("class", "chart")
		.attr("width", fullWidth)
		.attr("height", fullHeight)
	.append("g")
		.attr("class", "chartArea")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = d3.select(".chart");
var chartArea = d3.select(".chartArea");

d3.json("KNMI999.json", function(JSONdata) {
	x.domain(JSONdata.map(function(d) {  d.Date = parse(d.Date); return format(d.Date); }));
	y.domain([0, d3.max(JSONdata, function(d) { d.Windspeed = +d.Windspeed / 10; return d.Windspeed; })]);
	
	var barWidth = width / JSONdata.length;
	
	var bar = chartArea.selectAll(".bar")
		.data(JSONdata)
		.enter()
			.append("g")
			   .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
		.attr("class", "bar")
		.attr("y", function(d) { return y(d.Windspeed); }) 
		.attr("height", function(d) { return height - y(d.Windspeed); })
		.attr("width", barWidth - padding.left - padding.right);
				
	bar.append("text")
		.attr("class", "bartext")
		.attr("x", barWidth / 2 - 1)
		.attr("y", function(d) { return y(d.Windspeed) + padding.top; })
		.attr("dy", ".75em")
		.text(function(d) { return d.Windspeed; });
	
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	
	chart.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
		.call(xAxis);
		

	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	chart.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(yAxis)
	
	chart.append("g")
		.attr("class", "label")
		.attr("transform", "translate(15, " + (height / 2 + 80) + ") rotate(-90)" )
		.append("text")
		.text("Windspeed in M/S");
			
	chart.append("g")
		.attr("class", "label")
		.attr("transform", "translate(" + (width / 2) + ", " + (fullHeight) + ")")
		.append("text")
		.text("Date in 2016");
});
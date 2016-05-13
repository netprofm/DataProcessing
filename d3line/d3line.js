
var margin = {top: 20, right: 60, bottom: 80, left: 60},
	padding = {top: 5, right: 1, bottom: 0, left: 1},
	fullWidth = 800,
	fullHeight = 600,
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;
	
var parse = d3.time.format("%Y/%m/%d").parse;
var format = d3.time.format("%b");

var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0])

d3.select("body")
	.append("svg")
		.attr("class", "chartFull")
		.attr("width", fullWidth)
		.attr("height", fullHeight)
	.append("g")
		.attr("class", "chartArea")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chartFull = d3.select(".chartFull");
var chartArea = d3.select(".chartArea");

var color = d3.scale.category10();

d3.json("KNMI.json", function(error, JSONdata) {
	if (error) throw error;
	
	var average = [];
	var high = [];
	var low = [];
	
	JSONdata.forEach(function(d){
		d.Dates = parse(d.Dates);
		
		d.WindHigh = +d.WindHigh / 10;
		high.push(d.WindHigh);
		
		d.WindAvg = +d.WindAvg / 10;
		average.push(d.WindAvg);
		
		d.WindLow = +d.WindLow / 10;
		low.push(d.WindLow);
	});
	
	console.log(high);
	
	color.domain(d3.keys(JSONdata[0]).filter(function(key) { return key !== "date"; }));
	
	x.domain(d3.extent(JSONdata, function(d) { return d.Dates; }));
	y.domain([0, d3.max(JSONdata, function(d) {  return d.WindHigh; })]);
	
	console.log(JSONdata);
	
    var dataNest = d3.nest()
        .key(function(d) {return d.Location;})
        .entries(JSONdata);
		
	console.log(dataNest[0].values);	
		
	var lineData = d3.svg.line()
				.x(function(d) { return x(d.Dates); })
				.y(function(d) { return y(d.WindHigh); })
				.interpolate("linear");
		
	var lineDraw = chartArea.append("path")
						.attr("d", function(d) { return lineData(dataNest[0].values);})
						.attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none");
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.time.format("%b"));
	
	chartFull.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
		.call(xAxis);
	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	chartFull.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(yAxis);
	
	chartFull.append("g")
		.attr("class", "label")
		.attr("transform", "translate(" + (width / 2) + ", " + (fullHeight) + ")")
		.append("text")
		.text("Date in 2016");
		
	chartFull.append("g")
		.attr("class", "label")
		.attr("transform", "translate(15, " + (height / 2 + 80) + ") rotate(-90)" )
		.append("text")
		.text("Windspeed in M/S");
});
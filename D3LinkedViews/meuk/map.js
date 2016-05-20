
// initiate some variables
var filldata = ""
var name = ""
var dataSet = {}

// initiate log scale for nice color distribution
var logscale = d3.scale.log()
	.range([1, 100])

// initiate quantize scale for assigning (ordinal) colors from a continuous scale
var densscale = d3.scale.quantize()
	.range(["c1", "c2", "c3", "c4", "c5", "c6"])
	.domain([1, 100]);		

// load the JSON with the density data						
d3.json("output.json", function(JSONdata) {
	
	// set the domain of the logscale from zero to the maximum population density
	logscale.domain([1, d3.max(JSONdata.points, function(d) {return parser(d);})]);
	
	// initiate the filling of the map
	var basic_choropleth = new Datamap({
		element: document.getElementById("basic_choropleth"),
		projection: 'mercator',
		
		// colors from colorbrewer, c1 to c6 = from low to high
		fills: {
			defaultFill: "#aaaaaa",
			c1: "#fee5d9",
			c2: "#fcbba1",
			c3: "#fc9272",
			c4: "#fb6a4a",
			c5: "#de2d26",
			c6: "#a50f15"
			},
		geographyConfig: {
		highlightBorderColor: '#444444',
		highlightBorderWidth: 2,
		highlightFillColor: false,
		
		// make a popup on mouseover displaying the countryname and density
		popupTemplate: function(geography, data) {
				if (data) {
				return '<div class="hoverinfo">' + geography.properties.name + '<br> 	Density:' +  data.density + ' '
				}
				else {
				return '<div class="hoverinfo">' + geography.properties.name + '<br> 	No information  '
				}
			},
		},
	});
				
	// convert country names to abbreviations using the country_codes list
	for (i = 0, n = country_codes.length; i < n; i++) {
		
		// check if the country name of eacht abbreviation is in the json list
		for (j = 0, m = JSONdata["points"].length; j < m; j++) {
			
			// if so, replace the name with the abbreviation
			if (JSONdata["points"][j]["country"] == country_codes[i][2]) {
				
				// on each round, start with a new country code
				name = country_codes[i][1];
				// make a new object for that country in the data list
				dataSet[name] = {};		
				// make the object fillkey for that country and give it the appropriate color (selected through the two scales)
				dataSet[name]["fillKey"] = densscale(logscale(JSONdata["points"][j]["density"])) ;
				// make the object density for that country and appoint the density to it
				dataSet[name]["density"] = JSONdata["points"][j]["density"];
			}
		}
	}
	
	// update the map
	basic_choropleth.updateChoropleth(dataSet);
});

// changes numbers with commas to normal numbers
function parser(d) { 
	d.density = parseFloat(String(d.density).replace(',','')); 
	return d.density
}
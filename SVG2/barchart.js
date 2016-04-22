// Chris Olberts
// loads a json file in a data variable
var data = d3.json("KNMI999.json", function(error, data){ 
	console.log(data);
});
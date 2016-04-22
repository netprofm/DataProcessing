/* Chris Olberts */
window.onload = function() {
 	changeColor("no", "pink");
	changeColor("ch", "red");
	changeColor("dk", "cyan");
	changeColor("fin", "green");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill = color;
};
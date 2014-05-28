
// -------------------------------------------------------------------------
// Common Javascript functions
// last version: 21/05/2014
// Coded by Matteo Poropat ( http://www.matteoporopat.com )
// -------------------------------------------------------------------------



// -------------------------------------------------------------------------
function log(logarea, message) {
	document.getElementById(logarea).value = message + "\n" + document.getElementById(logarea).value;
}


// -------------------------------------------------------------------------
function saveCanvasToFile(canvasName) {
	var canvas = document.getElementById(canvasName);
	var image = canvas.toDataURL("image/png"); //.replace("image/png", "image/octet-stream");
	window.open(image, "Canvas Image");
}


// -------------------------------------------------------------------------
function supports_html5_storage() {
  try { return 'localStorage' in window && window['localStorage'] !== null; } catch (e) { return false; }
}



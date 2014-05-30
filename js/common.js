
// -------------------------------------------------------------------------
// Common Javascript functions
// last version: 30/05/2014
// Coded by Matteo Poropat ( http://www.matteoporopat.com )
// -------------------------------------------------------------------------


// =========================================================================
// GUI FUNCTIONS
// =========================================================================


// -------------------------------------------------------------------------
// mouse position referred to the canvas
// obtained from 
// http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/5932203#5932203
// http://stackoverflow.com/questions/8389156/what-substitute-should-we-use-for-layerx-layery-since-they-are-deprecated-in-web/10816667#10816667
// -------------------------------------------------------------------------
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)
    canvasX = event.clientX - totalOffsetX;
    canvasY = event.clientY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
// add a canvas mouse relative coords function
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;


// -------------------------------------------------------------------------
// check if right button has been clicked
// -------------------------------------------------------------------------
function isRightButton(e) {
	var isRightMB=false;
	if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		isRightMB = e.which == 3; 
	else 
	if ("button" in e)  // IE, Opera 
		isRightMB = e.button == 2;
	return isRightMB;
}


// -------------------------------------------------------------------------
// save canvas to a picture
// -------------------------------------------------------------------------
function saveCanvasToFile(canvasName) {
	var canvas = document.getElementById(canvasName);
	var image = canvas.toDataURL("image/png"); //.replace("image/png", "image/octet-stream");
	window.open(image, "Canvas Image");
}



// =========================================================================
// DATA FUNCTIONS
// =========================================================================


// -------------------------------------------------------------------------
function log(logarea, message) {
	document.getElementById(logarea).value =  document.getElementById(logarea).value + "\n" + message ;
}


// -------------------------------------------------------------------------
function supports_html5_storage() {
  try { return 'localStorage' in window && window['localStorage'] !== null; } catch (e) { return false; }
}



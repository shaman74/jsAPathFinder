
// ------------------------------------------------------------------
//
//       Javascript A* Pathfinding Algorithm
//
// ------------------------------------------------------------------
//
// Coded by Matteo Poropat (http://www.matteoporopat.com)
// Version: 30/05/2014
//
// ------------------------------------------------------------------


// =========================================================================
// DEFINITIONS
// =========================================================================

var clicknum = 0;
var grid=null;
var gridSize=64;
var canvasSize=512;
var startPoint = new Point(5,5);
var endPoint = new Point(gridSize-5,gridSize-5);
var rate = Math.floor(canvasSize/gridSize);
var canvasctx = 0;
var isDrawing = false; // is manual drawing on the grid
var drawingState = false; // toggle the manual drawing state

// cell type and colors
const CELL_EMPTY = 0; // empty
const CELL_FILLED = 1; // filled
const CELL_OPN_LIST = 2; // open list
const CELL_CLS_LIST = 3; // closed list
const CELL_PATH = 4; // path
const CELL_START = 5; // path
const CELL_END = 6; // path
const CELL_COLOR_ARRAY = new Array(
	"rgb(153,0,0)", 
	"rgb(0,0,0)", 
	"rgb(20,170,20)", 
	"rgb(0,0,170)", 
	"rgb(250,250,250)",
	"rgb(0,255,0)",
	"rgb(255,0,0)"
	);

// simple point on the map object
function Point(x,y) {
	this.x=x;
	this.y=y;
}	

function gridPoint(v) {
	this.value=v;
	this.ol=false; // point in openlist
	this.cl=false; // point in closedlist
	this.px=0;
	this.py=0;
}


// =========================================================================
// GRID FUNCTIONS
// =========================================================================

// -------------------------------------------------------------------------
// instantiate grid elements and insert random obstacle and border cells
// -------------------------------------------------------------------------
function createGrid() {
	grid=new Array(gridSize);
	for (var x=0; x<gridSize; x++) {
		grid[x] = new Array(gridSize);
		for (var y=0; y<gridSize; y++) {
			grid[x][y] = new gridPoint(CELL_EMPTY);
		}	
	}
}


// -------------------------------------------------------------------------
// reset grid cells and draw borders
// -------------------------------------------------------------------------
function resetGrid(resetCell) {
	for (var x=0; x<gridSize; x++) {
		for (var y=0; y<gridSize; y++) {
			if (resetCell==true)
				grid[x][y].value = CELL_EMPTY;
			grid[x][y].ol=false; 
			grid[x][y].cl=false; 
			grid[x][y].px=0;
			grid[x][y].py=0;
		}	
	}
	// borders
	for (var x=0; x<gridSize; x++) {
		grid[x][0].value=CELL_FILLED;
		grid[x][gridSize-1].value=CELL_FILLED;
	}
	for (var y=0; y<gridSize; y++) {
		grid[0][y].value=CELL_FILLED;
		grid[gridSize-1][y].value=CELL_FILLED;
	}
}


// -------------------------------------------------------------------------
// randomize grid
// -------------------------------------------------------------------------
function randomGrid() {
	resetGrid();
	for (var x=1; x<gridSize-1; x++) {
		for (var y=1; y<gridSize-1; y++) {
			if (Math.floor(Math.random()+0.52)==1)
				grid[x][y].value=CELL_FILLED;
			else
				grid[x][y].value=CELL_EMPTY;
		}	
	}
}


// -------------------------------------------------------------------------
// clear grid
// -------------------------------------------------------------------------
function clearGrid() {
	for (var x=0; x<gridSize; x++) {
		for (var y=0; y<gridSize; y++) {
			grid[x][y].value = CELL_EMPTY;
		}	
	}
}



// =========================================================================
// CANVAS FUNCTIONS
// =========================================================================

// -------------------------------------------------------------------------
function getCursorPosition (e) {    
	var coords = document.getElementById('playground').relMouseCoords(event);
	return new Point(coords.x,coords.y);
}


// -------------------------------------------------------------------------
//  set a grid point when clicked
// -------------------------------------------------------------------------
function setGridPoint() {    
	var e = window.event;
	var mp = getCursorPosition(e);
	mp.x=Math.floor(mp.x/rate);
	mp.y=Math.floor(mp.y/rate);
	// if drawingState==true we are drawing manually on the grid
	// else we are setting start and end point of the path
	if (drawingState)
	{
		var value=(isRightButton(e))?CELL_EMPTY:CELL_FILLED;
		drawPoint(mp.x,mp.y,value);
		grid[mp.x][mp.y].value=value;
	}
	else
	{
		var rb=isRightButton(e);
		var value=(rb)?CELL_END:CELL_START;
		if (rb) 
		{
			drawPoint(endPoint.x,endPoint.y,CELL_EMPTY);
			endPoint=mp;
		}
		else
		{
			drawPoint(startPoint.x,startPoint.y,CELL_EMPTY);
			startPoint=mp;
		}
		drawPoint(mp.x,mp.y,value);
	}
}


// -------------------------------------------------------------------------
// intercept mouse move on canvas
// -------------------------------------------------------------------------
function canvasOnMouseMove () {    
	if (isDrawing)
		setGridPoint();
}

// -------------------------------------------------------------------------
// intercept mouse move on canvas
// -------------------------------------------------------------------------
function canvasOnMouseDown () {    
	isDrawing=true;
}

// -------------------------------------------------------------------------
// intercept mouse move on canvas
// -------------------------------------------------------------------------
function canvasOnMouseUp () {    
	isDrawing=false;
	setGridPoint();
}


// -------------------------------------------------------------------------
// draw the grid into the canvas
// -------------------------------------------------------------------------
function drawGrid() {
	for (var x=0; x<gridSize; x++) {
		for (var y=0; y<gridSize; y++) {
			var value=grid[x][y].value;
			if (grid[x][y].ol) {
				value=CELL_OPN_LIST;
			}
			if (grid[x][y].cl) {
				value=CELL_CLS_LIST;
			}
			drawPoint(x,y,value);
		}	
	}	
	drawPoint(startPoint.x,startPoint.y,CELL_START);
	drawPoint(endPoint.x,endPoint.y,CELL_END);
}


// -------------------------------------------------------------------------
// draw a square into the canvas
// -------------------------------------------------------------------------
function drawPoint(x,y,type) {
	canvasctx.fillStyle = CELL_COLOR_ARRAY[type];
	canvasctx.fillRect(x*rate, y*rate, rate, rate);
}



// =========================================================================
// EXPORTED FUNCTIONS
// =========================================================================

// -------------------------------------------------------------------------
// save canvas to file
// -------------------------------------------------------------------------
function savePicture() {
	saveCanvasToFile('playground');
}


// -------------------------------------------------------------------------
// save data to local storage
// -------------------------------------------------------------------------
function saveData() {
	log ("logarea", "saving to storage");
    localStorage["mainpf.gridSize"] = gridSize;
	for (var x=0; x<gridSize; x++) {
		for (var y=0; y<gridSize; y++) {
			localStorage["mainpf.grid."+x+"."+y] = grid[x][y].value;
		}	
	}
	log ("logarea", "saved");
}


// -------------------------------------------------------------------------
// load data from local storage
// -------------------------------------------------------------------------
function loadData() {
	log ("logarea", "loading from storage");
    gridSize = parseInt(localStorage["mainpf.gridSize"]);
	log ("logarea", "gridSize="+gridSize);

	for (var x=0; x<gridSize; x++) {
		for (var y=0; y<gridSize; y++) {
			grid[x][y].value = parseInt(localStorage["mainpf.grid."+x+"."+y]);
			grid[x][y].ol=false; 
			grid[x][y].cl=false; 
			grid[x][y].px=0;
			grid[x][y].py=0;
		}	
	}
	log ("logarea", "loaded");
	drawGrid();
}


// -------------------------------------------------------------------------
// create a new grid with randomized cells
// -------------------------------------------------------------------------
function randomizeGrid() {
	clearGrid();
	randomGrid();
	drawGrid();
}


// -------------------------------------------------------------------------
// manual draw grid
// -------------------------------------------------------------------------
function manualDraw() {
	drawingState = !drawingState;
	if (drawingState) 
	{
		document.getElementById('manualDraw').innerHTML="stop drawing";
	}
	else
	{
		document.getElementById('manualDraw').innerHTML="draw";
	}
}


// -------------------------------------------------------------------------
// start path finding
// -------------------------------------------------------------------------
function startPathFinding() {
	// get the selected heuristic function
	var heuristics = document.getElementsByName("hFunctionGrp");
	var h=0;
	for(var i = 0; i < heuristics.length; i++) {
	   if(heuristics[i].checked == true) {
		   h = parseInt(heuristics[i].value);
	   }
	}
	log ("logarea", "heuristic="+h);
	// read cost values
	var lCost = parseInt(document.getElementById('lCost').value);
	var dCost = parseInt(document.getElementById('dCost').value);
	log ("logarea", "linear cost="+lCost);
	log ("logarea", "diagonal cost="+dCost);
	// exec A* path finder
	var output=runPathFinder(grid, startPoint, endPoint, lCost, dCost, h);
	// draw the complete grid with openList, closedList nodes
	drawGrid();
	canvasctx.font="12px Courier New";
	canvasctx.fillStyle = 'white';
	// if success, draw the path
	if (success==true)
	{
		canvasctx.fillText("END REACHED AT CYCLE " + cycle,15,20);
		for (var i=0; i<output.length; i++)
			drawPoint(output[i].x,output[i].y,CELL_PATH);
		document.getElementById('text').innerHTML="Found in " + pathFindingTime + "ms";
	}
	if (deadend==true)
	{
		canvasctx.fillText("DEAD END REACHED AT CYCLE " + cycle,15,20);
		document.getElementById('text').innerHTML="No path found in " + pathFindingTime + "ms";
	}
}


// -------------------------------------------------------------------------
// reset all the demo
// -------------------------------------------------------------------------
function resetDemo(resetCell) {
	resetGrid(resetCell);
	drawGrid();
}
	

// -------------------------------------------------------------------------
// init demo
// -------------------------------------------------------------------------
function initDemo() {
	canvasctx = document.getElementById('playground').getContext('2d');
	// prevent default right click popup menu on canvas to show
	document.getElementById('playground').oncontextmenu = function (e) {
		e.preventDefault();
	};
	// create data grid
	createGrid();
	// reset values and draw the grid
	resetDemo();
}






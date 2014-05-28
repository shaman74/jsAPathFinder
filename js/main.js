
// ------------------------------------------------------------------
//
//       Javascript A* Pathfinding Algorithm
//
// ------------------------------------------------------------------
//
// Coded by Matteo Poropat (http://www.matteoporopat.com)
// Version: 27/05/2014
//
// ------------------------------------------------------------------


// =================================================================================
// DEFINITIONS
// =================================================================================

var clicknum = 0;
var fp = new mapPoint(0,0);
var lp = new mapPoint(0,0);
var matrix=null;
var matrixSize=128;
var canvasSize=512;
var rate = Math.floor(canvasSize/matrixSize);
var canvasctx = 0;

const CELL_EMPTY = 0;
const CELL_FILLED = 1;
const CELL_OPN_LIST = 2;
const CELL_CLS_LIST = 3;
const CELL_LIMIT = 4;

var CELL_COLOR_ARRAY = new Array("rgb(153,0,0)", "rgb(30,0,0)", "rgb(20,200,20)", "rgb(0,0,150)", "rgb(250,250,250)");

// simple point on the map object
function mapPoint(x,y) {
	this.x=x;
	this.y=y;
}	

function matrixPoint(v) {
	this.value=v;
	this.ol=false; // point in openlist
	this.cl=false; // point in closedlist
	this.px=0;
	this.py=0;
}


// =================================================================================
// FUNCTIONS
// =================================================================================

// -------------------------------------------------------------------------
// instantiate grid elements and insert random obstacle and border cells
// -------------------------------------------------------------------------
function createMatrix() {
	matrix=new Array(matrixSize);
	for (var x=0; x<matrixSize; x++) {
		matrix[x] = new Array(matrixSize);
		for (var y=0; y<matrixSize; y++) {
			matrix[x][y] = new matrixPoint(CELL_EMPTY);
			if (Math.floor(Math.random()+0.52)==1)
				matrix[x][y].value=CELL_FILLED;
		}	
	}
	// borders
	for (var x=0; x<matrixSize; x++) {
		matrix[x][0].value=CELL_FILLED;
		matrix[x][matrixSize-1].value=CELL_FILLED;
	}
	for (var y=0; y<matrixSize; y++) {
		matrix[0][y].value=CELL_FILLED;
		matrix[matrixSize-1][y].value=CELL_FILLED;
	}
}


// -------------------------------------------------------------------------
// mouse position referred to the canvas
// -------------------------------------------------------------------------
function getCursorPosition (e) {    
	var x;
    var y;    
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;    
	}    
	else 
	{      
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;      
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;   
	}	
	var cv = document.getElementById('playground');
	x -= cv.offsetLeft;
	y -= cv.offsetTop;
	return new mapPoint(x,y);
}


// -------------------------------------------------------------------------
// intercept mouse click on canvas
// -------------------------------------------------------------------------
function canvasOnClick (e) {    
	var mp = getCursorPosition(e);
	mp.x = Math.floor(mp.x/rate);
	mp.y = Math.floor(mp.y/rate);
	if (matrix[mp.x][mp.y].value==CELL_EMPTY)
	{
		if (clicknum==0)
		{
			fp.x = mp.x;
			fp.y = mp.y;
			clicknum=1;
			document.getElementById('text').innerHTML="Click the picture to select END point";
		}
		else
		{
			lp.x = mp.x;
			lp.y = mp.y;
			clicknum=0;
			document.getElementById('startPathFinding').disabled=false;
			document.getElementById('text').innerHTML="Now you can start jsA* path finder";
		}
		drawPoint(mp.x,mp.y,CELL_LIMIT);
	}
	else
	{
		document.getElementById('text').innerHTML="You must select a EMPTY cell!";	
	}
}


// -------------------------------------------------------------------------
// draw the grid into the canvas
// -------------------------------------------------------------------------
function drawPlayGround() {
	for (var x=0; x<matrixSize; x++) {
		for (var y=0; y<matrixSize; y++) {
			var value=matrix[x][y].value;
			if (matrix[x][y].ol) {
				value=CELL_OPN_LIST;
			}
			if (matrix[x][y].cl) {
				value=CELL_CLS_LIST;
			}
			this.drawPoint(x,y,value);
		}	
	}	
}


// -------------------------------------------------------------------------
// draw a square into the canvas
// -------------------------------------------------------------------------
function drawPoint(x,y,type) {
	canvasctx.fillStyle = CELL_COLOR_ARRAY[type];
	canvasctx.fillRect(x*rate, y*rate, rate, rate);
}


// =================================================================================
// EXPORTED FUNCTIONS
// =================================================================================


// -------------------------------------------------------------------------
function savePicture() {
	saveCanvasToFile('playground');
}


// ---------------------------------------------------------------------------------
function saveData() {
	log ("logarea", "saving to storage");
    localStorage["mainpf.matrixSize"] = matrixSize;
	for (var x=0; x<matrixSize; x++) {
		for (var y=0; y<matrixSize; y++) {
			localStorage["mainpf.matrix."+x+"."+y] = matrix[x][y].value;
		}	
	}
	log ("logarea", "saved");
}


// ---------------------------------------------------------------------------------
function loadData() {
	log ("logarea", "loading from storage");
    matrixSize = parseInt(localStorage["mainpf.matrixSize"]);
	log ("logarea", "matrixSize="+matrixSize);

	for (var x=0; x<matrixSize; x++) {
		for (var y=0; y<matrixSize; y++) {
			matrix[x][y].value = parseInt(localStorage["mainpf.matrix."+x+"."+y]);
			matrix[x][y].ol=false; 
			matrix[x][y].cl=false; 
			matrix[x][y].px=0;
			matrix[x][y].py=0;
		}	
	}
	log ("logarea", "loaded");
	drawPlayGround();
}


// -------------------------------------------------------------------------
// reset grid cells
// -------------------------------------------------------------------------
function resetDemo() {
	for (var x=0; x<matrixSize; x++) {
		for (var y=0; y<matrixSize; y++) {
			if (Math.floor(Math.random()+0.52)==1)
				matrix[x][y].value=CELL_FILLED;
			else
				matrix[x][y].value = CELL_EMPTY;
			matrix[x][y].ol=false; 
			matrix[x][y].cl=false; 
			matrix[x][y].px=0;
			matrix[x][y].py=0;
		}	
	}
	// borders
	for (var x=0; x<matrixSize; x++) {
		matrix[x][0].value=CELL_FILLED;
		matrix[x][matrixSize-1].value=CELL_FILLED;
	}
	for (var y=0; y<matrixSize; y++) {
		matrix[0][y].value=CELL_FILLED;
		matrix[matrixSize-1][y].value=CELL_FILLED;
	}
	drawPlayGround();
}


// -------------------------------------------------------------------------
function startPathFinding() {
	// exec A* path finder
	var output=runPathFinder(matrix, fp, lp);
	// draw the complete matrix with openList, closedList nodes
	drawPlayGround();
	canvasctx.font="12px Courier New";
	canvasctx.fillStyle = 'white';
	// if success, draw the path
	if (success==true)
	{
		canvasctx.fillText("END REACHED AT CYCLE " + cycle,15,20);
		for (var i=0; i<output.length; i++)
			drawPoint(output[i].x,output[i].y,CELL_LIMIT);
		document.getElementById('text').innerHTML="A path has been found!";
	}
	if (deadend==true)
	{
		canvasctx.fillText("DEAD END REACHED AT CYCLE " + cycle,15,20);
		drawPoint(lp.x,lp.y,CELL_LIMIT);
		drawPoint(fp.x,fp.y,CELL_LIMIT);
		document.getElementById('text').innerHTML="No path found :(";
	}
}
	

// -------------------------------------------------------------------------
function initDemo() {
	canvasctx = document.getElementById('playground').getContext('2d');
	var cv = document.getElementById('playground');
	cv.addEventListener("click", canvasOnClick, false);	
	createMatrix();
	resetDemo();
	document.getElementById('startPathFinding').disabled=true;
}



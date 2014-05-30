## jsAPathFinder 

A simple implementation of A* pathfinding algorithm.

Coded by Matteo Poropat ([www.matteoporopat.com](http://www.matteoporopat.com))

### Demo

There is a [simple interactive demo online](http://www.matteoporopat.com/dev/jsademo/index.html) where you can select a heuristic function and draw on the canvas to build new obstacles to the path finder.

### Files

Project's files:

* main.html - the web page with a demo
* main.js - the javascript commands to run the demo
* common.js - simple common functions
* pathfinder.js - core of the project
 
### Notes

This is a first version of a on going project, started to learn Javascript and the basics of topics like *pathfinding* and *procedural generation*.

The H() heuristic function used by the algorithm is a simple Manhattan function.

### Usage

Usage is fair simple, you have to call the function with following parameters:
* data grid
* start point 
* end point
* cost for linear movement
* cost for diagonal movement
* heuristic function to be used

```javascript
var output = runPathFinder(pGrid, pStartPoint, pEndPoint, lCost, dCost, hFunction)
```

where

**grid** is the grid to navigate through, defined as a bidimensional array of matrixPoint items

```javascript
function gridPoint(v) {
	this.value=v;
	this.ol=false; // point in openlist
	this.cl=false; // point in closedlist
	this.px=0;
	this.py=0;
}
```

**pStartPoint** is the starting point and **pEndPoint** is the end point of the path, defined as instances of

```javascript
function Point(x,y) {
	this.x=x;
	this.y=y;
}
```

**hFunction** is a integer choosen from:

* 0 for manhattan h(x)=min(lc,dc)*(abs(x-xt)+abs(y-yt)) 
* 1 for diagonal h(x)=dc*max(abs(x-xt),abs(y-yt))
* 2 for euclidean h(x)=dc*sqrt(sqr(x-xt)+sqr(y-yt))
* 3 for square euclidean h(x)=dc*(sqr(x-xt)+sqr(y-yt))

**output** is an array of Point, containing the path, from the last point to the first point



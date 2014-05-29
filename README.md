## jsAPathFinder 

A simple implementation of A* pathfinding algorithm.

Coded by Matteo Poropat ([www.matteoporopat.com](http://www.matteoporopat.com))

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

Usage is fair simple, for now there are no other parameters than the grid, the start point and the end point.

```javascript
var output=runPathFinder(matrix, fp, lp);
```

where

**matrix** is the grid to navigate through, defined as a bidimensional array of matrixPoint items

```javascript
function matrixPoint(v) {
	this.value=v;
	this.ol=false; // point in openlist
	this.cl=false; // point in closedlist
	this.px=0;
	this.py=0;
}
```

**fp** is the starting point and **lp** is the end point of the path, defined as instances of

```javascript
function mapPoint(x,y) {
	this.x=x;
	this.y=y;
}
```

**output** is an array of mapPoint, containing the path, from the last point to the first point



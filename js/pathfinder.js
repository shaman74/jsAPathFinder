
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

var success = false;
var deadend = false;
var pathFindingTime = 0;
var cycle = 0;


// ---------------------------------------------------------------------------
function listItem(x, y, g, h, f) {
	this.x = x;
	this.y = y;
	this.g = g;
	this.h = h;
	this.f = f;
}


// ---------------------------------------------------------------------------
function findItemAtPos(list, x, y) {
	var result = -1;
	for (var i=0; i<list.length; i++) {
		if ( (list[i].x==x) && (list[i].y==y) ) {
			result=i;
			break;
		}
	}
	return result;
}

	
// ---------------------------------------------------------------------------
// Heuristic function
// ---------------------------------------------------------------------------
function fHeuristic(hf, lCost, dCost, sx,sy,ex,ey) {
	var v;
	switch (hf) {
		// Manhattan
		case 0: v = Math.min(lCost, dCost) * ( Math.abs(sx-ex) + Math.abs(sy-ey) ); break; 
		// Diagonal					
		case 1: v = dCost * Math.max ( Math.abs(sx-ex,2), Math.abs(sy-ey,2) ); break; 
		// Euclidean					
		case 2: v = dCost * Math.sqrt( Math.pow(sx-ex,2) + Math.pow(sy-ey,2) ); break; 
		// Squared Euclidean					
		case 3: v = dCost * ( Math.pow(sx-ex,2) + Math.pow(sy-ey,2) ); break; 
	}
	return v;
}

	
// ---------------------------------------------------------------------------
// A* Algorithm Implementation
// ---------------------------------------------------------------------------
function runPathFinder(pGrid, pStartPoint, pEndPoint, lCost, dCost, hFunction) {
	var start = new Date();
	// add starting point to the list
	var openList = new Array();
	openList.push(new listItem(pStartPoint.x,pStartPoint.y,0,0,0));
	// start the path finding
	cycle=0;
	deadend=false;
	success=false;
	while ( (!deadend) && (!success) ) {
		// find the best F sorting the list
		openList.sort( function(a,b) {return (a.f-b.f);} )
		var x = openList[0].x;
		var y = openList[0].y;
		var g = openList[0].g;
		var h = openList[0].h;
		// set the node as closed using a grid flag
		pGrid[x][y].cl = true;
		pGrid[x][y].ol = false;
		// remove from openList
		openList.splice(0,1);
		
		for (var dx=-1; dx<2 ; dx++) {
			for (var dy=-1; dy<2 ; dy++) {
				var nx=x+dx;
				var ny=y+dy;
				var cell_diff = ( (dx!=0) || (dy!=0) ); // is the cell different?
				if ( (cell_diff==true) && (pGrid[nx][ny].value==CELL_EMPTY) && (pGrid[nx][ny].cl==false) ) {
					// moving to the new cell has a cost
					// diagonal_cost = 2 x linear_cost
					var cost=lCost;
					if ( (dx!=0) && (dy!=0) )
						cost=dCost;
					// is the adjacent cell already in the open list?
					if (pGrid[nx][ny].ol==true) {
						// If the cell is already in the open list, calculate the G value through the new path. 
						// If it is lower, choose the new path, changing G and parent value of the node
						var ciol=findItemAtPos(openList,nx,ny);
						var ng = g + cost;
						if (ng<openList[ciol].g) {
							openList[ciol].g = ng;
							openList[ciol].f = ng + openList[ciol].h;
							pGrid[nx][ny].px = x;
							pGrid[nx][ny].py = y;
						}
					}
					else
					{
						var nh = fHeuristic(hFunction, lCost, dCost, nx, ny, endPoint.x, endPoint.y);
						var ng = g + cost;
						var nf = nh + ng;
						var target = new listItem(nx,ny,ng,nh,nf);
						openList.push(target);
						pGrid[nx][ny].ol = true;
						pGrid[nx][ny].px = x;
						pGrid[nx][ny].py = y;
					}
				}
			}
		}
		
		// no way to it
		if (openList.length==0)
			deadend=true;
		
		// found it!
		if ( (x==pEndPoint.x) && (y==pEndPoint.y) )
			success=true;
		
		cycle++;	
	}

	var end = new Date();
	pathFindingTime = end.getTime()-start.getTime();
	log ("logarea", "time=" + pathFindingTime + "msec");
	
	// create output vector
	var output = null;
	if (success==true) 
	{
		output = new Array();
		x=pEndPoint.x;
		y=pEndPoint.y;
		while ( ! ( (x==pStartPoint.x) && (y==pStartPoint.y) ) )
		{
			var px=pGrid[x][y].px;
			var py=pGrid[x][y].py;
			if ( (px>0) && (py>0) )
			{
				output.push(new Point(x,y));
			}
			x=px;
			y=py;
		}	
	}
	
	return output;
}


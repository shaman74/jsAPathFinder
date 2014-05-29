
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

var success = false;
var deadend = false;
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
function Heuristic(sx,sy,ex,ey) {
	return  ( Math.pow(sx-ex,2) + Math.pow(sy-ey,2) );						
}
	
// ---------------------------------------------------------------------------
function runPathFinder(grid, startPoint, endPoint) {
	var start = new Date();
	// add starting point to the list
	var openList = new Array();
	openList.push(new listItem(startPoint.x,startPoint.y,0,0,0));
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
		// set the node as closed using a matrix flag
		grid[x][y].cl = true;
		grid[x][y].ol = false;
		// remove from openList
		openList.splice(0,1);
		
		for (var dx=-1; dx<2 ; dx++) {
			for (var dy=-1; dy<2 ; dy++) {
				var nx=x+dx;
				var ny=y+dy;
				var cell_diff = ( (dx!=0) || (dy!=0) ); // is the cell different?
				if ( (cell_diff==true) && (grid[nx][ny].value==CELL_EMPTY) && (grid[nx][ny].cl==false) ) {
					// moving to the new cell has a cost
					// diagonal_cost = 2 x linear_cost
					var cost=2;
					if ( (dx!=0) && (dy!=0) )
						cost=2*cost;
					// is the adjacent cell already in the open list?
					if (grid[nx][ny].ol==true) {
						// If the cell is already in the open list, calculate the G value through the new path. 
						// If it is lower, choose the new path, changing G and parent value of the node
						var ciol=findItemAtPos(openList,nx,ny);
						var ng = g + cost;
						if (ng<openList[ciol].g) {
							openList[ciol].g = ng;
							openList[ciol].f = ng + openList[ciol].h;
							grid[nx][ny].px = x;
							grid[nx][ny].py = y;
						}
					}
					else
					{
						var nh = Heuristic(nx,ny,endPoint.x,endPoint.y);
						var ng = g + cost;
						var nf = nh + ng;
						var target = new listItem(nx,ny,ng,nh,nf);
						openList.push(target);
						grid[nx][ny].ol = true;
						grid[nx][ny].px = x;
						grid[nx][ny].py = y;
					}
				}
			}
		}
		
		// no way to it
		if (openList.length==0)
			deadend=true;
		
		// found it!
		if ( (x==endPoint.x) && (y==endPoint.y) )
			success=true;
		
		cycle++;	
	}

	var end = new Date();
	var ftime = end.getTime()-start.getTime();
	log ("logarea", "time=" + ftime + "msec");
	
	// create output vector
	var output = null;
	if (success==true) 
	{
		output = new Array();
		x=endPoint.x;
		y=endPoint.y;
		while ( ! ( (x==startPoint.x) && (y==startPoint.y) ) )
		{
			var px=matrix[x][y].px;
			var py=matrix[x][y].py;
			if ( (px>0) && (py>0) )
			{
				output.push(new mapPoint(x,y));
			}
			x=px;
			y=py;
		}	
	}
	
	return output;
}


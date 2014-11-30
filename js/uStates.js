//(function(){
var width = 960,
    height = 500,
    centered;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");
	
var uStates={};
	
uStates.draw = function(id, data, toolTip){

	function clicked(d) {
		var x, y, k;

		if (d && centered !== d) {
			var centroid = path.centroid(d);
			x = centroid[0];
			y = centroid[1];
			k = 4;
			centered = d;
		} else {
			x = width / 2;
			y = height / 2;
			k = 1;
			centered = null;
		}

		g.selectAll("path")
			.classed("active", centered && function(d) { return d === centered; });

		g.transition()
			.duration(750)
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
			.style("stroke-width", 1.5 / k + "px");
	}
		
	function mouseOver(d){
		d3.select("#tooltip").transition().duration(200).style("opacity", 1);      
		
		d3.select("#tooltip").html(toolTip(d.n, data[d.id]))
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY - 28) + "px");
	}
	
	function mouseOut(){
		d3.select("#tooltip").transition().duration(200).style("opacity", 0);      
	}
	
	d3.select(id).selectAll(".state")
	 	.data(statePaths)
	 	.enter()
	 	.append("path")
	 	.attr("class", "state")
	 	.attr("d", function(d){ return d.d;})
  	 // .style("fill", function(d){ return data[d.id].color; })
	 	.style("fill", "#000000")
	 	.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)
		.on("clicked", clicked);
	}
	
	this.uStates = uStates;
	
//})();
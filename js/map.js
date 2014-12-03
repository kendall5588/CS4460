var map = {};
	
map.draw = function(id, data, tooltip){

	function clicked(d) {
	
		// Put actions on state clicked here
		
	}
		
	function mouseOver(d){
	
		d3.select("#tooltip")
			.transition()
			.duration(200)
			.style("opacity", 1);      
		
		d3.select("#tooltip")
			.html(tooltip(d.n, data[d.id]))
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY - 25) + "px");
	}
	
	function mouseOut(){
	
		d3.select("#tooltip")
			.transition()
			.duration(200)
			.style("opacity", 0);      
	}
	
	d3.select(id).selectAll(".state")
	 	.data(stateBorders)
	 	.enter()
	 	.append("path")
	 	.attr("class", "state")
	 	.attr("d", function(d){ return d.d;})
  	    .style("fill", function(d){ return scores[d.id].color; })
	 	.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)
		.on("clicked", clicked);
}
	
this.map = map;
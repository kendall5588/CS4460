map = {};
previousState = {id:0, n:0, color:0};	
tempState = {id:0, n:0, color:0};

map.draw = function(id, data, tooltip){

	function clicked(d) {
		if (previousState.id != 0) {
			console.log("1");
			d3.select("#"+previousState.id).style("fill", previousState.color);
			d3.select("#"+previousState.n).style("fill", d3.rgb(0, 0, 255));
		}
		if (previousState.id == d.id) {
			console.log("2");
			d3.select("#"+previousState.id).style("fill", previousState.color);
			d3.select("#"+previousState.n).style("fill", d3.rgb(0, 0, 255));
			previousState = {id:0, n:0, color:0};
		} else {
			console.log("3");
			previousState.id = d.id;
			previousState.n = d.n;
			previousState.color = data[d.id].color;
			d3.select("#"+d.id).style("fill", d3.rgb(255, 0, 0));
			d3.select("#"+d.n).style("fill", d3.rgb(255, 0, 0));
		}
	}
		
	function mouseOver(d){
		tempState.id = d.id;
		tempState.n = d.n;
		tempState.color = data[d.id].color;
		d3.select("#"+d.id).style("fill", d3.rgb(0, 255, 0));
		d3.select("#"+d.n).style("fill", d3.rgb(0, 255, 0));
	
		d3.select("#tooltip")
			.transition()
			.duration(200)
			.style("opacity", 1);      
		
		d3.select("#tooltip")
			.html(tooltip(d.n, data[d.id]))
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY - 25) + "px");
	}
	
	function mouseOut(d){
		if (tempState.id != previousState.id) {
			d3.select("#"+d.id).style("fill", tempState.color);
			d3.select("#"+d.n).style("fill", d3.rgb(0, 0, 255));
		}
		d3.select("#tooltip")
			.transition()
			.duration(200)
			.style("opacity", 0);
	}
	
	d3.select(id).selectAll(".state")
	 	.data(stateBorders)
	 	.enter()
	 	.append("path")
		.attr("id", function(d){ return d.id;})
	 	.attr("class", "state")
	 	.attr("d", function(d){ return d.d;})
  	    .style("fill", function(d){ return data[d.id].color; })
	 	.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)
		.on("click", clicked);
}
	
this.map = map;
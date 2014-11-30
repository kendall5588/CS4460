var width = 960,
    height = 500,
    centered;

var projection = d3.geo.albersUsa().scale(1000).translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");


//Load in GeoJSON data
d3.json("json/us.json", function(json) {

		//Bind data and create one path per GeoJSON feature
		svg.selectAll("path")
		   .data(json.features)
		   .enter()
		   .append("path")
		   .attr("d", path);

});


// d3.json("json/us.json", function(error, us) {

// 	svg.insert("path", ".graticule")
//       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//       .attr("class", "state-boundary")
//       .attr("d", path);
	
// 	svg.selectAll("path")
//        .data(topojson.feature(us, us.objects.states).features)
// 	   .enter()
// 	   .append("path")
// 	   .attr("d", path);
	
// 	svg.insert("path", ".graticule")
//       .datum(topojson.feature(us, us.objects.states))
//       .attr("class", "state-boundary")
//       .attr("d", path);
	
// 	svg.insert("path", ".graticule")
//       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//       .attr("class", "state-boundary")
//       .attr("d", path);

// });

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
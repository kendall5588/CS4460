
//coropleth functions start
function coropleth() {
	width = 35, barHeight = 35; scores = {}; scale = [];
	states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

	//default data reading
	updateClicked();

}

function createScale(min, max) {
	if (min > 100) {
		return [max, Math.round(min + dif * .75), Math.round(min + dif * .5), Math.round(min + dif * .25), min];
	} else {
		return [max.toFixed(1), (min + dif * .75).toFixed(1), (min + dif * .5).toFixed(1), (min + dif * .25).toFixed(1), min.toFixed(1)];
	}
}

function updateClicked() {
	clearBox("statesvg");
	e = document.getElementById("maindropdown");
	column = e.options[e.selectedIndex].value;
	d3.csv("res/default.csv", function(error, data) {
		min = parseFloat(d3.min(data, function(d) {return d[column];}));
		max = parseFloat(d3.max(data, function(d) {return d[column];}));
		dif = max - min;
		scale = createScale(min, max);
		for (var index = 0; index < data.length; ++index) {
			data[index][column] = +data[index][column];
			var temp = 255 * (data[index][column] - min) / (max - min);
			scores[states[index]] = {score : data[index][column], color : d3.rgb(0, 0, temp)};
		}
		
		//draw map
		map.draw("#statesvg", scores, tooltip);

		//draw legend
		color = d3.scale.ordinal().range(getColor(scale, min, max));
		svg = d3.select("#statesvg").append("svg").append("g").attr("transform", "translate(850,400)");
		color.domain(scale);
		legend = svg.selectAll(".legend").data(color.domain().slice()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});
		legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);
		legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {return d;});
	});
}

function clearBox(elementID){
	document.getElementById(elementID).innerHTML = "";
}

function getColor(a, min, max) {
	var ret = [];
	for (var i = 0; i < a.length; i++) {
		ret[i] = d3.rgb(0, 0, 255 * (a[i] - min) / (max - min))
	}
	return ret;
}

function tooltip(n, d) {
	return "<h4>" + n + "</h4><table><tr><td>Score</td><td>" + (d.score) + "</td></tr></table>";
}

//coropleth functions end - scatterplot functions start
function updateScatterplot() {
	d = document.getElementById('rightMainScreen');
	old = document.getElementById('scatterPlotsvg');
	d.removeChild(old);
	drawScatterplot();
}

function drawScatterplot() {
	var margin = {top: 20, right: 40, bottom: 30, left: 60},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// setup x 
	var xValue = function(d) { return d[xHeader];}, // data -> value
		xScale = d3.scale.linear().range([0, width]), // value -> display
		xMap = function(d) { return xScale(xValue(d));}, // data -> display
		xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d[yHeader];}, // data -> value
		yScale = d3.scale.linear().range([height, 0]), // value -> display
		yMap = function(d) { return yScale(yValue(d));}, // data -> display
		yAxis = d3.svg.axis().scale(yScale).orient("left");

	// setup fill color. We can modify this to have color represent a variable
	var cValue = function(d) { return d.score;},
		color = d3.scale.category10();

	// add the graph canvas to the body of the webpage
	var svg = d3.select("#rightMainScreen").append("svg")
		.attr("id", "scatterPlotsvg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("id", "scatterPlotg")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip1 = d3.select("#rightMainScreen").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	e = document.getElementById("xdropdown");
	xHeader = e.options[e.selectedIndex].value;
	var e = document.getElementById("ydropdown");
	yHeader = e.options[e.selectedIndex].value;
	
	// load data
	//d3.csv("res/scatterplotData.csv", function(error, data) {
	d3.csv("res/default.csv", function(error, data) {
		data.forEach(function(d) {
			d[xHeader] = +d[xHeader];
			d[yHeader] = +d[yHeader];
		});
		// don't want dots overlapping axis, so add in buffer to data domain
		xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
		yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
		// x-axis
		d3.select("#scatterPlotg").append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)
			.append("text")
			  .attr("class", "label")
			  .attr("x", width)
			  .attr("y", -6)
			  .style("text-anchor", "end")
			  .text(xHeader);
		// y-axis
		d3.select("#scatterPlotg").append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("class", "label")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(yHeader);
		
		// draw dots
		d3.select("#scatterPlotg").selectAll(".dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", xMap)
				.attr("cy", yMap)
				//If we want the color of the dots to be relevant, change this	
				//.style("fill", function(d) { return color(cValue(d));}) 
				.on("mouseover", function(d) {
					tooltip1.transition()
						.duration(200)
						.style("opacity", .9);
					tooltip1.html(d.id + "<br/> (" + xValue(d) 
						+ ", " + yValue(d) + ")")
						.style("left", (d3.event.pageX + 5) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d) {
					tooltip1.transition()
						.duration(500)
						.style("opacity", 0);
				});
	});
}

//scatterplot functions end - main/comp screen functions start

function showMain() {
	compScreen.style.display = 'none';
	mainScreen.style.display = 'block';
}

function showComp() {
	mainScreen.style.display = 'none';
	compScreen.style.display = 'block';
}



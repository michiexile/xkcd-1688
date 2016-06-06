// developed against jQuery 1.12.2 and d3.js 

var xkcd1688;

var width=600,
    height=50;

var svg = d3.select("#svg_canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var gradient = svg.append('defs')
    .attr('id', 'axis_gradient')
    .append('linearGradient');
gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'blue')
    .attr('stop-opacity', '0.0');
gradient.append('stop')
    .attr('offset', '95%')
    .attr('stop-color', 'black')
    .attr('stop-opacity', '1.0');


var axis = svg.append('g');
var active = svg.append('g')
    .attr('id', 'active');

var year_scale = d3.scale.linear()
    .domain([1790, 2030])
    .range([0, width]);

axis.append('line')
    .attr('x1', year_scale(1790))
    .attr('x2', year_scale(1800))
    .attr('y1', height/2)
    .attr('y2', height/2)
    .attr('stroke-width', '2')
    .attr('class', 'intro');
axis.append('line')
    .attr('x1', year_scale(1800))
    .attr('x2', year_scale(2025))
    .attr('y1', height/2)
    .attr('y2', height/2)
    .attr('stroke-width', '2')
    .attr('class', 'timeline');
for(var i=0; i<(203-180); i++) {
    var offset = 5;
    if((i % 5) == 0)
	offset = 7;
    if((i % 10) == 0)
	offset = 10;
    
    axis.append('line')
	.attr('x1', year_scale(1800+10*i))
	.attr('x2', year_scale(1800+10*i))
	.attr('y1', height/2-offset)
	.attr('y2', height/2+offset)
	.attr('stroke-width', '1')
	.attr('class', 'timeline');
}
axis.append('text')
    .attr('x', year_scale('1800'))
    .attr('y', height/2+20)
    .attr('text-anchor', 'middle')
    .text('1800');
axis.append('text')
    .attr('x', year_scale('1900'))
    .attr('y', height/2+20)
    .attr('text-anchor', 'middle')
    .text('1900');
axis.append('text')
    .attr('x', year_scale('2000'))
    .attr('y', height/2+20)
    .attr('text-anchor', 'middle')
    .text('2000');

function ask_question(xkcd1688, node) {
    $('#question')
	.html(node.find("question").first().text().trim()
	     .replace(/\[/g,'<').replace(/\]/g,'>'));

    console.log(node.find('option'));
    var divs = d3.select('#options')
	.selectAll('div')
	.data(node.find('option').toArray());
    divs.exit().remove();
    divs.enter()
    	.append('div');
    
    divs.attr('id', function(d) {
	    console.log(d);
	    return $(d).attr('target');})
	.on('click', function(d) {
	    ask_question(xkcd1688,
			 $(xkcd1688).find('#'+$(d).attr('target')).first());
	})
	.attr('class', 'button-' + divs.size())
	.html(function(d) {
	    return $(d).text().trim()
		.replace(/\[/g,'<').replace(/\]/g,'>');
	});

    var ranges = [];
    node.find('range').each(function(index){
	var begin = parseFloat($(this).find('begin').first().attr('year'));
	if(isNaN(begin)) begin = 1800;
	var end = parseFloat($(this).find('end').first().attr('year'));
	if(isNaN(end)) end = 2030;
	begin = Math.max(1800, begin);
	end = Math.min(2025, end);
	ranges.push([begin,end]);
    });
    
    $('.active').remove();
    var rangetext = ""
    if(node.prop('tagName') == 'leaf') {
	rangetext += node.text().trim()
	    .replace(/\[/g,'<').replace(/\]/g,'>');
	rangetext += '<br/>';
    }
    $(ranges).each(function(index){
	rangetext += this[0] + "-" + this[1] + "<br/>";
	active.append('line')
	    .attr('x1', year_scale(this[0]))
	    .attr('x2', year_scale(this[1]))
	    .attr('y1', height/2)
	    .attr('y2', height/2)
	    .attr('stroke-width', '8')
	    .attr('class', 'active')
	    .append('title')
	    .text(this[0] + "-" + this[1]);
    });
    if(node.prop('tagName') == 'leaf') {
	$('#question').remove();
	$('#range').html(rangetext);
    }
}


d3.xml("xkcd1688.xml", function(error, data) {
    if(error) throw error;
    xkcd1688 = data;

    var node = $(xkcd1688).find("#root").first();

    ask_question(xkcd1688, node);
});
 

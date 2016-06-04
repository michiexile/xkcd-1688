// developed against jQuery 1.12.2 and d3.js 

var xkcd1688;

var width=600,
    height=600,
    linewidth=40;

var svg = d3.select("#svg_canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

function draw_timeline(cx, cy, w, ranges) {
    
}

d3.xml("xkcd1688.xml", function(error, data) {
    if(error) throw error;
    xkcd1688 = data;

    var vertices = $.map(
	$(xkcd1688).find("node, leaf"),
	function(node) {
	    return {
		id: node.id,
		children: $(node).find("option"),
		level: 0,
		question: $.trim($($(node).find("question").get(0)).text()),
		from: $($(node).find("range > begin").get(0)).attr("year"),
		to: $($(node).find("range > end").get(0)).attr("year")
	    }
	});
    
    var vertices_ids = $.map(vertices, function(vtx){ return vtx.id; });
    var edges = [];
    var maxlevel = 0;
    for(var i=0; i<vertices.length; i++) {
	var node = vertices[i];
	for(var j=0; j<node.children.length; j++) {
	    var child = node.children[j];
	    var child_id = $.inArray($(child).attr('target'), vertices_ids);
	    if(child_id > 0) {
		edges.push({
		    source: i,
		    target: child_id,
		    option: $(child).text()
		});
	    }
	    if((vertices[child_id] != undefined) &&
	       (vertices[child_id].level == 0)) {
		vertices[child_id].level = node.level + 1;
		if(maxlevel < vertices[child_id].level) {
		    maxlevel = vertices[child_id].level;
		}
	    }
	}
    }

    var steps = height / (maxlevel + 2);
    
    force
	.nodes(vertices)
        .links(edges)
        .start();

    var links = svg.selectAll(".link")
	.data(edges)
	.enter()
	.append("line")
	.classed("link", true);
    
    var nodes = svg.selectAll(".node")
	.data(vertices)
	.enter()
	.append("svg")
	.attr("height", 10)
	.attr("width", linewidth)
	.classed("node", true)
	.call(force.drag);

    nodes.append("title")
	.text(function(d) { return d.question; });

    nodes.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", 1)
	.attr("width", linewidth)
	.classed("timeline-backdrop", true);
    nodes.append("rect")
	.attr("x", function(d) {
	    if(d.from != undefined) {
		return parseFloat(d.from);
	    } else {
		return 0;
	    }
	})
	.attr("width", function(d) {
	    if((d.from != undefined) && (d.to != undefined)) {
		return parseFloat(d.to)-parseFloat(d.from);
	    } else {
		return 0;
	    }
	})
	.attr("y", 0)
	.attr("height", 5)
	.classed("timeline-active", true);
    
    force.on("tick", function() {
	nodes.attr("x", function(d) { return d.x; })
	    .attr("y", function(d) {
		d.y = steps * (d.level + 1);
		return d.y; });
	links.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
    });
});
 

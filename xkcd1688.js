// developed against jQuery 1.12.2 and d3.js 

var xkcd_data;
d3.xml("xkcd1688.xml", function(error, xkcd1688) {
    if(error) throw error;
    xkcd_data = xkcd1688;
    
    var vertices = [].map.call(
	xkcd1688.querySelectorAll("node, leaf"),
	function(node) {
	    return {
		id: node.getAttribute("id"),
		children: node.querySelectorAll("option").map.call(
		    function(option) {
			return option.getAttribute("target");
		    })
	    };
	});
    
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    
});

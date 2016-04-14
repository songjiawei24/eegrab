console.log("from script");

var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal() // invitation rounds
    .rangeRoundBands([0, width], .1);

var y1 = d3.scale.linear() // score of invitations
    .range([height, 0]);

var y2 = d3.scale.linear() // number of invitations
    .range([height, 0]);



var xAxis = d3.svg.axis() // x
    .scale(x)
    .orient("bottom");

var yAxis1 = d3.svg.axis() // y for score
    .scale(y1)
    .orient("left");

var yAxis2 = d3.svg.axis() // y for num
    .scale(y2)
    .orient("right");

var tipNum = d3.tip() // tool tip for num
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        var date = "<strong>Date:</strong> <span>" + d.date + "</span>";
        var invited = "<strong>Number invited:</strong> <span>" + d.num + "</span><br />";
        var score = "<strong>Score:</strong> <span>" + d.score + "</span><br />";
        return invited + score + date;
    })
var tipScore = d3.tip() // tool tip for num
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        var date = "<strong>Date:</strong> <span>" + d.date + "</span>";
        var invited = "<strong>Number invited:</strong> <span>" + d.num + "</span><br />";
        var score = "<strong>Score:</strong> <span>" + d.score + "</span><br />";
        return score + invited + date;
    })

var line1 = d3.svg.line() // make line follow score y
    .x(function(d) { return x(d.round); })
    .y(function(d) { return y1(d.score); });
    
var line2 = d3.svg.line() // make line follow num y
    .x(function(d) { return x(d.round); })
    .y(function(d) { return y2(d.num); });

var svg = d3.select(".chart-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tipNum);
svg.call(tipScore);

d3.json("data.json", function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.round; }));

    var y1Max = d3.max(data, function(d) {
        return parseInt(d.score) + 100;
    });
    y1.domain([400, y1Max]);

    var yMax2 = d3.max(data, function(d) {
        return parseInt(d.num) + 200;
    });
    y2.domain([500, yMax2]);

    svg.append("g") // x axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g") // y axis for score
        .attr("class", "y axis score")
        .call(yAxis1)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("CRS lowest score");

    svg.append("g") // y axis for num
        .attr("class", "y axis num")
        .call(yAxis2)
        .attr("transform", "translate(" + width + " ,0)")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -15)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of invitations");

    svg.selectAll(".bar") // bar chart for num
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            var temp = x(d.round); 
            return temp; 
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y2(d.num); })
        .attr("height", function(d) { return height - y2(d.num); })
        .on('mouseover', tipNum.show)
        .on('mouseout', tipNum.hide);

    svg.append("path") // line for score
        .datum(data)
        .attr("transform", "translate(" + x(1) + ",0)")
        .attr("class", "line")
        .attr("d", line1);
        
    /*svg.append("path") // line for num
        .datum(data)
        .attr("transform", "translate(" + x(1) + ",0)")
        .attr("class", "line")
        .attr("d", line2);*/

    svg.selectAll(".dot") // dots reprensent scores
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", function(d) { return x(d.round) + x(1); })
        .attr("cy", function(d) { return y1(d.score); })
        .on('mouseover', tipScore.show)
        .on('mouseout', tipScore.hide);;
});
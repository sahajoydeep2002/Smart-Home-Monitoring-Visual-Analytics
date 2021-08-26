var cols=[];
var corr = [];

var margin = {top: 90, bottom: 30, left: 90, right: 30};

var dim = 1000; //d3.min([window.innerWidth * .9, window.innerHeight * .9])

var width = dim - margin.left - margin.right, height = dim - margin.top - margin.bottom;

var svg = d3.select("#grid").append("div")
                .classed("svg-container", true) 
                .attr('style','padding-bottom: 100%')
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 1000 1000")
                .classed("svg-content-responsive", true)
                .append("g")
                  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");



// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)

var padding = .1;

d3.csv("data/correlation.csv",
  function(d,i){
    var x = d[""];
    delete d[""];
    cols.push(x);
    // console.log(d)
    for(var prop in d) {
      var y = prop,
        value = d[prop];
      corr.push({
        column_a: x,
        column_b: y,
        correlation: +value
      });
    }
  }
)
  .then(function(data) {
  d3.select("corrmat")
    .append("rect")
    .attr("id", "tip-tool")
    .attr("opacity", "0");

  var grid = data2grid.grid(corr);
  var rows = d3.max(grid, function(d){ return d.row; });
    
  var extent = d3.extent(corr.map(function(d){ return d.correlation; })
    .filter(function(d){ return d !== 1; }));

  var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));

  var y = d3.scaleBand()
    .range([0, height])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));

  var c = chroma.scale(["#b2df8a", "white", "steelblue"])
    .domain([-1, 0, 1]);

  var x_axis = d3.axisTop(y).tickFormat(function(d, i){ return cols[i]; });
  var y_axis = d3.axisLeft(x).tickFormat(function(d, i){ return cols[i]; });

  svg.append("g")
      .attr("class", "x axis")
      .call(x_axis)
      .selectAll("text")	
        .attr('text-anchor', 'start')
        .attr("dx", "0.8em")
        .attr("dy", "0.5em")
        .attr('transform', 'rotate(-45)');

  svg.append("g")
      .attr("class", "y axis")
      .call(y_axis);

  svg.selectAll("text")
      .data(grid, function(d){ return d.column_a + d.column_b; })
    .enter().append("text")
      .attr('id', function(d){return 'txt-'+d.column+d.row})
      .attr("x", function(d){ return x(d.column) + 16; })
      .attr("y", function(d){ return y(d.row) + 18; })
      .text(function(d){ return d.correlation.toFixed(2); })
      .style("fill", 'black')
      .attr('text-anchor', 'middle')
      .style("opacity", 0);

  svg.selectAll("rect")
      .data(grid, function(d){ return d.column_a + d.column_b; })
    .enter().append("rect")
      .attr("x", function(d){ return x(d.column); })
      .attr("y", function(d){ return y(d.row); })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d){ return c(d.correlation); })
      .style("opacity", 1e-6)
    .transition()
      .style("opacity", 1);

  svg.selectAll("rect")

  d3.selectAll("rect")
    .on("mouseover", function(d){

      var coordinates= d3.mouse(this);
      d3.select(this).classed("selected", true);

      d3.select("#txt-"+d.column+d.row).style("opacity", 1);
      d3.select(this).attr("fill-opacity", 0).transition();

      //   console.log(d)
      // var row_pos = y(d.row);
      // var col_pos = x(d.column);
      // var tip_pos = d3.select("#tip-tool").node().getBoundingClientRect();
      // var tip_width = x_pos;
      // var tip_height = y_pos;
      // var grid_pos = d3.select("#grid").node().getBoundingClientRect();
      // var grid_left = grid_pos.left;
      // var grid_top = grid_pos.top;

      // var left = grid_left + col_pos + margin.left + (x.bandwidth() / 2) - (tip_width / 2);
      // var top = grid_top + row_pos + margin.top - tip_height - 5;

      // d3.select("#tip-tool")
      //     .style("left", x_pos + "px")
      //     .style("top", y_pos + "px");

      d3.select(".x.axis .tick:nth-of-type(" + d.column + ") text").classed("selected", true);
      d3.select(".y.axis .tick:nth-of-type(" + d.row + ") text").classed("selected", true);
      d3.select(".x.axis .tick:nth-of-type(" + d.column + ") line").classed("selected", true);
      d3.select(".y.axis .tick:nth-of-type(" + d.row + ") line").classed("selected", true);

    })
    .on("mouseout", function(d){
      d3.selectAll("rect").classed("selected", false);
      d3.select("#tip-tool").style("display", "none");
      d3.selectAll(".axis .tick text").classed("selected", false);
      d3.selectAll(".axis .tick line").classed("selected", false);
      d3.select("#txt-"+d.column+d.row).style("opacity", 0);
      d3.select(this).attr("fill-opacity", 1).transition();
    });

  // legend scale
  var legend_top = 15;
  var legend_height = 15;

  var legend_svg = d3.select("#legend").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", legend_height + legend_top)
    .append("g")
      .attr("transform", "translate(" + margin.left + ", " + legend_top + ")");

  var defs = legend_svg.append("defs");

  var gradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

  var stops = [{offset: 0, color: "#b2df8a", value: -1}, 
               {offset: .5, color: "white", value: 0}, 
               {offset: 1, color: "steelblue", value: 1}];
  
  gradient.selectAll("stop")
      .data(stops)
    .enter().append("stop")
      .attr("offset", function(d){ return (100 * d.offset) + "%"; })
      .attr("stop-color", function(d){ return d.color; });

  legend_svg.append("rect")
      .attr("width", width-150)
      .attr("height", legend_height)
      .style("fill", "url(#linear-gradient)");

  legend_svg.selectAll("text")
      .data(stops)
    .enter().append("text")
      .attr("x", function(d){ return (width-150) * d.offset; })
      .attr("dy", -3)
      .style("text-anchor", function(d, i){ return i == 0 ? "start" : i == 1 ? "middle" : "end"; })
      .text(function(d, i){ return d.value.toFixed(2); })
  });
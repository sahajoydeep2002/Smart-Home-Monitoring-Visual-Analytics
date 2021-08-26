
    var w = 960,
        h = 400
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 40, bottom: 10, left: 30},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    var idSelected = [];
    // append the svg object to the body of the page
    var scatt = d3.select("#scatterplotChartContainer")
                .append("div")
                    .classed("svg-container", true) 
                        .attr('style','padding-bottom: 45%')
                    .append("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "0 0 "+w+" "+h+"")
                        .classed("svg-content-responsive", true)
                    .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");
    
    
    var color = d3.scaleSequential(d3.interpolateYlGnBu);
                        
    //Read the data
    d3.csv("data/tsne.csv", function(d, i){
       if( i %5 == 0){ // Campionamento ogni 5 minuti 
            return {
                id: i,
                display: true,
                pc1: parseFloat(d['PC1']),
                pc2: parseFloat(d['PC2']),
                use: parseFloat(d['use'])
            };
        };
    }).then( function(data){

        // console.log(d3.extent(data, (d)=>{ return d.use}))
        // Add X axis
        var x = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.pc1 -2}), 
                     d3.max(data, function(d) { return d.pc1 +2})])
            .range([ 0, width *0.9]);

        var xAxis = scatt.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.pc2 -5}), 
                d3.max(data, function(d) { return d.pc2 +5 })])
            .range([ height, 0]);

        var yAxis = scatt.append("g")
            .call(d3.axisLeft(y));

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = scatt.append("defs").append("svg:clipPath")
                                        .attr("id", "clip-scatter")
                                        .append("svg:rect")
                                        .attr("width", width )
                                        .attr("height", height )
                                        .attr("x", 0)
                                        .attr("y", 0);

        // Color scale: give me a specie name, I return a color
        color.domain([d3.max(data, (d)=>{ return d.use}),0]) //d3.extent(data, (d)=>{ return d.use})
                console.log(d3.max(data, (d)=>{ return d.use}))
    //                     d3.scaleSequential(d3.interpolateInferno)
    // .domain([0, width])
        // console.log(d3.extent(data, (d)=>{ return d.use}))

        // Add brushing
        var brush = d3.brush()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width*0.9,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", function(){

                var extent = d3.event.selection
                
                // console.log(d3.event)
                // If no selection, back to initial coordinate. Otherwise, update X axis domain
                if(!extent){
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    // x.domain([d3.min(data, function(d) { return d.pc1; }) -1, 
                    //           d3.max(data, function(d) { return d.pc1; }) +1])
                    // y.domain([d3.min(data, function(d) { return d.pc1; }) -3, 
                    //           d3.max(data, function(d) { return d.pc1; }) +1])

                }else{
                    idSelected = []
                    scatt.selectAll('circle').classed('not-brushed', false)
                    // x.domain([ x.invert(extent[0][0]), x.invert(extent[1][0]) ])
                    // y.domain([ y.invert(extent[1][1]), y.invert(extent[0][1]) ])
                    var brush_coords = d3.brushSelection(this);
                    var x0 = brush_coords[0][0],
                        x1 = brush_coords[1][0],
                        y0 = brush_coords[0][1],
                        y1 = brush_coords[1][1];
                    
                    
                    // style brushed circles
                    scatt.selectAll('circle')
                                    .filter(function (){
                                        var cx = d3.select(this).attr("cx"),
                                            cy = d3.select(this).attr("cy");
                                        if((x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1)){
                                            idSelected.push(d3.select(this).data()[0].id)
                                        }
                                        return !(x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1);
                           }).attr('class', 'not-brushed');

                    if(idSelected.length == 0){
                        scatt.selectAll('circle').classed('not-brushed', false)
                        foreground.style('display', null);
                        parall.selectAll(".brush-parall").call(brush.move, null)
                        parall.selectAll(".brush-parall").call(brush.move, null)
                        return;
                    }

                    foreground.style('display', 'none');

                    for(var i =0; i < idSelected.length; i++){
                        parall.selectAll('#fore-'+idSelected[i]).style('display', null)
                    }

                    scatt.select(".brush-scatter").call(brush.move, null) 
                    parall.selectAll(".brush-parall").call(brush.move, null)// This remove the grey brush area as soon as the selection has been done
                }

                // Update axis and circle position
                xAxis.transition().duration(1000).call(d3.axisBottom(x))
                yAxis.transition().duration(1000).call(d3.axisLeft(y))
                scatt
                    .selectAll("circle")
                    .transition().duration(1000)
                    .attr("cx", function (d) { return x(d.pc1); } )
                    .attr("cy", function (d) { return y(d.pc2); } )

            }) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var scatter = scatt.append('g')
            .attr("clip-path", "url(#clip-scatter)")

        // Add circles
        scatter.append('g')
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", (d)=>{return "scat-"+d.id})
            .attr("cx", function (d) { return x(d.pc1); } )
            .attr("cy", function (d) { return y(d.pc2); } )
            .attr("r", 4)
            .style("fill", function (d) { return color(d.use) } )
            .style("opacity", 0.8)

        // Add the brushing
        scatter
            .append("g")
            .attr("class", "brush-scatter")
            .call(brush);

        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }

        //Append a defs (for definition) element to your SVG
        var defs = scatt.append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        //Set the color for the start (0%)
        linearGradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", color(d3.max(data, (d)=>{ return d.use;}))); //light blue 
        
        linearGradient.append("stop")
                        .attr("offset", "50%")
                        .attr("stop-color", color(d3.max(data, (d)=>{ return d.use;})/2)); //light blue

        //Set the color for the end (100%)
        linearGradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", color(0)); //dark blue

        scatt.append("rect")
                .attr('x', (width*0.9)+60)
                .attr('y', 10)
                .attr('width', 20)
                .attr('height', height-10)
                .attr('fill', "url(#linear-gradient)");

        scatt.append('text')
                .attr("x", (width*0.9)+85)
                .attr('y', 10)
                .attr('alignment-baseline', 'hanging')
                .text(d3.max(data, (d)=>{ return d.use.toFixed(3);}) + " kW")

        scatt.append('text')
                .attr("x", (width*0.9)+85)
                .attr('y', height)
                .attr('alignment-baseline', 'ideographic')
                .text("0 kW")
        
        scatt.append('text')
                .attr("x", (width*0.9)+85)
                .attr('y', height/2)
                .attr('alignment-baseline', 'middle')
                .text((d3.max(data, (d)=>{ return d.use;})/2).toFixed(3) + " kW")

        scatt.append("text")             
                .attr("transform",
                      "translate(" + ((width*0.9)/2) + " ," + 
                                     (height + margin.top) + ")")
                .style("text-anchor", "middle")
                .text("Dimension 1");
          
        // text label for the y axis
        scatt.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Dimension 2"); 
        // scatt.selectAll("text")
        //     .data(stops)
        //     .enter().append("text")
        //     .attr("x", function(d){ return (width-150) * d.offset; })
        //     .attr("dy", -3)
        //     .style("text-anchor", function(d, i){ return i == 0 ? "start" : i == 1 ? "middle" : "end"; })
        //     .text(function(d, i){ return d.value.toFixed(2); })


    })

    var parall = d3.select("#parallelChartContainer")
                    .append("div")
                        .classed("svg-container", true) 
                            .attr('style','padding-bottom: 45%')
                        .append("svg")
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .attr("viewBox", "0 0 "+w+" "+h+"")
                            .classed("svg-content-responsive", true)
                        .append("g")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scalePoint().range([1,width]).padding(0),
        y = {},
        dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground,
        dimensions;

    d3.csv("data/clean_dataset.csv", function(d, i){
        if( i %5 == 0){ // Campionamento ogni 5 minuti 
            return {
            id: i,
            display: true,
            use: parseFloat(d['use [kW]']),
            temperature: parseFloat(d['temperature']),
            humidity: parseFloat(d['humidity']),
            pressure: parseFloat(d['pressure']),
            windSpeed: parseFloat(d['windSpeed']),
            precipIntensity: parseFloat(d['precipIntensity'])
            };
        };
        })
    .then(function(data) {
        color.domain([d3.max(data, (d)=>{ return d.use}),0]) //d3.extent(data, (d)=>{ return d.use})
        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            return d != "use" && d != "display" && d != "id" && (y[d] = d3.scaleLinear()
                                                 .domain(d3.extent(data, function(p) { return +p[d]; }))
                                                 .range([height,0]));
        }));
        
        // Add grey background lines for context.
        background = parall.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = parall.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", (d)=> color(d.use))
            .attr("id",(d)=>{return "fore-"+d.id});

        // Add a group element for each dimension.
        var g = parall.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.drag()
                .subject(function(d) { return {x: x(d)}; })
                .on("start", function(d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { return position(a) - position(b); });
                    x.domain(dimensions);
                    g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
                .on("end", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush-parall")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.brushY()
                                                    .extent([[-8, y[d].range()[1]], [8, y[d].range()[0]]])
                                                    .on("start", function(){
                                                        d3.event.sourceEvent.stopPropagation();
                                                        // scatt.select(".brush-scatter").call(brush.move, null) 
                                                        
                                                    })
                                                    .on("brush", 
                                                    function (){
                                                        scatt.selectAll('circle').attr('class','not-brushed')
                                                        var actives = [];
                                                        // filter brushed extents
                                                        parall.selectAll('.brush-parall')
                                                          .filter(function(d){
                                                            return d3.brushSelection(this);
                                                          })
                                                          .each(function(d) {
                                                            actives.push({
                                                              dimension: d,
                                                              extent: d3.brushSelection(this),
                                                              id: d3.select(this)
                                                            });
                                                          });
                                                        
                                                        // console.log(actives)
                                                        // set un-brushed foreground line disappear
                                                        foreground.style('display', function(d) {
                                                          d.display = false;
                                                          return actives.every(function(active) {
                                                            var dim = active.dimension;
                                                            if(active.extent[0] <= y[dim](d[dim]) && 
                                                                                   y[dim](d[dim]) <= active.extent[1]){
                                                                d.display = true;
                                                                return true
                                                            }
                                                            d.display = false;
                                                            return false;
                                                          }) ? null : 'none';
                                                        });

                                                        foreground.each(function(d){
                                                            if(d.display){
                                                                scatt.select('#scat-'+ d.id)
                                                                .classed('not-brushed', false)
                                                            }
                                                        })
                                                    }));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }
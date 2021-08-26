
    var triggerbutton = false
    var w = 960
    var h = 500
    var svg = d3.select("#lineChartContainer").append("div")
                                            .classed("svg-container", true) 
                                            .attr('style','padding-bottom: 55%')
                                            .append("svg")
                                            .attr("preserveAspectRatio", "xMinYMin meet")
                                            .attr("viewBox", "0 0 960 500")
                                            .classed("svg-content-responsive", true),
        margin = {top: 20, right: 20, bottom: 110, left: 40},
        margin2 = {top: 430, right: 20, bottom: 30, left: 40},
        width1 = (w*0.85) - margin.left - margin.right,
        width2 = (w*0.15) - margin.left - margin.right,
        height = +h - margin.top - margin.bottom,
        height2 = +h - margin2.top - margin2.bottom;

    var x = d3.scaleTime().range([0, width1]),
        x2 = d3.scaleTime().range([0, width1]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")),
        xAxis2 = d3.axisBottom(x2).ticks(7).tickFormat(d3.timeFormat("%a %d %b")),
        yAxis = d3.axisLeft(y).ticks(7).tickFormat(function (d) {
                                                        return d+" kW";
                                                    });

    var brush = d3.brushX()
        .extent([[0, 0], [width1, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width1, height]])
        .extent([[0, 0], [width1, height]])
        .on("zoom", zoomed);

    var area = d3.area()
        // .curve(d3.curveMonotoneX)
        .x(d => x(d.data.date))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x2(d.date); })
        .y0(height2)
        .y1(function(d) { return y2(d.use); });
    
    var area3 = d3.area()
        // .curve(d3.curveMonotoneX)
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.use); });
    
    var line = d3.line()
                 .x(function(d) { return x(d.date) })
                 .y(function(d) { return y(d.gen) })

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
            .attr("width", width1)
            .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var mapDateTag = []
    var parseTime = d3.timeParse(('%Y-%m-%d %H:%M:%S'));

    d3.csv("data/clean_dataset.csv", function(d, i){
        // if( i %300 == 0){ // Campionamento ogni 5 minuti 
            return {
            date: parseTime(d['time_europe']),//new Date(parseInt(d.time* 1000))
            use: parseFloat(d['use [kW]']),
            gen: parseFloat(d['gen [kW]']),
            dishwasher: parseFloat(d['Dishwasher [kW]']),
            furnance1: parseFloat(d['Furnace 1 [kW]']),
            furnance2: parseFloat(d['Furnace 2 [kW]']),
            homeoffice: parseFloat(d['Home office [kW]']),
            fridge: parseFloat(d['Fridge [kW]']),
            winecellar: parseFloat(d['Wine cellar [kW]']),
            garagedoor: parseFloat(d['Garage door [kW]']),
            kitchen1: parseFloat(d['Kitchen 12 [kW]']),
            kitchen2: parseFloat(d['Kitchen 14 [kW]']),
            kitchen3: parseFloat(d['Kitchen 38 [kW]']),
            barn: parseFloat(d['Barn [kW]']),
            well: parseFloat(d['Well [kW]']),
            microwave: parseFloat(d['Microwave [kW]']),
            livingroom: parseFloat(d['Living room [kW]'])
            };
        // };
        })
    .then(function(data) {

        var avguse = 0
        var avggen = 0
        var cnt = 0
        data.forEach(function(d,i){
            cnt = cnt + 1
            avguse += d.use
            avggen += d.gen
        })
        avguse = avguse/cnt
        avggen = avggen/cnt

        d3.select('#avguse').text(avguse.toFixed(2) + ' kW')
        d3.select('#avggen').text(avggen.toFixed(2) + ' kW')
        d3.select('#curruse').text(data[data.length -1].use.toFixed(2) + ' kW')
        d3.select('#currgen').text(data[data.length -1].gen.toFixed(2) + ' kW')
        d3.selectAll('.still-loading').style('display', 'none');
        d3.selectAll('.loaded').style('display', 'block');

        for(var i= 0; i < data.length; i++){
            mapDateTag[i] = data[i].date.getTime()/1000
        }

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.use; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        var keys = d3.keys(data[0]).slice(3)

        var color = d3.scaleOrdinal(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]
        );
        // console.log(d3.schemeCategory20)

        var stackedData = d3.stack()
                        .keys(keys)
                        (data)


        for (var i = 0; i < stackedData.length; i++) {
            stackedData[i].selected = true;
            stackedData[i].color = color(i);
        }

        let paths = focus.append("g")
                            .attr('class', 'path-stacked')
                            .attr('opacity', 0)
                        .selectAll("path")
                        .data(stackedData)
                        .enter()
                        .append("path")
                            .attr("class", "area")
                            .attr('id',(d)=>'area-'+d.key)
                            .attr("fill", (d)=>d.color)
                            .attr("d", area);

        let totArea = focus.append("g")
                            .attr('class', 'path-total')
                            .attr('opacity', 1);
        totArea.datum(data)
                .append("path")
                    .attr("clip-path","url(#ellipse-clip)")
                    .attr("class", "area-tot")
                    .attr("fill", 'steelblue')
                    .attr("d", area3)

        let genLine = focus.append("g")
                    .attr('class', 'path-total')
                    .attr('opacity', 1);

        genLine.datum(data)
                .append("path")
                    .attr("clip-path","url(#ellipse-clip)")
                    .attr("class", "line-tot")
                    .attr("fill", "none")
                    .attr("stroke", "#b2df8a")
                    .attr("stroke-width", 1.5)
                    .attr("d", line)

        var labels = focus.append("g")
                                .attr('class', 'label-stacked')
                                .attr('opacity', 0)
                            .selectAll("g")
                            .data(stackedData)
                            .enter().append('g')
                                    .attr('id',(d)=>'label-'+d.key)
                                    .on("click", function(d){
                                        console.log('click')
                                        d.selected = !d.selected;
                                        var tmpKeys = []
                                        for (var i = 0; i < stackedData.length; i++) {
                                            if(stackedData[i].selected == true)
                                                tmpKeys.push(stackedData[i].key)
                                        }

                                        var tmpStacked = d3.stack()
                                                        .keys(tmpKeys)
                                                        (data)

                                        for (var i = 0; i < keys.length; i++) {
                                            if(!tmpKeys.includes(keys[i])){
                                                var tmpL = stackedData[i]
                                                for(var j = 0; j < tmpL.length -1; j++){
                                                    tmpL[j][0] = 0
                                                    tmpL[j][1] = 0
                                                }
                                                tmpStacked = tmpStacked.slice(0,i).concat([tmpL]).concat(tmpStacked.slice(i))
                                            }
                                            tmpStacked[i].selected = stackedData[i].selected;
                                            tmpStacked[i].color = stackedData[i].color;
                                        }
                                        
                                        paths.data(tmpStacked)
                                            .transition()
                                                .attr("d", area);

                                        labels.select('#circle-'+d.key)
                                                .attr('fill', d.selected ? d.color : '#cfcfcf')
                                    });

        var secondLabel = focus.append("g")
                                    .attr('class', 'label-total')
                                    .attr('opacity', 1)
                                .append("g");


        secondLabel.append("text")
                                    .attr("y", 0)
                                    .attr("x", width1 + (0.9*width2))
                                    .attr('text-anchor', 'start')
                                    .attr('alignment-baseline', 'central')
                                    .text('Total Consumption');

        secondLabel.append("circle")
                                    .attr("cy", 0)
                                    .attr("cx", width1 + (0.9*width2) - 15)
                                    .attr('r', '8')
                                    .attr("fill", 'steelblue')
                                    .attr('id','total-consumption-label');
        secondLabel.append("text")
                                    .attr("class", "total-kw-update")
                                    .attr("y", 0)
                                    .attr("x", width1 + (0.9*width2)- 30)
                                    .attr('text-anchor', 'end')
                                    .attr('alignment-baseline', 'central')
                                    .text("")



        secondLabel.append("text")
                                    .attr("y", 25)
                                    .attr("x", width1 + (0.9*width2))
                                    .attr('text-anchor', 'start')
                                    .attr('alignment-baseline', 'central')
                                    .text('Generated');

        secondLabel.append("circle")
                                    .attr("cy", 25)
                                    .attr("cx", width1 + (0.9*width2) - 15)
                                    .attr('r', '8')
                                    .attr("fill", '#b2df8a')
                                    .attr('id','gen-consumption-label');
        secondLabel.append("text")
                                    .attr("class", "gen-kw-update")
                                    .attr("y", 25)
                                    .attr("x", width1 + (0.9*width2)- 30)
                                    .attr('text-anchor', 'end')
                                    .attr('alignment-baseline', 'central')
                                    .text("")         



        
        labels.append("text")
                .attr("y", (d,i)=>{return ((i+2)*25)})
                .attr("x", width1 + (0.9*width2))
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'central')
                .text((d,i)=>{return d.key.charAt(0).toUpperCase() + d.key.slice(1)})

        labels.append("circle")
                .attr("cy", (d,i)=>{return ((i+2)*25)})
                .attr("cx", width1 + (0.9*width2) - 15)
                .attr('r', '8')
                .attr("fill", (d)=>d.color)
                .attr('id',(d)=>'circle-'+d.key);
        
        labels.append("text")
                .attr("class", "kw-update")
                .attr("y", (d,i)=>{return ((i+2)*25)})
                .attr("x", width1 + (0.9*width2)- 30)
                .attr('text-anchor', 'end')
                .attr('alignment-baseline', 'central')
                .text("")

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        focus.append("g") 
                .append("line")          
                    .style("stroke", "grey")          
                    .attr('id', 'selectionLine')
                    .attr("x1", 30)
                    .attr("x2", 30)     
                    .attr("y1", 0)     
                    .attr("y2", height)
                    .style("stroke-width", 0)   
                    .style("stroke-dasharray", ("3, 3"));

        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width1)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom)
            .on("mousemove", function(){
                var coordinates= d3.mouse(this);
                var xM = coordinates[0];
        
                var goal = x.invert(xM).getTime()/1000;

                var closest = mapDateTag.reduce(function(prev, curr) {
                    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                });

                var idx = mapDateTag.indexOf(closest);

                secondLabel.select('.total-kw-update')
                            .text(data[idx].use.toFixed(3)+' kW')
                            
                secondLabel.select('.gen-kw-update')
                            .text(data[idx].gen.toFixed(3)+' kW')

                labels.selectAll('.kw-update')
                        .text((d, i)=>{return data[idx][d.key].toFixed(3)+' kW'})
                
                var xLine = x(data[idx].date)
                
                focus.select("#selectionLine")
                        .attr('x1', xLine)
                        .attr('x2', xLine)
                        .style("stroke-width", 1) 
            })
            .on("mouseout", function(){
                labels.selectAll('.kw-update')
                    .text('');

                secondLabel.select('.total-kw-update')
                            .text('')

                secondLabel.select('.gen-kw-update')
                            .text('')

                focus.select("#selectionLine").style("stroke-width", 0) 
            });
    });

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select("#selectionLine").style("stroke-width", 0) 
        focus.selectAll(".area").attr("d", area);
        focus.selectAll(".area-tot").attr("d", area3);
        focus.selectAll(".line-tot").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width1 / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select("#selectionLine").style("stroke-width", 0) 
        focus.selectAll(".area").attr("d", area);
        focus.selectAll(".area-tot").attr("d", area3);
        focus.selectAll(".line-tot").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
        d.use = +d.use;
        return d;
    }

    d3.select('#customSwitches').on('click',function(){
        console.log('clicked')
        if(triggerbutton){
            d3.select('.path-stacked').attr('opacity', 0)
            d3.selectAll('.path-total').attr('opacity', 1)
            d3.select('.label-stacked').attr('opacity', 0)
            d3.select('.label-total').attr('opacity', 1)
        }else{
            d3.select('.path-stacked').attr('opacity', 1)
            d3.selectAll('.path-total').attr('opacity', 0)
            d3.select('.label-stacked').attr('opacity', 1)
            d3.select('.label-total').attr('opacity', 0)
        }
        triggerbutton = !triggerbutton
    })

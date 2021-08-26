function boxpl(){

localStorage.setItem('stat2', 1);
document.getElementById("boxplt").style.display="block";
document.getElementById("brpplt").style.display="none";
document.getElementById("bxm").style.display="none";
document.getElementById("brpplt1").innerHTML = "";

var margin = {top: 0, right: 30, bottom: 30, left: 43},
    width = 1160 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#boxplt")
 .append("div")
              .classed("svg-container", true) 
              .attr('style','padding-bottom: 55%')
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 "+(width+margin.left+margin.right)+" "+height+"")
              .classed("svg-content-responsive", true)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["Dishwasher", "Furnace 1", "Furnace 2", "Home office", "Fridge", "Wine cellar", "Garage door", "Kitchen 12", "Kitchen 14", "Kitchen 38", "Barn", "Well", "Microwave", "Living room"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


  var y = d3.scaleLinear()
    .domain([0,1.8])
    .range([height, 0])
  var yAxis = d3.axisLeft(y).ticks(7).tickFormat(function (d) {  return d+" kW"; });
  svg.append("g").attr("class", "y axis").call(yAxis);


  svg.selectAll(".y .tick:last-of-type text")
                .attr('alignment-baseline','hanging');

 var color = d3.scaleOrdinal(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);



function show_data(rows, dev, p){
	document.getElementById("bxm").style.display="block";
	//var color = d3.scaleOrdinal(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);
    
    d3.select("#"+dev.replace(/ /g,'')).remove();
    var device=dev+" [kW]";
    var test=[];
          count = 0
	        for (i=0; i<rows.length; i++) {
                if(rows[i][device] > 1.8){
                  count += 1
                }
		            test.push({key:dev, val: rows[i][device]});
            }
            var jitterWidth = 25
            svg
            .selectAll("indPoints")
            .data(test)
            .enter()
            .append("circle")
              .attr("cx", function(d){return(x(d.key) - jitterWidth/2 + Math.random()*jitterWidth )})
              .attr("cy", function(d){return(y(d.val))})
              .attr("r", 4)
              .style("fill", color(p))
              .attr("stroke", "none")
              .style("opacity", .3);
              
              //console.log(x(test[0].key))
            if(count != 0){
              svg.append('text')
              .attr("x", function(d){return(x(test[0].key))})
              .attr("y", function(d){return(y(1.8) + 10)})
              .attr('alignment-baseline','hanging')
              .attr('text-anchor','middle')
              .style("fill", color(p))
              .attr('font-size', '20px')
              .attr('font-weight', '600')
              .style("cursor", "pointer")
              .text(count)
              .append("title").text(function(d) { 
                  return ((100*count)/10080).toFixed(3)+"% of total surveys"; 
              });
            }

      

}

d3.csv("data/clean_dataset.csv", function(error, rows) {

  var test=[];

  var i;
  var len=rows.length;
  var di=[];var f1=[];var f2=[];var ho=[];var fr=[];var wc=[];var gd=[];var k1=[];var k2=[];var k3=[];
  var ba=[];var we=[];var mi=[];var li=[];
  for (i=0; i<rows.length; i++) {
      di.push(Number(parseFloat(rows[i]['Dishwasher [kW]']).toFixed(3)));
      f1.push(Number(parseFloat(rows[i]['Furnace 1 [kW]']).toFixed(3)));
      f2.push(Number(parseFloat(rows[i]['Furnace 2 [kW]']).toFixed(3)));
      ho.push(Number(parseFloat(rows[i]['Home office [kW]']).toFixed(3)));
      fr.push(Number(parseFloat(rows[i]['Fridge [kW]']).toFixed(3)));
      wc.push(Number(parseFloat(rows[i]['Wine cellar [kW]']).toFixed(3)));
      gd.push(Number(parseFloat(rows[i]['Garage door [kW]']).toFixed(3)));
      k1.push(Number(parseFloat(rows[i]['Kitchen 12 [kW]']).toFixed(3)));
      k2.push(Number(parseFloat(rows[i]['Kitchen 14 [kW]']).toFixed(3)));
      k3.push(Number(parseFloat(rows[i]['Kitchen 38 [kW]']).toFixed(3)));
      ba.push(Number(parseFloat(rows[i]['Barn [kW]']).toFixed(3)));
      we.push(Number(parseFloat(rows[i]['Well [kW]']).toFixed(3)));
      mi.push(Number(parseFloat(rows[i]['Microwave [kW]']).toFixed(3)));
      li.push(Number(parseFloat(rows[i]['Living room [kW]']).toFixed(3)));

     // test.push({key:'Barn', val: rows[i]['Barn [kW]']});
  }

  var lung=di.length;

  var sumstat=[
  {key: "Dishwasher", value:{q1: getCII(di, lung)[1], median: getCII(di, lung)[2], q3: getCII(di, lung)[3], interQuantileRange: (getCII(di, lung)[3]-getCII(di,lung)[1]), min: getCII(di, lung)[0], max: getCII(di, lung)[4]}},
  {key: "Furnace 1", value:{q1: getCII(f1, lung)[1], median: getCII(f1, lung)[2], q3: getCII(f1, lung)[3], interQuantileRange: (getCII(f1, lung)[3]-getCII(f1, lung)[1]), min: getCII(f1, lung)[0], max: getCII(f1, lung)[4]}},
  {key: "Furnace 2", value:{q1: getCII(f2, lung)[1], median: getCII(f2, lung)[2], q3: getCII(f2, lung)[3], interQuantileRange: (getCII(f2, lung)[3]-getCII(f2, lung)[1]), min: getCII(f2, lung)[0], max: getCII(f2, lung)[4]}},
  {key: 'Home office', value:{q1: getCII(ho, lung)[1], median: getCII(ho, lung)[2], q3: getCII(ho, lung)[3], interQuantileRange: (getCII(ho, lung)[3]-getCII(ho, lung)[1]), min: getCII(ho, lung)[0], max: getCII(ho, lung)[4]}},
  {key: 'Fridge', value:{q1: getCII(fr, lung)[1], median: getCII(fr,lung)[2], q3: getCII(fr, lung)[3], interQuantileRange: (getCII(fr, lung)[3]-getCII(fr, lung)[1]), min: getCII(fr, lung)[0], max: getCII(fr, lung)[4]}},
  {key: 'Wine cellar', value:{q1: getCII(wc, lung)[1], median: getCII(wc, lung)[2], q3: getCII(wc, lung)[3], interQuantileRange: (getCII(wc, lung)[3]-getCII(wc, lung)[1]), min: getCII(wc, lung)[0], max: getCII(wc, lung)[4]}},
  {key: 'Garage door', value:{q1: getCII(gd, lung)[1], median: getCII(gd, lung)[2], q3: getCII(gd, lung)[3], interQuantileRange: (getCII(gd, lung)[3]-getCII(gd, lung)[1]), min: getCII(gd, lung)[0], max: getCII(gd, lung)[4]}},
  {key: 'Kitchen 12', value:{q1: getCII(k1, lung)[1], median: getCII(k1, lung)[2], q3: getCII(k1, lung)[3], interQuantileRange: (getCII(k1, lung)[3]-getCII(k1, lung)[1]), min: getCII(k1, lung)[0], max: getCII(k1, lung)[4]}},
  {key: 'Kitchen 14', value:{q1: getCII(k2, lung)[1], median: getCII(k2, lung)[2], q3: getCII(k2, lung)[3], interQuantileRange: (getCII(k2, lung)[3]-getCII(k2, lung)[1]), min: getCII(k2, lung)[0], max: getCII(k2, lung)[4]}},
  {key: 'Kitchen 38', value:{q1: getCII(k3, lung)[1], median: getCII(k3, lung)[2], q3: getCII(k3, lung)[3], interQuantileRange: (getCII(k3, lung)[3]-getCII(k3, lung)[1]), min: getCII(k3, lung)[0], max: getCII(k3, lung)[4]}},
  {key: 'Barn', value:{q1: getCII(ba, lung)[1], median: getCII(ba, lung)[2], q3: getCII(ba, lung)[3], interQuantileRange: (getCII(ba, lung)[3]-getCII(ba, lung)[1]), min: getCII(ba, lung)[0], max: getCII(ba, lung)[4]}},
  {key: 'Well', value:{q1: getCII(we, lung)[1], median: getCII(we, lung)[2], q3: getCII(we, lung)[3], interQuantileRange: (getCII(we, lung)[3]-getCII(we, lung)[1]), min: getCII(we, lung)[0], max: getCII(we, lung)[4]}},
  {key: 'Microwave', value:{q1: getCII(mi,lung)[1], median: getCII(mi, lung)[2], q3: getCII(mi, lung)[3], interQuantileRange: (getCII(mi, lung)[3]-getCII(mi, lung)[1]), min: getCII(mi, lung)[0], max: getCII(mi, lung)[4]}},
  {key: 'Living room', value:{q1: getCII(li, lung)[1], median: getCII(li, lung)[2], q3: getCII(li, lung)[3], interQuantileRange: (getCII(li, lung)[3]-getCII(li, lung)[1]), min: getCII(li, lung)[0], max: getCII(li, lung)[4]}}
  ];

  
  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("stroke-dasharray", ("3, 3"))
      .style("width", 1)
      .style("opacity", .2)
      .style("cursor", "pointer")
      .on("click", function(d) {
          get_bar2(d.key);
         })
      .on("mouseover", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "1");})
      .on("mouseleave", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "0");})
      .append("title").text(function(d) { 
           return "Max: "+d.value.max+"\nQ_95%: "+d.value.q3+"\nMedian: "+d.value.median+"\nQ_5%: "+d.value.q1+"\nMin: "+d.value.min; 
      });

  // rectangle for the main box
  //var color = d3.scaleOrdinal(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);
  var boxWidth = 50
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("id", function(d) {return (d.key).replace(/ /g,'')})
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", function(d,i){return color(i)})
        .style("cursor", "pointer")
        .on("click", function(d,i) {
            get_bar2(d.key);
            show_data(rows, d.key, i);
            d3.select(this).remove;
         })
        .on("mouseover", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "1");})
        .on("mouseleave", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "0");})
        .append("title").text(function(d) { 
           return "Max: "+d.value.max+"\nQ_95%: "+d.value.q3+"\nMedian: "+d.value.median+"\nQ_5%: "+d.value.q1+"\nMin: "+d.value.min; 
        });





  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("id", function(d, i) {return (d.key).replace(/ /g,'')})
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(1.8))})
        .attr("height", height)
        .attr("width", boxWidth )
        .style("opacity",0)
        .style("cursor", "pointer")
        .on("click", function(d,i) {
          // svg
          // .selectAll("vertLines")
          // .data(sumstat)
          // .update()
          //   .attr("y1", function(d){return(y(d.value.min))})
          //   .attr("y2", function(d){return(y(d.value.max))})

          // y.domain([0,d.value.max])

          var t = d3.transition().duration(500)
      
          svg.select(".y")
              .transition(t)
              .call(yAxis)
          // console.log(d.value.max)
          get_bar2(d.key);
          show_data(rows, d.key, i);
          d3.select(this).remove;
         })
        .on("mouseover", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "1");})
        .on("mouseleave", function(d){ d3.select("#box"+d.key.replace(/ /g,'').replace('[','').replace(']','')).style("opacity", "0");})
        .append("title").text(function(d) { 
           return "Max: "+d.value.max+"\nQ_95%: "+d.value.q3+"\nMedian: "+d.value.median+"\nQ_5%: "+d.value.q1+"\nMin: "+d.value.min; 
        });

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)

  var ss = svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("g")
    .style("opacity",0)
    .attr("id", function(d){return("box"+d.key.replace(/ /g,'').replace('[','').replace(']',''))});

    ss.append("line")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", function(d){return(y(d.value.q1))})
      .attr("y2", function(d){return(y(d.value.q1))})
      .style("stroke", "rgb(255, 0, 0)")
      .style("width", 220)



    ss.append("line")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", function(d){return(y(d.value.q3))})
      .attr("y2", function(d){return(y(d.value.q3))})
      .style("stroke", "rgb(255, 0, 0)")
      .style("width", 220)


    ss.append("line")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .style("width", 220)
      .style("stroke", "rgb(34,139,34)")

  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.max))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 80)
      .style("opacity", .5);
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.min))})
      .attr("stroke", "black")
      .style("width", 80)
      .style("opacity", .5);

})
}

boxpl();
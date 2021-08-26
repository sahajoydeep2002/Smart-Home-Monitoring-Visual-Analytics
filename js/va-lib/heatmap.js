function chart1(){
  localStorage.setItem('state', 1);
  document.getElementById("bac").style.display="none";
  document.getElementById("g1").innerHTML="<b class='h5 mb-0 font-weight-bold text-gray-800'>Week:</b> 2016, 1 January - 7 January";
  document.getElementById("chart").innerHTML = "";
  document.getElementById("rad").style.display="none";
  var margin = { top: 20, right: 0, bottom: 100, left: 40 },
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#fffff0","#FFF8C6","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], 
          days = ["Fr 01", "Sa 02", "Su 03", "Mo 04", "Tu 05", "We 06", "Th 07"],
          times = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
  
  d3.csv("data/clean_dataset.csv", function(error, rows) {
  	
  var len=rows.length;
  var use=[];
  for (i=0; i<rows.length; i++) {
     use.push(Number(parseFloat(rows[i]['use [kW]'])).toFixed(3));
  }


  var k; var x=0, y=60;
  var data=[];
  var a=1,b=0;
  for (k=0; k<parseInt(rows.length/60); k++){
      var v = getMean(use.slice(x, y), 60);
      if(b==24){
        a+=1;
        b=0;
      }
      data[k]={day: a, hour:b, value: v};
      x=y;
      y=y+60;
      b+=1;
  }

          var colorScale = d3.scale.quantile()
              .domain([0, 0.51, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var svg = d3.select("#chart")
          .append("div")
              .classed("svg-container", true) 
              .attr('style','padding-bottom: 40%')
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 "+(width+margin.left+margin.right)+" "+height+"")
              .classed("svg-content-responsive", true)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", "dayLabel mono axis axis-workweek");
                //.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", "timeLabel mono axis axis-worktime");

           // Three function that change the tooltip when user hover / move / leave a cell
           var mouseover = function(d) {
              //alert(d.value)
           }
           var mousemove = function(d) {
              //alert(d.value)
           }
           var mouseleave = function(d) {
              // alert(d.value)
           }

           var heatMap = svg.selectAll(".hour")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.hour) * gridSize; })
              .attr("y", function(d) { return (d.day-1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0])
              .style("cursor", "pointer")
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
              .on("click", function(d) {
                  chart2(d.day,d.hour);
               });

          heatMap.transition().duration(3000)
              .style("fill", function(d) { return colorScale(d.value); });

          heatMap.append("title").text(function(d) { return Number((d.value).toFixed(3))+" KW"; });
              
          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            //.text(function(d) { return ">= " + Math.round(d); })
            .text(function(d) { return "  KW >= " + parseFloat(d).toFixed(2); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);
  });
}
chart1();
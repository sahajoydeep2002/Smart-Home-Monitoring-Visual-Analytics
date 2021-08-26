var margin = {top: 50, right: 30, bottom: 70, left: 90},
    width = 720 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#brpplt2")

  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

var exists = false;

function update(data, day) {

  var xx=[];
  for (i=0; i<data.length; i++) {
  	xx.push(data[i]['value']);
  }

  d3.selectAll('#ttt').remove();
  svg.append("text")
      .attr("id","ttt")
      .attr("y", -30)
      .attr("x",+40)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average hours:"+getMean(xx, xx.length).toFixed(3)+" KW");
   d3.selectAll('#ttt2').remove();
   svg.append("text")
        .attr("id","ttt2")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top-30 / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(function(d) { return day; });
  // Update the X axis
  x.domain(data.map(function(d) { return d.day; }))
  xAxis.call(d3.axisBottom(x))

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.value; }) ]);
  var yAxis2 = d3.axisLeft(y).ticks(7).tickFormat(function (d) {  return d+" kW"; });
  yAxis.transition().duration(1000).call(yAxis2);

  var u = svg.selectAll("rect")
    .data(data)
  if(exists == false){
    u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
      .attr("x", function(d) { return x(d.day); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .attr("fill", "#1C91C0")
      .style("cursor", "pointer")

    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
    .delay(function(d,i){ return(i*50)})

    exists = true

  } else {

    u.enter().append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
      .attr("x", function(d) { return x(d.day); })
      .attr("width", x.bandwidth())
      .attr("fill", "#1C91C0")
      .style("cursor", "pointer")
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
    .delay(function(d,i){ return(i*50)})

   
  }
 d3.selectAll('rect').selectAll('title').remove();
  svg.selectAll("rect")
      .data(data)
      .on("mouseover", function (d){ 
        svg.append("line")
      .attr("id","linn")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", y(d.value))
      .attr("y2", y(d.value))
      .style("stroke", "#7FCDBB")
      .style("stroke-width", "2")
      .attr('stroke-dasharray', '5,5')
      .style("width", 220)
      .style("height", 6)
      })
     // .on("mousemove", function (d){})
      .on("mouseleave", function (d){
        d3.selectAll('#linn').remove();
      })
      .append("title")
        .text(function(d) { return Number((d.value).toFixed(3))+" KW"; });

  u
    .exit()
    .remove()

}

function get_bar3(keys, dayss){
localStorage.setItem('state2', 3);
document.getElementById("brpplt2").style.display="block";

d3.csv("data/clean_dataset.csv", function(datas) {

  var len=datas.length;
  var use_de=[];

  for (i=0; i<datas.length; i++) {
    var date = new Date(datas[i]['time_europe']);
    if((parseInt(date.getDate())==parseInt(dayss.substr(-2)))){
        use_de.push(Number(parseFloat(datas[i][keys])).toFixed(3));
    }
  }

  var days=["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  var k; var xx=0, yy=60;
  var data=[];
  var a=1,b=0;
  for (k=0; k<parseInt(24); k++){
      var v = getMean(use_de.slice(xx, yy), 60);
      data[k]={day: days[k], value: v};
      xx=yy;
      yy=yy+60;
  }
   update(data, dayss);
})
}

function get_bar2(keys){
localStorage.setItem('state2', 2);
localStorage.setItem('keyss', keys);
document.getElementById("brpplt1").innerHTML = "";
document.getElementById("brpplt").style.display="block";
document.getElementById("bxm").style.display="block";
document.getElementById("brpplt2").style.display="none";


var margin = {top: 40, right: 30, bottom: 70, left: 60},
    width = 520 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#brpplt1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

var device=keys+" [kW]";

d3.csv("data/clean_dataset.csv", function(datas) {

  var len=datas.length;
  var use_de=[];
  for (i=0; i<datas.length; i++) {
     use_de.push(Number(parseFloat(datas[i][device])).toFixed(3));
  }

  var days=["Fr_01", "Sa_02", "Su_03", "Mo_04", "Tu_05", "We_06", "Th_07"];
  var k; var xx=0, yy=1440;
  var data=[];
  var a=1,b=0;
  for (k=0; k<parseInt(datas.length/1440); k++){
      var v = getMean(use_de.slice(xx, yy), 1440);
      data[k]={day: days[k], value: v};
      xx=yy;
      yy=yy+1440;
  }


  x.domain(data.map(function(d) { return d.day; }))
  xAxis.call(d3.axisBottom(x))

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.value; }) ]);
  var yAxis3 = d3.axisLeft(y).ticks(7).tickFormat(function (d) {  return d+" kW"; });
  yAxis.transition().duration(1000).call(yAxis3);


  // Create the u variable
  var u = svg.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
      .attr("x", function(d) { return x(d.day); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(0); })
      .attr("height", 0)
      .attr("id", function(d) { return 'rect-'+d.day; })
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#1C91C0")

    
  // Create labels inside the rect
  svg.append('g')
  .selectAll('text')
    .data(data)
    .enter()
    .append('text')
      .attr("x", function(d) { return x(d.day) + x.bandwidth()/2; })
      .attr("y", function(d) { return y(0); })
      .text((d,i)=>{return d.value.toFixed(3)+" kW"})
      .attr("text-anchor", "middle")
      .attr("fill", 'white')
    .transition() // and apply changes to all of them
      .duration(1000)
        .attr("y", function(d) { return y(d.value) + 15 ; })

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()
    
    	svg.selectAll("rect")
       .data(data)
       .style("cursor", "pointer")
       .on("click", function(d){
          svg.selectAll("rect").attr('fill', '#1C91C0');
          svg.selectAll('#rect-'+d.day).attr('fill', '#7FCDBB');
         	get_bar3(device, d.day);
       })
       .append("title").text(function(d) { return Number((d.value).toFixed(3))+" KW"; });

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top-30 / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(function(d) { return keys; });
   
})
}

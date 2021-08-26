// Arithmetic mean
function getMean(data, len) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / len;
};

// Standard deviation
function getSD(data, len) {
    let m = getMean(data,len);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (len - 1));
};

// Confidential interval 95%
function getCI(data, len){
	mean=getMean(data, len);
	std=getSD(data, len);
	low=mean-1.96*(std/Math.sqrt(len));
	high=mean+1.96*(std/Math.sqrt(len));
    return [low,mean,high];
};

/*
function getCII(data, len){
	mean=getMean(data, len);
	std=getSD(data, len);
	low=mean-1.96*(std/Math.sqrt(len));
	high=mean+1.96*(std/Math.sqrt(len));
	min=Math.min.apply(Math, data);
    max=Math.max.apply(Math, data);
    return [min, low, mean, high, max];
};*/

function back_state(){
	var st=localStorage.getItem('state');
    if(st==3){
    	var dd=localStorage.getItem('day');
    	var hh=localStorage.getItem('hour');
        chart2(dd, hh);
    }else{
    	chart1();
    }
}

function back_state2(){
    document.getElementById("brpplt").style.display="none";
    document.getElementById("bxm").style.display="none";
    document.getElementById("brpplt1").innerHTML = "";
    document.getElementById("boxplt").innerHTML = "";
    boxpl();
}

//adapted from https://blog.poettner.de/2011/06/09/simple-statistics-with-php/
function Median(data) {
  return Quartile_50(data);
}

function Quartile_25(data) {
  return Quartile(data, 0.05);
}

function Quartile_50(data) {
  return Quartile(data, 0.5);
}

function Quartile_75(data) {
  return Quartile(data, 0.95);
}

function Quartile(data, q) {
  data=Array_Sort_Numbers(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}

function Array_Sort_Numbers(inputarray){
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}

function Array_Sum(t){
   return t.reduce(function(a, b) { return a + b; }, 0); 
}

function Array_Average(data) {
  return Array_Sum(data) / data.length;
}

function Array_Stdev(tab){
   var i,j,total = 0, mean = 0, diffSqredArr = [];
   for(i=0;i<tab.length;i+=1){
       total+=tab[i];
   }
   mean = total/tab.length;
   for(j=0;j<tab.length;j+=1){
       diffSqredArr.push(Math.pow((tab[j]-mean),2));
   }
   return (Math.sqrt(diffSqredArr.reduce(function(firstEl, nextEl){
            return firstEl + nextEl;
          })/tab.length));  
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function getCII(data, len){
   /* var k;
    for(k=0; k<data.length; k++){
      console.log(parseFloat(data[k]));
      //console.log(isFloat(data[k]));
    }*/
    return [Math.min.apply(Math, data), parseFloat(Quartile_25(data)), parseFloat(Quartile_50(data)), parseFloat(Quartile_75(data)), Math.max.apply(Math, data)];
};

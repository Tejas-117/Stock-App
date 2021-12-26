// To display chart;
let xAxis = [], yAxis = [];
chartData.forEach(element => {
  xAxis.unshift(element['datetime']);
  yAxis.unshift(element['close']);
});

let priceDiff = yAxis[yAxis.length-1] - yAxis[0];   
let bgColor,borderColor;
if(priceDiff > 0) {
  bgColor = 'rgba(112,204,124, 0.2)';
  borderColor = 'rgb(51,161,88)';
}
else {
  bgColor = 'rgb(235, 35, 35)';
  borderColor = 'rgb(219, 102, 102)';
}

// chart;
const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: xAxis,
      datasets: [{
          label: `Value of one share`,
          fill: true,
          data: yAxis,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderCapStyle: 'round',
          pointRadius: 3,
          borderWidth: 2
      }]
  }
});

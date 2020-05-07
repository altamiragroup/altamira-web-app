let canvas = document.querySelector("#chart");
let stats = document.querySelector(".chart");

let pendientes = stats.getAttribute("data-pendientes");
let disponibles = stats.getAttribute("data-disponibles");

Chart.defaults.global.defaultFontFamily = "Roboto";
Chart.defaults.global.defaultFontSize = 15;

let chartConfig = {
  labels: ["Disponibles", "Pendientes"],
  datasets: [
    {
      data: [disponibles, pendientes],
      backgroundColor: ["rgb(216, 37, 37)", "rgb(155, 155, 155)"],
    },
  ],
};

let pieChart = new Chart(canvas, {
  type: "doughnut",
  data: chartConfig,
});

import * as d3 from "d3";

function getTransactionsVsDateAxes(yExtent, xDomain, width, height, margin) {
  const yDomain = yExtent;
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([height - margin.b, margin.t])
    .nice();
  const yAxis = d3.axisLeft(yScale);

  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([margin.l, width - margin.r])
    .paddingOuter(0.1)
    .paddingInner(0.1);

  const xAxis = d3.axisBottom(xScale);

  return { xDomain, xAxis, xScale, yDomain, yAxis, yScale };
}

export default getTransactionsVsDateAxes;

import * as d3 from "d3";

function getTransactionsVsDateAxes(
  yExtent: number[],
  xDomain: string[],
  width: number,
  height: number,
  margin: { r: number, t: number, l: number, b: number }
) {
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
    .paddingOuter(0.5)
    .paddingInner(0.5);

  const xAxis = d3.axisBottom(xScale);

  return { xDomain, xAxis, xScale, yDomain, yAxis, yScale };
}

export default getTransactionsVsDateAxes;

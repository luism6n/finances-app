import * as d3 from "d3";

function getTransactionsVsDateAxes(yExtent, xExtent, width, height, margin) {
  const yDomain = yExtent;
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([height - margin.b, margin.t])
    .nice();
  const yAxis = d3.axisLeft(yScale);

  let currentDate = xExtent[0].clone().startOf("month");
  let xDomain = [currentDate.format("YY/MM")];
  while (currentDate < xExtent[1]) {
    currentDate.add(1, "month");
    xDomain.push(currentDate.format("YY/MM"));
  }
  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([margin.l, width - margin.r])
    .paddingOuter(0.1)
    .paddingInner(0.1);

  const xTicks = [
    xDomain[0],
    ...xDomain.filter((d, i) => {
      return (
        i !== 0 &&
        i !== xDomain.length - 1 &&
        i % Math.floor(xDomain.length / 8) === 0
      );
    }),
    xDomain[xDomain.length - 1],
  ];
  const xAxis = d3.axisBottom(xScale).tickValues(xTicks);

  return { xDomain, xAxis, xScale, yDomain, yAxis, yScale };
}

export default getTransactionsVsDateAxes;

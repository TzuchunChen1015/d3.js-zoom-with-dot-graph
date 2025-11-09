const svgWidth = 600;
const svgHeight = 400;

const svg = d3.select("svg");

const margin = {
  left: 30,
  right: 30,
  top: 30,
  bottom: 30,
};
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartWidth)
  .attr("height", chartHeight);

const xScaler = d3.scaleLinear().domain([0, 100]).range([0, chartWidth]);
const yScaler = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

const xAxisGroup = chartGroup
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`);
xAxisGroup.call(d3.axisBottom(xScaler));

const yAxisGroup = chartGroup.append("g");
yAxisGroup.call(d3.axisLeft(yScaler));

const dataPoints = [];
for (let i = 0; i < 10; i++) {
  const x = Math.floor(Math.random() * 100) + 1;
  const y = Math.floor(Math.random() * 100) + 1;
  const r = Math.floor(Math.random() * 10) + 5;
  dataPoints.push({ x, y, r });
}
// Clip-path area to contain all items that wanted to be clipped //
svg
  .append("defs")
  .append("clipPath")
  .attr("id", "myClipPath")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chartWidth)
  .attr("height", chartHeight);

const clipPathGroup = chartGroup
  .append("g")
  .attr("clip-path", "url(#myClipPath)");
// Clip-path needs to contain all items that wanted to be clipped //
const contentGroup = clipPathGroup.append("g");

contentGroup
  .selectAll("circle")
  .data(dataPoints)
  .join(
    (enterSelection) => {
      enterSelection
        .append("circle")
        .attr("cx", (data) => xScaler(data.x))
        .attr("cy", (data) => yScaler(data.y))
        .attr("r", (data) => data.r)
        .attr("stroke", "gray")
        .attr("fill", "skyblue")
        .style("opacity", 0.5)
        .on("mouseover", function (event, data) {
          d3.select(this)
            .transition()
            .attr("r", data.r * 2)
            .attr("stroke", "black")
            .attr("fill", "orange")
            .style("opacity", 1);
        })
        .on("mouseout", function (event, data) {
          d3.select(this)
            .transition()
            .attr("r", data.r)
            .attr("stroke", "gray")
            .attr("fill", "skyblue")
            .style("opacity", 0.5);
        });
    },
    (updateSelection) => {},
    (exitSelection) => {
      exitSelection.remove();
    },
  );

const scope = [
  [0, 0],
  [chartWidth, chartHeight],
];

/**
  d3.js Zoom Implementation
**/
const zoom = d3
  .zoom()
  .scaleExtent([0.1, 100])
  .translateExtent(scope)
  .extent(scope)
  .on("zoom", function (event) {
    const newXScaler = event.transform.rescaleX(xScaler);
    xAxisGroup.transition().call(d3.axisBottom(newXScaler));

    const newYScaler = event.transform.rescaleY(yScaler);
    yAxisGroup.transition().call(d3.axisLeft(newYScaler));

    contentGroup.attr("transform", event.transform);
  });
svg.call(zoom);

/**

Needs to Finish

**/
/*
const brush = d3.brush().extent(scope).on("end", function(event) {
  console.log(event.selection());
});
chartGroup.call(brush);
*/

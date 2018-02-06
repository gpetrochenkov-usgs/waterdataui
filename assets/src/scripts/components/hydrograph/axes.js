const { axisBottom, axisLeft } = require('d3-axis');
const { format } = require('d3-format');
const { timeDay } = require('d3-time');
const { timeFormat } = require('d3-time-format');
const { createSelector } = require('reselect');

const { layoutSelector, MARGIN } = require('./layout');
const { xScaleSelector, yScaleSelector } = require('./scales');

const yTickCount = 5;


/**
 * Helper function which generates y tick values for a scale
 * @param {Object} yScale - d3 scale
 * @returns {Array} of tick values
 */
function yTickValues(yScale) {
    const yDomain = yScale.domain();
    const tickSize = (yDomain[1] - yDomain[0]) / yTickCount;
    return Array(yTickCount).fill(0).map((_, index) => {
        return yDomain[0] + index * tickSize;
    });
}


/**
 * Create an x and y axis for hydrograph
 * @param  {Object} xScale      D3 Scale object for the x-axis
 * @param  {Object} yScale      D3 Scale object for the y-axis
 * @param  {Number} yTickSize   Size of inner ticks for the y-axis
 * @return {Object}             {xAxis, yAxis} - D3 Axis
 */
function createAxes({xScale, yScale}, yTickSize) {
    // Create x-axis
    const xAxis = axisBottom()
        .scale(xScale)
        .ticks(timeDay)
        .tickFormat(timeFormat('%b %d'))
        .tickSizeOuter(0);

    // Create y-axis
    const yAxis = axisLeft()
        .scale(yScale)
        .tickValues(yTickValues(yScale))
        .tickFormat(format('.2f'))
        .tickSizeInner(yTickSize)
        .tickPadding(14)
        .tickSizeOuter(0);

    return {xAxis, yAxis};
}


const axesSelector = createSelector(
    xScaleSelector('current'),
    yScaleSelector,
    layoutSelector,
    (state) => state.plotYLabel,
    (xScale, yScale, layout, plotYLabel) => {
        return {
            ...createAxes({xScale, yScale}, -layout.width + MARGIN.right),
            layout: layout,
            yTitle: plotYLabel
        };
    }
);


function appendAxes(elem, {xAxis, yAxis, layout, yTitle}) {
    const xLoc = {
        x: 0,
        y: layout.height - (MARGIN.top + MARGIN.bottom)
    };
    const yLoc = {x: 0, y: 0};
    const yLabelLoc = {
        x: layout.height / -2 + MARGIN.top,
        y: -35
    };

    // Remove existing axes before adding the new ones.
    elem.selectAll('.x-axis, .y-axis').remove();

    // Add x-axis
    elem.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${xLoc.x}, ${xLoc.y})`)
        .call(xAxis);

    // Add y-axis and a text label
    elem.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${yLoc.x}, ${yLoc.y})`)
        .call(yAxis)
        .append('text')
            .attr('class', 'y-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', yLabelLoc.x)
            .attr('y', yLabelLoc.y)
            //.attr('dy', '0.71em')
            .text(yTitle);
}


module.exports = {createAxes, appendAxes, axesSelector};

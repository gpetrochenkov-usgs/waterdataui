const { timeFormat } = require('d3-time-format');
require('whatwg-fetch');


// Define Water Services root URL - use global variable if defined, otherwise
// use production.
const SERVICE_ROOT = window.SERVICE_ROOT || 'https://waterservices.usgs.gov/nwis';

// Create a time formatting function from D3's timeFormat
const formatTime = timeFormat('%c %Z');


/**
 * Simple XMLHttpRequest wrapper.
 * @param  {String} url - URL to retrieve
 * @return {Promise} resolves to the json data in the response, rejects with error message
 */
function get(url) {
    return window.fetch(url, {}).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            let error = new Error(response.statusText);
            throw error;
        }
    });
}



/**
 * Get a given timeseries dataset from Water Services.
 * @param  {Array}    sites  Array of site IDs to retrieve.
 * @param  {Array}    params List of parameter codes
 * @param  {Function} callback       Callback to be called with (data, error)
 */
export function getTimeseries({sites, params=['00060']}, callback) {
    let url = `${SERVICE_ROOT}/iv/?sites=${sites.join(',')}&parameterCd=${params.join(',')}&period=P7D&indent=on&siteStatus=all&format=json`;
    get(url)
        .then((data) => {
            callback(data.value.timeSeries.map(series => {
                    let startDate = new Date(series.values[0].value[0].dateTime);
                    let endDate = new Date(
                        series.values[0].value.slice(-1)[0].dateTime);
                    return {
                        code: series.variable.variableCode[0].value,
                        variableName: series.variable.variableName,
                        variableDescription: series.variable.variableDescription,
                        seriesStartDate: startDate,
                        seriesEndDate: endDate,
                        values: series.values[0].value.map(value => {
                            let date = new Date(value.dateTime);
                            return {
                                time: date,
                                value: parseFloat(value.value),
                                label: `${formatTime(
                                    date)}\n${value.value} ${series.variable.unit.unitCode}`
                            };
                        })
                    };
                }
            ));
        })
        .catch((error) => {
            callback(null, error);
        });
}

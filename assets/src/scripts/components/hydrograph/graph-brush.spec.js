import {select} from 'd3-selection';

import{configureStore} from '../../store';

import {drawGraphBrush} from './graph-brush';

describe ('graph-brush module', () => {

    const TEST_STATE = {
        series: {
            timeSeries: {
                '00010:current': {
                    points: [{
                        dateTime: 1514926800000,
                        value: 4,
                        qualifiers: ['P']
                    }],
                    method: 'method1',
                    tsKey: 'current:P7D',
                    variable: '45807190'
                },
                '00060:current': {
                    points: [{
                        dateTime: 1514926800000,
                        value: 10,
                        qualifiers: ['P']
                    }],
                    method: 'method1',
                    tsKey: 'current:P7D',
                    variable: '45807197'
                },
                '00060:compare': {
                    points: [{
                        dateTime: 1514926800000,
                        value: 10,
                        qualifiers: ['P']
                    }],
                    method: 'method1',
                    tsKey: 'compare:P7D',
                    variable: '45807197'
                }
            },
            timeSeriesCollections: {
                'coll1': {
                    variable: '45807197',
                    timeSeries: ['00060:current']
                },
                'coll2': {
                    variable: '45807197',
                    timeSeries: ['00060:compare']
                },
                'coll3': {
                    variable: '45807197',
                    timeSeries: ['00060:median']
                },
                'coll4': {
                    variable: '45807190',
                    timeSeries: ['00010:current']
                }
            },
            queryInfo: {
                'current:P7D': {
                    notes: {
                        'filter:timeRange':  {
                            mode: 'PERIOD',
                            periodDays: 7
                        },
                        requestDT: 1522425600000
                    }
                }
            },
            requests: {
                'current:P7D': {
                    timeSeriesCollections: ['coll1']
                },
                'compare:P7D': {
                    timeSeriesCollections: ['coll2', 'col4']
                }
            },
            variables: {
                '45807197': {
                    variableCode: {
                        value: '00060'
                    },
                    oid: '45807197',
                    variableName: 'Test title for 00060',
                    variableDescription: 'Test description for 00060',
                    unit: {
                        unitCode: 'unitCode'
                    }
                },
                '45807190': {
                    variableCode: {
                        value: '00010'
                    },
                    oid: '45807190',
                    unit: {
                        unitCode: 'unitCode'
                    }
                }
            },
            methods: {
                'method1': {
                    methodDescription: 'method description'
                }
            }
        },
        statisticsData : {
            median: {
                '00060': {
                    '1234': [
                        {
                            month_nu: '2',
                            day_nu: '20',
                            p50_va: '40',
                            begin_yr: '1970',
                            end_yr: '2017',
                            loc_web_ds: 'This method'
                        }, {
                            month_nu: '2',
                            day_nu: '21',
                            p50_va: '41',
                            begin_yr: '1970',
                            end_yr: '2017',
                            loc_web_ds: 'This method'
                        }, {
                            month_nu: '2',
                            day_nu: '22',
                            p50_va: '42',
                            begin_yr: '1970',
                            end_yr: '2017',
                            loc_web_ds: 'This method'
                        }
                    ]
                }
            }
        },
        timeSeriesState: {
            currentVariableID: '45807197',
            currentDateRange: 'P7D',
            requestedTimeRange: null,
            showSeries: {
                current: true,
                compare: true,
                median: true
            },
            loadingTSKeys: []
        },
        ui: {
            width: 400,
            hydrographXRange: undefined
        }
    };
    describe('drawGraphBrush', () => {
        let div, store;

        beforeEach(() => {
            div = select('body').append('div');
            store = configureStore(TEST_STATE);
        });

        afterEach(() => {
            div.remove();
        });

        it('Should create a brush svg element', () => {
            div.call(drawGraphBrush, store);

            expect(div.select('svg').size()).toBe(1);
            expect(div.select('.brush').size()).toBe(1);
            expect(div.select('.overlay').size()).toBe(1);
            expect(div.select('.selection').size()).toBe(1);
            expect(div.selectAll('.handle').size()).toBe(2);
        });

        it('Should create a time-series-line, and an x-axis', () => {
            div.call(drawGraphBrush, store);

            expect(div.selectAll('#ts-current-group').size()).toBe(1);
            expect(div.selectAll('.x-axis').size()).toBe(1);
        });
    });
});
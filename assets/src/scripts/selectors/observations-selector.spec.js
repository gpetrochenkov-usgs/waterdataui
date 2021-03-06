
import {
    getCurrentObservationsTimeSeriesId,
    getAllObservationsTimeSeries,
    hasCurrentObservationsTimeSeries,
    getCurrentObservationsTimeSeries,
    getCurrentObservationsTimeSeriesTimeRange,
    getCurrentObservationsTimeSeriesValueRange
} from './observations-selector';

describe('observations-selector', () => {
    describe('getCurrentObservationsTimeSeriesId', () => {
       it('should be false if no current time series id set', () => {
           expect(getCurrentObservationsTimeSeriesId({
               observationsState: {}
           })).toBeNull();
       });

       it('should be true if current time series id is set', () => {
           expect(getCurrentObservationsTimeSeriesId({
               observationsState: {
                   currentTimeSeriesId: '12345'
               }
           })).toEqual('12345');
       });
    });

    describe('getAllObservationsTimeSeries', () => {
        it('should be null if no time series are defined', () => {
            expect(getAllObservationsTimeSeries({
                observationsData: {}
            })).toBeNull();
        });

        it('should return time series when defined', () => {
            expect(getAllObservationsTimeSeries({
                observationsData: {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        },
                        '12345': {
                            type: 'Feature',
                            id: '12345'
                        }
                    }
                }
            })).toEqual({
                '11111': {
                    type: 'Feature',
                    id: '11111'
                },
                '12345': {
                    type: 'Feature',
                    id: '12345'
                }
            });
        });
    });

    describe('hasCurrentObservationsTimeSeries', () => {
        it('expect false if no timeSeries defined', () => {
            expect(hasCurrentObservationsTimeSeries({
                observationsData: {},
                observationsState: {}
            })).toBe(false);
        });

        it('expect false if specific timeSeries is not defined', () => {
            expect(hasCurrentObservationsTimeSeries({
                observationsData : {
                    timeSeries: {}
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBe(false);
            expect(hasCurrentObservationsTimeSeries({
                observationsData: {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBe(false);
        });

        it('expect true if specific timeSeries is defined', () => {
            expect(hasCurrentObservationsTimeSeries({
                observationsData : {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        },
                        '12345' : {
                            type: 'Feature',
                            id: '12345'
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBe(true);
        });
    });

    describe('getCurrentObservationsTimeSeries', () => {
        it('expect null if timeSeries is not defined', () => {
            expect(getCurrentObservationsTimeSeries({
                observationsData : {},
                observationsState: {}
            })).toBeNull();
            expect(getCurrentObservationsTimeSeries({
                observationsData: {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        }
                    }
                },
                observationsState: {}
            })).toBeNull();
            expect(getCurrentObservationsTimeSeries({
                observationsData: {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBeNull();
        });

        it('expect object if timeSeries is defined', () => {
            expect(getCurrentObservationsTimeSeries({
                observationsData: {
                    timeSeries: {
                        '11111': {
                            type: 'Feature',
                            id: '11111'
                        },
                        '12345': {
                            type: 'Feature',
                            id: '12345'
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toEqual({
                type: 'Feature',
                id: '12345'
            });
        });
    });

    describe('getCurrentObservationsTimeSeriesTimeRange', () => {
        it('should be null if no current time series is set or available', () => {
            expect(getCurrentObservationsTimeSeriesTimeRange({
                observationsData: {},
                observationsState: {}
            })).toBeNull();
            expect(getCurrentObservationsTimeSeriesTimeRange({
                observationsData: {
                    timeSeries: {}
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBeNull();
        });

        it('should return startTime and endTime properties in universal time when time series is defined', () => {
            expect(getCurrentObservationsTimeSeriesTimeRange({
                observationsData: {
                    timeSeries: {
                        '12345': {
                            type: 'Feature',
                            id: '12345',
                            properties: {
                                phenomenonTimeStart: '2010-01-01',
                                phenomenonTimeEnd: '2019-12-01'
                            }
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toEqual({
                startTime: 1262304000000,
                endTime: 1575158400000
            });
        });
    });

    describe('getCurrentObservationsTimeSeriesValueRange', () => {
        it('should be null if if no current time series is set or available', () => {
            expect(getCurrentObservationsTimeSeriesValueRange({
                observationsData: {},
                observationsState: {}
            })).toBeNull();
            expect(getCurrentObservationsTimeSeriesValueRange({
                observationsData: {
                    timeSeries: {}
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toBeNull();
        });

        it('should return the extent of the current time series', () => {
            expect(getCurrentObservationsTimeSeriesValueRange({
                observationsData: {
                    timeSeries: {
                        '12345': {
                            type: 'Feature',
                            id: '12345',
                            properties: {
                                result: [
                                    '12.3',
                                    '12.4',
                                    '4.5',
                                    '7.6'
                                ]
                            }
                        }
                    }
                },
                observationsState: {
                    currentTimeSeriesId: '12345'
                }
            })).toEqual({
                min: 4.5,
                max: 12.4
            });
        });
    });
});
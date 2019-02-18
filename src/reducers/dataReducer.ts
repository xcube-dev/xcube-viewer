import { newDataState, DataState } from '../states/dataState';
import { UPDATE_TIME_SERIES, DataAction, UPDATE_DATASETS, UPDATE_COLOR_BARS } from '../actions/dataActions';


export function dataReducer(state: DataState, action: DataAction): DataState {
    if (typeof state === 'undefined') {
        state = newDataState();
    }
    switch (action.type) {
        case UPDATE_DATASETS: {
            return {...state, datasets: action.datasets};
        }
        case UPDATE_COLOR_BARS: {
            return {...state, colorBars: action.colorBars};
        }
        case UPDATE_TIME_SERIES: {
            if (action.updateMode === "add") {
                return {...state, timeSeriesCollection: [...state.timeSeriesCollection, action.timeSeries]};
            } else if (action.updateMode === "replace") {
                return {...state, timeSeriesCollection: [action.timeSeries]};
            }
        }
    }
    return state;
}

import { newDataState, DataState } from '../states/dataState';
import { DataAction, UPDATE_DATASETS } from '../actions/dataActions';


export function dataReducer(state: DataState, action: DataAction): DataState {
    if (typeof state === 'undefined') {
        state = newDataState();
    }
    switch (action.type) {
        case UPDATE_DATASETS: {
            return {...state, datasets: action.datasets};
        }
    }
    return state;
}

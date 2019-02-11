import { ComponentVisibility, ControlState, newSessionState } from '../states/controlState';
import { CHANGE_COMPONENT_VISIBILITY, SELECT_DATASET, ControlAction } from '../actions/controlActions';

export function controlReducer(state: ControlState, action: ControlAction): ControlState {
    if (typeof state === 'undefined') {
        state = newSessionState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            return {...state, selectedDatasetId: action.selectedDatasetId}
        }
        case CHANGE_COMPONENT_VISIBILITY: {
            let propertyName = action.propertyName;
            let visibilityNew = action.visibility;
            let visibilityOld = state.componentVisibility[propertyName];
            if (typeof visibilityNew === 'undefined') {
                visibilityNew = !visibilityOld;
            }
            if (visibilityNew !== visibilityOld) {
                let componentVisibility: ComponentVisibility | null = null;
                if (visibilityNew) {
                    if (propertyName === 'datasetList') {
                        componentVisibility = {
                            ...state.componentVisibility,
                            datasetList: true,
                            layerList: false,
                            regionList: false
                        }
                    } else if (propertyName === 'layerList') {
                        componentVisibility = {
                            ...state.componentVisibility,
                            datasetList: false,
                            layerList: true,
                            regionList: false
                        }
                    } else if (propertyName === 'regionList') {
                        componentVisibility = {
                            ...state.componentVisibility,
                            datasetList: false,
                            layerList: false,
                            regionList: true
                        }
                    }
                }
                if (componentVisibility === null) {
                    componentVisibility = {...state.componentVisibility, [propertyName]: visibilityNew};
                }
                return {...state, componentVisibility};
            }
        }
    }
    return state;
}

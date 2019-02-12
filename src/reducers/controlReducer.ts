import { ComponentVisibility, ControlState, newSessionState } from '../states/controlState';
import { CHANGE_COMPONENT_VISIBILITY, SELECT_DATASET, SELECT_LOCATION, ControlAction } from '../actions/controlActions';

export function controlReducer(state: ControlState, action: ControlAction): ControlState {
    if (typeof state === 'undefined') {
        state = newSessionState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            return {
                ...state,
                selectedDatasetId: action.selectedDatasetId,
                componentVisibility: getComponentVisibility(state.componentVisibility,
                                                            "datasetList",
                                                            false),
            };
        }
        case SELECT_LOCATION: {
            return {
                ...state,
                selectedLocationId: action.selectedLocationId,
                componentVisibility: getComponentVisibility(state.componentVisibility,
                                                            "locationList",
                                                            false),
            };
        }
        case CHANGE_COMPONENT_VISIBILITY: {
            let componentVisibilityOld = state.componentVisibility;
            let componentVisibilityNew = getComponentVisibility(componentVisibilityOld,
                                                                action.propertyName,
                                                                action.visibility);
            if (componentVisibilityNew !== componentVisibilityOld)
                return {...state, componentVisibility: componentVisibilityNew!};
        }
    }
    return state;
}


function getComponentVisibility(componentVisibilityOld: ComponentVisibility,
                                propertyName: string,
                                visibilityNew: boolean | undefined): ComponentVisibility {
    let componentVisibilityNew = componentVisibilityOld;
    let visibilityOld = componentVisibilityOld[propertyName];
    if (typeof visibilityNew === 'undefined') {
        visibilityNew = !visibilityOld;
    }
    if (visibilityNew !== visibilityOld) {
        if (visibilityNew) {
            if (propertyName === 'datasetList') {
                componentVisibilityNew = {
                    ...componentVisibilityOld,
                    datasetList: true,
                    layerList: false,
                    locationList: false
                }
            } else if (propertyName === 'layerList') {
                componentVisibilityNew = {
                    ...componentVisibilityOld,
                    datasetList: false,
                    layerList: true,
                    locationList: false
                }
            } else if (propertyName === 'locationList') {
                componentVisibilityNew = {
                    ...componentVisibilityOld,
                    datasetList: false,
                    layerList: false,
                    locationList: true
                }
            }
        }
        if (componentVisibilityNew === componentVisibilityOld) {
            componentVisibilityNew = {...componentVisibilityOld, [propertyName]: visibilityNew};
        }
    }
    return componentVisibilityNew;
}

import { ConfigState, newConfigState } from '../states/configState';

import { ConfigAction, CONFIGURE_SERVER } from '../actions/configActions';

const initialState = newConfigState();

export function configReducer(state: ConfigState, action: ConfigAction): ConfigState  {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
        case CONFIGURE_SERVER:
            return {...state, apiServerUrl: action.apiServerUrl};
    }
    return state;
}

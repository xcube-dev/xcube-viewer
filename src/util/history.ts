import { Action, createBrowserHistory, Location } from 'history';

const history = createBrowserHistory();

if (process.env.NODE_ENV === 'development') {
    history.listen((location: Location, action: Action,) => {
        console.debug(`history ${action}:`, location);
    });
}

export default history;
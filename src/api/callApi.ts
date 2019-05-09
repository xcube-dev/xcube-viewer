import { HTTPError } from './errors';
import { I18N } from '../config';


export type QueryComponent = [string, string];

export function callApi<T>(endpointUrl: string, queryComponents?: QueryComponent[], init?: RequestInit): Promise<Response> {

    let url = endpointUrl;
    if (queryComponents && queryComponents.length > 0) {
        const queryString = queryComponents.map(kv => kv.map(encodeURIComponent).join('=')).join('&');
        url += '?' + queryString;
    }

    console.debug('Calling API: ', url);

    return fetch(url, init)
        .then(response => {
            if (!response.ok) {
                throw new HTTPError(response.status, response.statusText);
            }
            return response;
        })
        .catch(error => {
            if (error instanceof TypeError) {
                console.error(`Server did not respond for ${endpointUrl}. `
                              +  "May be caused by timeout, refused connection, network error, etc.", error);
                throw new Error(I18N.get("Server did not respond"));
            } else {
                console.error(error);
            }
            throw error;
        });
}

export function callJsonApi<T>(endpointUrl: string, queryComponents?: QueryComponent[], init?: RequestInit): Promise<T> {
    return callApi(endpointUrl, queryComponents, init).then(response => response.json());
}

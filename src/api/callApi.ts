import { HTTPError } from './errors';

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
                throw new Error(`Cannot reach ${endpointUrl}`);
            }
            throw error;
        });
}

export function callJsonApi<T>(endpointUrl: string, queryComponents?: QueryComponent[], init?: RequestInit): Promise<T> {
    return callApi(endpointUrl, queryComponents, init).then(response => response.json());
}

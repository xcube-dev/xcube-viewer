import { HTTPError } from './errors';
import { I18N } from '../config';


export type QueryComponent = [string, string];

export function makeRequestInit(accessToken: string | null): RequestInit {
    if (accessToken) {
        console.log(`Access token!!`);
        return {
            headers: [['Authorization', `Bearer ${accessToken}`]],
        };
    }
    return {};
}

export function makeRequestUrl(url: string, query: QueryComponent[]) {
    if (query.length > 0) {
        const queryString = query.map(kv => kv.map(encodeURIComponent).join('=')).join('&');
        if (!url.includes('?')) {
            return url + '?' + queryString;
        } else if (!url.endsWith('&')) {
            return url +  '&' + queryString;
        } else {
            return url +  queryString;
        }
    }
    return url;
}

export function callApi<T>(url: string, init?: RequestInit): Promise<Response> {

    if (process.env.NODE_ENV === 'development') {
        console.debug('Calling API: ', url);
    }

    return fetch(url, init)
        .then(response => {
            if (!response.ok) {
                throw new HTTPError(response.status, response.statusText);
            }
            return response;
        })
        .catch(error => {
            if (error instanceof TypeError) {
                console.error(`Server did not respond for ${url}. `
                              +  "May be caused by timeout, refused connection, network error, etc.", error);
                throw new Error(I18N.get("Cannot reach server"));
            } else {
                console.error(error);
                throw error;
            }
        });
}

export function callJsonApi<T>(url: string, init?: RequestInit): Promise<T> {
    return callApi(url, init).then(response => response.json());
}

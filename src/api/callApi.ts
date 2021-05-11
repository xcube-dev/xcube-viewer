/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import i18n from '../i18n';
import { HTTPError } from './errors';


export type QueryComponent = [string, string];

export function makeRequestInit(accessToken: string | null): RequestInit {
    if (accessToken) {
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

export function callApi(url: string, init?: RequestInit): Promise<Response> {

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
                throw new Error(i18n.get("Cannot reach server"));
            } else {
                console.error(error);
                throw error;
            }
        });
}

export function callJsonApi<T>(url: string, init?: RequestInit): Promise<T> {
    return callApi(url, init).then(response => response.json());
}

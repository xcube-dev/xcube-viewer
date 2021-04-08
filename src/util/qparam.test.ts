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

import { getQueryParameterByName } from './qparam';


describe('getQueryParameterByName', () => {

    it('works', () => {
        const serverUrl = 'http://xcube-org:3000/xcube-server/api/v1.0';
        const serverName = 'Default Server';

        const queryStr = `?serverUrl=${encodeURIComponent(serverUrl)}&serverName=${encodeURIComponent(serverName)}`;

        const actualServerUrl = getQueryParameterByName(queryStr, 'serverUrl');
        expect(actualServerUrl).toEqual(serverUrl);

        const actualServerName = getQueryParameterByName(queryStr, 'serverName');
        expect(actualServerName).toEqual(serverName);
    });

    it('works with default (missing param)', () => {
        const serverUrl = 'http://xcube-org:3000/xcube-server/api/v1.0';
        const serverName = 'Default Server';

        const queryStr = `?server=${encodeURIComponent(serverUrl)}&serverName=${encodeURIComponent(serverName)}`;

        const actualServerUrl = getQueryParameterByName(queryStr, 'serverUrl', 'https://pippo');
        expect(actualServerUrl).toEqual('https://pippo');
        const actualServerName = getQueryParameterByName(queryStr, 'serverName', 'https://pippo');
        expect(actualServerName).toEqual(serverName);
    });

    it('works with default (no queryStr)', () => {
        const actualServerUrl = getQueryParameterByName(null, 'serverUrl', 'https://pippo');
        expect(actualServerUrl).toEqual('https://pippo');
    });

});


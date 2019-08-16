
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

});


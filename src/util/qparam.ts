// based on https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

export function getQueryParameterByName(queryStr: string | null,
                                        name: string,
                                        defaultValue: string | null = null): string | null {
    queryStr = queryStr || window.location.search;
    if (!queryStr) {
        return defaultValue;
    }
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(queryStr);
    if (!match) {
        return defaultValue;
    }
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
}

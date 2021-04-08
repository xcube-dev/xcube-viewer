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

// Based on https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e

import { LanguageDictionary } from './lang';


const JSON_CONTENT_1 = {
    languages: {en: "English", de: "Deutsch", it: "Italiano", es: "Espanol"},
    dictionary: [
        {
            en: "Hello",
            de: "Hallo",
            it: "Ciao",
            es: "Hola",
        },
        {
            en: "Hello ${name}!",
            de: "Hallo ${name}!",
            it: "Ciao ${name}!",
            es: "Hola ${name}!",
        },
    ]
};

const JSON_CONTENT_2 = {
    languages: {en: "English", es: "Espanol"},
    dictionary: [
        {
            en: "I got ${count} ${property} ${thing}",
            es: "tengo ${count} ${thing} ${property}",
        },
        {
            en: "one",
            es: "uno",
        },
        {
            en: "tomato",
            es: "tomato",
        },
        {
            en: "green",
            es: "verde",
        }
    ]
};


describe('Database', () => {

    it('can set/get locale', () => {
        const i18n = new LanguageDictionary(JSON_CONTENT_1);
        expect(i18n.locale).toEqual('en');
        i18n.locale = 'de';
        expect(i18n.locale).toEqual('de');
        i18n.locale = 'en-US';
        expect(i18n.locale).toEqual('en');
        i18n.locale = 'de-DE';
        expect(i18n.locale).toEqual('de');
    });

    it('can replace parameter', () => {
        const i18n = new LanguageDictionary(JSON_CONTENT_1);

        const name = 'Bibo';

        expect(i18n.get("Hello ${name}!", {name})).toEqual('Hello Bibo!');

        i18n.locale = 'en';
        expect(i18n.get("Hello ${name}!", {name})).toEqual('Hello Bibo!');

        i18n.locale = 'es';
        expect(i18n.get("Hello ${name}!", {name})).toEqual('Hola Bibo!');

        i18n.locale = 'de';
        expect(i18n.get("Hello ${name}!", {name})).toEqual('Hallo Bibo!');

        i18n.locale = 'it';
        expect(i18n.get("Hello ${name}!", {name})).toEqual('Ciao Bibo!');

        i18n.locale = 'ro';
        expect(i18n.get("Hello ${name}!", {name})).toEqual('Ciao Bibo!');
    });

    it('can replace multiple parameters', () => {
        const i18n = new LanguageDictionary(JSON_CONTENT_2);

        i18n.locale = 'es';

        const count = i18n.get("one");
        const thing = i18n.get("tomato");
        const property = i18n.get("green");

        const result = i18n.get("I got ${count} ${property} ${thing}", {count, thing, property});

        expect(result).toEqual('tengo uno tomato verde');
    });
});


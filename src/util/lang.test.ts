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
    });

    it('can add', () => {
        const i18n = new LanguageDictionary(JSON_CONTENT_1);

        const name = 'Bibo';

        expect(i18n.get("Hello ${name}", {name})).toEqual('Hello Bibo!');

        i18n.locale = 'en';
        expect(i18n.get("Hello ${name}", {name})).toEqual('Hello Bibo!');

        i18n.locale = 'es';
        expect(i18n.get("Hello ${name}", {name})).toEqual('Hola Bibo!');

        i18n.locale = 'de';
        expect(i18n.get("Hello ${name}", {name})).toEqual('Hallo Bibo!');

        i18n.locale = 'it';
        expect(i18n.get("Hello ${name}", {name})).toEqual('Ciao Bibo!');

        i18n.locale = 'ro';
        expect(i18n.get("Hello ${name}", {name})).toEqual('Hello Bibo!');
    });

    it('can deal with multiple parameters', () => {
        const i18n = new LanguageDictionary(JSON_CONTENT_2);

        i18n.locale = 'es';

        const count = i18n.get("one");
        const thing = i18n.get("tomato");
        const property = i18n.get("green");

        const result = i18n.get("I got ${count} ${property} ${thing}", {count, thing, property});

        expect(result).toEqual('tengo uno tomato verde');
    });
});


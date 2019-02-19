// Based on https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e

import Database from './i18n';


describe('Database', () => {

    it('can set/get locale', () => {
        const i18n = new Database();
        expect(i18n.locale).toEqual('en');
        i18n.locale = 'de';
        expect(i18n.locale).toEqual('de');
    });

    it('can add', () => {
        const i18n = new Database();
        i18n.set('en')`Hello ${'name'}!`
            .add('de')`Hallo ${'name'}!`
            .add('it')`Ciao ${'name'}!`
            .add('es')`Hola ${'name'}!`;

        const name = 'Bibo';

        expect(i18n.text`Hello ${name}!`).toEqual('Hello Bibo!');

        i18n.locale = 'en';
        expect(i18n.text`Hello ${name}!`).toEqual('Hello Bibo!');

        i18n.locale = 'es';
        expect(i18n.text`Hello ${name}!`).toEqual('Hola Bibo!');

        i18n.locale = 'de';
        expect(i18n.text`Hello ${name}!`).toEqual('Hallo Bibo!');

        i18n.locale = 'it';
        expect(i18n.text`Hello ${name}!`).toEqual('Ciao Bibo!');

        i18n.locale = 'ro';
        expect(i18n.text`Hello ${name}!`).toEqual('Hello Bibo!');
    });

    it('can deal with multiple parameters', () => {
        const i18n = new Database();

        i18n.set('en')`I got ${'count'} ${'property'} ${'thing'}`
            .add('es')`tengo ${'count'} ${'thing'} ${'property'}`;

        i18n.set('en')`one`
            .add('es')`uno`;

        i18n.set('en')`tomato`
            .add('es')`tomato`;

        i18n.set('en')`green`
            .add('es')`verde`;

        i18n.locale = 'es';

        const count = i18n.text`one`;
        const thing = i18n.text`tomato`;
        const property = i18n.text`green`;

        const result = i18n.text`I got ${count} ${property} ${thing}`;

        expect(result).toEqual('tengo uno tomato verde');
    });
});


// Based on https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e

const KEY_SEP = "\x01";

export default class Database {
    private readonly _baseLocaleId: string;
    private _localeId: string;
    private readonly _locales: { [locale: string]: Templates };

    constructor(baseLocaleId: string = "en") {
        this._baseLocaleId = baseLocaleId;
        this._localeId = baseLocaleId;
        this._locales = {};
    }

    get locale() {
        return this._localeId;
    }

    set locale(value: string) {
        this._localeId = value;
    }

    get text(): TemplateFunction {
        return this._text;
    }

    private _text(strings: TemplateStringsArray, ...values: any[]): string {
        const localeId = this._localeId;
        const templates = this._locales[localeId];
        let translatedStrings: ReadonlyArray<string> = strings;
        let found = false;
        if (templates) {
            const key = strings.join(KEY_SEP);
            const template = templates[key];
            if (template) {
                translatedStrings = template.strings;
                const indexes = template.indexes;
                values = values.map((v, i) => values[indexes[i]]);
                found = true;
            }
        }
        const textParts = [translatedStrings[0]];
        for (let i = 1; i < translatedStrings.length; i++) {
            textParts.push(values[i - 1], translatedStrings[i]);
        }
        const text = textParts.join('');
        if (!found) {
            console.warn(`No translation found for text "${text}" for locale "${localeId}".`);
        }
        return text;
    }

    set(localeId?: string): TemplateAdderFunction {
        return (strings: TemplateStringsArray, ...names: string[]): TemplateAdder => {
            const key = strings.join(KEY_SEP);
            this.addTemplate(localeId || this._baseLocaleId, key, strings, names);
            return new TemplateAdder(this, key);
        };
    }

    addTemplate(localeId: string, key: string, strings: ReadonlyArray<string>, names: ReadonlyArray<string>) {
        const baseLocaleId = this._baseLocaleId;
        let template;
        if (localeId === baseLocaleId) {
            const indexes = names.map((name, index) => index);
            template = {strings: [...strings], indexes, names: [...names]};
        } else {
            const baseTemplates = this._locales[baseLocaleId];
            if (!baseTemplates) {
                console.warn(`Base locale "${baseLocaleId}" not found.`);
            }
            const baseTemplate = baseTemplates[key];
            if (!baseTemplate) {
                console.warn(`No entry found in base locale "${baseLocaleId}" for key "${key}".`);
            }
            const baseNames = baseTemplate.names!;
            const indexes = baseNames.map(name => names.indexOf(name));
            template = {strings: [...strings], indexes};
        }
        const templates = this._locales[localeId] || (this._locales[localeId] = {});
        templates[key] = template;
    }
}

class TemplateAdder {
    private readonly database: Database;
    private readonly key: string;

    constructor(database: Database, key: string) {
        this.database = database;
        this.key = key;
    }

    add(localeId: string): TemplateAdderFunction {
        return (strings: TemplateStringsArray, ...names: string[]): TemplateAdder => {
            this.database.addTemplate(localeId, this.key, strings, names);
            return this;
        };
    }
}

type TemplateFunction = (strings: TemplateStringsArray, ...values: any[]) => string;
type TemplateAdderFunction = (strings: TemplateStringsArray, ...names: string[]) => TemplateAdder;

type Templates = { [key: string]: Template };

interface Template {
    strings: ReadonlyArray<string>;
    indexes: ReadonlyArray<number>;
    names?: ReadonlyArray<string>;
}
export type LanguageDictionaryEntry = { [locale: string]: string };

export interface LanguageDictionaryJson {
    languages: LanguageDictionaryEntry;
    dictionary: LanguageDictionaryEntry[];
}

type LanguageDictionaryContent = { [key: string]: LanguageDictionaryEntry };

export interface WithLocale {
    locale?: string;
}

export class LanguageDictionary {
    private readonly _languages: LanguageDictionaryEntry;
    private readonly _content: LanguageDictionaryContent;
    private _locale: string;

    constructor(json: LanguageDictionaryJson) {

        const locales = Object.getOwnPropertyNames(json.languages);
        if (locales.findIndex(locale => locale === "en") < 0) {
            throw new Error(`Internal error: locale "en" must be included in supported languages`)
        }

        const content: any = {};
        json.dictionary.forEach((entry, index) => {
            locales.forEach(locale => {
                if (!entry[locale]) {
                    throw new Error(`Internal error: invalid entry at index ${index} in "./resources/lang.json":` +
                                    ` missing translation for locale: "${locale}": ${entry}`)
                }
            });
            const phraseKey = getPhraseKey(entry["en"]);
            if (content[phraseKey]) {
                console.warn(`Translation already defined for "${entry["en"]}".`);
            }
            content[phraseKey] = entry;
        });

        this._languages = json.languages;
        this._content = content;
        this._locale = "en";
    }

    get languages(): LanguageDictionaryEntry {
        return this._languages;
    }

    get locale(): string {
        return this._locale;
    }

    set locale(value: string) {
        const locales = Object.getOwnPropertyNames(this._languages);
        if (locales.findIndex(locale => locale === value) < 0) {
            const baseValue = value.split("-")[0];
            if (locales.findIndex(locale => locale === baseValue) < 0) {
                console.error(`No translation found for locale "${value}", staying with "${this._locale}".`);
                return;
            } else {
                console.warn(`No translation found for locale "${value}", falling back to "${baseValue}".`);
                value = baseValue;
            }
        }

        this._locale = value;
    }

    get(phrase: string, values?: { [name: string]: any }): string {
        const key = getPhraseKey(phrase);
        const entry = this._content[key];
        let translatedPhrase: string;
        if (!entry) {
            console.warn(`missing translation for phrase "${phrase}"`);
            translatedPhrase = phrase;
        } else {
            translatedPhrase = entry[this._locale];
            if (!translatedPhrase) {
                console.warn(`missing translation of phrase "${phrase}" for locale "${this._locale}"`);
                translatedPhrase = phrase;
            }
        }
        if (values) {
            Object.keys(values).forEach(name => {
                translatedPhrase = translatedPhrase.replace("${" + name + "}", `${values[name]}`)
            });
        }
        return translatedPhrase;
    }
}

export const getCurrentLocale = (): string => {
    let locale;
    if (navigator.languages && navigator.languages.length > 0) {
        locale = navigator.languages[0];
    } else {
        locale = navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage || 'en';
    }
    return locale.split('-')[0];
};


const getPhraseKey = (phrase: string) => phrase.toLowerCase();

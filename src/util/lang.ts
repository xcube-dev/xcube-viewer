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

    constructor(json: LanguageDictionaryJson, locale?: string) {

        const locales = Object.getOwnPropertyNames(json.languages);
        if (locales.findIndex(locale => locale === "en") < 0) {
            throw new Error(`Internal error: locale "en" must be included in supported languages`)
        }

        let currentLocale = locale || getCurrentLocale();
        if (locales.findIndex(locale => locale === currentLocale) < 0) {
            console.warn(`No translation found for current locale "${currentLocale}", falling back to "en".`);
            currentLocale = "en";
        }

        const content = {};
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
        this._locale = currentLocale;
    }

    get languages(): LanguageDictionaryEntry {
        return this._languages;
    }

    get locale(): string {
        return this._locale;
    }

    set locale(value: string) {
        this._locale = value;
    }

    get(phrase: string, values?: { [name: string]: any }): string {
        const key = getPhraseKey(phrase);
        const entry = this._content[key];
        if (!entry) {
            console.warn(`missing translation for phrase "${phrase}"`);
            return phrase;
        }
        let translatedPhrase = entry[this._locale];
        if (!translatedPhrase) {
            console.warn(`missing translation of phrase "${phrase}" for locale "${this._locale}"`);
            return phrase;
        }
        if (values) {
            Object.keys(values).forEach(name => {
                translatedPhrase = translatedPhrase.replace("${" + name + "}", `${values[name]}`)
            });
        }
        return translatedPhrase;
    }
}

const getCurrentLocale = (): string => {
    if (navigator.languages && navigator.languages.length > 0) {
        return navigator.languages[0];
    } else {
        return navigator["userLanguage"] || navigator["language"] || navigator["browserLanguage"] || 'en';
    }
};


const getPhraseKey = (phrase: string) => phrase.toLowerCase();

import Database from '../util/i18n';

export const DEFAULT_APP_NAME = 'xcube Viewer';
export const DEFAULT_API_SERVER_URL = 'http://localhost:8080/xcube/api/0.1.0.dev6';

export const I18N = new Database();

I18N.locale = "de";

I18N.set('en')`Dataset`
    .add('de')`Datensatz`;

I18N.set('en')`Variable`
    .add('de')`Variable`;

I18N.set('en')`Place`
    .add('de')`Ort`;

I18N.set('en')`Time`
    .add('de')`Zeit`;

I18N.set('en')`Multi`
    .add('de')`Multi`;

I18N.set('en')`Something went wrong.`
    .add('de')`Irgendetwas lief schief.`;

I18N.set('en')`Time-Series`
    .add('de')`Zeitserie`;

I18N.set('en')`Values`
    .add('de')`Werte`;


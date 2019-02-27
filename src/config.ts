import Database from './util/i18n';
import { blue, green, grey, red } from "@material-ui/core/colors";
import { pink } from "@material-ui/core/colors";
import { yellow } from "@material-ui/core/es/colors";


export const VIEWER_APP_NAME = 'xcube Viewer';
export const VIEWER_API_SERVER_URL = 'http://localhost:8080/xcube/api/0.1.0.dev6';

export const VIEWER_THEME = 'dark';
export const VIEWER_PRIMARY_COLOR = blue;
export const VIEWER_SECONDARY_COLOR = pink;

export const VIEWER_LOGO_WIDTH = 32;
export const VIEWER_HEADER_BACKGROUND_COLOR = undefined;

export const LINECHART_STROKES = [grey.A100, red.A100, blue.A100, green.A100, yellow.A100];


export const I18N = new Database();

I18N.locale = 'en';

I18N.set('en')`Dataset`
    .add('de')`Datensatz`
    .add('se')`Uppgifter`;

I18N.set('en')`Variable`
    .add('de')`Variable`
    .add('se')`Variabel`;

I18N.set('en')`Places`
    .add('de')`Orte`
    .add('se')`Platser`;

I18N.set('en')`Place`
    .add('de')`Ort`
    .add('se')`Plats`;

I18N.set('en')`Time`
    .add('de')`Zeit`
    .add('se')`Tid`;

I18N.set('en')`Multi`
    .add('de')`Multi`
    .add('se')`Multi`;

I18N.set('en')`Something went wrong.`
    .add('de')`Irgendetwas lief schief.`
    .add('se')`Något gick fel.`;

I18N.set('en')`Time-Series`
    .add('de')`Zeitserie`
    .add('se')`Tidsserier`;

I18N.set('en')`Values`
    .add('de')`Werte`
    .add('se')`Värden`;

I18N.set('en')`Start`
    .add('de')`Start`
    .add('se')`Start`;

I18N.set('en')`Stop`
    .add('de')`Stopp`
    .add('se')`Stanna`;

I18N.set('en')`Please wait...`
    .add('de')`Bitte warten...`
    .add('se')`Vänta vänta...`;

I18N.set('en')`Loading data`
    .add('de')`Lade Daten`
    .add('se')`Laddar data`;

I18N.set('en')`Cannot reach server`
    .add('de')`Kann Server nicht erreichen`
    .add('se')`Kan inte nå servern`;

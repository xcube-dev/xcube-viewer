import { blue, green, grey, purple, red, pink, yellow, deepPurple } from '@material-ui/core/colors';
import { LanguageDictionary } from './util/lang';
import lang from './resources/lang.json';

export const VIEWER_APP_NAME = '';

export const VIEWER_DEFAULT_API_SERVER = {
    id: 'cyanoalert',
    name: 'CyanoAlert Server',
    url: 'https://www.brockmann-consult.de/cyanoalert-dev/api/0.1.0.dev6'
};

export const VIEWER_API_SERVERS = [
    {...VIEWER_DEFAULT_API_SERVER},
];

export const VIEWER_THEME = 'dark';
export const VIEWER_PRIMARY_COLOR = {
    light: '#ceef64',
    main: '#9abc31',
    dark: '#688c00',
    contrastText: '#fff',
};
export const VIEWER_SECONDARY_COLOR = deepPurple;

export const VIEWER_LOGO_WIDTH = 120;
export const VIEWER_HEADER_BACKGROUND_COLOR = undefined;

export const LINE_CHART_STROKE_SHADE_DARK_THEME = 400;
export const LINE_CHART_STROKE_SHADE_LIGHT_THEME = 800;

export const USER_PLACES_COLORS = {green, red, blue, yellow, purple, pink, orange, cyan, indigo, grey};
export const USER_PLACES_COLOR_NAMES = Object.keys(USER_PLACES_COLORS);

export const I18N = new LanguageDictionary(lang);

import Database from './util/i18n';
import { blue, green, grey, purple, red, pink, yellow, deepPurple } from "@material-ui/core/colors";
import { blue, green, grey, purple, red, pink, yellow } from "@material-ui/core/colors";
import { LanguageDictionary } from "./util/lang";
import lang from "./resources/lang.json";


export const VIEWER_APP_NAME = '';
export const VIEWER_API_SERVER_URL = 'https://www.brockmann-consult.de/cyanoalert-dev/api/0.1.0.dev6';

export const VIEWER_THEME = 'dark';

export const VIEWER_PRIMARY_COLOR = {
    light: "#ceef64",
    main: "#9abc31",
    dark: "#688c00",
    contrastText: '#fff',
};

export const VIEWER_SECONDARY_COLOR = deepPurple;

export const VIEWER_LOGO_WIDTH = 120;
export const VIEWER_HEADER_BACKGROUND_COLOR = undefined;

export const LINECHART_STROKE_SHADE_DARK = 400;
export const LINECHART_STROKE_SHADE_LIGHT = 600;

export const LINECHART_STROKES_BASE = [grey, red, blue, green, yellow, purple, pink];
export const LINECHART_STROKES_LIGHT = LINECHART_STROKES_BASE.map(color => color[LINECHART_STROKE_SHADE_LIGHT]);
export const LINECHART_STROKES_DARK = LINECHART_STROKES_BASE.map(color => color[LINECHART_STROKE_SHADE_DARK]);

export const I18N = new LanguageDictionary(lang);
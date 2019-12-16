import { callJsonApi } from './callApi';
import { ColorBars, ColorBarGroup } from "../model/colorBar";


export function getColorBars(apiServerUrl: string): Promise<ColorBars> {
    return callJsonApi<ColorBars>(apiServerUrl + '/colorbars')
        .then(parseColorBars);
}

function parseColorBars(colorBarGroups: any): ColorBars {
    const groups: ColorBarGroup[] = [];
    const images: any = {};
    colorBarGroups.forEach((colorBarGroup: [string, string, any[]]) => {
        const title = colorBarGroup[0];
        const description = colorBarGroup[1];
        const names: string[] = [];
        colorBarGroup[2].forEach((colorBar: [string, string]) => {
            const name = colorBar[0];
            const image = colorBar[1];
            names.push(name);
            images[name] = image;
        });
        groups.push({title, description, names});
    });
    return {groups, images};
}
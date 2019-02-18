export interface ColorBars {
    groups: ColorBarGroup[];
    images: {[colorBarName: string]: string}
}

export interface ColorBarGroup {
    title: string;
    description: string;
    names: string[];
}
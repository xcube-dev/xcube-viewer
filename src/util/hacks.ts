// Ugly hack to avoid image smoothing. We alter the global HTMLCanvasElementPrototype.getContext() implementation.
// See https://github.com/openlayers/openlayers/issues/10273

const HTMLCanvasElementPrototype = HTMLCanvasElement.prototype as any;
HTMLCanvasElementPrototype._getContextDefault = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElementPrototype._getContextNoImageSmoothing = function (contextType: string, contextAttributes?: any): any {
    const self = this as any;
    const ctx = self._getContextDefault(contextType, contextAttributes);
    if (contextType === '2d') {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
    }
    return ctx;
};


export function getGlobalCanvasImageSmoothing(): boolean {
    return HTMLCanvasElementPrototype.getContext === HTMLCanvasElementPrototype._getContextDefault;
}

export function setGlobalCanvasImageSmoothing(imageSmoothingEnabled: boolean) {
    if (imageSmoothingEnabled) {
        HTMLCanvasElementPrototype.getContext = HTMLCanvasElementPrototype._getContextDefault;
    } else {
        HTMLCanvasElementPrototype.getContext = HTMLCanvasElementPrototype._getContextNoImageSmoothing;
    }
}

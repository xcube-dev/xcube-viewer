import * as  GeoJSON from "geojson";

export interface LocationGroup {
    title: string;
    role: string;
    featureUrl: string;
    feature?: GeoJSON.Feature | GeoJSON.FeatureCollection;
}


export interface Place {
    id: string;
    title: string;
    /**
     * The bounding box. Should be present if `url` is not.
     */
    bbox?: GeoJSON.BBox;
    /**
     * An URL from which a GeoJSON feature or feature collection is loaded. Should be present if `bbox` is not.
     * It may contain template parameters of the form `"${paramName}"`, where the value of `paramName`
     * may be
     * * `"id"` - a parent feature's ID or the feature property "id", if any.
     * * any place identifier.
     */
    url?: string;
    /**
     * The (loaded) feature or feature collection.
     */
    feature?: GeoJSON.Feature | GeoJSON.FeatureCollection;
    /**
     * Sub-places that can use this place or its features as context.
     */
    places?: Place[];
}


export function resolvePlaceUrl(url: string, feature: GeoJSON.Feature) {
    const params = {id: feature.id, ...feature.properties};
    let resolvedUrl = url;
    Object.getOwnPropertyNames(params).forEach(name => {
        resolvedUrl.replace("${" + name + "}", "" + params[name])
    });
    return resolvedUrl;
}

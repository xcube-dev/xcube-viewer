import * as  GeoJSON from 'geojson';
import { Variable } from './variable';
import { PlaceGroup } from './place';


export interface Dataset {
    id: string;
    title: string;
    bbox: GeoJSON.BBox;
    variables: Variable[];
    placeGroups?: PlaceGroup[];
}


export function findDataset(datasets: Dataset[], selectedDatasetId: string | null): Dataset | null {
    return (selectedDatasetId && datasets.find(dataset => dataset.id === selectedDatasetId)) || null;
}

export function findDatasetVariable(dataset: Dataset, variableName: string | null): Variable | null {
    return (variableName && dataset.variables.find(variable => variable.name === variableName)) || null;
}
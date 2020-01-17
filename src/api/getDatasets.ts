import { callJsonApi, makeRequestInit, makeRequestUrl } from './callApi';
import { Dataset, Dimension, TimeDimension } from '../model/dataset';


export function getDatasets(apiServerUrl: string, accessToken: string | null): Promise<Dataset[]> {
    const url = makeRequestUrl(`${apiServerUrl}/datasets`, [['details', '1'], ['tiles','ol4']]);
    const init = makeRequestInit(accessToken);
    return callJsonApi<Dataset[]>(url, init)
        .then((result: any) => result['datasets'])
        .then(adjustTimeDimensionsForDatasets);
}

function adjustTimeDimensionsForDatasets(datasets: Dataset[]): Dataset[] {
    return datasets.map(adjustTimeDimensionsForDataset);
}

function adjustTimeDimensionsForDataset(dataset: Dataset): Dataset {
    if (dataset.dimensions && dataset.dimensions.length) {
        let dimensions = dataset.dimensions;
        const index = dimensions.findIndex((dimension: Dimension) => dimension.name === 'time');
        if (index > -1) {
            const timeDimension = dimensions[index];
            let timeCoordinates: any = timeDimension.coordinates;
            if (timeCoordinates && timeCoordinates.length && typeof timeCoordinates[0] === 'string') {
                let labels = timeCoordinates as string[];
                let coordinates = labels.map((label: string) => new Date(label).getTime());
                dimensions = [...dimensions];
                dimensions[index] = {...timeDimension, coordinates, labels} as TimeDimension;
                return {...dataset, dimensions};
            }
        }
    }
    return dataset;
}
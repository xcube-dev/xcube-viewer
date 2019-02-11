import * as React from 'react';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Dataset } from '../types/dataset';

interface DatasetListProps {
    selectedDatasetId: string | number | null;
    datasets: Dataset[];
    selectDataset: (placeId: string | number | null) => void;
}

export default class DatasetList extends React.Component<DatasetListProps> {
    render() {
        const {selectedDatasetId, datasets, selectDataset} = this.props;
        const userPlaceElements = datasets.map((dataset: Dataset) => (
            <ListItem
                button
                selected={selectedDatasetId === dataset.id}
                onClick={() => selectDataset(dataset.id)}
            >
                <ListItemText primary={dataset.title}/>
            </ListItem>)
        );
        return (
            <List>
                <ListSubheader inset>Datasets</ListSubheader>
                {userPlaceElements}
            </List>
        );
    }
}


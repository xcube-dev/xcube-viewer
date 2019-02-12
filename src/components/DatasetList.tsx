import * as React from 'react';
import { Drawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Dataset } from '../types/dataset';

interface DatasetListProps {
    selectedDatasetId: string | number | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null) => void;
    isDatasetListVisible: boolean;
    closeDatasetList: () => void;
}

export default class DatasetList extends React.Component<DatasetListProps> {
    render() {
        const {selectedDatasetId, datasets, selectDataset, isDatasetListVisible, closeDatasetList} = this.props;
        const elements = datasets.map((dataset: Dataset) => (
            <ListItem
                button
                selected={selectedDatasetId === dataset.id}
                onClick={() => selectDataset(dataset.id)}
            >
                <ListItemText primary={dataset.title} secondary={dataset.id}/>
            </ListItem>)
        );
        return (
            <Drawer anchor="left" open={isDatasetListVisible} onClose={closeDatasetList}>
                <List>
                    <ListSubheader>Select Dataset</ListSubheader >
                    {elements}
                </List>
            </Drawer>
        );
    }
}


import * as React from 'react';
import { Drawer } from '@material-ui/core';
import { Dataset } from '../types/dataset';
import DatasetList from './DatasetList';

interface DatasetDrawerProps {
    selectedDatasetId: string | number | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null) => void;
    isDatasetListVisible: boolean;
    closeDatasetList: () => void;
}

export default class DatasetDrawer extends React.Component<DatasetDrawerProps> {
    render() {
        const {selectedDatasetId, datasets, selectDataset, isDatasetListVisible, closeDatasetList} = this.props;
        return (
            <Drawer anchor="left" open={isDatasetListVisible} onClose={closeDatasetList}>
                <DatasetList
                    selectedDatasetId={selectedDatasetId}
                    datasets={datasets}
                    selectDataset={selectDataset}/>
            </Drawer>
        );
    }
}


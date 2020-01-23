import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InfoIcon from '@material-ui/icons/Info';
import MyLocationIcon from '@material-ui/icons/MyLocation';

import { Dataset } from '../model/dataset';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import ControlBarItem from './ControlBarItem';


const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {},
    });

interface DatasetSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedDatasetId: string | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null, datasets: Dataset[]) => void;
    flyToDataset: (datasetId: string | null, datasets: Dataset[]) => void;
    showInfoCard: (open: boolean) => void;
}

const DatasetSelect: React.FC<DatasetSelectProps> = ({
                                                         classes,
                                                         selectedDatasetId,
                                                         datasets,
                                                         selectDataset,
                                                         flyToDataset,
                                                         showInfoCard,
                                                     }) => {

    const handleDatasetChange = (event: React.ChangeEvent<{ name?: string; value: any; }>) => {
        selectDataset(event.target.value || null, datasets);
    };

    selectedDatasetId = selectedDatasetId || '';
    datasets = datasets || [];

    const datasetSelectLabel = (
        <InputLabel shrink htmlFor="dataset-select">
            {I18N.get('Dataset')}
        </InputLabel>
    );

    const datasetSelect = (
        <Select
            value={selectedDatasetId}
            onChange={handleDatasetChange}
            input={<Input name="dataset" id="dataset-select"/>}
            displayEmpty
            name="dataset"
            className={classes.selectEmpty}
        >
            {datasets.map(dataset => (
                <MenuItem
                    key={dataset.id}
                    value={dataset.id}
                    selected={dataset.id === selectedDatasetId}
                >
                    {dataset.title}
                </MenuItem>
            ))}
        </Select>
    );

    const handleLocateButtonClick = () => {
        flyToDataset(selectedDatasetId, datasets);
    };

    const handleInfoButtonClick = () => {
        showInfoCard(true);
    };

    return (
        <ControlBarItem
            label={datasetSelectLabel}
            control={datasetSelect}
            actions={
                [
                    (<IconButton
                        key={0}
                        disabled={selectedDatasetId === ''}
                        onClick={handleLocateButtonClick}
                    >
                        {<MyLocationIcon/>}
                    </IconButton>),
                    (<IconButton
                        key={1}
                        disabled={selectedDatasetId === ''}
                        onClick={handleInfoButtonClick}
                    >
                        {<InfoIcon/>}
                    </IconButton>)
                ]
            }
        />
    );
};

export default withStyles(styles)(DatasetSelect);


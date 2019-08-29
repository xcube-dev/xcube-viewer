import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
        selectEmpty: {
        },
    });

interface DatasetSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedDatasetId: string | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null, dataset: Dataset[]) => void;
}

class DatasetSelect extends React.Component<DatasetSelectProps> {

    handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectDataset(event.target.value || null, this.props.datasets);
    };

    render() {
        const {classes} = this.props;

        const selectedDatasetId = this.props.selectedDatasetId || '';
        const datasets = this.props.datasets || [];

        const datasetSelectLabel = (
            <InputLabel shrink htmlFor="dataset-select">
            {I18N.get('Dataset')}
        </InputLabel>
        );

        const datasetSelect = (
            <Select
                value={selectedDatasetId}
                onChange={this.handleDatasetChange}
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

        return (
            <ControlBarItem
                label={datasetSelectLabel}
                control={datasetSelect}
            />
        );
    }
}

export default withStyles(styles)(DatasetSelect);


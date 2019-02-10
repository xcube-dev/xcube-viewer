import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
//import DashboardIcon from '@material-ui/icons/Dashboard';
//import BarChartIcon from '@material-ui/icons/BarChart';
import StorageIcon from '@material-ui/icons/Storage';
import CategoryIcon from '@material-ui/icons/Category';
import LayersIcon from '@material-ui/icons/Layers';
import TimelineIcon from '@material-ui/icons/Timeline';
//import SlideshowIcon from '@material-ui/icons/Slideshow';
import DateRangeIcon from '@material-ui/icons/DateRange';

interface PrimaryDrawerListProps {
    isDatasetsSelected: boolean;
    onDatasetsSelected: () => void;

    isLayersSelected: boolean;
    onLayersSelected: () => void;

    isRegionsSelected: boolean;
    onRegionsSelected: () => void;

    isTimeSelected: boolean;
    onTimeSelected: () => void;

    isTimeseriesSelected: boolean;
    onTimeseriesSelected: () => void;
}

export default class PrimaryDrawerList extends React.Component<PrimaryDrawerListProps> {
    render() {
        const {
            isDatasetsSelected, onDatasetsSelected,
            isLayersSelected, onLayersSelected,
            isRegionsSelected, onRegionsSelected,
            isTimeSelected, onTimeSelected,
            isTimeseriesSelected, onTimeseriesSelected,
        } = this.props;
        return (
            <List>
                <div>
                    <ListItem button selected={isDatasetsSelected} onClick={onDatasetsSelected}>
                        <ListItemIcon>
                            <StorageIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Datasets"/>
                    </ListItem>
                    <ListItem button selected={isLayersSelected} onClick={onLayersSelected}>
                        <ListItemIcon>
                            <LayersIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Layers"/>
                    </ListItem>
                    <ListItem button selected={isRegionsSelected} onClick={onRegionsSelected}>
                        <ListItemIcon>
                            <CategoryIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Regions"/>
                    </ListItem>
                    <ListItem button selected={isTimeSelected} onClick={onTimeSelected}>
                        <ListItemIcon>
                            <DateRangeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Time"/>
                    </ListItem>
                    <ListItem button selected={isTimeseriesSelected} onClick={onTimeseriesSelected}>
                        <ListItemIcon>
                            <TimelineIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Time-Series"/>
                    </ListItem>
                </div>
            </List>
        );
    }
}

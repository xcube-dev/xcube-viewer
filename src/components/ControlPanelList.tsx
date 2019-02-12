import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import CategoryIcon from '@material-ui/icons/Category';
import LayersIcon from '@material-ui/icons/Layers';
import DateRangeIcon from '@material-ui/icons/DateRange';
import TimelineIcon from '@material-ui/icons/Timeline';
import { ComponentVisibility } from '../states/controlState';

interface PrimaryDrawerListProps {
    componentVisibility: ComponentVisibility;
    changeComponentVisibility: (propertyName: string, visibility?: boolean) => void;
}

interface ActionEntry {
    propertyName: string;
    labelText: string;
    iconElement: JSX.Element;
    handler: () => void;
}

export default class ControlPanelList extends React.Component<PrimaryDrawerListProps> {

    actionEntries: ActionEntry[];

    constructor(props: Readonly<PrimaryDrawerListProps>) {
        super(props);
        this.actionEntries = [
            this.getActionEntry('datasetList', 'Datasets', <StorageIcon/>),
            this.getActionEntry('layerList', 'Layers', <LayersIcon/>),
            this.getActionEntry('locationList', 'Locations', <CategoryIcon/>),
            this.getActionEntry('timePanel', 'Time', <DateRangeIcon/>),
            this.getActionEntry('timeSeriesPanel', 'Time-Series', <TimelineIcon/>),
        ];
    }

    private getActionEntry = (propertyName: string, labelText: string, iconElement: JSX.Element): ActionEntry => {
        const handler = () => this.props.changeComponentVisibility(propertyName);
        return {propertyName, labelText, iconElement, handler};
    };

    render() {
        const {componentVisibility} = this.props;
        const actions = [];
        for (let actionEntry of this.actionEntries) {
            actions.push(
                <ListItem button
                          selected={componentVisibility[actionEntry.propertyName]}
                          onClick={actionEntry.handler}>
                    <ListItemIcon>{actionEntry.iconElement}</ListItemIcon>
                    <ListItemText primary={actionEntry.labelText}/>
                </ListItem>
            );
        }
        return (<List>{actions}</List>);
    }
}

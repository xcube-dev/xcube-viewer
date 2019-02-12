import * as React from 'react';
import * as GeoJSON from 'geojson';

import { Drawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Location, LocationGroup } from '../types/location';


interface DatasetListProps {
    selectedLocationId: string | number | null;
    locationGroup: LocationGroup | null;
    selectLocation: (selectedLocationId: string | number | null) => void;
    isLocationListVisible: boolean;
    closeLocationList: () => void;
}

export default class LocationList extends React.Component<DatasetListProps> {
    render() {
        const {locationGroup} = this.props;
        if (locationGroup === null) {
            return null;
        }
        const {selectedLocationId, selectLocation, isLocationListVisible, closeLocationList} = this.props;
        const groupElement = LocationList.getGroupElement(locationGroup, selectedLocationId, selectLocation, "");
        return (
            <div>
                <Drawer anchor="left" open={isLocationListVisible} onClose={closeLocationList}>
                    {groupElement}
                </Drawer>
            </div>
        );
    }

    private static getGroupElement(locationGroup: LocationGroup,
                                   selectedLocationId: string | number | null,
                                   selectLocation: (id: string | number | null) => void,
                                   indent: string): JSX.Element {
        const elements = LocationList.getElements(locationGroup.locations, selectedLocationId, selectLocation, indent);
        return (<List dense disablePadding>
            <ListSubheader>{indent}{locationGroup.title}</ListSubheader>
            {elements}
        </List>);
    }

    private static getElements(locations: Location[],
                               selectedLocationId: string | number | null,
                               selectLocation: (id: string | number | null) => void,
                               indent: string): JSX.Element[] {
        const elements: JSX.Element[] = [];
        locations.forEach((location: Location) => {
            elements.push(LocationList.getFeatureElement(location.feature, selectedLocationId, selectLocation, indent));
            const locationGroup = location.group;
            if (locationGroup) {
                elements.push(LocationList.getGroupElement(locationGroup,
                                                           selectedLocationId, selectLocation, indent + ".."));
            }
        });
        return elements;
    }

    private static getFeatureElement(feature: GeoJSON.Feature,
                                     selectedLocationId: string | number | null,
                                     selectLocation: (id: string | number | null) => void,
                                     indent: string): JSX.Element {
        const locationId = LocationList.normalizeFeatureId(feature.id);
        const title = (feature.properties && (feature.properties["title"] || feature.properties["title"])) || "No title";
        return (
            <ListItem
                button
                selected={selectedLocationId === locationId}
                onClick={() => selectLocation(locationId)}
            >
                <ListItemText primary={indent + title}/>
            </ListItem>
        );
    }

    private static normalizeFeatureId(id?: number | string): string | number | null {
        if (typeof id === 'undefined') {
            return null;
        }
        return id;
    }
}




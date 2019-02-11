import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';
import * as GeoJSON from 'geojson';

interface UserPlacesListProps {
    selectedUserPlaceId: string | number | null;
    userPlaces: GeoJSON.FeatureCollection;
    selectUserPlace: (placeId: string | number | null) => void;
}

export default class UserPlacesList extends React.Component<UserPlacesListProps> {
    render() {
        const {selectedUserPlaceId, userPlaces, selectUserPlace} = this.props;
        const userPlaceElements = userPlaces.features.map((place: GeoJSON.Feature) => (
            <ListItem
                button
                selected={selectedUserPlaceId === place.id}
                onClick={() => selectUserPlace(UserPlacesList.normalizeUserPlaceId(place.id))}>
                <ListItemIcon>
                    <PlaceIcon/>
                </ListItemIcon>
                <ListItemText
                    primary={(place.properties && place.properties['title']) || `Place ${place.id}`}
                />
            </ListItem>)
        );
        return (
            <List>
                <ListSubheader inset>User Places</ListSubheader>
                {userPlaceElements}
            </List>
        );
    }

    private static normalizeUserPlaceId(id?: number | string): string | number | null {
        if (typeof id === 'undefined') {
            return null;
        }
        return id;
    }
}


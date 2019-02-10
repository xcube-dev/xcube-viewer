import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';

interface SecondaryDrawerListProps {
}

export default class SecondaryDrawerList extends React.Component<SecondaryDrawerListProps> {
    render() {
        return (
            <List>
                <ListSubheader inset>Saved locations</ListSubheader>
                <ListItem button>
                    <ListItemIcon>
                        <PlaceIcon/>
                    </ListItemIcon>
                    <ListItemText primary="My Place #1"/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <PlaceIcon/>
                    </ListItemIcon>
                    <ListItemText primary="My Place #2"/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <PlaceIcon/>
                    </ListItemIcon>
                    <ListItemText primary="My Place #3"/>
                </ListItem>
            </List>
        );
    }
}


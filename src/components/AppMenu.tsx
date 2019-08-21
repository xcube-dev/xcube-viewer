import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { WithLocale } from '../util/lang';
import { I18N } from '../config';


interface AppMenuProps extends WithLocale {
    anchorElement: HTMLElement | null;
    itemSelect: (itemId: string | null) => void;
}

export default class AppMenu extends React.Component<AppMenuProps> {

    handleClose = () => {
        this.props.itemSelect(null);
    };

    handleLanguage = () => {
        this.props.itemSelect('language');
    };

    handleServer = () => {
        this.props.itemSelect('server');
    };

    // handleSettings = () => {
    //     this.props.itemSelect('settings');
    // };

    render() {
        const {anchorElement} = this.props;
        return (
            <Menu
                id="app-menu"
                anchorEl={anchorElement}
                open={Boolean(anchorElement)}
                onClose={this.handleClose}
            >
                <MenuItem onClick={this.handleLanguage}>{I18N.get('Language')}</MenuItem>
                <MenuItem onClick={this.handleServer}>{I18N.get('Server')}</MenuItem>
                {/*<MenuItem onClick={this.handleSettings}>{I18N.get('Settings')}</MenuItem>*/}
            </Menu>
        );
    }
}

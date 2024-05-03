/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from "react";
import { useAuth } from "react-oidc-context";
import { Theme } from "@mui/material";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { deepOrange } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";

import i18n from "@/i18n";
import { Config } from "@/config";
import { WithLocale } from "@/util/lang";
import UserProfile from "@/components/UserProfile";

const styles = (theme: Theme) =>
  createStyles({
    imageAvatar: {
      width: 32,
      height: 32,
      color: "#fff",
      backgroundColor: deepOrange[300],
    },
    letterAvatar: {
      width: 32,
      height: 32,
      color: "#fff",
      backgroundColor: deepOrange[300],
    },
    signInWrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    signInProgress: {
      color: deepOrange[300],
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 1,
      marginTop: -12,
      marginLeft: -12,
    },
    iconButton: {
      padding: 0,
    },
  });

interface UserControlProps extends WithStyles<typeof styles>, WithLocale {
  updateAccessToken: (accessToken: string | null) => void;
}

const UserControlContent: React.FC<UserControlProps> = ({
  classes,
  updateAccessToken,
}) => {
  const auth = useAuth();
  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);

  if (import.meta.env.DEV) {
    console.debug("User: ", auth.user);
  }

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("User changed:", auth.user);
    }
    if (auth.user && auth.user.access_token) {
      updateAccessToken(auth.user.access_token);
    } else {
      updateAccessToken(null);
    }
  }, [auth.user, updateAccessToken]);

  const handleUserProfileMenuItemClicked = () => {
    handleUserMenuClose();
    setProfileDialogOpen(true);
  };

  const handleUserProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleSignInButtonClicked = () => {
    auth
      .signinRedirect()
      .then(() => {
        if (import.meta.env.DEV) {
          console.debug("Signed in:", auth.user);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSignOutMenuItemClicked = () => {
    handleUserMenuClose();
    auth
      .signoutRedirect()
      .then(() => {
        if (import.meta.env.DEV) {
          console.debug("Signed out:", auth.user);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (auth.user) {
    const userInfo = auth.user.profile;
    let avatar;
    let avatarContent: React.ReactNode = <PersonIcon />;
    if (!userInfo) {
      avatar = <Avatar className={classes.letterAvatar}>?</Avatar>;
    } else if (userInfo.picture) {
      avatar = (
        <Avatar
          className={classes.imageAvatar}
          src={userInfo.picture}
          alt={userInfo.name}
        />
      );
    } else {
      const name1 = userInfo.given_name || userInfo.name || userInfo.nickname;
      const name2 = userInfo.family_name;
      let letters: string | null = null;
      if (name1 && name2) {
        letters = name1[0] + name2[0];
      } else if (name1) {
        letters = name1[0];
      } else if (name2) {
        letters = name2[0];
      }
      if (letters !== null) {
        avatarContent = letters.toUpperCase();
      }
      avatar = (
        <Avatar className={classes.letterAvatar}>{avatarContent}</Avatar>
      );
    }
    return (
      <React.Fragment>
        <IconButton
          onClick={handleUserMenuOpen}
          aria-controls="user-menu"
          aria-haspopup="true"
          size="small"
          className={classes.iconButton}
        >
          {avatar}
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          keepMounted
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem onClick={handleUserProfileMenuItemClicked}>
            {i18n.get("Profile")}
          </MenuItem>
          <MenuItem onClick={handleSignOutMenuItemClicked}>
            {i18n.get("Log out")}
          </MenuItem>
        </Menu>
        <Dialog
          open={profileDialogOpen}
          keepMounted
          onClose={handleUserProfileDialogClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {i18n.get("User Profile")}
          </DialogTitle>
          <DialogContent>
            <UserProfile userInfo={auth.user.profile} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserProfileDialogClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  } else {
    let userButton = (
      <IconButton
        onClick={auth.isLoading ? undefined : handleSignInButtonClicked}
        size="small"
      >
        <PersonIcon />
      </IconButton>
    );
    if (auth.isLoading) {
      userButton = (
        <div className={classes.signInWrapper}>
          {userButton}
          <CircularProgress size={24} className={classes.signInProgress} />
        </div>
      );
    }
    return userButton;
  }
};

const _UserControl: React.FC<UserControlProps> = (props) => {
  if (!Config.instance.authClient) {
    return null;
  }
  return <UserControlContent {...props} />;
};

const UserControl = withStyles(styles)(_UserControl);
export default UserControl;

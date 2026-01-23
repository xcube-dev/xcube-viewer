/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { useAuth } from "react-oidc-context";
import { makeStyles } from "@/util/styles";
import { styled } from "@mui/system";
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
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";

import i18n from "@/i18n";
import { Config } from "@/config";
import { WithLocale } from "@/util/lang";
import UserProfile from "@/components/UserProfile";

const styles = makeStyles({
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
  signInProgress: {
    color: deepOrange[300],
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 1,
    marginTop: -12,
    marginLeft: -12,
  },
  iconButton: (theme) => ({
    marginLeft: theme.spacing(2),
    ...Config.instance.branding.headerIconStyle,
  }),
});

const StyledContainerDiv = styled("div")({
  position: "relative",
});

interface UserControlProps extends WithLocale {
  updateAccessToken: (accessToken: string | null) => void;
}

const UserControlContent: React.FC<UserControlProps> = ({
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
      console.debug("User changed:", auth.user);
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
      avatar = <Avatar sx={styles.letterAvatar}>?</Avatar>;
    } else if (userInfo.picture) {
      avatar = (
        <Avatar
          sx={styles.imageAvatar}
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
      avatar = <Avatar sx={styles.letterAvatar}>{avatarContent}</Avatar>;
    }
    return (
      <React.Fragment>
        <IconButton
          onClick={handleUserMenuOpen}
          aria-controls="user-menu"
          aria-haspopup="true"
          size="small"
          sx={styles.iconButton}
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
            <Button onClick={handleUserProfileDialogClose}>OK</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  } else {
    let userButton = (
      <Tooltip arrow title={i18n.get("User Profile")}>
        <IconButton
          onClick={auth.isLoading ? undefined : handleSignInButtonClicked}
          size="small"
          sx={styles.iconButton}
        >
          <PersonIcon />
        </IconButton>
      </Tooltip>
    );
    if (auth.isLoading) {
      userButton = (
        <StyledContainerDiv>
          {userButton}
          <CircularProgress size={24} sx={styles.signInProgress} />
        </StyledContainerDiv>
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

const UserControl = _UserControl;
export default UserControl;

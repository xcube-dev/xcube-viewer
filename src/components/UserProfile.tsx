/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { UserProfile as UserInfo } from "oidc-client-ts";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";

interface UserProfileProps extends WithLocale {
  userInfo: UserInfo;
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo }) => {
  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item>
        <img src={userInfo.picture} width={84} alt={i18n.get("User Profile")} />
      </Grid>
      <Grid item>
        <Paper elevation={3}>
          <List>
            <ListItem>
              <ListItemText
                primary={userInfo.name}
                secondary={i18n.get("User name")}
              />
            </ListItem>
            <Divider light />
            <ListItem>
              <ListItemText
                primary={`${userInfo.email} (${userInfo.email_verified ? i18n.get("verified") : i18n.get("not verified")})`}
                secondary={i18n.get("E-mail")}
              />
            </ListItem>
            <Divider light />
            <ListItem>
              <ListItemText
                primary={userInfo.nickname}
                secondary={i18n.get("Nickname")}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default UserProfile;

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";

import { makeStyles } from "@/util/styles";
import { styled } from "@mui/system";
import Markdown from "@/components/Markdown";

const styles = makeStyles({
  dialog: (theme) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[200],
    padding: 2,
  }),
  appBar: {
    position: "relative",
  },
  title: (theme) => ({
    marginLeft: theme.spacing(2),
    flex: 1,
  }),
});
const StyledDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(40),
  marginRight: theme.spacing(40),
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MarkdownPageProps {
  title: string;
  text: string;
  open: boolean;
  onClose: () => void;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({
  title,
  text,
  open,
  onClose,
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ tabIndex: -1 }}
    >
      <AppBar sx={styles.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={styles.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent sx={styles.dialog}>
        <StyledDiv>
          <Markdown text={text} />
        </StyledDiv>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownPage;

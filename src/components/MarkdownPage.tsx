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

import React from "react";
import Markdown from "react-markdown";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";

import useFetchText from "@/hooks/useFetchText";
import { makeStyles } from "@/util/styles";
import { styled } from "@mui/system";

const styles = makeStyles({
  dialog: (theme) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200],
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
  text?: string;
  href?: string;
  open: boolean;
  onClose: () => void;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({
  title,
  text,
  href,
  open,
  onClose,
}) => {
  let markdownText = useFetchText(href);

  if (markdownText && text) {
    markdownText = markdownText.replace("${text}", text);
  } else if (!markdownText) {
    markdownText = text;
  }

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
          <Markdown children={markdownText || ""} linkTarget="_blank" />
        </StyledDiv>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownPage;

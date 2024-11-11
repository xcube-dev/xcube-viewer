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

import { useContext, useEffect, useState } from "react";
import { Store } from "redux";
import { ReactReduxContext } from "react-redux";
import Markdown from "react-markdown";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import i18n from "@/i18n";
import { ControlState } from "@/states/controlState";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  icon: (theme) => ({
    marginRight: theme.spacing(2),
  }),
});

interface LegalAgreementDialogProps {
  open: boolean;
  settings: ControlState;
  updateSettings: (settings: ControlState) => void;
  syncWithServer: (store: Store) => void;
}

export default function LegalAgreementDialog({
  open,
  settings,
  updateSettings,
  syncWithServer,
}: LegalAgreementDialogProps) {
  const [markdownText, setMarkdownText] = useState<string | null>(null);

  const { store } = useContext(ReactReduxContext);

  useEffect(() => {
    const href = i18n.get("docs/privacy-note.en.md");
    // fetch(window.location.href + href)
    fetch(href)
      .then((response) => response.text())
      .then((text) => setMarkdownText(text));
  });

  if (!open) {
    return null;
  }

  function handleConfirm() {
    updateSettings({ ...settings, privacyNoticeAccepted: true });
    syncWithServer(store);
  }

  function handleLeave() {
    try {
      if (window.history.length > 0) {
        window.history.back();
      } else if (
        typeof (window as unknown as { home?: unknown }).home === "function"
      ) {
        (window as unknown as { home: () => void }).home();
      } else {
        window.location.href = "about:home";
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      keepMounted={true}
      scroll="body"
    >
      <DialogTitle>{i18n.get("Privacy Notice")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {markdownText === null ? (
            <CircularProgress />
          ) : (
            <Markdown children={markdownText} linkTarget="_blank" />
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleConfirm}>
          <CheckIcon sx={styles.icon} />
          {i18n.get("Accept and continue")}
        </Button>
        <Button onClick={handleLeave}>{i18n.get("Leave")}</Button>
      </DialogActions>
    </Dialog>
  );
}

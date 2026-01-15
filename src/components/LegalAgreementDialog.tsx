/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useContext, useEffect, useState } from "react";
import { Store } from "redux";
import { ReactReduxContext } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { ControlState } from "@/states/controlState";
import Markdown from "@/components/Markdown";

const styles = makeStyles({
  icon: (theme) => ({
    marginRight: theme.spacing(2),
  }),
});

interface LegalAgreementDialogProps {
  open: boolean;
  settings: ControlState;
  updateSettings: (settings: ControlState) => void;
  syncWithServer: (store: Store, init: boolean) => void;
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
    syncWithServer(store, true);
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
            <Markdown text={markdownText} />
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

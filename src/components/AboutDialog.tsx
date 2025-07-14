/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import { type WithLocale } from "@/util/lang";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AboutItem from "@/components/AboutItem";

interface AboutDialogProps extends WithLocale {
  open: boolean;
  closeDialog: (dialogId: string) => void;
}

const AboutDialog = ({ open, closeDialog }: AboutDialogProps) => {
  function handleCloseDialog() {
    closeDialog("about");
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{i18n.get("About")}</DialogTitle>
      <DialogContent>
        <AboutItem />
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;

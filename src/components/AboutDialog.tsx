/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type WithLocale } from "@/util/lang";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

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
      <DialogContent>
        <AboutItem />
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;

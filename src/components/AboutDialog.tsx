/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import { type WithLocale } from "@/util/lang";

import useFetchText from "@/hooks/useFetchText";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Markdown from "@/components/Markdown";
import { closeDialog } from "@/actions/controlActions";

interface AboutDialogProps extends WithLocale {
  open: boolean;
  closeDialog: (dialogId: string) => void;
}

const AboutDialog = ({ open, closeDialog }: AboutDialogProps) => {
  const text = useFetchText(i18n.get("docs/about.en.md"));

  function handleCloseDialog() {
    closeDialog("about");
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogContent>
        <Markdown text={text} />
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;

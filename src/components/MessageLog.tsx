/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme, styled } from "@mui/system";
import { SxProps } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarOrigin } from "@mui/material/Snackbar/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { green, amber } from "@mui/material/colors";

import { MessageLogEntry } from "@/states/messageLogState";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const StyledSpan = styled("span")(() => ({
  display: "flex",
  alignItems: "center",
}));

const styles: Record<string, SxProps<Theme>> = {
  close: {
    p: 0.5,
  },
  success: (theme: Theme) => ({
    color: theme.palette.error.contrastText,
    backgroundColor: green[600],
  }),
  error: (theme: Theme) => ({
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.dark,
  }),
  info: (theme: Theme) => ({
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.primary.dark,
  }),
  warning: (theme: Theme) => ({
    color: theme.palette.error.contrastText,
    backgroundColor: amber[700],
  }),
  icon: {
    fontSize: 20,
  },
  iconVariant: (theme: Theme) => ({
    opacity: 0.9,
    marginRight: theme.spacing(1),
    fontSize: 20,
  }),
  message: {
    display: "flex",
    alignItems: "center",
  },
};

interface MessageLogProps {
  message: MessageLogEntry | null;
  hideMessage: (messageId: number) => void;
  className?: string;
}

const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

export default function MessageLog({
  className,
  message,
  hideMessage,
}: MessageLogProps) {
  const handleClose = () => {
    hideMessage(message!.id);
  };

  if (!message) {
    return null;
  }

  const MessageIcon = variantIcon[message.type];

  return (
    <Snackbar
      key={message.type + ":" + message.text}
      open={true}
      anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <SnackbarContent
        sx={styles[message.type]}
        className={className}
        aria-describedby="client-snackbar"
        message={
          <StyledSpan id="client-snackbar">
            <MessageIcon sx={styles.iconVariant} />
            {message.text}
          </StyledSpan>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            sx={styles.close}
            onClick={handleClose}
            size="large"
          >
            <CloseIcon sx={styles.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState, useEffect } from "react";
import { WithLocale } from "@/util/lang";
import i18n from "@/i18n";

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Theme, styled } from "@mui/system";

import AboutItem from "@/components/AboutItem";
import { Config } from "@/config";

const StyledProgress = styled(CircularProgress)(
  ({ theme }: { theme: Theme }) => ({
    margin: theme.spacing(2),
  }),
);
const StyledMessage = styled(Typography)(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(1),
}));

const StyledContainerDiv = styled("div")(({ theme }: { theme: Theme }) => ({
  margin: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
}));

interface LoadingDialogProps extends WithLocale {
  messages: string[];
}

export default function LoadingDialog({ messages }: LoadingDialogProps) {
  const [startTime] = useState(Date.now());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const minTime = 3000; // min. display time in ms (1000 ms = 1 s)

    if (messages.length === 0) {
      const elapsed = Date.now() - startTime;

      if (elapsed >= minTime) {
        setVisible(false);
      } else {
        // wait remaining time until minTime mark
        const remaining = minTime - elapsed;
        timer = setTimeout(() => {
          setVisible(false);
        }, remaining);
      }
    } else {
      setVisible(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [messages, startTime]);

  if (!visible) {
    return null;
  }

  return (
    <Dialog open={true} aria-labelledby="loading">
      {Config.instance.branding.allowAboutPage && (
        <DialogContent>
          <AboutItem />
        </DialogContent>
      )}
      {!Config.instance.branding.allowAboutPage && (
        <DialogTitle id="loading">{i18n.get("Please wait...")}</DialogTitle>
      )}
      <StyledContainerDiv>
        <StyledProgress />
        {messages.map((message, i) => (
          <StyledMessage key={i}>{message}</StyledMessage>
        ))}
      </StyledContainerDiv>
    </Dialog>
  );
}

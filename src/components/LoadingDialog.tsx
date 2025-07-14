/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { WithLocale } from "@/util/lang";

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
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
  if (messages.length === 0) {
    return null;
  }
  return (
    <Dialog open={true} aria-labelledby="loading">
      {Config.instance.branding.allowAboutPage && (
        <DialogContent>
          <AboutItem />
        </DialogContent>
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

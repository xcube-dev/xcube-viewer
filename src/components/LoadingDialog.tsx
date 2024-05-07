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

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Theme, styled } from "@mui/system";
import Typography from "@mui/material/Typography";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";

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
      <DialogTitle id="loading">{i18n.get("Please wait...")}</DialogTitle>
      <StyledContainerDiv>
        <StyledProgress />
        {messages.map((message, i) => (
          <StyledMessage key={i}>{message}</StyledMessage>
        ))}
      </StyledContainerDiv>
    </Dialog>
  );
}

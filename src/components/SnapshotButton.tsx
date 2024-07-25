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

import { RefObject } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { MessageType } from "@/states/messageLogState";
import { exportElement } from "@/util/export";
import ToolButton from "@/components/ToolButton";

interface SnapshotButtonProps extends WithLocale {
  elementRef: RefObject<HTMLDivElement | null>;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function SnapshotButton({
  elementRef,
  postMessage,
}: SnapshotButtonProps) {
  const handleExportSuccess = () => {
    postMessage("success", i18n.get("Snapshot copied to clipboard"));
  };

  const handleExportError = (error: unknown) => {
    const message = "Error copying snapshot to clipboard";
    console.error(message + ":", error);
    postMessage("error", i18n.get(message));
  };

  const handleButtonClick = () => {
    if (elementRef.current) {
      exportElement(elementRef.current!, {
        format: "png",
        width: 2000,
        handleSuccess: handleExportSuccess,
        handleError: handleExportError,
      });
    } else {
      handleExportError(new Error("missing element reference"));
    }
  };

  return (
    <ToolButton
      tooltipText={i18n.get("Copy snapshot of chart to clipboard")}
      onClick={handleButtonClick}
      icon={<CameraAltIcon fontSize="inherit" />}
    />
  );
}

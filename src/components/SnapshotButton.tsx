/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  hiddenElements?: HTMLElement[] | ((root: HTMLElement) => HTMLElement[]);
}

export default function SnapshotButton({
  elementRef,
  postMessage,
  hiddenElements = [],
}: SnapshotButtonProps) {
  const pixelRatio = 1;

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
        pixelRatio: pixelRatio,
        hiddenElements: hiddenElements,
      });
    } else {
      handleExportError(new Error("missing element reference"));
    }
  };

  return (
    <ToolButton
      tooltipText={i18n.get("Copy snapshot to clipboard")}
      onClick={handleButtonClick}
      icon={<CameraAltIcon fontSize="inherit" />}
    />
  );
}

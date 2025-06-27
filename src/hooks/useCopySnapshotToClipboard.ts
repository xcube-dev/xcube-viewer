/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { RefObject, useCallback } from "react";

import i18n from "@/i18n";
import { exportElement, ExportOptions } from "@/util/export";
import { MessageType } from "@/states/messageLogState";

type SnapshotExportOptions = ExportOptions & {
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
};
export function useCopySnapshotToClipboard(
  elementRef: RefObject<HTMLDivElement | null>,
  exportOptions: SnapshotExportOptions,
) {
  const { postMessage, pixelRatio, hiddenElements } = exportOptions;

  const handleExportSuccess = useCallback(() => {
    postMessage("success", i18n.get("Snapshot copied to clipboard"));
  }, [postMessage]);

  const handleExportError = useCallback(
    (error: unknown) => {
      const message = "Error copying snapshot to clipboard";
      console.error(message + ":", error);
      postMessage("error", i18n.get(message));
    },
    [postMessage],
  );

  const onSnapshotClick = useCallback(() => {
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
  }, [
    elementRef,
    pixelRatio,
    handleExportSuccess,
    handleExportError,
    hiddenElements,
  ]);
  return { onSnapshotClick };
}

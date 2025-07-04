/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { RefObject } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { ExportResolution } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import ToolButton from "@/components/ToolButton";
import { useCopySnapshotToClipboard } from "@/hooks/useCopySnapshotToClipboard";

interface SnapshotButtonProps extends WithLocale {
  elementRef: RefObject<HTMLDivElement | null>;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  exportResolution: ExportResolution;
}

export default function SnapshotButton({
  elementRef,
  postMessage,
  exportResolution,
}: SnapshotButtonProps) {
  const exportOptions = {
    postMessage,
    exportResolution,
  };

  const { onSnapshotClick } = useCopySnapshotToClipboard(
    elementRef,
    exportOptions,
  );

  return (
    <ToolButton
      tooltipText={i18n.get("Copy snapshot to clipboard")}
      onClick={onSnapshotClick}
      icon={<CameraAltIcon fontSize="inherit" />}
    />
  );
}

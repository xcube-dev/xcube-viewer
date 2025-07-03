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
import { getHiddenElements } from "@/actions/otherActions";
import ToolButton from "@/components/ToolButton";
import { useCopySnapshotToClipboard } from "@/hooks/useCopySnapshotToClipboard";

interface SnapshotButtonProps extends WithLocale {
  elementRef: RefObject<HTMLDivElement | null>;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function SnapshotButton({
  elementRef,
  postMessage,
}: SnapshotButtonProps) {
  const hiddenElements = (root: HTMLElement) => getHiddenElements(root);

  const exportOptions = {
    pixelRatio: 1,
    postMessage,
    hiddenElements,
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

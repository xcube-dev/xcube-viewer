/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MessageType } from "@/states/messageLogState";
import { WithLocale } from "@/util/lang";
import MapButton from "@/components/Viewer/MapButton";
import i18n from "@/i18n";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useCopySnapshotToClipboard } from "@/hooks/useCopySnapshotToClipboard";
import { getMapElement, getHiddenElements } from "@/actions/mapActions";

interface MapSnapshotButtonProps extends WithLocale {
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function MapSnapshotButton({
  postMessage,
}: MapSnapshotButtonProps) {
  const elementRef = getMapElement();
  const hiddenElements = (root: HTMLElement) => getHiddenElements(root);

  const exportOptions = {
    pixelRatio: 1,
    hiddenElements,
    postMessage,
  };

  const { onSnapshotClick } = useCopySnapshotToClipboard(
    elementRef,
    exportOptions,
  );

  return (
    <MapButton
      icon={<CameraAltIcon fontSize="small" />}
      tooltipTitle={i18n.get("Copy snapshot to clipboard")}
      onClick={onSnapshotClick}
    />
  );
}

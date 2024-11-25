import { RefObject } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { MessageType } from "@/states/messageLogState";
import { exportElement } from "@/util/export";
import ToolButton from "@/components/ToolButton";

interface SnapshotButtonProps extends WithLocale {
  elementRef?: RefObject<HTMLDivElement | null>;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  fontSize?: "small" | "inherit" | "medium" | "large";
  isToggle?: boolean;
  hiddenElements?: HTMLElement[];
}

export default function SnapshotButton({
  elementRef,
  postMessage,
  fontSize = "inherit",
  isToggle = false,
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

  const handleButtonClick = async () => {
    if (elementRef?.current) {
      try {
        exportElement(elementRef.current, {
          format: "png",
          width: 2000,
          handleSuccess: handleExportSuccess,
          handleError: handleExportError,
          pixelRatio: pixelRatio,
          hiddenElements
        });
      } catch (error) {
        handleExportError(error);
      }
    } else {
      handleExportError(new Error("missing element reference"));
    }
  };

  return (
    <ToolButton
      tooltipText={i18n.get("Copy snapshot to clipboard")}
      onClick={handleButtonClick}
      toggle={isToggle}
      icon={<CameraAltIcon fontSize={fontSize} />}
    />
  );
}

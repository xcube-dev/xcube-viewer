/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useRef, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";

import useFetchText from "@/hooks/useFetchText";
import MarkdownPopover from "@/components/MarkdownPopover";

interface HelpButtonProps {
  size?: "small" | "medium" | "large";
  helpUrl?: string;
}

export default function HelpButton({ size, helpUrl }: HelpButtonProps) {
  const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const helpText = useFetchText(helpUrl);

  const handleHelpOpen = () => {
    setHelpAnchorEl(helpButtonRef.current);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleHelpOpen} size={size} ref={helpButtonRef}>
        <HelpOutlineIcon fontSize="inherit" />
      </IconButton>
      <MarkdownPopover
        anchorEl={helpAnchorEl}
        open={!!helpAnchorEl}
        onClose={handleHelpClose}
        markdownText={helpText}
      />
    </>
  );
}

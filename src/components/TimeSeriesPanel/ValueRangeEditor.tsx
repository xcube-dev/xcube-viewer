/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";

import DoneCancel from "@/components/DoneCancel";
import { makeStyles } from "@/util/styles";

type ValueRange = [number, number];

const styles = makeStyles({
  container: (theme) => ({
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  }),
  minMaxBox: (theme) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(1),
  }),
  minTextField: {
    maxWidth: "8em",
  },
  maxTextField: {
    maxWidth: "8em",
  },
});

interface ValueRangeEditorProps {
  anchorEl: HTMLElement | null;
  valueRange: ValueRange | undefined;
  setValueRange: (valueRange: ValueRange | undefined) => void;
}

export default function ValueRangeEditor({
  anchorEl,
  valueRange,
  setValueRange,
}: ValueRangeEditorProps) {
  const [enteredValueRange, setEnteredValueRange] = useState<[string, string]>(
    valueRange ? [valueRange[0] + "", valueRange[1] + ""] : ["0", "1"],
  );

  if (!anchorEl) {
    return null;
  }

  const parsedValueRange: ValueRange = [
    Number.parseFloat(enteredValueRange[0]),
    Number.parseFloat(enteredValueRange[1]),
  ];

  const canCommit =
    Number.isFinite(parsedValueRange[0]) &&
    Number.isFinite(parsedValueRange[1]) &&
    parsedValueRange[0] < parsedValueRange[1];

  const handleEnteredColorBarMinChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredValueRange([enteredValue, enteredValueRange[1]]);
  };

  const handleEnteredColorBarMaxChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredValueRange([enteredValueRange[0], enteredValue]);
  };

  const handleCommit = () => {
    setValueRange(parsedValueRange);
  };

  const handleCancel = () => {
    setValueRange(undefined);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={true}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={styles.container}>
        <Box component="form" sx={styles.minMaxBox}>
          <TextField
            sx={styles.minTextField}
            label="Y-Minimum"
            variant="filled"
            size="small"
            value={enteredValueRange[0]}
            error={!canCommit}
            onChange={(evt) => handleEnteredColorBarMinChange(evt)}
          />
          <TextField
            sx={styles.maxTextField}
            label="Y-Maximum"
            variant="filled"
            size="small"
            value={enteredValueRange[1]}
            error={!canCommit}
            onChange={(evt) => handleEnteredColorBarMaxChange(evt)}
          />
        </Box>
        <DoneCancel
          onDone={handleCommit}
          doneDisabled={!canCommit}
          onCancel={handleCancel}
          size={"medium"}
        />
      </Box>
    </Popover>
  );
}

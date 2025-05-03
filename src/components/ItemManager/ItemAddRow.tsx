/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";

import { makeStyles } from "@/util/styles";
import type { WithLocale } from "@/util/lang";
import type { JsonValue } from "@/util/json";
import ItemRow from "./ItemRow";

const styles = makeStyles({
  progress: {
    color: "primary",
  },
});

interface ItemAddRowProps<S extends JsonValue> extends WithLocale {
  selectedSource: S | null;
  canAddItem: boolean;
  addItem: (selectedSource: S) => void;
  itemLoading: boolean;
  renderSource: (source: S | null) => ReactNode;
}

export default function ItemAddRow<S extends JsonValue>({
  selectedSource,
  canAddItem,
  addItem,
  itemLoading,
  renderSource,
}: ItemAddRowProps<S>) {
  return (
    <ItemRow
      title={renderSource(selectedSource)}
      actions={
        itemLoading ? (
          <CircularProgress size={20} sx={styles.progress} />
        ) : (
          <IconButton
            size="small"
            disabled={!canAddItem || !selectedSource}
            onClick={() => addItem(selectedSource!)}
            color={"primary"}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )
      }
    />
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type ReactNode, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { makeStyles } from "@/util/styles";
import type { WithLocale } from "@/util/lang";
import type { JsonValue } from "@/util/json";
import HoverVisibleBox from "@/components/HoverVisibleBox";
import ItemRow from "./ItemRow";
import type { ItemRecord } from "./types";

const styles = makeStyles({
  table: {
    flexGrow: 0,
  },
  chart: {
    flexGrow: 1,
  },
  hoverVisibleBox: {
    display: "flex",
    gap: 0.1,
  },
});

interface ItemRecordRowProps<V extends JsonValue, S extends JsonValue>
  extends WithLocale {
  itemRecord: ItemRecord<V, S>;
  itemIndex: number;
  removeItem: (itemIndex: number, itemRecord: ItemRecord<V, S>) => void;
  renderItem: (itemIndex: number, itemRecord: ItemRecord<V, S>) => ReactNode;
  renderActions?: (
    itemIndex: number,
    itemRecord: ItemRecord<V, S>,
  ) => ReactNode;
  renderSource: (source: S) => ReactNode;
}

export default function ItemRecordRow<
  V extends JsonValue,
  S extends JsonValue,
>({
  itemRecord,
  itemIndex,
  removeItem,
  renderItem,
  renderActions,
  renderSource,
}: ItemRecordRowProps<V, S>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRemoveItem = () => {
    removeItem(itemIndex, itemRecord);
  };
  return (
    <ItemRow
      containerRef={containerRef}
      title={renderSource(itemRecord.source)}
      actions={
        <>
          {renderActions && (
            <HoverVisibleBox sx={styles.hoverVisibleBox} initialOpacity={0.05}>
              {renderActions(itemIndex, itemRecord)}
            </HoverVisibleBox>
          )}
          <IconButton size="small" onClick={handleRemoveItem}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </>
      }
      body={renderItem(itemIndex, itemRecord)}
    />
  );
}

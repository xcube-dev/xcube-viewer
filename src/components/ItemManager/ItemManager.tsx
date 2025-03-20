/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import type { JsonValue } from "@/util/json";
import { makeStyles } from "@/util/styles";
import ItemRecordRow from "./ItemRecordRow";
import ItemAddRow from "./ItemAddRow";
import type { ItemRecord } from "./types";
import type { ReactNode } from "react";

const styles = makeStyles({
  container: {
    padding: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

interface ItemManagerProps<V extends JsonValue, S extends JsonValue> {
  selectedSource: S;
  itemLoading: boolean;
  itemRecords: ItemRecord<V, S>[];
  canAddItem: boolean;
  addItem: () => void;
  removeItem: (itemIndex: number, itemRecord: ItemRecord<V, S>) => void;
  renderItem: (itemIndex: number, itemRecord: ItemRecord<V, S>) => ReactNode;
  renderActions?: (
    itemIndex: number,
    itemRecord: ItemRecord<V, S>,
  ) => ReactNode;
  renderSource: (source: S) => ReactNode;
}

export default function ItemManager<V extends JsonValue, S extends JsonValue>({
  selectedSource,
  itemRecords,
  canAddItem,
  itemLoading,
  addItem,
  removeItem,
  renderItem,
  renderActions,
  renderSource,
}: ItemManagerProps<V, S>) {
  return (
    <Box sx={styles.container}>
      <ItemAddRow
        selectedSource={selectedSource}
        canAddItem={canAddItem}
        addItem={addItem}
        itemLoading={itemLoading}
        renderSource={renderSource}
      />
      {itemRecords.map((itemRecord, rowIndex) => (
        <ItemRecordRow
          key={rowIndex}
          itemRecord={itemRecord}
          itemIndex={rowIndex}
          removeItem={removeItem}
          renderItem={renderItem}
          renderActions={renderActions}
          renderSource={renderSource}
        />
      ))}
    </Box>
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Menu from "@mui/material/Menu";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import { exprPartKeys, exprPartLabels, type ExprPartType } from "./utils";

interface ExprPartFilterMenuProps extends WithLocale {
  anchorEl: HTMLElement | null;
  exprPartTypes: Record<ExprPartType, boolean>;
  setExprPartTypes: (exprPartTypes: Record<ExprPartType, boolean>) => void;
  onClose: () => void;
}

export default function ExprPartFilterMenu({
  anchorEl,
  exprPartTypes,
  setExprPartTypes,
  onClose,
}: ExprPartFilterMenuProps) {
  const handleExprPartTypeSelected = (key: ExprPartType) => {
    setExprPartTypes({ ...exprPartTypes, [key]: !exprPartTypes[key] });
  };
  return (
    <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      {exprPartKeys.map((key) => (
        <SelectableMenuItem
          key={key}
          selected={exprPartTypes[key]}
          title={i18n.get(exprPartLabels[key])}
          onClick={() => handleExprPartTypeSelected(key)}
          dense
        />
      ))}
    </Menu>
  );
}

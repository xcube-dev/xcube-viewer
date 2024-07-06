/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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

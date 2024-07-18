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

import { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";

interface ColorBarFixedValueRangeToggleProps {
  fixesValueRange?: boolean;
  setFixesValueRange: (fixesValueRange: boolean) => void;
}

export default function ColorBarFixedValueRangeToggle({
  fixesValueRange,
  setFixesValueRange,
}: ColorBarFixedValueRangeToggleProps) {
  const handleFixesValueRangeChange = (
    _event: ChangeEvent<HTMLInputElement>,
    fixesValueRange: boolean,
  ) => {
    setFixesValueRange(fixesValueRange);
  };

  return (
    <Box>
      <Tooltip
        arrow
        title={i18n.get(
          "Whether min/max of the color mapping values provide the value range",
        )}
      >
        <FormControlLabel
          sx={{ margin: 0 }}
          control={
            <Checkbox
              sx={{ padding: "4px 4px 4px 1px" }}
              checked={!!fixesValueRange}
              onChange={handleFixesValueRangeChange}
              size="small"
            />
          }
          labelPlacement="end"
          label={
            <Box component="span" sx={{ fontSize: "small" }}>
              {i18n.get("Fixes value range")}
            </Box>
          }
        />
      </Tooltip>
    </Box>
  );
}

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

import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";
import { ColorMapType } from "@/model/colorBar";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  radioGroup: { marginLeft: 1 },
  radio: { padding: "4px" },
  label: { fontSize: "small" },
});

const typeLabels: [ColorMapType, string, string][] = [
  [
    "continuous",
    "Contin.",
    "Continuous color assignment, where each value represents" +
      " a support point of a color gradient",
  ],
  [
    "stepwise",
    "Stepwise",
    "Stepwise color mapping where values are bounds of value" +
      " ranges mapped to the same single color",
  ],
  [
    "categorical",
    "Categ.",
    "Values represent unique categories or indexes that are mapped to a color",
  ],
];

interface ColorMapTypeEditorProps {
  colorMapType: ColorMapType;
  setColorMapType: (colorMapType: ColorMapType) => void;
}

export default function ColorMapTypeEditor({
  colorMapType,
  setColorMapType,
}: ColorMapTypeEditorProps) {
  return (
    <RadioGroup
      row
      value={colorMapType}
      onChange={(_e, value: string) => {
        setColorMapType(value as ColorMapType);
      }}
      sx={styles.radioGroup}
    >
      {typeLabels.map(([type, title, tooltipTitle]) => (
        <Tooltip key={type} arrow title={i18n.get(tooltipTitle)}>
          <FormControlLabel
            value={type}
            control={<Radio size="small" sx={styles.radio} />}
            label={
              <Box component="span" sx={styles.label}>
                {i18n.get(title)}
              </Box>
            }
          />
        </Tooltip>
      ))}
    </RadioGroup>
  );
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@/util/styles";
import { ExprPartType } from "@/components/UserVariablesDialog/utils";

const styles = makeStyles({
  expressionPart: { padding: 0.2 },
  expressionPartChip: { fontFamily: "monospace" },
});

interface ExprPartChipProps {
  part: string;
  partType: ExprPartType;
  onPartClicked: (part: string) => void;
}

export default function ExprPartChip({
  part,
  partType,
  onPartClicked,
}: ExprPartChipProps) {
  return (
    <Box component="span" sx={styles.expressionPart}>
      <Chip
        label={part}
        sx={styles.expressionPartChip}
        size="small"
        variant="outlined"
        color={
          partType === "variables"
            ? "primary"
            : partType === "constants"
              ? "default"
              : "secondary"
        }
        onClick={() => onPartClicked(part)}
      />
    </Box>
  );
}

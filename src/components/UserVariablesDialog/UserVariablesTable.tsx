/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import i18n from "@/i18n";
import { copyUserVariable, EditedVariable, newUserVariable } from "./utils";
import { UserVariable } from "@/model/userVariable";
import HeaderBar from "./HeaderBar";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: { display: "flex", flexDirection: "column", height: "100%" },
  tableContainer: { overflowY: "auto", flexGrow: 1 },
});

interface UserVariablesTableProps {
  userVariables: UserVariable[];
  setUserVariables: (userVariables: UserVariable[]) => void;
  selectedIndex: number;
  setSelectedIndex: (selectedIndex: number) => void;
  setEditedVariable: (editedVariable: EditedVariable) => void;
}

export default function UserVariablesTable({
  userVariables,
  setUserVariables,
  selectedIndex,
  setSelectedIndex,
  setEditedVariable,
}: UserVariablesTableProps) {
  const variable = selectedIndex >= 0 ? userVariables[selectedIndex] : null;
  const isSelected = selectedIndex >= 0;

  const handleSelectRow = (index: number) => {
    setSelectedIndex(selectedIndex !== index ? index : -1);
  };

  const handleAddVariable = () => {
    setEditedVariable({ editMode: "add", variable: newUserVariable() });
  };

  const handleDuplicateVariable = () => {
    const selectedVariable = userVariables[selectedIndex];
    setUserVariables([
      ...userVariables.slice(0, selectedIndex + 1),
      copyUserVariable(selectedVariable),
      ...userVariables.slice(selectedIndex + 1),
    ]);
    setSelectedIndex(selectedIndex + 1);
  };

  const handleEditVariable = () => {
    setEditedVariable({ editMode: "edit", variable: variable! });
  };

  const handleRemoveVariable = () => {
    setUserVariables([
      ...userVariables.slice(0, selectedIndex),
      ...userVariables.slice(selectedIndex + 1),
    ]);
    if (selectedIndex >= userVariables.length - 1) {
      setSelectedIndex(userVariables.length - 2);
    }
  };

  return (
    <>
      <HeaderBar
        selected={selectedIndex !== null}
        title={i18n.get("Manage user variables")}
        actions={
          <>
            <Tooltip title={i18n.get("Add user variable")}>
              <IconButton color={"primary"} onClick={handleAddVariable}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            {isSelected && (
              <Tooltip title={i18n.get("Duplicate user variable")}>
                <IconButton onClick={handleDuplicateVariable}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
            {isSelected && (
              <Tooltip title={i18n.get("Edit user variable")}>
                <IconButton onClick={handleEditVariable}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {isSelected && (
              <Tooltip title={i18n.get("Remove user variable")}>
                <IconButton onClick={handleRemoveVariable}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
      />
      <TableContainer sx={styles.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "15%" }}>{i18n.get("Name")}</TableCell>
              <TableCell sx={{ width: "15%" }}>{i18n.get("Title")}</TableCell>
              <TableCell sx={{ width: "10%" }}>{i18n.get("Units")}</TableCell>
              <TableCell>{i18n.get("Expression")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userVariables.map((v, index) => (
              <TableRow
                key={v.id}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                hover
                selected={index === selectedIndex}
                onClick={() => handleSelectRow(index)}
              >
                <TableCell component="th" scope="row">
                  {v.name}
                </TableCell>
                <TableCell>{v.title}</TableCell>
                <TableCell>{v.units}</TableCell>
                <TableCell>{v.expression || ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _UserPlacesDialog from "@/components/UserPlacesDialog";
import {
  closeDialog,
  updateSettings,
  setMapInteraction,
} from "@/actions/controlActions";
import { importUserPlacesFromText } from "@/actions/dataActions";

const mapStateToProps = (state: AppState) => {
  return {
    open: state.controlState.dialogOpen["addUserPlacesFromText"],
    userPlacesFormatName: state.controlState.userPlacesFormatName,
    userPlacesFormatOptions: state.controlState.userPlacesFormatOptions,
    nextMapInteraction: state.controlState.lastMapInteraction,
  };
};

const mapDispatchToProps = {
  closeDialog,
  updateSettings,
  setMapInteraction,
  addUserPlacesFromText: importUserPlacesFromText,
};

const UserPlacesDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_UserPlacesDialog);
export default UserPlacesDialog;

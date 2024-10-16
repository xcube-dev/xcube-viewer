import { store } from "@/store/appStore";
import { SidebarPanelId } from "@/features/sidebar/types";

const setState = store.setState;

export const setSidebarPanelId = (panelId: SidebarPanelId): void => {
  const { controlState } = store.getState();
  setState({
    controlState: {
      ...controlState,
      ["sidebarPanelId"]: panelId,
    },
  });
};

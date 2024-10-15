import { usezAppStore } from "@/store/appStore";
import { SidebarPanelId } from "@/features/sidebar/model/sidebar";

const set = usezAppStore.setState;

export const setSidebarPanelId = (panelId: SidebarPanelId): void => {
  const { controlState } = usezAppStore.getState();
  set({
    controlState: {
      ...controlState,
      ["sidebarPanelId"]: panelId,
    },
  });
  console.log("zustand state changed::::", usezAppStore.getState());
};

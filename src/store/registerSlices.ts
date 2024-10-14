import { registerSlice } from "@/store/appStore";
import { createSidebarSlice } from "@/features/sidebar/slice/sidebar";

const registerAllSlices = () => {
  registerSlice(createSidebarSlice);
};

export default registerAllSlices;

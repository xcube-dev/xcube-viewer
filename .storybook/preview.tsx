import { useMemo } from "react";
import type { Preview } from "@storybook/react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { lightTheme, darkTheme } from "../src/theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/material-icons";

// noinspection JSUnusedGlobalSymbols
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: lightTheme.palette.background.default },
        { name: "dark", value: darkTheme.palette.background.default },
      ],
    },
  },
  decorators: [
    // Custom decorator to change MUI theme
    // when Storybook background changes.
    (Story, context) => {
      // Get the currently selected background in Storybook
      const background = context.globals.backgrounds?.value;

      // Determine the theme based on the Storybook background
      const theme = useMemo(() => {
        if (background === darkTheme.palette.background.default) {
          return darkTheme;
        }
        return lightTheme;
      }, [background]);

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story {...context} />
        </ThemeProvider>
      );
    },
  ],
};

// noinspection JSUnusedGlobalSymbols
export default preview;

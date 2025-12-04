import type { Preview } from "@storybook/react-vite";
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
      options: {
        light: { name: "light", value: lightTheme.palette.background.default },
        dark: { name: "dark", value: darkTheme.palette.background.default }
      }
    },
  },

  decorators: [
    (Story, context) => {
      // Determine the theme based on the Storybook background
      const background = context.globals.backgrounds?.value;
      const theme = background === "dark" ? darkTheme : lightTheme;

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      );
    },
  ],

  initialGlobals: {
    backgrounds: {
      value: "light"
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default preview;

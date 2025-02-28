import type { Preview } from "@storybook/react";
import { useGlobals } from "@storybook/preview-api";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  createTheme,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";

// Same CSS imports as in src/index.ts
import "@fontsource/material-icons/latin-400.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../src/index.css";

// We synchronize Storybook layout area's background colors
// (not the Storybook UI theme!)
// with background colors from MUI theme modes.
//
const lightThemeOptions: ThemeOptions = { palette: { mode: "light" } };
const darkThemeOptions: ThemeOptions = { palette: { mode: "dark" } };
const lightTheme: Theme = createTheme(lightThemeOptions);
const darkTheme: Theme = createTheme(darkThemeOptions);
const lightBackground = lightTheme.palette.background.default;
const darkBackground = darkTheme.palette.background.default;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light", // Start-background
      values: [
        { name: "light", value: lightBackground },
        { name: "dark", value: darkBackground },
      ],
    },
  },
  decorators: [
    // Custom decorator to change MUI theme
    // when Storybook background changes.
    (Story, context) => {
      const [{ backgrounds }] = useGlobals();
      const isDark: boolean = backgrounds?.value === darkBackground;
      return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <CssBaseline />
          <Story {...context} />
        </ThemeProvider>
      );
    },
  ],
};

// noinspection JSUnusedGlobalSymbols
export default preview;

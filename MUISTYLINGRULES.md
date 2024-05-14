## Material UI styling usages howto, naming conventions and rules

## Naming Convention

- For any components put the name of the component and prefix it with `Styled`.
  for ex: `StyledFormControl`
- For plain HTML components prefix it with Styled and if there is same component more than once
  then also write the purpose/usage in name.
  for ex: `StyledContainerDiv` this is with purpose/usage
  `StyledSpan` when only single component
- When creating object of multiple css for different components create const named `styles` and also
  make `styles` object type-safe
  for ex:

  ```javascript
  import { SxProps } from "@mui/material";

  const styles: Record<string, SxProps> = {
  sxProp1: ...,
  sxProp2: ...,
  sxProp3: ...,
  ...
  };

  ```

## Different Style usages

- Use `styled` from Material UI for plain HTML such as `div`, `span`, etc. and Material UI components such as ``
  for ex:

```javascript
const StyledFormControl = styled(FormControl)(({ theme }: { theme: Theme }) => ({
marginRight: theme.spacing(1),
}));

```

```javascript

const StyledContainerDiv = styled("div")(({ theme }: { theme: Theme }) => ({
margin: theme.spacing(1),
textAlign: "center",
}));

```

- For little css code for components use "sx" property of MUI components.
- When there are many custom styles for different components then create a
  constant object with name 'styles' and then use its properties with sx.
- Avoid Inline sx and extract constant and use it instead
  for ex:

```javascript
 const styles: Record<string, SxProps<Theme>> = {
 close: {
   p: 0.5,
 },
 success: (theme: Theme) => ({
   color: theme.palette.error.contrastText,
   backgroundColor: green[600],
 }),
 error: (theme: Theme) => ({
   color: theme.palette.error.contrastText,
   backgroundColor: theme.palette.error.dark,
 }),
 }

- usage of styles:
    <CloseIcon sx={styles.icon} />
```

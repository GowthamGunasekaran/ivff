import { ThemeProvider, createTheme } from "@mui/material/styles";
import IdppRouterHandler from "./routers/IdppRouterHandler";

const theme = createTheme({
  typography: { fontFamily: "'Segoe UI', system-ui, sans-serif" },
  palette: { primary: { main: "#2c4cd3" } },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <IdppRouterHandler />
    </ThemeProvider>
  );
}

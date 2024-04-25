import { useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import agent from "../api/agent";
import Loading from "../pages/loading/Loading";
import { useAppDispatch } from "../store/configureStore";
import { setCart } from "../pages/shoppingCart/shoppingCartSlice";
function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      agent.ShoppingCart.get()
        .then((cart) => dispatch(setCart(cart)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // 还有一种情况，当前网站不存在userId,会一直显示APP初始化中，这是错误的情况，后续需要处理
  }, [dispatch]);

  if (loading) {
    return <Loading message="App Initializing..." />;
  }

  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;

import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import ContactPage from "../pages/contact/ContactPage";
import Catalog from "../pages/catalog/Catalog";
import ProductDetail from "../pages/catalog/ProductDetail";
import ServerError from "../pages/error/ServerError";
import NotFound from "../pages/error/NotFound";
import ShoppingCartPage from "../pages/shoppingCart/ShoppingCartPage";
import CheckoutPage from "../pages/catalog/CheckoutPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "home", element: <HomePage /> },
            { path: "catalog", element: <Catalog /> },
            { path: "catalog/:id", element: <ProductDetail /> },
            { path: "contact", element: <ContactPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "shopingcart", element: <ShoppingCartPage /> },
            { path: "checkout", element: <CheckoutPage /> },
            { path: "*", element: <NotFound /> }
        ]
    }
]);

export default router;

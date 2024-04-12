import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../components/home/HomePage";
import AboutPage from "../components/about/AboutPage";
import ContactPage from "../components/contact/ContactPage";
import Catalog from "../components/catalog/Catalog";
import ProductDetail from "../components/catalog/ProductDetail";
import ServerError from "../components/error/ServerError";
import NotFound from "../components/error/NotFound";
import ShoppingCartPage from "../components/shoppingCart/ShoppingCartPage";
import CheckoutPage from "../components/catalog/CheckoutPage";


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

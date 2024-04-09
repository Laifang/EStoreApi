import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../components/home/HomePage";
import AboutPage from "../components/about/AboutPage";
import ContactPage from "../components/contact/ContactPage";
import Catalog from "../components/catalog/Catalog";
import ProductDetail from "../components/catalog/ProductDetail";


const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "home", element: <HomePage /> },
            { path: "catalog", element: <Catalog /> },
            { path: "catalog/:id", element: <ProductDetail /> },
            { path: "contact", element: <ContactPage /> },
            { path: "about", element: <AboutPage /> }
        ]
    }
]);

export default routes;

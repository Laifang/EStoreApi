import { Fragment } from "react/jsx-runtime";
import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";


export default function Catalog() {
    // const [products, setProducts] = useState<Product[]>([])
    // const [loading, setLoading] = useState(true);
    const products = useAppSelector(productSelectors.selectAll)
    const dispatch = useAppDispatch();
    const {productsLoaded, status} = useAppSelector(state => state.catalog);

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded,dispatch])

    if (status.includes("pending")) return <Loading message="Loading products..." />


    return (
        <Fragment>
            <ProductList products={products} />
        </Fragment>

    )
}
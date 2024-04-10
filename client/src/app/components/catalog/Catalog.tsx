import { Fragment } from "react/jsx-runtime";
import { Product } from "../../models/Product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import agent from "../../api/agent";


export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        agent.Catalog.list()
            .then(products => setProducts(products))
    }, [])



    return (
        <Fragment>
            <ProductList products={products} />
        </Fragment>

    )
}
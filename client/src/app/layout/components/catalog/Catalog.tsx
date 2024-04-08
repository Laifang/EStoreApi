import { Fragment } from "react/jsx-runtime";
import { Product } from "../../../models/product";
import { Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";


export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        fetch('http://localhost:5130/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])



    return (
        <Fragment>
            <Typography variant="h4">产品目录</Typography>
            <ProductList products={products} />
        </Fragment>

    )
}
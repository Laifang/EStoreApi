import { Grid } from "@mui/material";

import ProductCard from "./ProductCard";
import { Product } from "../../models/Product";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
    <Grid container spacing={4}>
      {products.map((product, index) => (
        <Grid item xs={4} key={index}>
          <ProductCard key={product.id} product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

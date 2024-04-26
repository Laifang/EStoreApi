import { Grid } from "@mui/material";

import ProductCard from "./ProductCard";
import { Product } from "../../models/product";
import { useAppSelector } from "../../store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <Grid container spacing={4}>
      {products.map((product, index) => (
        <Grid item xs={4} key={index}>
          {!productsLoaded ? <ProductCardSkeleton /> : <ProductCard key={product.id} product={product} />}
        </Grid>
      ))}
    </Grid>
  );
}

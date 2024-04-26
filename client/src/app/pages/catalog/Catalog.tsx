import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchFiltersAsync, fetchProductsAsync, productSelectors, setProductParams } from "./catalogSlice";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import CheckboxGroup from "../../components/CheckboxGroup";

const sortOptions = [
  { value: "name", label: "商品名称" },
  { value: "price", label: "价格低->高" },
  { value: "priceDesc", label: "价格高->低" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, productParams } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFiltersAsync());
    }
  }, [filtersLoaded, dispatch]);

  if (!productsLoaded) return <Loading message="Loading products..." />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            sortOptions={sortOptions}
            selectedValue={productParams.orderBy}
            handleOnChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxGroup 
            filterTitle="品牌"
            items={brands}
            checkedItemsInStore={productParams.brands}
            onChange={(e) => dispatch(setProductParams({brands: e}))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxGroup
            filterTitle="类型"
            items={types}
            checkedItemsInStore={productParams.types}
            onChange={(e) => dispatch(setProductParams({types: e}))}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>显示 1-6 条，共 10 条</Typography>
          <Pagination count={10} shape="rounded" variant="outlined" color="primary" size="large" page={2} />
        </Box>
      </Grid>
    </Grid>
  );
}

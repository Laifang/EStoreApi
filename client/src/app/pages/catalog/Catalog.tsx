import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchFiltersAsync, fetchProductsAsync, productSelectors } from "./catalogSlice";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ProductSearch from "./ProductSearch";

const sortOptions = [
  { value: "name", label: "商品名称" },
  { value: "price", label: "价格低->高" },
  { value: "priceDesc", label: "价格高->低" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, status, filtersLoaded, brands, types } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFiltersAsync());
    }
  }, [filtersLoaded, dispatch]);

  if (status.includes("pending")) return <Loading message="Loading products..." />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel>排序</FormLabel>
            <RadioGroup>
              {sortOptions.map(({ value, label }) => (
                <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            <FormLabel>品牌</FormLabel>
            {brands.map((brand) => (
              <FormControlLabel control={<Checkbox />} label={brand} key={brand} />
            ))}
          </FormGroup>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            <FormLabel>类别</FormLabel>
            {types.map((type) => (
              <FormControlLabel control={<Checkbox />} label={type} key={type} />
            ))}
          </FormGroup>
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

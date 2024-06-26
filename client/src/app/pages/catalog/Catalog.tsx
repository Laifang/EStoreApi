import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import {
  fetchFiltersAsync,
  fetchProductsAsync,
  productSelectors,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import CheckboxGroup from "../../components/CheckboxGroup";
import AppPagination from "../../components/AppPagination";

const sortOptions = [
  { value: "name", label: "商品名称" },
  { value: "price", label: "价格低->高" },
  { value: "priceDesc", label: "价格高->低" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(
    (state) => state.catalog
  );

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFiltersAsync());
    }
  }, [filtersLoaded, dispatch]);

  if (!filtersLoaded) return <Loading message="Loading products..." />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            sortOptions={sortOptions}
            selectedValue={productParams.orderBy}
            handleOnChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxGroup
            filterTitle="品牌"
            items={brands}
            checkedItemsInStore={productParams.brands}
            onChange={(e) => dispatch(setProductParams({ brands: e }))}
          />
        </Paper>
        <Paper sx={{ p: 2 }}>
          <CheckboxGroup
            filterTitle="类型"
            items={types}
            checkedItemsInStore={productParams.types}
            onChange={(e) => dispatch(setProductParams({ types: e }))}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />

        {metaData && (
          <AppPagination
            metaData={metaData!}
            onChange={(pageNumber: number) => dispatch(setPageNumber({ pageNumber: pageNumber }))}
          />
        )}
      </Grid>
      {/* <Grid item xs={3} />
      <Grid item xs={9}></Grid> */}
    </Grid>
  );
}

// 创建 product 类型的 adapter
import { createEntityAdapter, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../models/Product";
import agent from "../../api/agent";
import { RootState } from "../../store/configureStore";

// 创建一个 entity adapter 用于将
const productsAdapter = createEntityAdapter<Product>();

// 创建一个异步Thunk，用于获取产品列表
export const fetchProductsAsync = createAsyncThunk<Product[]>("catalog/fetchProductsAsync", async (_, thunkAPI) => {
  try {
    return await agent.Catalog.list();
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId: number, thunkAPI) => {
    try {
      return await agent.Catalog.detail(productId);
    } catch (error: any) {
      // 这行代码将错误信息传递给 redux-thunk，以便在组件中显示
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

// 创建并导出catalogSlice
export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取产品信息列表
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = "pendingFetchProducts";
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        // 通过entity adapter 的 setAll 方法 将产品列表添加到 state 中
        productsAdapter.setAll(state, action.payload);
        state.status = "idle";
        // 设置 productsLoaded 为 true
        state.productsLoaded = true;
      })
      .addCase(fetchProductsAsync.rejected, (state) => {
        state.status = "idle";
      })

      // 单个产品信息获取
      .addCase(fetchProductAsync.pending, (state) => {
        state.status = "pendingFetchProduct";
      })
      .addCase(fetchProductAsync.fulfilled, (state, action) => {
        // upsertOne 方法用于更新或添加产品到 state 中
        productsAdapter.upsertOne(state, action.payload);
        state.status = "idle";
      })
      .addCase(fetchProductAsync.rejected, (state) => {
        state.status = "idle";
      });
  },
});

// 创建并导出 productSelectors 的 selector 函数
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

// export default catalogSlice.reducer;

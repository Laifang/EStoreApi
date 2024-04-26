// 创建 product 类型的 adapter
import { createEntityAdapter, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../models/Product";
import agent from "../../api/agent";
import { RootState } from "../../store/configureStore";
import { MetaData, PaginatedResponse } from "../../models/Pagination";

// 创建catalog State 数据类型
interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}

// 创建一个 entity adapter 用于将
const productsAdapter = createEntityAdapter<Product>();

const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);
  if (productParams.searchTerm) params.append("searchTerm", productParams.searchTerm);
  if (productParams.brands) params.append("brands", productParams.brands.toString());
  if (productParams.types) params.append("types", productParams.types.toString());
  return params;
};

/*
  创建一个异步Thunk，用于获取产品列表 , <Product[]> 类型表示异步Thunk返回的类型,void 表示Thunk的输入参数类型,
  { state: RootState } thunkAPI 可访问 Redux store 的 RootState,也就是全局的 state数据都可以获取
*/
/**
 * 异步函数用来获取产品列表
 * @param void 无输入参数
 * @param { state: RootState }  包含了全局状态的对象
 * @returns Product[] 包含产品信息的数组
 */
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
  "catalog/fetchProductsAsync",
  async (_, thunkAPI) => {
    // 获取API请求参数
    const queryParams = getAxiosParams(thunkAPI.getState().catalog.productParams);
    try {
      // 发起获取产品列表的请求
      const response: PaginatedResponse<Product[]> = await agent.Catalog.list(queryParams);
      // 将元数据更新到全局状态中
      thunkAPI.dispatch(setMetaData(response.metaData));
      // 注意这里的返回值的变量名称要与 PaginatedResponse<Product> 中的定义的要一致
      return response.items; // 返回产品列表
    } catch (error: any) {
      // 如果请求失败，通过 thunkAPI.rejectWithValue 返回错误信息
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

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

// 创建异步Thunk，用于获取 产品 filters
export const fetchFiltersAsync = createAsyncThunk("catalog/fetchFiltersAsync", async (_, thunkAPI) => {
  try {
    return await agent.Catalog.fetchFilters();
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

const initProductParams = () => {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
  };
};

// 创建并导出catalogSlice
export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",
    brands: [],
    types: [],
    productParams: initProductParams(),
    metaData: null,
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false; // 重置 productsLoaded 状态,配合组件的useEffect 重新获取数据
      // 使用 ... 操作符 将 action.payload 合并到 state.productParams 中,达到更新 productParams 的效果
      state.productParams = { ...state.productParams, ...action.payload };
    },

    resetProductParams: (state) => {
      state.productParams = initProductParams();
    },

    // 设置metaData
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
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
      })

      // filters 相关处理
      .addCase(fetchFiltersAsync.pending, (state) => {
        state.status = "pendingFetchFilters";
      })
      .addCase(fetchFiltersAsync.fulfilled, (state, action) => {
        state.brands = action.payload.brands;
        state.types = action.payload.types;
        state.status = "idle";
        state.filtersLoaded = true;
      })
      .addCase(fetchFiltersAsync.rejected, (state) => {
        state.status = "idle";
      });
  },
});

// 创建并导出 productSelectors 的 selector 函数
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

// 导出 catalogSlice 的一般actions

export const { setProductParams, resetProductParams, setMetaData } = catalogSlice.actions;

// export default catalogSlice.reducer;

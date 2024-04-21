// 创建 product 类型的 adapter
import { createEntityAdapter, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from '../../models/Product';
import agent from '../../api/agent';
import { RootState } from '../../store/configureStore';

// 创建一个 entity adapter 用于将
const productsAdapter = createEntityAdapter<Product>();

// 创建一个异步Thunk，用于获取产品列表
export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async () => {
        try {
            return await agent.Catalog.list();
        } catch (error) {
            console.log(error);
        }
    }
);

// 创建并导出catalogSlice
export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle',
    }),
    reducers: {},
    extraReducers: (builder => {
        builder
           .addCase(fetchProductsAsync.pending, (state) => {
                state.status = 'pendingFetchProducts';
            })
           .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                // 通过entity adapter 的 setAll 方法 将产品列表添加到 state 中
                productsAdapter.setAll(state, action.payload); 
                state.status ='idle';
                // 设置 productsLoaded 为 true
                state.productsLoaded = true;
            })
           .addCase(fetchProductsAsync.rejected, (state) => {
                state.status = 'idle';
            });
    })
});

// 创建并导出 productSelectors 的 selector 函数
export const productSelectors = productsAdapter.getSelectors((state:RootState) => state.catalog);


// export default catalogSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ShoppingCart } from "../../models/ShoppingCart";
import agent from "../../api/agent";

interface ShoppingCartState {
  shoppingCart: ShoppingCart | null;
  status: string;
}

const initialState: ShoppingCartState = {
  shoppingCart: null,
  status: "idle", // idle 是指初始状态，loading 是指正在加载数据，success 是指数据加载成功，error 是指数据加载失败,pending 是指正在请求数据
};

// 异步新增购物车商品
export const AddCartItemAsync = createAsyncThunk<ShoppingCart, { productId: number; quantity?: number }>(
  "shoppingCart/addCartItemAsync", // 第一个参数是 prefix/actionType，
  async ({ productId, quantity = 1 }) => {
    try {
      return await agent.ShoppingCart.addItem(productId, quantity);
    } catch (error) {
      console.log(error);
    }
  } // 第二个参数是 action 异步委托
);

// 异步删除购物车商品
export const RemoveCartItemAsync = createAsyncThunk<
  ShoppingCart,
  { productId: number; quantity?: number; name?: string }
>("shoppingCart/removeItemAsync", async ({ productId, quantity = 1 }) => {
  try {
    return await agent.ShoppingCart.removeItem(productId, quantity);
  } catch (error) {
    console.log(error);
  }
});

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.shoppingCart = action.payload;
    },
    removeItem: (state, action) => {
      // 如果购物车为空，则不执行任何操作
      if (!state.shoppingCart) return;

      // 从action的payload中获取productId和quantity
      const { productId, quantity } = action.payload;

      // 寻找购物车中是否存在该productId对应的商品，若不存在则不执行任何操作
      const itemIndex = state.shoppingCart.items.findIndex((item) => item.productId === productId);
      if (itemIndex === -1 || itemIndex === undefined) return;

      // 获取原始的商品数量
      const originalQuantity = state.shoppingCart.items[itemIndex].quantity;

      // 如果减少的数量大于等于原始数量，则从购物车中删除该商品
      // 否则，减少商品相应的数量
      if (quantity >= originalQuantity) {
        state.shoppingCart.items.splice(itemIndex, 1); // 删除该商品
      } else {
        state.shoppingCart.items[itemIndex].quantity -= quantity;
      }

      // 最后更新购物车状态
    },
  },
  extraReducers: (builder) => {
    // 处理异步请求开始的情况
    builder.addCase(AddCartItemAsync.pending, (state, action) => {
      state.status = "pendingAddItem" + action.meta.arg.productId; // 给状态添加 productId 后缀，以区分不同的商品
    });
    // 处理异步请求成功的情况
    builder.addCase(AddCartItemAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.shoppingCart = action.payload;
    });
    // 处理异步请求拒绝的情况
    builder.addCase(AddCartItemAsync.rejected, (state) => {
      state.status = "error";
    });

    // 移除购物车商品
    builder.addCase(RemoveCartItemAsync.pending, (state, action) => {
      state.status = "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(RemoveCartItemAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.shoppingCart = action.payload;
    });
    builder.addCase(RemoveCartItemAsync.rejected, (state) => {
      state.status = "error";
    });
  },
});

export const { setCart } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;

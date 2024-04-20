import { createSlice } from "@reduxjs/toolkit";
import { ShoppingCart } from "../../models/ShoppingCart";

interface ShoppingCartState {
  shoppingCart: ShoppingCart | null;
}

const initialState: ShoppingCartState = {
  shoppingCart: null,
};

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
});

export const { setCart, removeItem } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import shoppingCartSlice from "../components/shoppingCart/shoppingCartSlice";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { catalogSlice } from "../components/catalog/catalogSlice";


const store = configureStore({
    reducer: {
        shoppingCart: shoppingCartSlice,
        catalog:catalogSlice.reducer,
    },
});


// 设置 自定义 hooks  useAppDispatch 和 useAppSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
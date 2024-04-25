import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
    const { productParams } = useAppSelector((state) => state.catalog);
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    const debouncedSearch = debounce((value: string) => {
        dispatch(setProductParams({ searchTerm: value }));
    }, 1000);

    return (
        <TextField
            label="搜索产品"
            variant="outlined"
            fullWidth
            placeholder="输入产品名称"
            value={searchTerm || ""}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event.target.value);
            }}
        />
    );

    // 更改searchTerm时，会触发catalogSlice的setProductParams方法，并更新store中的productsLoaded状态, 在catalog 组件中，通过useEffects监听productsLoaded状态，获取产品列表，刷新页面显示

    //onChange={(event) => dispatch(setProductParams({ searchTerm: event.target.value }))}，这个函数会频繁触发页面刷新，需要另外的方案
}

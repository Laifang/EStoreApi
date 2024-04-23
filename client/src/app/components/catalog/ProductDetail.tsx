import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Loading from "../loading/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { AddCartItemAsync, RemoveCartItemAsync } from "../shoppingCart/shoppingCartSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetail() {
  // 从url中 获取产品id 参数
  const { id } = useParams<{ id: string }>();
  // 从 购物车相关状态
  const { shoppingCart, status: shoppingCartStatus } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();
  // 商品列表 加载状态
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  // 单个商品信息获取
  const product = useAppSelector((state) => productSelectors.selectById(state, parseInt(id!)));

  // 购物车数量状态
  const [quantity, setQuantity] = useState(0); // 已加购数量
  // 购物车中是否存在该商品
  const item = shoppingCart?.items.find((item) => item.productId === product?.id); // 购物车中是否存在该商品

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    id && !product && dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, dispatch, product]);

  // 给加购数量组件添加 onChanged 事件 实现能够改变已加购数量
  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }

  function handleUpdateQuantity() {
    if (!product) return;
    // setUpdating(true);
    // 已加购数量小于页面显示的数量，则增加购物车中该商品的数量
    if (!item || quantity > item.quantity) {
      const addQuantity = item ? quantity - item.quantity : quantity;
      dispatch(AddCartItemAsync({ productId: product.id, quantity: addQuantity }));
    } else {
      // 已加购数量大于页面显示的数量,则减少购物车中该商品的数量
      const decraseQuantity = item.quantity - quantity;
      dispatch(RemoveCartItemAsync({ productId: product.id, quantity: decraseQuantity }));
    }
  }

  // 加载商品列表信息
  if (productStatus.includes("pending")) {
    return <Loading message="Loading product details..." />;
  }

  // 加载商品信息
  if (!product) {
    return <Typography variant="h4">Product not found</Typography>;
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" color={"secondary"}>
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>商品名称</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>简介</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>类型</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>品牌</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>库存数量</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* 这里是已加购数量和加购按钮 */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                onChange={handleQuantityChange}
                variant="outlined"
                type="number"
                label="已加购数量"
                value={quantity}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={item?.quantity === quantity || (!item && quantity === 0)}
                variant="contained"
                color="primary"
                sx={{ height: "55px" }}
                size="large"
                loading={
                  shoppingCartStatus === "pendingAddItem" + product?.id ||
                  shoppingCartStatus === "pendingRemoveItem" + item?.productId
                }
                onClick={handleUpdateQuantity}
              >
                {item ? "更新数量" : "加购物车"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

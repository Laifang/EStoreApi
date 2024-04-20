import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../models/Product";
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
import agent from "../../api/agent";
import Loading from "../loading/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { AddCartItemAsync, RemoveCartItemAsync } from "../shoppingCart/shoppingCartSlice";

export default function ProductDetail() {
  // Todo: 需要在详情组件访问 router参数，并显示相应的产品信息

  const { shoppingCart, status } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0); // 已加购数量
  // const [updating, setUpdating] = useState(false); // 购物车中是否存在该商品
  const item = shoppingCart?.items.find((item) => item.productId === product?.id); // 购物车中是否存在该商品

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    id &&
      agent.Catalog.detail(parseInt(id))
        .then((product: Product) => setProduct(product))
        .catch((error) => console.error(error.response))
        .finally(() => setLoading(false));
  }, [id, item]);

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
  if (loading) {
    return <Loading message="Loading product details..." />;
  }

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
                loading={status === "pendingRemoveItem" + item?.productId}
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

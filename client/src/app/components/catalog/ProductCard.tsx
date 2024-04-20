import { Card, CardMedia, CardContent, Typography, CardActions, Button, Avatar, CardHeader } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { AddCartItemAsync } from "../shoppingCart/shoppingCartSlice";
import { Product } from "../../models/Product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();

  // 2024年4月20日23:07:53  改造为 reduxtoolkit 的 异步thunk action 方式 以下代码deprecated
  // function handleAddItem(productId: number) {
  //     setLoading(true);
  //     agent.ShoppingCart.addItem(productId)
  //         // 2024年04月11日23:26:39 新增,因为ShoppingCart.addItem返回的是cart,
  //         // 所以这里可用返回值更新store中的shoppingCart状态
  //         .then(cart => dispatch(setCart(cart)))
  //         .catch(error => console.log(error))
  //         .finally(() => setLoading(false));
  // }

  return (
    <Card>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "secondary.main" }}>{product.name.charAt(0).toUpperCase()}</Avatar>}
        title={product.name}
        titleTypographyProps={{ fontWeight: "bold", color: "primary.main" }}
      />
      <CardMedia sx={{ height: 140, backgroundSize: "contain" }} image={product.imageUrl} title={product.name} />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5" component="div">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={status === 'pendingAddItem' + product.id} // 添加product.id 只刷新当前商品的loading状态
          onClick={() => dispatch(AddCartItemAsync({ productId: product.id }))}
          size="small"
        >
          加购
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">
          详情
        </Button>
      </CardActions>
    </Card>
  );
}

import { Box, Button, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../context/StoreContext";
import { Fragment, useState } from "react";
import agent from "../../api/agent";
import LoadingButton from '@mui/lab/LoadingButton';
import ShoppingCartSummary from "./ShoppingCartSummary";

export default function ShoppingCartPage() {

    // 2024年04月11日23:19:22 更新代码
    // 已将 cart 提升为 useContext 全局共享共享，不需要下列这些代码
    // const [loading, setLoading] = useState(true);
    // const [cart, setCart] = useState<ShoppingCart | null>(null);

    // useEffect(() => {
    //     // 获取购物车数据
    //     agent.ShoppingCart.get()
    //         .then(cart => setCart(cart))
    //         .catch(error => console.log(error))
    //         .finally(() => setLoading(false))
    // }, []);

    // if (loading) return <Loading message="Loading shoppingCart..." />


    const [status, setStatus] = useState({
        loading: false,
        name: ''
    });
    const { shoppingCart, setShoppingCart } = useStoreContext();
    if (!shoppingCart) return <Typography variant="h4">购物车空空如也</Typography>

    function addQuantity(productId: number, statusName: string, quantity: number = 1) {
        setStatus({ loading: true, name: statusName });
        agent.ShoppingCart.addItem(productId, quantity)
            .then(cart => setShoppingCart(cart))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name: '' }))
    }

    // 减少商品数量
    function reduceQuantity(productId: number, statusName: string, quantity: number = 1) {
        setStatus({ loading: true, name: statusName });
        agent.ShoppingCart.removeItem(productId, quantity)
            .then(cart => setShoppingCart(cart))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name: '' }))
    }

    return (
        <Fragment>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" >商品情况</TableCell>
                        <TableCell align="right">商品单价($)</TableCell>
                        <TableCell align="center">数量</TableCell>
                        <TableCell align="right">总价</TableCell>
                        <TableCell align="center">功能</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shoppingCart.items.map(item => (
                        <TableRow key={item.productId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center' >
                                    <img src={item.imageUrl} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 5, marginRight: '20px' }} />
                                    <span>{item.productName}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton loading={status.loading && status.name === 'reduce' + item.productId} onClick={() => reduceQuantity(item.productId, 'reduce' + item.productId)} color="error" >
                                    <Remove />
                                </LoadingButton >
                                {item.quantity}
                                <LoadingButton loading={status.loading && status.name === 'add' + item.productId} onClick={() => addQuantity(item.productId, 'add' + item.productId)} color="secondary" >
                                    <Add />
                                </LoadingButton >
                            </TableCell>
                            <TableCell align="right">${(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton color="error" loading={status.loading && status.name === 'del' + item.productId} onClick={() => reduceQuantity(item.productId, 'del' + item.productId, item.quantity)} ><Delete /></LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <ShoppingCartSummary />
                    <Button
                        component={Link}
                        to='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth>
                        结算
                    </Button>

                </Grid>
            </Grid>
        </Fragment>
    )
}
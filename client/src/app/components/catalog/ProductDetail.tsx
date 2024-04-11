import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../models/Product";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import agent from "../../api/agent";
import Loading from "../loading/Loading";

export default function ProductDetail() {
  // Todo: 需要在详情组件访问 router参数，并显示相应的产品信息
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // 保证id参数存在
    id && agent.Catalog.detail(parseInt(id))
      .then((product: Product) => setProduct(product))
      .catch((error) => console.error(error.response))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading message="Loading product details..." />
  }

  if (!product) {
    return <Typography variant="h4">Product not found</Typography>
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
          <Typography variant="h4" color={"secondary"}>${(product.price / 100).toFixed(2)}</Typography>
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

        </Grid>
      </Grid>
    </>
  )
}
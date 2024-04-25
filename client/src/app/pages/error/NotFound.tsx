import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <Container component={Paper} sx={{height: 400}}>
            <Typography variant="h4" align="center">
                糟糕，你进入了没有知识的荒漠
            </Typography>
            <Divider />
            <img src="/images/404.png" alt="404" />
            <Button fullWidth component={Link} to="/catalog">返回商品列表</Button>
        </Container>
    );
}
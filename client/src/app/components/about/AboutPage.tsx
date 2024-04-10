import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import agent from "../../api/agent";

export default function AboutPage() {
  // 在ABout 页面测试 TestErrorAPI 并返回错误信息的展示
  return (
    <>
        <Container>
          <Typography variant="h2" gutterBottom>测试错误信息展示</Typography>
          <ButtonGroup fullWidth>
            <Button variant="contained" onClick={() => agent.TestErrors.get400Error()}>Test 400 Error</Button>
            <Button variant="contained" onClick={() => agent.TestErrors.get401Error()}>Test 401 Error</Button>
            <Button variant="contained" onClick={() => agent.TestErrors.get404Error()}>Test 404 Error</Button>
            <Button variant="contained" onClick={() => agent.TestErrors.get500Error()}>Test 500 Error</Button>
            <Button variant="contained" onClick={() => agent.TestErrors.getValidattionError()}>Test ValidationError</Button>
          </ButtonGroup>
        </Container>
    </>
  );
}
import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import agent from "../../api/agent";
import { toast } from "react-toastify";
export default function AboutPage() {
  // 在ABout 页面测试 TestErrorAPI 并返回错误信息的展示
  return (
    <>
      <Container>
        <Typography variant="h2" gutterBottom>测试错误信息展示</Typography>
        <ButtonGroup fullWidth>
          <Button variant="contained" onClick={() => agent.TestErrors.get400Error().catch(console.error)}>Test 400 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get401Error().catch(console.error)}>Test 401 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get404Error().catch(console.error)}>Test 404 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get500Error().catch(console.error)}>Test 500 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.getValidattionError().catch(console.error)}>Test ValidationError</Button>
          <Button variant="outlined" onClick={() => toast.error('Here is your toast.')}>Test toastify</Button>
        </ButtonGroup>
      </Container>
    </>
  );
}
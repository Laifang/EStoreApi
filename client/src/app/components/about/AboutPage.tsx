import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { useState } from "react";
export default function AboutPage() {
  const [ValidationError, setValidationError] = useState<string[]>([]);

  function getValidationError() {
    agent.TestErrors.getValidattionError()
      .then(() => console.log('should not see this!'))
      .catch(error => setValidationError(error));
  }

  // 在ABout 页面测试 TestErrorAPI 并返回错误信息的展示
  return (
    <>
      <Container>
        <Typography variant="h2" gutterBottom>测试错误信息展示</Typography>
        <ButtonGroup fullWidth>
          <Button variant="contained" onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>Test 400 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>Test 401 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>Test 404 Error</Button>
          <Button variant="contained" onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}>Test 500 Error</Button>
          <Button variant="contained" onClick={(getValidationError)}>Test 400 Error with Validation</Button>
          <Button variant="outlined" onClick={() => toast.error('Here is your toast.')}>Test toastify</Button>
        </ButtonGroup>
        {ValidationError.length > 0 &&
          <Alert severity="error">
            <AlertTitle>Validation Errors</AlertTitle>
            <List>
              {ValidationError.map(error => (
                <ListItem key={error}>
                  <ListItemText>{error}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Alert>}
      </Container>
    </>
  );
}
import e from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
const app = e();
const PORT = 3000;

app.use(
  "/service1",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/service1": "",
    },
    on: {
      proxyReq: fixRequestBody,
    },
  }),
);
app.use(
  "/service2",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/service2": "",
    },
    on: {
      proxyReq: fixRequestBody,
    },
  }),
);
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

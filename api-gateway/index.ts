import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());

// Proxy to Auth Service
app.use("/auth", createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true
}));

// Proxy to Ticket Service
app.use("/tickets", createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true
}));

app.listen(8080, () => {
    console.log("API Gateway running on 8080");
});
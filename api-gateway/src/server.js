import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import gatewayRoutes from "./routes/gatewayRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 4000;

// --------------- Middleware ---------------
app.use(cors());
app.use(morgan("dev"));
// NOTE: Do NOT use express.json() here.
// It consumes the request body stream, which prevents
// http-proxy-middleware from forwarding the body to target services.

// --------------- Health Check ---------------
app.get("/health", (_req, res) => {
  res.status(200).json({ message: "API Gateway is running" });
});

// --------------- Proxy Routes ---------------
app.use(gatewayRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway is running on http://localhost:${PORT}\n`);
});

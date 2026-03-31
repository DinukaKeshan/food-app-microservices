import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import gatewayRoutes from "./routes/gatewayRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔹 Health Check
app.get("/", (req, res) => {
  res.json({
    message: "API Gateway is running 🚀",
  });
});

// 🔹 Routes
app.use("/api", gatewayRoutes);

// 🔥 404 Handler (must be after routes)
app.use(notFound);

// 🔥 Global Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);

  console.clear(); // 🧼 clears old terminal output (optional but nice)

  console.log("\n🚀 ===============================");
  console.log("   API GATEWAY STARTED SUCCESSFULLY");
  console.log("🚀 ===============================\n");

  console.log(`📡 Base URL: http://localhost:${PORT}\n`);

  console.log("🔗 Available API Endpoints:\n");

  console.log(`👤 User Service      → http://localhost:${PORT}/api/users`);
  console.log(`📦 Order Service     → http://localhost:${PORT}/api/orders`);
  console.log(`💳 Payment Service   → http://localhost:${PORT}/api/payments`);
  console.log(
    `🍔 Restaurant Service→ http://localhost:${PORT}/api/restaurants`,
  );
  console.log(`⭐ Review Service    → http://localhost:${PORT}/api/reviews`);
  console.log(`🚚 Delivery Service  → http://localhost:${PORT}/api/delivery`);

  console.log("\n📘 API Docs (if enabled in services):\n");

  console.log(
    `👤 User Docs        → http://localhost:${PORT}/api/users/api-docs/`,
  );
  console.log(
    `📦 Order Docs       → http://localhost:${PORT}/api/orders/api-docs/`,
  );
  console.log(
    `💳 Payment Docs     → http://localhost:${PORT}/api/payments/api-docs/`,
  );
  console.log(
    `🍔 Restaurant Docs  → http://localhost:${PORT}/api/restaurants/api-docs`,
  );
  console.log(
    `⭐ Review Docs      → http://localhost:${PORT}/api/reviews/api-docs/`,
  );
  console.log(
    `🚚 Delivery Docs    → http://localhost:${PORT}/api/delivery/api-docs/`,
  );

  console.log("\n🔥 Gateway is ready to accept requests!\n");
});

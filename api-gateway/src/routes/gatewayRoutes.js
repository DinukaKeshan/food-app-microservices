import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services.js";

const router = express.Router();

const createServiceProxy = (target, pathRewrite) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,

    // 🔥 timeout protection
    proxyTimeout: 5000,
    timeout: 5000,

    // 🔥 better error handling
    onError: (err, req, res) => {
      console.error(`❌ Proxy Error → ${target}`, err.message);

      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: "Service temporarily unavailable",
          service: target,
        });
      }
    },

    // 🔥 log outgoing requests (optional but useful)
    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ ${req.method} ${req.originalUrl} → ${target}`);
    },
  });
};

// 🔥 ROUTES

// User Service
router.use(
  "/users",
  createServiceProxy(SERVICES.USER_SERVICE, {
    "^/users": "",
  }),
);

// Order Service
router.use(
  "/orders",
  createServiceProxy(SERVICES.ORDER_SERVICE, {
    "^/orders": "",
  }),
);

// Payment Service
router.use(
  "/payments",
  createServiceProxy(SERVICES.PAYMENT_SERVICE, {
    "^/payments": "",
  }),
);

// Restaurant Service
router.use(
  "/restaurants",
  createServiceProxy(SERVICES.RESTAURANT_SERVICE, {
    "^/restaurants": "",
  }),
);

// Review Service
router.use(
  "/reviews",
  createServiceProxy(SERVICES.REVIEW_SERVICE, {
    "^/reviews": "",
  }),
);

// Delivery Service
router.use(
  "/delivery",
  createServiceProxy(SERVICES.DELIVERY_SERVICE, {
    "^/delivery": "",
  }),
);

export default router;

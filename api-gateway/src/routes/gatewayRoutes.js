import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

/**
 * Proxy route definitions.
 * Each entry maps a gateway path prefix to its target microservice URL.
 *
 * The full path is preserved when forwarding, so:
 *   GET /api/payments       → http://localhost:5000/api/payments
 *   POST /api/payments      → http://localhost:5000/api/payments
 *   GET /api/payments/order/ORD1 → http://localhost:5000/api/payments/order/ORD1
 */
const proxyRoutes = [
  { path: "/api/users", target: process.env.USER_SERVICE },
  { path: "/api/orders", target: process.env.ORDER_SERVICE },
  { path: "/api/payments", target: process.env.PAYMENT_SERVICE },
  { path: "/api/restaurants", target: process.env.RESTAURANT_SERVICE },
  { path: "/api/reviews", target: process.env.REVIEW_SERVICE },
  { path: "/api/delivery", target: process.env.DELIVERY_SERVICE },
];

/**
 * Swagger/docs proxy routes.
 * Each microservice serves Swagger UI at /api-docs on its own port.
 * These rules let you access them through the gateway like:
 *   /api/payments/api-docs  → http://localhost:5000/api-docs
 *   /api/users/api-docs     → http://localhost:8002/api-docs
 *
 * pathRewrite strips the service prefix so the target receives /api-docs.
 */
proxyRoutes.forEach(({ path, target }) => {
  if (!target) return;

  // Swagger UI route: /api/<service>/api-docs → /api-docs
  router.use(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: `${path}/api-docs`,
      pathRewrite: {
        [`^${path}/api-docs`]: "/api-docs",
      },
    })
  );

  // Swagger JSON spec: /api/<service>/api-docs.json → /api-docs.json
  router.use(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: `${path}/api-docs.json`,
      pathRewrite: {
        [`^${path}/api-docs.json`]: "/api-docs.json",
      },
    })
  );
});

// Register API proxy routes (these must come AFTER the docs routes)
proxyRoutes.forEach(({ path, target }) => {
  if (!target) {
    console.warn(`[Gateway] WARNING: No target URL configured for ${path}`);
    return;
  }

  router.use(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: path,
      logger: console,
    })
  );

  console.log(`[Gateway] ${path} → ${target}`);
});

export default router;

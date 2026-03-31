# 🚀 Delivery Service

Production-ready microservice for the **Food Delivery Platform** — handles delivery partner management, real-time tracking, order assignment, status updates, and delivery zones.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Cache | Redis (real-time location) |
| Validation | Joi |
| HTTP Client | Axios + axios-retry |
| Logging | Winston + Morgan |
| API Docs | Swagger (OpenAPI 3.0) |
| Container | Docker (multi-stage) |

---

## 📁 Project Structure

```
delivery-service/
├── app.js                    # Express app (middleware, routes, Swagger)
├── server.js                 # Entry point (DB/Redis connect, graceful shutdown)
├── .env                      # Environment variables
├── Dockerfile                # Multi-stage Docker build
├── postman_collection.json   # Postman API collection
│
├── config/
│   ├── db.js                # MongoDB connection
│   ├── redis.js             # Redis client
│   └── swagger.js           # OpenAPI 3.0 spec
│
├── models/
│   ├── Delivery.js          # Delivery schema + indexes
│   └── DeliveryPartner.js   # Partner schema + indexes
│
├── controllers/
│   ├── deliveryController.js
│   ├── partnerController.js
│   └── zoneController.js
│
├── services/
│   ├── deliveryService.js   # Core delivery business logic
│   ├── partnerService.js    # Partner CRUD logic
│   ├── locationService.js   # Redis location cache
│   ├── notificationService.js # Notification Service client
│   ├── orderService.js      # Order Service client
│   └── userService.js       # User Service client
│
├── routes/
│   ├── deliveryRoutes.js    # Delivery endpoints + Swagger JSDoc
│   ├── partnerRoutes.js     # Partner endpoints + Swagger JSDoc
│   └── zoneRoutes.js        # Zone endpoint + Swagger JSDoc
│
├── middleware/
│   ├── errorHandler.js      # Global error handler
│   ├── validate.js          # Joi validation schemas + middleware
│   └── logger.js            # Morgan HTTP logging
│
└── utils/
    ├── logger.js            # Winston logger
    ├── axiosClient.js       # Axios factory with retry + interceptors
    ├── idGenerator.js       # Auto-generate partnerId / deliveryId
    └── zones.js             # Delivery zone definitions
```

---

## ⚙️ Setup

### 1. Prerequisites

- Node.js >= 18
- MongoDB running on `localhost:27017`
- Redis running on `localhost:6379`

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Edit `.env`:

```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/delivery-service
REDIS_HOST=localhost
REDIS_PORT=6379
ORDER_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3004
```

### 4. Start the Service

```bash
# Development (with file watch)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/delivery/partners` | Register a new delivery partner |
| `GET` | `/api/delivery/partner/:partnerId` | Get partner details |
| `GET` | `/api/delivery/partner/:partnerId/history` | Partner delivery history (paginated) |
| `PUT` | `/api/delivery/partner/:partnerId/status` | Update partner availability status |
| `DELETE` | `/api/delivery/partners/:partnerId` | Deactivate a partner (soft delete) |
| `POST` | `/api/delivery/assign` | Assign partner to an order |
| `GET` | `/api/delivery/track/:orderId` | Track delivery (Redis location) |
| `PUT` | `/api/delivery/:deliveryId/status` | Update delivery status |
| `PUT` | `/api/delivery/:deliveryId/location` | Update real-time GPS location |
| `GET` | `/api/delivery/zones` | Get all delivery zones |
| `GET` | `/health` | Health check |

---

## 📚 API Documentation

Swagger UI available at: **http://localhost:3003/api-docs**  
Raw OpenAPI JSON: **http://localhost:3003/api-docs.json**

---

## ⚡ Redis Location Tracking

- **Key format**: `delivery:{deliveryId}:location`
- **TTL**: 5 minutes (configurable via `REDIS_TTL`)
- **Read priority**: Redis first → MongoDB fallback
- **Cleanup**: Location key deleted on `DELIVERED` status

---

## 🔗 Inter-Service Communication

| Service | Trigger |
|---------|---------|
| **Order Service** | Verify order exists on `POST /assign` |
| **User Service** | Fetch customer address |
| **Notification Service** | On ASSIGNED, PICKED_UP, DELIVERED events |

All calls use **Axios** with:
- Configurable timeout (`AXIOS_TIMEOUT`)
- Automatic retry with exponential backoff (`AXIOS_RETRY_COUNT`)
- Request/response logging interceptors

---

## 🐳 Docker

```bash
# Build image
docker build -t delivery-service .

# Run container
docker run -p 3003:3003 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/delivery-service \
  -e REDIS_HOST=host.docker.internal \
  delivery-service
```

---

## 🧪 Postman

Import `postman_collection.json` into Postman. The collection:
- Auto-captures `partnerId` after partner creation
- Auto-captures `deliveryId` after delivery assignment
- Includes query params for pagination and status filtering

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Review Service API",
      version: "1.0.0",
      description:
        "Handles restaurant reviews and ratings for the Food Delivery platform. Users can create, read, update, and delete reviews. Each user may leave only one review per restaurant.",
      contact: {
        name: "API Support",
        email: "support@fooddelivery.com",
      },
    },
    servers: [
      { url: "http://localhost:8006", description: "Review Service (direct)" },
      { url: "http://localhost:8000", description: "Via API Gateway" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from the User Service login endpoint",
        },
      },
      schemas: {
        Review: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d0e" },
            userId: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d1f" },
            restaurantId: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d2a" },
            rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            title: { type: "string", example: "Great food and fast delivery!" },
            comment: {
              type: "string",
              example: "The pizza was absolutely delicious and arrived piping hot.",
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["https://example.com/img1.jpg"],
            },
            tags: {
              type: "array",
              items: {
                type: "string",
                enum: ["food", "service", "ambiance", "value", "delivery"],
              },
              example: ["food", "delivery"],
            },
            isVerified: { type: "boolean", example: false },
            helpfulCount: { type: "integer", example: 3 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ReviewInput: {
          type: "object",
          required: ["restaurantId", "rating", "comment"],
          properties: {
            restaurantId: {
              type: "string",
              example: "664f1b2c3d4e5f6a7b8c9d2a",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 4,
            },
            title: {
              type: "string",
              maxLength: 100,
              example: "Great food and fast delivery!",
            },
            comment: {
              type: "string",
              minLength: 10,
              maxLength: 1000,
              example: "The pizza was absolutely delicious and arrived piping hot.",
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: [],
            },
            tags: {
              type: "array",
              items: {
                type: "string",
                enum: ["food", "service", "ambiance", "value", "delivery"],
              },
              example: ["food", "delivery"],
            },
          },
        },
        ReviewResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Review created successfully." },
            data: {
              type: "object",
              properties: {
                review: { $ref: "#/components/schemas/Review" },
              },
            },
          },
        },
        ReviewListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                reviews: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Review" },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    total: { type: "integer", example: 42 },
                    pages: { type: "integer", example: 5 },
                  },
                },
              },
            },
          },
        },
        RestaurantReviewResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                reviews: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Review" },
                },
                averageRating: { type: "number", example: 4.3 },
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    total: { type: "integer", example: 18 },
                    pages: { type: "integer", example: 2 },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request — missing or invalid fields",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                message: "restaurantId, rating, and comment are required.",
              },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized — missing or invalid JWT token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Access denied. No token provided." },
            },
          },
        },
        Forbidden: {
          description: "Forbidden — insufficient permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "You can only update your own reviews." },
            },
          },
        },
        NotFound: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Review not found." },
            },
          },
        },
        ServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Internal server error." },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Reviews",
        description: "CRUD operations for restaurant reviews and ratings",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

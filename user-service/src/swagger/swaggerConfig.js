import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description:
        "Handles user registration, authentication, profile management, and address management for the Food Delivery platform.",
      contact: {
        name: "API Support",
        email: "support@fooddelivery.com",
      },
    },
    servers: [
      { url: "http://localhost:8002", description: "User Service (direct)" },
      { url: "http://localhost:8000", description: "Via API Gateway" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d0e" },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@example.com" },
            phone: { type: "string", example: "+1 555-0100" },
            role: {
              type: "string",
              enum: ["customer", "restaurant_owner", "driver", "admin"],
              example: "customer",
            },
            avatar: { type: "string", nullable: true, example: null },
            isActive: { type: "boolean", example: true },
            addresses: { type: "array", items: { $ref: "#/components/schemas/Address" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Address: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3d4e5f6a7b8c9d1f" },
            label: { type: "string", enum: ["home", "work", "other"], example: "home" },
            street: { type: "string", example: "123 Main Street" },
            city: { type: "string", example: "New York" },
            state: { type: "string", example: "NY" },
            postalCode: { type: "string", example: "10001" },
            country: { type: "string", example: "US" },
            isDefault: { type: "boolean", example: true },
          },
        },
        AddressInput: {
          type: "object",
          required: ["street", "city", "state", "postalCode"],
          properties: {
            label: { type: "string", enum: ["home", "work", "other"], example: "home" },
            street: { type: "string", example: "123 Main Street" },
            city: { type: "string", example: "New York" },
            state: { type: "string", example: "NY" },
            postalCode: { type: "string", example: "10001" },
            country: { type: "string", example: "US" },
            isDefault: { type: "boolean", example: false },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful." },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: { user: { $ref: "#/components/schemas/User" } },
            },
          },
        },
        AddressListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                addresses: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Address" },
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
          description: "Bad Request - Missing or invalid fields",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Name, email, and password are required." },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized - Missing or invalid JWT token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Access denied. No token provided." },
            },
          },
        },
        Forbidden: {
          description: "Forbidden - Insufficient permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "Access denied. Admin privileges required." },
            },
          },
        },
        NotFound: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, message: "User not found." },
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
      { name: "Auth", description: "User registration and login" },
      { name: "Users", description: "User profile management" },
      { name: "Addresses", description: "Delivery address management" },
      { name: "Admin", description: "Admin-only user management endpoints" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Service API',
      version: '1.0.0',
      description:
        'Production-ready microservice for managing delivery partners, real-time tracking, delivery zones, and order assignments for a Food Delivery Platform.',
      contact: {
        name: 'Food Delivery Platform Team',
        email: 'support@fooddelivery.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3003}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Partners', description: 'Delivery partner management' },
      { name: 'Deliveries', description: 'Delivery operations and tracking' },
      { name: 'Zones', description: 'Delivery zone management' },
    ],
    components: {
      schemas: {
        DeliveryPartner: {
          type: 'object',
          properties: {
            partnerId: { type: 'string', example: 'partner_abc123' },
            name: { type: 'string', example: 'John Doe' },
            phone: { type: 'string', example: '+1-555-123-4567' },
            vehicleType: { type: 'string', enum: ['MOTORCYCLE', 'BIKE', 'CAR'], example: 'MOTORCYCLE' },
            licenseNumber: { type: 'string', example: 'DL-1234567890' },
            currentStatus: { type: 'string', enum: ['AVAILABLE', 'BUSY', 'OFFLINE'], example: 'AVAILABLE' },
            rating: { type: 'number', example: 4.8 },
            totalDeliveries: { type: 'integer', example: 250 },
            deliveryZones: { type: 'array', items: { type: 'string' }, example: ['downtown', 'midtown'] },
          },
        },
        Delivery: {
          type: 'object',
          properties: {
            deliveryId: { type: 'string', example: 'delivery_xyz789' },
            orderId: { type: 'string', example: 'order_001' },
            partnerId: { type: 'string', example: 'partner_abc123' },
            partnerName: { type: 'string', example: 'John Doe' },
            partnerPhone: { type: 'string', example: '+1-555-123-4567' },
            status: { type: 'string', enum: ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'], example: 'IN_TRANSIT' },
            currentLocation: {
              type: 'object',
              properties: {
                latitude: { type: 'number', example: 40.7128 },
                longitude: { type: 'number', example: -74.006 },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            assignedAt: { type: 'string', format: 'date-time' },
            pickedUpAt: { type: 'string', format: 'date-time' },
            deliveredAt: { type: 'string', format: 'date-time' },
            distanceToRestaurant: { type: 'number', example: 1.5 },
            distanceToCustomer: { type: 'number', example: 3.2 },
            estimatedTime: { type: 'integer', example: 20 },
            deliveryEarnings: { type: 'number', example: 5.5 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

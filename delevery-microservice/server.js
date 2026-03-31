'use strict';

require('dotenv').config();
require('express-async-errors');

const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = parseInt(process.env.PORT) || 3003;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB (required — exits on failure)
    await connectDB();

    // 2. Connect to Redis (optional — warns but continues on failure)
    await connectRedis();

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Delivery Service running on port ${PORT}`);
      logger.info(`📚 API Docs : http://localhost:${PORT}/api-docs`);
      logger.info(`❤️  Health   : http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────────────
    const gracefulShutdown = async (signal) => {
      logger.warn(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
        } catch (err) {
          logger.error(`Error closing MongoDB: ${err.message}`);
        }

        try {
          const { getRedisClient, isRedisAvailable } = require('./config/redis');
          if (isRedisAvailable()) {
            const redisClient = getRedisClient();
            await redisClient.quit();
            logger.info('Redis connection closed');
          }
        } catch (err) {
          logger.error(`Error closing Redis: ${err.message}`);
        }

        logger.info('Graceful shutdown complete ✅');
        process.exit(0);
      });

      // Force exit after 15 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 15000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error(`Unhandled Rejection: ${reason}`);
    });

    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`, err);
      process.exit(1);
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, error);
    process.exit(1);
  }
};

startServer();

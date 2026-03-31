'use strict';

const { createClient } = require('redis');
const logger = require('../utils/logger');

let client = null;
let redisAvailable = false;

const connectRedis = async () => {
  const redisConfig = {
    socket: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          logger.warn('Redis: max reconnect attempts reached. Running without Redis cache.');
          return false; // stop retrying
        }
        return Math.min(retries * 500, 3000);
      },
    },
  };

  if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
  }

  client = createClient(redisConfig);

  client.on('connect', () => logger.info('Redis connecting...'));
  client.on('ready', () => {
    redisAvailable = true;
    logger.info('Redis client ready ✅');
  });
  client.on('error', (err) => {
    redisAvailable = false;
    // Only log once, not on every retry
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      logger.warn(`Redis unavailable (${err.code}). Location caching disabled.`);
    } else {
      logger.error(`Redis error: ${err.message}`);
    }
  });
  client.on('end', () => {
    redisAvailable = false;
    logger.warn('Redis connection closed');
  });

  try {
    await client.connect();
  } catch (err) {
    // Non-fatal: app works without Redis, just without location caching
    logger.warn(`Redis connection failed: ${err.message}. Continuing without Redis.`);
    redisAvailable = false;
  }
};

const getRedisClient = () => client;

const isRedisAvailable = () => redisAvailable;

module.exports = { connectRedis, getRedisClient, isRedisAvailable };

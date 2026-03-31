'use strict';

const { getRedisClient, isRedisAvailable } = require('../config/redis');
const logger = require('../utils/logger');

const TTL = parseInt(process.env.REDIS_TTL) || 300; // 5 minutes

/**
 * Store delivery location in Redis
 * Key: delivery:{deliveryId}:location
 */
const setLocation = async (deliveryId, latitude, longitude) => {
  if (!isRedisAvailable()) {
    logger.debug(`[LocationService] Redis unavailable — skipping cache write for ${deliveryId}`);
    return;
  }
  try {
    const client = getRedisClient();
    const key = `delivery:${deliveryId}:location`;
    const value = JSON.stringify({ latitude, longitude, updatedAt: new Date().toISOString() });
    await client.setEx(key, TTL, value);
    logger.debug(`[LocationService] Stored location for delivery ${deliveryId}`);
  } catch (error) {
    logger.error(`[LocationService] Failed to set location: ${error.message}`);
  }
};

/**
 * Get the latest delivery location from Redis
 * @returns {object|null} location object or null
 */
const getLocation = async (deliveryId) => {
  if (!isRedisAvailable()) {
    logger.debug(`[LocationService] Redis unavailable — returning null for ${deliveryId}`);
    return null;
  }
  try {
    const client = getRedisClient();
    const key = `delivery:${deliveryId}:location`;
    const value = await client.get(key);
    if (value) {
      logger.debug(`[LocationService] Cache hit for delivery ${deliveryId}`);
      return JSON.parse(value);
    }
    logger.debug(`[LocationService] Cache miss for delivery ${deliveryId}`);
    return null;
  } catch (error) {
    logger.error(`[LocationService] Failed to get location: ${error.message}`);
    return null;
  }
};

/**
 * Delete location cache on delivery completion
 */
const deleteLocation = async (deliveryId) => {
  if (!isRedisAvailable()) return;
  try {
    const client = getRedisClient();
    const key = `delivery:${deliveryId}:location`;
    await client.del(key);
    logger.debug(`[LocationService] Deleted location cache for delivery ${deliveryId}`);
  } catch (error) {
    logger.error(`[LocationService] Failed to delete location: ${error.message}`);
  }
};

module.exports = { setLocation, getLocation, deleteLocation };

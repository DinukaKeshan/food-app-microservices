'use strict';

const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const logger = require('./logger');

/**
 * Create a pre-configured Axios instance with retry logic, timeouts, and logging.
 * @param {string} baseURL - Base URL for the service
 * @param {string} serviceName - Human-readable name for logging
 */
const createAxiosClient = (baseURL, serviceName) => {
  const client = axios.create({
    baseURL,
    timeout: parseInt(process.env.AXIOS_TIMEOUT) || 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Name': 'delivery-service',
    },
  });

  // Configure retry: retry on network errors and 5xx responses
  axiosRetry(client, {
    retries: parseInt(process.env.AXIOS_RETRY_COUNT) || 3,
    retryDelay: (retryCount) => {
      const delay = retryCount * (parseInt(process.env.AXIOS_RETRY_DELAY) || 1000);
      logger.warn(`[${serviceName}] Retry attempt ${retryCount} after ${delay}ms`);
      return delay;
    },
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkError(error) ||
        axiosRetry.isRetryableError(error) ||
        (error.response && error.response.status >= 500)
      );
    },
    onRetry: (retryCount, error) => {
      logger.warn(`[${serviceName}] Request failed (attempt ${retryCount}): ${error.message}`);
    },
  });

  // Request interceptor - logging
  client.interceptors.request.use(
    (config) => {
      logger.debug(`[${serviceName}] --> ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      logger.error(`[${serviceName}] Request error: ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Response interceptor - logging
  client.interceptors.response.use(
    (response) => {
      logger.debug(`[${serviceName}] <-- ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url;
      logger.error(`[${serviceName}] Response error: ${status || 'Network Error'} ${url} - ${error.message}`);
      return Promise.reject(error);
    }
  );

  return client;
};

module.exports = { createAxiosClient };

'use strict';

const { getAllZones } = require('../utils/zones');

/**
 * GET /api/delivery/zones
 */
const getZones = async (req, res) => {
  const zones = getAllZones();
  res.status(200).json({
    success: true,
    count: zones.length,
    data: zones,
  });
};

module.exports = { getZones };

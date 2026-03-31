'use strict';

/**
 * Static delivery zones configuration.
 * In production this would be stored in DB and managed via admin panel.
 */
const DELIVERY_ZONES = [
  {
    zoneId: 'zone_downtown',
    name: 'Downtown',
    description: 'Central business district and surrounding areas',
    active: true,
    coverageRadiusKm: 5,
    baseFare: 2.5,
    perKmRate: 1.2,
  },
  {
    zoneId: 'zone_midtown',
    name: 'Midtown',
    description: 'Midtown commercial and residential area',
    active: true,
    coverageRadiusKm: 6,
    baseFare: 2.0,
    perKmRate: 1.0,
  },
  {
    zoneId: 'zone_uptown',
    name: 'Uptown',
    description: 'Uptown residential neighborhoods',
    active: true,
    coverageRadiusKm: 8,
    baseFare: 3.0,
    perKmRate: 1.5,
  },
  {
    zoneId: 'zone_suburbs',
    name: 'Suburbs',
    description: 'Suburban areas outside city center',
    active: true,
    coverageRadiusKm: 15,
    baseFare: 4.0,
    perKmRate: 1.8,
  },
  {
    zoneId: 'zone_airport',
    name: 'Airport District',
    description: 'Airport and surrounding commercial zones',
    active: true,
    coverageRadiusKm: 10,
    baseFare: 5.0,
    perKmRate: 2.0,
  },
];

const getAllZones = () => DELIVERY_ZONES;

const getZoneById = (zoneId) => DELIVERY_ZONES.find((z) => z.zoneId === zoneId);

const getZoneNames = () => DELIVERY_ZONES.map((z) => z.name.toLowerCase());

module.exports = { getAllZones, getZoneById, getZoneNames };

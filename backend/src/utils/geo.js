/**
 * Calculates the Haversine distance between two points on the Earth.
 *
 * @param {number} lat1 - Latitude of the first point in decimal degrees
 * @param {number} lon1 - Longitude of the first point in decimal degrees
 * @param {number} lat2 - Latitude of the second point in decimal degrees
 * @param {number} lon2 - Longitude of the second point in decimal degrees
 * @returns {number} Distance in kilometers
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    !Number.isFinite(lat1) || !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) || !Number.isFinite(lon2) ||
    lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
    lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180
  ) {
    throw new Error('Invalid coordinates for distance calculation');
  }

  const R = 6371; // Earth radius in kilometers

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Obscures a coordinate to protect privacy before claiming.
 * Rounds to ~2 decimal places, giving a ~1.1 km precision.
 * 
 * @param {number} coordinate - Latitude or Longitude
 * @returns {number} Obscured coordinate
 */
const obscureCoordinate = (coordinate) => {
  if (!Number.isFinite(coordinate)) return coordinate;
  return Math.round(coordinate * 100) / 100;
};

module.exports = {
  calculateDistanceKm,
  obscureCoordinate
};

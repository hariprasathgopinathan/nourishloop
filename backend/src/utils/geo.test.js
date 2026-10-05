const { calculateDistanceKm, obscureCoordinate } = require('./geo');

describe('Geo Utilities', () => {
  describe('calculateDistanceKm', () => {
    test('Calculates distance correctly for known pairs', () => {
      // New York to London
      const ny = { lat: 40.7128, lng: -74.0060 };
      const london = { lat: 51.5074, lng: -0.1278 };
      
      const distance = calculateDistanceKm(ny.lat, ny.lng, london.lat, london.lng);
      // Rough distance is ~5570km
      expect(distance).toBeGreaterThan(5500);
      expect(distance).toBeLessThan(5600);
    });

    test('Distance to same point is zero', () => {
      const distance = calculateDistanceKm(10, 20, 10, 20);
      expect(distance).toBe(0);
    });

    test('Throws error for invalid coordinates', () => {
      expect(() => calculateDistanceKm(100, 20, 10, 20)).toThrow('Invalid coordinates');
      expect(() => calculateDistanceKm(10, 200, 10, 20)).toThrow('Invalid coordinates');
      expect(() => calculateDistanceKm(null, 20, 10, 20)).toThrow('Invalid coordinates');
    });
  });

  describe('obscureCoordinate', () => {
    test('Rounds to 2 decimal places', () => {
      expect(obscureCoordinate(12.3456)).toBe(12.35);
      expect(obscureCoordinate(12.344)).toBe(12.34);
    });

    test('Handles non-numbers safely', () => {
      expect(obscureCoordinate(null)).toBe(null);
      expect(obscureCoordinate(undefined)).toBe(undefined);
    });
  });
});

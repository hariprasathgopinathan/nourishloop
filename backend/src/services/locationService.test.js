const https = require('https');
const { getRoute } = require('./locationService');

jest.mock('https');

describe('Location Service', () => {
  let mockReq;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      on: jest.fn(),
      destroy: jest.fn()
    };
    https.get.mockReturnValue(mockReq);
  });

  test('Validates coordinates', async () => {
    await expect(getRoute(null, 1, 2, 3)).rejects.toThrow('Invalid coordinates provided');
    await expect(getRoute(1, 'a', 2, 3)).rejects.toThrow('Invalid coordinates provided');
  });

  test('Successfully parses OSRM route response', async () => {
    const mockRes = {
      on: jest.fn((event, cb) => {
        if (event === 'data') {
          cb(JSON.stringify({
            code: 'Ok',
            routes: [
              { distance: 1500, duration: 300, geometry: { type: 'LineString', coordinates: [] } }
            ]
          }));
        }
        if (event === 'end') cb();
      })
    };

    https.get.mockImplementation((url, options, cb) => {
      cb(mockRes);
      return mockReq;
    });

    const route = await getRoute(10, 20, 11, 21);
    expect(route.distanceMeters).toBe(1500);
    expect(route.durationSeconds).toBe(300);
    expect(route.geometry.type).toBe('LineString');
    
    // Check URL order (longitude,latitude)
    const callUrl = https.get.mock.calls[0][0];
    expect(callUrl).toContain('/20,10;21,11?');
  });

  test('Handles NoRoute', async () => {
    const mockRes = {
      on: jest.fn((event, cb) => {
        if (event === 'data') {
          cb(JSON.stringify({
            code: 'NoRoute',
            message: 'No route found'
          }));
        }
        if (event === 'end') cb();
      })
    };

    https.get.mockImplementation((url, options, cb) => {
      cb(mockRes);
      return mockReq;
    });

    await expect(getRoute(10, 20, 11, 21)).rejects.toThrow('No route found');
  });

  test('Handles network error', async () => {
    https.get.mockImplementation((url, options, cb) => {
      mockReq.on.mockImplementation((event, errCb) => {
        if (event === 'error') errCb(new Error('ECONNRESET'));
      });
      return mockReq;
    });

    await expect(getRoute(10, 20, 11, 21)).rejects.toThrow('Network error calling route service: ECONNRESET');
  });

  test('Handles malformed JSON', async () => {
    const mockRes = {
      on: jest.fn((event, cb) => {
        if (event === 'data') cb('Not a json');
        if (event === 'end') cb();
      })
    };

    https.get.mockImplementation((url, options, cb) => {
      cb(mockRes);
      return mockReq;
    });

    await expect(getRoute(10, 20, 11, 21)).rejects.toThrow('Failed to parse OSRM response');
  });
});

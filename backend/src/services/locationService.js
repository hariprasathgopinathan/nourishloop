const https = require('https');

function getRoute(originLat, originLng, destLat, destLng) {
  return new Promise((resolve, reject) => {
    // Validate coordinates
    if (!Number.isFinite(originLat) || !Number.isFinite(originLng) || 
        !Number.isFinite(destLat) || !Number.isFinite(destLng)) {
      const err = new Error('Invalid coordinates provided');
      err.status = 400;
      return reject(err);
    }

    const baseUrl = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org';
    
    // OSRM requires longitude,latitude
    const coords = `${originLng},${originLat};${destLng},${destLat}`;
    const url = `${baseUrl}/route/v1/driving/${coords}?geometries=geojson&overview=full&steps=false&alternatives=false`;

    const req = https.get(url, { timeout: 5000 }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (parsed.code !== 'Ok') {
            const err = new Error(parsed.message || 'OSRM returned non-OK response');
            err.status = parsed.code === 'NoRoute' ? 404 : 502;
            err.code = parsed.code;
            return reject(err);
          }

          if (!parsed.routes || parsed.routes.length === 0) {
            const err = new Error('No route found');
            err.status = 404;
            return reject(err);
          }

          const route = parsed.routes[0];

          resolve({
            distanceMeters: route.distance,
            durationSeconds: route.duration,
            geometry: route.geometry
          });
        } catch (e) {
          const err = new Error('Failed to parse OSRM response');
          err.status = 502;
          reject(err);
        }
      });
    });

    req.on('error', (e) => {
      const err = new Error('Network error calling route service: ' + e.message);
      err.status = 503;
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      const err = new Error('Route service request timed out');
      err.status = 504;
      reject(err);
    });
  });
}

module.exports = {
  getRoute
};

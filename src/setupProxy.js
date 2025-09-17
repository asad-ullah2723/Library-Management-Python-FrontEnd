const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/auth', '/books'],
    createProxyMiddleware({
      target: 'http://localhost:9000',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Do not set CORS headers on the proxied request to the backend.
        // The browser needs CORS headers on the response. We'll handle preflight below.
        return;
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to the response so the browser accepts it.
        // Use the incoming request Origin if available (handles http://localhost:3000)
        const allowedOrigin = req.headers.origin || 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Origin'] = allowedOrigin;
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';

        // If this was a preflight request, short-circuit with 204 on the dev server
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
          });
          res.end();
        }
      },
      logLevel: 'debug' // Enable debug logging
    })
  );
};

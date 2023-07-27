/* eslint-disable func-names */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: "https://localhost:5001",
      target: process.env.REACT_APP_ADMIN_BASE_API_URL,
      ws: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};

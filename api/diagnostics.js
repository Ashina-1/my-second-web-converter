/**
 * Environment variables diagnostic endpoint
 * Check if API keys are properly configured
 */

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    apiKeys: {
      STORMGLASS_API_KEY: process.env.STORMGLASS_API_KEY
        ? "✓ SET (length: " + process.env.STORMGLASS_API_KEY.length + ")"
        : "✗ NOT SET",
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
        ? "✓ SET (length: " + process.env.GOOGLE_MAPS_API_KEY.length + ")"
        : "✗ NOT SET",
      OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY
        ? "✓ SET (length: " + process.env.OPENWEATHERMAP_API_KEY.length + ")"
        : "✗ NOT SET",
    },
  };

  res.status(200).json(diagnostics);
};

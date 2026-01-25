/**
 * Google Maps API キー供給バックエンド関数
 * APIキーはサーバー側で管理し、安全に供給
 */

module.exports = function handler(req, res) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GOOGLE_MAPS_API_KEY not configured" });
    }

    res.status(200).json({ apiKey });
  } catch (error) {
    console.error("[Google Maps API] Error:", error);
    console.error("[Google Maps API] Error details:", {
      name: error.name,
      message: error.message,
    });
    res.status(500).json({
      error: error.message,
      type: error.name,
    });
  }
};

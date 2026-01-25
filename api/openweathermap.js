/**
 * OpenWeatherMap API バックエンド関数
 * APIキーはサーバー側で管理
 */

export default async function handler(req, res) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "OPENWEATHERMAP_API_KEY not configured" });
    }

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "lat and lon parameters are required" });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`,
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API Error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("OpenWeatherMap API Error:", error);
    res.status(500).json({ error: error.message });
  }
}

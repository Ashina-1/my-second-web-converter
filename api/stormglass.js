/**
 * StormGlass API バックエンド関数
 * 潮汐・波浪データ取得
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
    const { lat, lng, type } = req.query;
    const apiKey = process.env.STORMGLASS_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "STORMGLASS_API_KEY not configured" });
    }

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "lat and lng parameters are required" });
    }

    // type が tide の場合は潮汐データ、wave の場合は波浪データを取得
    let url;
    if (type === "wave") {
      url = `https://api.stormglass.io/v2/weather?lat=${lat}&lng=${lng}&params=waveHeight,windWaveHeight,swellWaveHeight&datum=msl`;
    } else {
      url = `https://api.stormglass.io/v2/tide?lat=${lat}&lng=${lng}&datum=msl`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`StormGlass API Error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("StormGlass API Error:", error);
    res.status(500).json({ error: error.message });
  }
}

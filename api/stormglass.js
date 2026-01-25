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

    // デバッグログ
    console.log("[StormGlass API] Request:", {
      lat,
      lng,
      type,
      hasApiKey: !!apiKey,
    });

    if (!apiKey) {
      console.error("[StormGlass API] Missing API key");
      return res
        .status(503)
        .json({ error: "StormGlass API キーが設定されていません。管理者に連絡してください。" });
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

    console.log("[StormGlass API] Fetching from:", url);
    console.log("[StormGlass API] Auth header value length:", apiKey.length);

    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("[StormGlass API] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[StormGlass API] Error response:", errorText);
      throw new Error(
        `StormGlass API Error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("[StormGlass API] Error:", error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}

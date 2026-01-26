/**
 * StormGlass API バックエンド関数
 * 潮汐・波浪データ取得
 * APIキーはサーバー側で管理
 */

module.exports = async function handler(req, res) {
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
      return res.status(503).json({
        error:
          "StormGlass API キーが設定されていません。管理者に連絡してください。",
      });
    }

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "lat and lng parameters are required" });
    }

    // type が tide の場合は潮汐データ、wave の場合は波浪データを取得
    let url;
    if (type === "wave") {
      url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=waveHeight,windWaveHeight,swellWaveHeight`;
    } else {
      url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&datum=MLLW`;
    }

    console.log("[StormGlass API] Request details:", {
      url: url,
      type: type,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + "...",
      method: "GET",
      headers: {
        Authorization: apiKey.substring(0, 10) + "...",
        "Content-Type": "application/json",
      },
    });

    let response;
    try {
      response = await fetch(url, {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      });
    } catch (fetchError) {
      console.error("[StormGlass API] Fetch error:", fetchError);
      throw new Error(`Fetch failed: ${fetchError.message}`);
    }

    console.log("[StormGlass API] Response status:", response.status);
    console.log("[StormGlass API] Response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (textError) {
        errorText = `Unable to read response: ${textError.message}`;
      }
      console.error("[StormGlass API] Error response body:", errorText);
      console.error("[StormGlass API] Error details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(
        `StormGlass API Error: ${response.status} - ${errorText}`,
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("[StormGlass API] JSON parse error:", jsonError);
      throw new Error(`Failed to parse JSON response: ${jsonError.message}`);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("[StormGlass API] Error:", error);
    console.error("[StormGlass API] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json({
      error: errorMessage,
      type: error.name,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * 海況情報取得システム
 * Googleマップで選んだ地点から海況を取得
 */

// OpenWeatherMap APIを使用した海況情報取得
// (日本の海況データは気象庁が提供していますが、APIは限定的なため、
//  OpenWeatherMapの波浪予報とコマンドを併用します)
// APIキーはバックエンド関数で管理

/**
 * 緯度経度から海況情報を取得
 * @param {number} latitude - 緯度
 * @param {number} longitude - 経度
 * @returns {Promise<Object>} 海況データ
 */
export async function getOceanWeather(latitude, longitude) {
  try {
    // バックエンド関数を経由してOpenWeatherMap APIから気象・波浪データを取得
    const response = await fetch(
      `/api/openweathermap?lat=${latitude}&lon=${longitude}`,
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      location: {
        name: data.name || "不明な地点",
        latitude,
        longitude,
      },
      weather: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        windGust: data.wind.gust,
        description: data.weather[0]?.description || "不明",
        cloudiness: data.clouds.all,
      },
      waves: {
        // OpenWeatherMapでは直接波のデータは限定的なため、
        // 近似値として風速から波の高さを推定
        estimatedHeight: estimateWaveHeight(data.wind.speed),
        windSpeed: data.wind.speed,
        recommendation: getWaveRecommendation(data.wind.speed),
      },
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("海況データ取得エラー:", error);
    throw error;
  }
}

/**
 * 風速から波の高さを推定
 * @param {number} windSpeed - 風速（m/s）
 * @returns {Object} 推定波高データ
 */
function estimateWaveHeight(windSpeed) {
  // 風速から波の高さを簡易的に推定
  // 実際の波は多くの要因に影響されます
  let estimatedHeight = windSpeed * 0.0625;

  return {
    min: Math.max(0, estimatedHeight - 0.5),
    max: estimatedHeight + 0.5,
    unit: "m",
  };
}

/**
 * 波の高さに基づいて釣りの推奨度を返す
 * @param {number} windSpeed - 風速（m/s）
 * @returns {string} 推奨メッセージ
 */
function getWaveRecommendation(windSpeed) {
  if (windSpeed < 3) {
    return "🟢 快適 - 波が穏やかで釣りに最適です";
  } else if (windSpeed < 7) {
    return "🟡 普通 - 釣りは可能ですが、波に注意してください";
  } else if (windSpeed < 12) {
    return "🟠 注意 - 波が高くなっています。上級者向けです";
  } else {
    return "🔴 危険 - 波が高く、釣りは推奨されません";
  }
}

/**
 * 座標情報を Firestore ドキュメントに追加
 * @param {Object} catchData - 釣果データ
 * @param {number} latitude - 緯度
 * @param {number} longitude - 経度
 * @param {Object} oceanData - 海況データ
 * @returns {Object} 更新されたドキュメント
 */
export function addLocationToCatch(catchData, latitude, longitude, oceanData) {
  return {
    ...catchData,
    location: {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    },
    oceanConditions: {
      temperature: oceanData.weather.temperature,
      windSpeed: oceanData.weather.windSpeed,
      windDirection: oceanData.weather.windDirection,
      humidity: oceanData.weather.humidity,
      estimatedWaveHeight: oceanData.waves.estimatedHeight.max,
      recommendation: oceanData.waves.recommendation,
      capturedAt: oceanData.timestamp.toISOString(),
    },
  };
}

/**
 * 日本周辺の有名釣り場のデフォルト座標
 */
export const FAMOUS_FISHING_SPOTS = [
  {
    name: "犬吠埼灯台周辺",
    latitude: 35.7447,
    longitude: 140.8755,
    region: "千葉県",
  },
  {
    name: "伊豆半島・伊東沖",
    latitude: 34.93,
    longitude: 139.12,
    region: "静岡県",
  },
  {
    name: "紀伊水道",
    latitude: 34.1667,
    longitude: 135.1833,
    region: "和歌山県",
  },
  {
    name: "瀬戸内海・玄海灘",
    latitude: 34.3,
    longitude: 130.3,
    region: "広島県・山口県",
  },
  {
    name: "北海道・稚内沖",
    latitude: 45.42,
    longitude: 141.68,
    region: "北海道",
  },
  {
    name: "大分県・佐賀関",
    latitude: 33.4,
    longitude: 131.8,
    region: "大分県",
  },
];

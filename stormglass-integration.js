/**
 * StormGlass API 統合
 * 潮汐、波浪、天気データの取得
 * https://stormglass.io/
 */

// API キーはバックエンド関数で管理

/**
 * 潮汐タイプを日本語に変換
 * @private
 * @param {string} type - "High" or "Low"
 * @returns {Object} { label: string, emoji: string, description: string }
 */
function getTideTypeLabel(type) {
  if (type === "High") {
    return {
      label: "満潮",
      emoji: "🌊",
      description: "水位が最も高い状態",
    };
  } else if (type === "Low") {
    return {
      label: "干潮",
      emoji: "⬇️",
      description: "水位が最も低い状態",
    };
  }
  return { label: "不明", emoji: "❓", description: "" };
}

/**
 * StormGlass APIから潮汐データを取得
 * @param {number} latitude - 緯度
 * @param {number} longitude - 経度
 * @returns {Promise<Object>} 潮汐データ
 */
export async function getTideData(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/stormglass?lat=${latitude}&lng=${longitude}&type=tide`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `API Error: ${response.status}`;

      if (response.status === 401) {
        throw new Error("StormGlass APIキーが無効です");
      } else if (response.status === 503) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return parseTideData(data.data);
  } catch (error) {
    console.error("潮汐データ取得エラー:", error);
    throw error;
  }
}

/**
 * StormGlass APIから波浪データを取得（より詳細）
 * @param {number} latitude - 緯度
 * @param {number} longitude - 経度
 * @returns {Promise<Object>} 波浪データ
 */
export async function getWaveData(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/stormglass?lat=${latitude}&lng=${longitude}&type=wave`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `API Error: ${response.status}`;

      if (response.status === 401) {
        throw new Error("StormGlass APIキーが無効です");
      } else if (response.status === 503) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return parseWaveData(data.hours);
  } catch (error) {
    console.error("波浪データ取得エラー:", error);
    throw error;
  }
}

/**
 * 潮汐データをパース
 * @private
 */
function parseTideData(tideArray) {
  if (!tideArray || tideArray.length === 0) {
    return null;
  }

  // 現在時刻を基準に満潮と干潮を探す
  const now = new Date();
  let nextTide = null;
  let currentTide = null;

  for (const tide of tideArray) {
    const tideTime = new Date(tide.time);
    const timeDiff = tideTime.getTime() - now.getTime();

    if (timeDiff >= 0) {
      // 将来の潮汐
      if (!nextTide) {
        nextTide = tide;
      }
    } else if (timeDiff >= -3600000) {
      // 現在の1時間以内の過去
      currentTide = tide;
    }
  }

  // 最初と最後の潮汐情報
  const firstTide = tideArray[0];
  const lastTide = tideArray[tideArray.length - 1];

  // 次の潮時情報を整形
  const nextTideInfo = nextTide
    ? {
        time: new Date(nextTide.time),
        height: nextTide.height,
        type: nextTide.type,
        ...getTideTypeLabel(nextTide.type), // 日本語ラベルと絵文字を追加
      }
    : null;

  // 現在の潮汐情報を整形
  const currentTideInfo = currentTide
    ? {
        time: new Date(currentTide.time),
        height: currentTide.height,
        type: currentTide.type,
        ...getTideTypeLabel(currentTide.type),
      }
    : null;

  return {
    current: currentTideInfo,
    next: nextTideInfo,
    range: {
      min: Math.min(...tideArray.map((t) => t.height)),
      max: Math.max(...tideArray.map((t) => t.height)),
    },
    predictions: tideArray.slice(0, 6).map((t) => ({
      time: new Date(t.time),
      height: t.height,
      type: t.type,
      ...getTideTypeLabel(t.type), // 各予報にも日本語ラベルを追加
    })),
  };
}

/**
 * 波浪データをパース
 * @private
 */
function parseWaveData(hoursArray) {
  if (!hoursArray || hoursArray.length === 0) {
    return null;
  }

  console.log("=== parseWaveData called ===");
  console.log("hoursArray[0]:", hoursArray[0]);
  console.log("hoursArray[0].time:", hoursArray[0]?.time);
  console.log("typeof hoursArray[0].time:", typeof hoursArray[0]?.time);

  // 現在のデータと24時間の傾向を取得
  const current = hoursArray[0];
  const next24Hours = hoursArray.slice(0, Math.min(24, hoursArray.length));

  // 複数のデータソースがある場合の値の取得（優先度順）
  const getValueFromSources = (sources) => {
    for (const source of sources) {
      // source が null/undefined の場合はスキップ
      if (!source) continue;

      // ケース1: source が配列 [{ value: X, source: "..." }]
      if (Array.isArray(source)) {
        if (
          source[0] &&
          source[0].value !== undefined &&
          source[0].value !== null
        ) {
          return source[0].value;
        }
      }
      // ケース2: source が直接オブジェクト { value: X, source: "..." }
      else if (source.value !== undefined && source.value !== null) {
        return source.value;
      }
      // ケース3: source が直接数値
      else if (typeof source === "number") {
        return source;
      }
    }
    return null;
  };

  const currentWaveHeight =
    getValueFromSources([
      current.waveHeight,
      current.windWaveHeight,
      current.swellHeight,
    ]) || 0;

  const currentWavePeriod =
    getValueFromSources([
      current.wavePeriod,
      current.windWavePeriod,
      current.swellPeriod,
    ]) || 0;

  return {
    current: {
      waveHeight: currentWaveHeight,
      wavePeriod: currentWavePeriod,
      waveDirection: current.waveDirection?.[0]?.value || null,
      windWaveHeight: current.windWaveHeight?.[0]?.value || null,
      swellHeight: current.swellHeight?.[0]?.value || null,
      windSpeed: current.windSpeed?.[0]?.value || null,
      windDirection: current.windDirection?.[0]?.value || null,
    },
    trend24h: next24Hours.map((hour, index) => {
      const waveHeight =
        getValueFromSources([
          hour.waveHeight,
          hour.windWaveHeight,
          hour.swellHeight,
        ]) || 0;

      // 最初の1つのデータを詳細にデバッグログに出力
      if (index === 0) {
        console.log(`=== trend24h[0] 詳細情報 ===`);
        console.log("hour:", hour);
        console.log("hour.waveHeight:", hour.waveHeight);
        console.log("hour.waveHeight JSON:", JSON.stringify(hour.waveHeight));
        console.log("hour.windWaveHeight:", hour.windWaveHeight);
        console.log(
          "hour.windWaveHeight JSON:",
          JSON.stringify(hour.windWaveHeight),
        );
        console.log("hour.swellHeight:", hour.swellHeight);
        console.log("hour.swellHeight JSON:", JSON.stringify(hour.swellHeight));
        console.log("calculatedWaveHeight:", waveHeight);
      }

      // StormGlass APIの時刻は現在時刻 + index時間で計算
      const timeValue = hour.time
        ? new Date(hour.time)
        : new Date(new Date().getTime() + index * 60 * 60 * 1000);

      return {
        time: timeValue,
        waveHeight: waveHeight,
      };
    }),
    quality: evaluateWaveQuality(currentWaveHeight, currentWavePeriod),
  };
}

/**
 * 波のコンディション評価
 * @private
 */
function evaluateWaveQuality(height, period) {
  if (height < 0.5) {
    return {
      rating: "平穏",
      emoji: "🟢",
      description: "波が小さく、初心者向け",
    };
  } else if (height < 1.5) {
    return {
      rating: "良好",
      emoji: "🟡",
      description: "ちょうど良い波のサイズ",
    };
  } else if (height < 2.5) {
    return {
      rating: "荒い",
      emoji: "🟠",
      description: "上級者向け、経験が必要",
    };
  } else {
    return { rating: "危険", emoji: "🔴", description: "非常に荒い波、危険" };
  }
}

/**
 * 潮汐と波のコンディション総合評価
 */
export function evaluateOverallCondition(tideData, waveData, weatherData) {
  let score = 0;
  let factors = [];

  // 潮の流れの強さを評価
  if (tideData && tideData.range) {
    const tideRange = tideData.range.max - tideData.range.min;
    if (tideRange > 2) {
      factors.push("潮の流れが強い");
      score += 5; // 潮の流れが強い＝良い釣果の可能性
    }
  }

  // 波の高さを評価
  if (waveData && waveData.current) {
    const waveHeight = waveData.current.waveHeight;
    if (waveHeight < 2) {
      factors.push("波が穏やか");
      score += 10;
    } else if (waveHeight < 3) {
      factors.push("波のサイズが適切");
      score += 15;
    } else {
      factors.push("波が高い");
      score -= 5;
    }
  }

  // 風を評価
  if (weatherData && weatherData.weather) {
    const windSpeed = weatherData.weather.windSpeed;
    if (windSpeed < 5) {
      factors.push("風が弱い");
      score += 8;
    } else if (windSpeed > 15) {
      factors.push("風が強い");
      score -= 8;
    }
  }

  // 次の潮時を評価
  if (tideData && tideData.next) {
    const nextTideTime = tideData.next.time;
    const timeToNextTide =
      (nextTideTime.getTime() - new Date().getTime()) / (1000 * 60);

    if (timeToNextTide < 60 && timeToNextTide > 0) {
      factors.push("もうすぐ潮が変わる");
      score += 10;
    }
  }

  const recommendation = generateRecommendation(score, factors);

  return {
    score: Math.max(0, Math.min(100, score)),
    factors: factors,
    recommendation: recommendation,
  };
}

/**
 * 釣行推奨メッセージ生成
 * @private
 */
function generateRecommendation(score, factors) {
  if (score >= 40) {
    return {
      emoji: "🟢",
      text: "今がチャンス！釣行に最適な時間帯です",
      level: "excellent",
    };
  } else if (score >= 20) {
    return {
      emoji: "🟡",
      text: "釣行可能ですが、条件に注意してください",
      level: "good",
    };
  } else if (score >= 0) {
    return {
      emoji: "🟠",
      text: "釣行できますが、難しい条件です",
      level: "fair",
    };
  } else {
    return {
      emoji: "🔴",
      text: "今日は釣行を控えることをお勧めします",
      level: "poor",
    };
  }
}

/**
 * 潮汐情報を Firestore ドキュメントに追加
 */
export function addTideDataToCatch(catchData, tideData, waveData) {
  return {
    ...catchData,
    tideConditions: {
      currentHeight: tideData?.current?.height,
      nextTideTime: tideData?.next?.time?.toISOString(),
      nextTideType: tideData?.next?.type,
      tideRange: tideData?.range,
    },
    waveConditions: {
      height: waveData?.current?.waveHeight,
      period: waveData?.current?.wavePeriod,
      direction: waveData?.current?.waveDirection,
      quality: waveData?.quality,
    },
  };
}

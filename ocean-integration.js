/**
 * 釣果記録と海況チェッカーの統合スクリプト
 * fishing-log.html で使用
 */

import { getOceanWeather } from "./ocean-weather.js";

/**
 * sessionStorageから海況データを復元
 * ocean-checker.html から遷移してきた場合の処理
 */
export function restoreOceanDataFromSession() {
  const stored = sessionStorage.getItem("oceanData");
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    sessionStorage.removeItem("oceanData"); // 1回限りの使用
    return data;
  } catch (error) {
    console.error("セッションデータの復元エラー:", error);
    return null;
  }
}

/**
 * 海況データを釣果フォームに適用
 */
export function applyOceanDataToForm(oceanData) {
  if (!oceanData) return;

  // 入力フィールドに海況情報を自動入力
  const form = document.getElementById("catchForm");
  if (!form) return;

  // 温度フィールド（あれば）
  const tempField = form.querySelector('input[name="temperature"]');
  if (tempField && oceanData.temperature) {
    tempField.value = oceanData.temperature.toFixed(1);
  }

  // 風速フィールド（あれば）
  const windField = form.querySelector('input[name="windSpeed"]');
  if (windField && oceanData.windSpeed) {
    windField.value = oceanData.windSpeed.toFixed(1);
  }

  // 座標フィールド（あれば）
  const latField = form.querySelector('input[name="latitude"]');
  const lngField = form.querySelector('input[name="longitude"]');
  if (latField && oceanData.latitude) {
    latField.value = oceanData.latitude.toFixed(6);
  }
  if (lngField && oceanData.longitude) {
    lngField.value = oceanData.longitude.toFixed(6);
  }

  // StormGlass潮汐データフィールド（あれば）
  const tideHeightField = form.querySelector('input[name="tideHeight"]');
  if (tideHeightField && oceanData.tideData?.currentHeight) {
    tideHeightField.value = oceanData.tideData.currentHeight.toFixed(2);
  }

  // StormGlass波浪データフィールド（あれば）
  const waveHeightField = form.querySelector('input[name="waveHeight"]');
  if (waveHeightField && oceanData.waveData?.height) {
    waveHeightField.value = oceanData.waveData.height.toFixed(2);
  }
}

/**
 * 海況チェッカーへのリンクボタンを挿入
 */
export function addOceanCheckerLink() {
  const form = document.getElementById("catchForm");
  if (!form) return;

  // 既に追加されている場合はスキップ
  if (document.getElementById("oceanCheckerLink")) return;

  // 「海況データ連動」セクションを探す
  const oceanSection = form.querySelector(
    '[style*="rgba(107, 143, 176, 0.1)"]'
  );
  if (!oceanSection) return;

  // 既存のボタングループを取得
  const buttonGroup = oceanSection.querySelector(
    '[style*="display: flex; gap: 8px"]'
  );
  if (!buttonGroup) return;

  // 新しいボタンを作成
  const linkButton = document.createElement("button");
  linkButton.id = "oceanCheckerLink";
  linkButton.type = "button";
  linkButton.className = "btn";
  linkButton.style.cssText = "flex: 1; min-width: 150px; font-size: 0.9rem;";
  linkButton.textContent = "🌊 海況チェッカーを開く";
  linkButton.onclick = (e) => {
    e.preventDefault();
    window.open("ocean-checker.html", "oceanChecker", "width=1200,height=800");
  };

  // ボタングループに追加
  buttonGroup.appendChild(linkButton);
}

/**
 * 現在地を取得して海況データを取得（Geolocation API使用）
 */
export async function captureCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("ブラウザが位置情報をサポートしていません"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const oceanData = await getOceanWeather(latitude, longitude);
          resolve({
            latitude,
            longitude,
            temperature: oceanData.weather.temperature,
            windSpeed: oceanData.weather.windSpeed,
            oceanData: oceanData,
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`位置情報取得エラー: ${error.message}`));
      }
    );
  });
}

/**
 * 波情報から釣りの推奨度を生成
 */
export function generateFishingRecommendation(oceanData) {
  if (!oceanData) return "";

  const windSpeed = oceanData.weather.windSpeed;
  const waveHeight = oceanData.waves.estimatedHeight.max;

  let recommendation = `🌊 海況情報\n`;
  recommendation += `気温: ${oceanData.weather.temperature.toFixed(1)}°C\n`;
  recommendation += `風速: ${windSpeed.toFixed(1)} m/s\n`;
  recommendation += `推定波高: ${waveHeight.toFixed(1)}m\n`;
  recommendation += `${oceanData.waves.recommendation}`;

  return recommendation;
}

/**
 * 海況チェッカーと連携するための UI をセットアップ
 */
export function setupOceanCheckerIntegration() {
  // セッションストレージから海況データを復元
  const oceanData = restoreOceanDataFromSession();

  if (oceanData) {
    // データをフォームに適用
    applyOceanDataToForm(oceanData);

    // 表示用のメッセージを生成
    const form = document.getElementById("catchForm");
    if (form) {
      const oceanDisplay = form.querySelector("#oceanDataDisplay");
      if (oceanDisplay) {
        oceanDisplay.style.display = "block";
        const textElem = oceanDisplay.querySelector("#oceanDataText");
        if (textElem) {
          textElem.textContent = `✅ 海況チェッカーからデータを取得しました (${new Date().toLocaleString(
            "ja-JP"
          )})`;
        }
      }
    }
  }

  // 海況チェッカーリンクボタンを追加
  addOceanCheckerLink();

  // 現在地キャプチャボタンのイベントリスナー設定
  const quickCaptureBtn = document.getElementById("quickCapture");
  if (quickCaptureBtn) {
    quickCaptureBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await handleQuickCapture();
    });
  }

  // 地点選択キャプチャボタンのイベントリスナー設定
  const selectCaptureBtn = document.getElementById("selectCapture");
  if (selectCaptureBtn) {
    selectCaptureBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        "ocean-checker.html",
        "oceanChecker",
        "width=1200,height=800"
      );
    });
  }
}

/**
 * 現在地から即座に海況データを取得
 */
async function handleQuickCapture() {
  const form = document.getElementById("catchForm");
  const oceanDisplay = form?.querySelector("#oceanDataDisplay");
  if (!oceanDisplay) return;

  oceanDisplay.style.display = "block";
  const textElem = oceanDisplay.querySelector("#oceanDataText");
  if (textElem) {
    textElem.textContent = "位置情報を取得中...";
  }

  try {
    const data = await captureCurrentLocation();
    applyOceanDataToForm(data);

    if (textElem) {
      const rec = generateFishingRecommendation(data.oceanData);
      textElem.textContent = rec;
    }
  } catch (error) {
    if (textElem) {
      textElem.textContent = `❌ エラー: ${error.message}`;
      textElem.style.color = "#ff8787";
    }
  }
}

/**
 * Firestore に海況データを一緒に保存するヘルパー関数
 */
export function enrichCatchWithOceanData(catchData, oceanData) {
  if (!oceanData) return catchData;

  return {
    ...catchData,
    oceanConditions: {
      temperature: oceanData.weather?.temperature,
      windSpeed: oceanData.weather?.windSpeed,
      windDirection: oceanData.weather?.windDirection,
      humidity: oceanData.weather?.humidity,
      estimatedWaveHeight: oceanData.waves?.estimatedHeight?.max,
      cloudiness: oceanData.weather?.cloudiness,
      timestamp: oceanData.timestamp?.toISOString(),
      recommendation: oceanData.waves?.recommendation,
    },
    tideConditions: oceanData.tideData
      ? {
          currentHeight: oceanData.tideData.currentHeight,
          nextTideTime: oceanData.tideData.nextTideTime,
          nextTideType: oceanData.tideData.nextTideType,
        }
      : null,
    waveConditions: oceanData.waveData
      ? {
          height: oceanData.waveData.height,
          period: oceanData.waveData.period,
          quality: oceanData.waveData.quality,
        }
      : null,
    location: catchData.location || {
      latitude: oceanData.latitude,
      longitude: oceanData.longitude,
    },
  };
}

/**
 * Googleマップ統合スクリプト
 * 地点選択と海況データ連携
 */

let mapInstance = null;
let markerInstance = null;
let selectedLocation = null;

/**
 * Googleマップを初期化
 * @param {string} mapContainerId - マップコンテナのID
 * @param {number} initialLat - 初期緯度（デフォルト：日本中央）
 * @param {number} initialLng - 初期経度（デフォルト：日本中央）
 * @param {number} zoom - ズームレベル
 */
export async function initializeMap(
  mapContainerId,
  initialLat = 36.2048,
  initialLng = 138.2529,
  zoom = 7,
) {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const mapContainer = document.getElementById(mapContainerId);
  if (!mapContainer) {
    console.error(`Map container with ID "${mapContainerId}" not found`);
    return null;
  }

  mapInstance = new Map(mapContainer, {
    zoom: zoom,
    center: { lat: initialLat, lng: initialLng },
    mapId: "fishing_app_map",
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: true,
    gestureHandling: "greedy",
  });

  // マップクリックで地点選択
  mapInstance.addListener("click", (e) => {
    handleMapClick(e.latLng);
  });

  return mapInstance;
}

/**
 * マップ上のクリックを処理
 * @param {google.maps.LatLng} latLng - クリック地点の座標
 */
export async function handleMapClick(latLng) {
  const lat = latLng.lat();
  const lng = latLng.lng();

  selectedLocation = { latitude: lat, longitude: lng };

  // 既存のマーカーを削除
  if (markerInstance) {
    markerInstance.map = null;
  }

  // 新しいマーカーを配置
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const markerContent = document.createElement("div");
  markerContent.style.cssText = `
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  `;
  markerContent.textContent = "📍";

  markerInstance = new AdvancedMarkerElement({
    map: mapInstance,
    position: { lat, lng },
    content: markerContent,
    title: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  });

  // イベント発火
  window.dispatchEvent(
    new CustomEvent("locationSelected", {
      detail: { latitude: lat, longitude: lng },
    }),
  );

  return selectedLocation;
}

/**
 * マップに複数の釣り場マーカーを追加
 * @param {Array} fishingSpots - 釣り場のリスト
 */
export async function addFishingSpotMarkers(fishingSpots) {
  if (!mapInstance) {
    console.error("Map not initialized");
    return;
  }

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  fishingSpots.forEach(async (spot) => {
    const markerContent = document.createElement("div");
    markerContent.style.cssText = `
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #4db8ff, #0099ff);
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
    `;
    markerContent.textContent = "🎣";

    const marker = new AdvancedMarkerElement({
      map: mapInstance,
      position: { lat: spot.latitude, lng: spot.longitude },
      content: markerContent,
      title: `${spot.name} - ${spot.region}`,
    });

    marker.addListener("click", () => {
      handleMapClick({ lat: () => spot.latitude, lng: () => spot.longitude });
    });

    const infoWindowContent = document.createElement("div");
    infoWindowContent.style.cssText = `
      color: #8099b8;
      font-size: 14px;
      padding: 8px;
      background: #050404;
      border: 1px solid #506080;
      border-radius: 4px;
    `;
    infoWindowContent.innerHTML = `
      <strong>${escapeHtml(spot.name)}</strong><br/>
      <small>${escapeHtml(spot.region)}</small>
    `;

    const { InfoWindow } = await google.maps.importLibrary("maps");
    const infoWindow = new InfoWindow({
      content: infoWindowContent,
    });

    marker.addListener("click", () => {
      infoWindow.open(mapInstance, marker);
    });
  });
}

/**
 * マップをズームしてマーカーを表示
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} zoom - ズームレベル
 */
export function focusMapLocation(lat, lng, zoom = 10) {
  if (!mapInstance) return;
  mapInstance.setCenter({ lat, lng });
  mapInstance.setZoom(zoom);
}

/**
 * 選択されている地点の座標を取得
 * @returns {Object|null} {latitude, longitude} または null
 */
export function getSelectedLocation() {
  return selectedLocation;
}

/**
 * XSS対策：HTMLエスケープ
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

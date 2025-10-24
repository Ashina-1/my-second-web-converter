// タナトル4用データ（必要ならここを編集して増やす）
const tanatoru4Data = [
  {
    pe: 0.6,
    peKg: 6.4,
    leader: 3.5,
    leaderKg: 6.4,
    leaderLb: 14,
    link: "https://www.amazon.co.jp/dp/B00XL7EFM",
  }, // シーガー船ハリス 3.5号
  {
    pe: 0.8,
    peKg: 8.1,
    leader: 4,
    leaderKg: 7,
    leaderLb: 16,
    link: "https://www.amazon.co.jp/dp/B00YYYYY",
  }, // シーガー船ハリス 4号
  {
    pe: 1.0,
    peKg: 9.1,
    leader: 5,
    leaderKg: 9,
    leaderLb: 20,
    link: "https://www.amazon.co.jp/dp/B00ZZZZZ",
  }, // シーガー船ハリス 5号
  {
    pe: 1.5,
    peKg: 13.6,
    leader: 8,
    leaderKg: 13,
    leaderLb: 30,
    link: "https://www.amazon.co.jp/dp/B00ZZZZZ",
  }, // シーガー船ハリス 8号
  {
    pe: 2.0,
    peKg: 15.9,
    leader: 10,
    leaderKg: 16,
    leaderLb: 40,
    link: "https://www.amazon.co.jp/dp/B00ZZZZZ",
  }, // シーガー船ハリス 10号
  {
    pe: 3.0,
    peKg: 22.5,
    leader: 14,
    leaderKg: 22,
    leaderLb: 55,
    link: "https://amzn.asia/d/1UOyEyG",
  }, // シーガー船ハリス 14号
  {
    pe: 4.0,
    peKg: 30.5,
    leader: 20,
    leaderKg: 30,
    leaderLb: 70,
    link: "https://www.amazon.co.jp/dp/B00ZZZZZ",
  }, // シーガー船ハリス 20号
  {
    pe: 5.0,
    peKg: 36.3,
    leader: 25,
    leaderKg: 35,
    leaderLb: 80,
    link: "https://www.amazon.co.jp/dp/B00ZZZZZ",
  }, // シーガー船ハリス 25号
];
// DOM が読み込まれてから設定する（安全策）
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("convertBtn");
  if (btn) btn.addEventListener("click", convert);
});

function convert() {
  const peEl = document.getElementById("pe");
  const resultEl = document.getElementById("result");
  if (!peEl || !resultEl) return;

  const raw = peEl.value;
  const peInput = parseFloat(raw);

  // 空入力や数値でない場合
  if (!raw || isNaN(peInput)) {
    showError("⚠️ 正しいPE号数を入力してください（例: 1.5）");
    return;
  }

  // リストに完全一致があるか確認（「リストに載っていない号数はエラー」の要望に対応）
  const exact = tanatoru4Data.find((d) => d.pe === peInput);
  if (!exact) {
    showError(
      `⚠️ ${peInput}号はデータに登録されていません（対応: ${tanatoru4Data
        .map((d) => d.pe)
        .join("、")}号）`
    );
    return;
  }

  // 一致したデータを表示
  resultEl.innerHTML = `
    🐟 入力PE号数: <strong>${exact.pe}</strong><br>
    🪝 推奨リーダー: <strong>${exact.leader}号</strong>
      （約 ${exact.leaderKg} kg ≒ ${exact.leaderLb} lb）<br>
    🌊 参考PE強度: 約 ${exact.peKg} kg
    ${
      exact.link
        ? `<br>🔗 <a href="${exact.link}" target="_blank" rel="noopener">筆者がよく使う高コスパリーダー(amazon)</a>`
        : ""
    }
  `;
  resultEl.style.color = "#023e8a";
}

function showError(msg) {
  const resultEl = document.getElementById("result");
  if (!resultEl) return;
  resultEl.textContent = msg;
  resultEl.style.color = "crimson";
}

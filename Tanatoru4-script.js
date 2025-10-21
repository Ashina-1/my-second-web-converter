const tanatoru4Data = [
  { pe: 0.6, peKg: 6.4, leader: 3.5, leaderKg: 6.4, leaderLb: 14 },
  { pe: 0.8, peKg: 8.1, leader: 4, leaderKg: 7, leaderLb: 16 },
  { pe: 1.0, peKg: 9.1, leader: 5, leaderKg: 9, leaderLb: 20 },
  { pe: 1.5, peKg: 13.6, leader: 8, leaderKg: 13, leaderLb: 30 },
  { pe: 2.0, peKg: 15.9, leader: 10, leaderKg: 16, leaderLb: 40 },
  { pe: 3.0, peKg: 22.5, leader: 14, leaderKg: 22, leaderLb: 55 },
  { pe: 4.0, peKg: 30.5, leader: 20, leaderKg: 30, leaderLb: 70 },
];

function convert() {
  const peInput = parseFloat(document.getElementById("pe").value);
  const resultEl = document.getElementById("result");

  if (isNaN(peInput) || peInput <= 0) {
    resultEl.innerText = "⚠️ 正しいPE号数を入力してください";
    return;
  }

  if (peInput < 0.6 || peInput > 4.0) {
    resultEl.innerText = "⚠️ データ範囲は 0.6〜4号 です";
    return;
  }

  // 入力PE号数に最も近いデータを探す
  let closest = tanatoru4Data[0];
  let minDiff = Math.abs(peInput - closest.pe);
  for (const d of tanatoru4Data) {
    const diff = Math.abs(peInput - d.pe);
    if (diff < minDiff) {
      closest = d;
      minDiff = diff;
    }
  }

  resultEl.innerHTML = `
    🐟 入力PE号数: <strong>${peInput}</strong><br>
    🪝 推奨リーダー: <strong>${closest.leader}号</strong>（
    約${closest.leaderKg}kg）≒ ${closest.leaderLb}Lb <br>
    🌊 参考PE強度: 約${closest.peKg}kg

  `;
}

// ボタンにイベントを設定
document.getElementById("convertBtn").addEventListener("click", convert);

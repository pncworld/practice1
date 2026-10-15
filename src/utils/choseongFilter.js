const CHOSEONG = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const JUNGSEONG = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

const CHOSEONG_SET = new Set(CHOSEONG);

export const toChoseong = (str) => {
  let out = "";
  for (const ch of String(str || "")) {
    const parts = decomposeHangul(ch);
    if (parts) {
      out += parts.cho;
    } else {
      out += ch;
    }
  }
  return out;
};

const decomposeHangul = (ch) => {
  const code = String(ch || "").charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const s = code - 0xac00;
    return {
      cho: CHOSEONG[Math.floor(s / 588)],
      jung: JUNGSEONG[Math.floor((s % 588) / 28)],
      jong: s % 28,
    };
  }
  if (CHOSEONG_SET.has(ch)) {
    return { cho: ch, jung: "", jong: 0 };
  }
  return null;
};

const charMatchesKeyword = (nameCh, keyCh) => {
  const n = String(nameCh || "");
  const k = String(keyCh || "");
  if (!k) {
    return true;
  }
  if (n.toLowerCase() === k.toLowerCase()) {
    return true;
  }
  const nd = decomposeHangul(n);
  const kd = decomposeHangul(k);
  if (!nd || !kd) {
    return false;
  }
  if (!kd.jung) {
    return nd.cho === kd.cho;
  }
  if (kd.jong === 0) {
    return nd.cho === kd.cho && nd.jung === kd.jung;
  }
  return n === k;
};

const matchChoseongSequence = (name, keyword) => {
  const nameChars = [...String(name || "")];
  const keyChars = [...String(keyword || "")];
  if (keyChars.length === 0) {
    return true;
  }
  if (nameChars.length < keyChars.length) {
    return false;
  }
  for (let i = 0; i <= nameChars.length - keyChars.length; i += 1) {
    let ok = true;
    for (let j = 0; j < keyChars.length; j += 1) {
      if (!charMatchesKeyword(nameChars[i + j], keyChars[j])) {
        ok = false;
        break;
      }
    }
    if (ok) {
      return true;
    }
  }
  return false;
};

export const matchNameWithChoseong = (name, keyword) => {
  const k = String(keyword || "").trim().toLowerCase();
  if (!k) {
    return true;
  }
  const n = String(name || "");
  if (n.toLowerCase().includes(k)) {
    return true;
  }
  return matchChoseongSequence(n, k);
};

export const stockDisplayName = (item) =>
  [
    item?.strStockName,
    item?.strStock,
    item?.strItemName,
    item?.strStockNm,
    item?.StrStockName,
  ]
    .filter((v) => v != null && String(v) !== "")
    .join(" ");

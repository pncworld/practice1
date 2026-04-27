/**
 * alreadyLogined 등 토큰 검증 응답이 getLoginSession과 동일하지 않을 때,
 * BasicLayout에서 쓰는 상단 그라데이션·로고 필드만 이전 세션에서 보조한다.
 * API가 값을 주면 항상 그 값이 우선이다.
 */
const THEME_AND_LOGO_KEYS = [
  "strTopFColor",
  "strTopTColor",
  "strBackColor",
  "strNLogoUrl",
  "strLogoUrl",
];

function isEmptySessionValue(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

export function mergeThemeLogoFromPersistedSession(fresh, previous) {
  if (!fresh || typeof fresh !== "object" || Array.isArray(fresh)) {
    return fresh;
  }
  if (!previous || typeof previous !== "object" || Array.isArray(previous)) {
    return fresh;
  }
  const out = { ...fresh };
  for (const key of THEME_AND_LOGO_KEYS) {
    if (!isEmptySessionValue(out[key])) continue;
    const pv = previous[key];
    if (!isEmptySessionValue(pv)) {
      out[key] = pv;
    }
  }
  return out;
}

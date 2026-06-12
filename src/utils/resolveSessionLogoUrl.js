/**
 * 브랜드 로고 URL — 로컬·운영 공통 규칙
 *
 * 1) 세션 URL(pncapi.kr:88 등) → /image/... 상대경로로만 변환 (브라우저가 :88 직접 호출 금지)
 * 2) img src 는 항상 /image/... (로컬·운영 동일)
 * 3) 프록시만 환경별:
 *    - 로컬 devServer (proxy.config.js) → pncoffice.net 미러
 *    - 운영 server.js → 이미지 서버 pncapi.kr:88
 * 4) 로컬에서 /image 프록시 실패 시 → pncoffice.net 절대 URL 재시도 (handleLogoImgError)
 */

import { PNC_IMAGE_DEV_MIRROR_ORIGIN } from "@/constants/pncHosts";

export const isProductionBuild = () =>
  typeof process !== "undefined" && process.env?.NODE_ENV === "production";

/** /Image/ → /image/ */
export function normalizePncImagePath(path) {
  const p = String(path ?? "").trim().split(/[?#]/)[0];
  if (!p) return "";
  return p.replace(/^\/image\//i, "/image/");
}

/** 로컬·운영 공통 — 항상 동일 출처 상대경로 */
export function toLogoImgSrc(relativeImagePath) {
  return normalizePncImagePath(relativeImagePath);
}

export function normalizeLogoUrlForPage(url) {
  if (!url || typeof url !== "string") return url;
  const u = url.trim();
  if (typeof window === "undefined" || window.location.protocol !== "https:") {
    return u;
  }
  if (/^http:\/\//i.test(u)) {
    return u.replace(/^http:\/\//i, "https://");
  }
  return u;
}

/** 이미지 서버·pncoffice 호스트 절대 URL → /image/... 상대 경로 */
export function toSameOriginPncImagePath(absoluteUrl) {
  const s = String(absoluteUrl ?? "").trim();
  if (!s) return null;

  const imageIdx = s.search(/\/image\//i);
  if (imageIdx >= 0) {
    return normalizePncImagePath(s.slice(imageIdx));
  }

  const mNet = s.match(/\.net(\/[^?#]*)/i);
  if (mNet) return mNet[1];
  const mKr = s.match(/\.co\.kr(\/[^?#]*)/i);
  if (mKr) return mKr[1];
  return null;
}

export function pickSessionLogoRaw(sessionUser) {
  if (!sessionUser || typeof sessionUser !== "object" || Array.isArray(sessionUser)) {
    return "";
  }
  const raw =
    sessionUser.strNLogoUrl ||
    sessionUser.strLogoUrl ||
    sessionUser.StrNLogoUrl ||
    sessionUser.StrLogoUrl ||
    "";
  return typeof raw === "string" ? raw.trim() : "";
}

export function resolveSessionLogoUrl(sessionUser, defaultLogoSrc) {
  const fallback = defaultLogoSrc || "";
  const raw = pickSessionLogoRaw(sessionUser);
  if (!raw) return fallback;

  const proxyPath = toSameOriginPncImagePath(raw);
  if (proxyPath) return toLogoImgSrc(proxyPath);

  if (/pncapi\.kr/i.test(raw)) {
    return fallback;
  }

  if (/^https?:\/\//i.test(raw)) {
    return normalizeLogoUrlForPage(raw);
  }

  if (raw.startsWith("//")) {
    const fromProto = toSameOriginPncImagePath(`https:${raw}`);
    if (fromProto) return toLogoImgSrc(fromProto);
    if (/pncapi\.kr/i.test(raw)) return fallback;
    return normalizeLogoUrlForPage(`https:${raw}`);
  }

  if (/^\/image\//i.test(raw)) {
    return toLogoImgSrc(raw);
  }

  return raw.startsWith("/") ? raw : `/${raw.replace(/^\/+/, "")}`;
}

/**
 * 로고 img @error
 * - 로컬: /image 프록시 실패 → pncoffice.net 미러 1회 재시도
 * - 운영: 기본 로고 PNG
 */
export function handleLogoImgError(e, defaultLogoSrc) {
  const img = e?.target;
  if (!img || !defaultLogoSrc) return;

  const step = img.dataset.logoFallback || "";

  if (!isProductionBuild() && step === "") {
    try {
      const path = new URL(img.src, window.location.href).pathname;
      if (/^\/image\//i.test(path)) {
        img.dataset.logoFallback = "mirror";
        img.src = `${PNC_IMAGE_DEV_MIRROR_ORIGIN}${normalizePncImagePath(path)}`;
        return;
      }
    } catch {
      void 0;
    }
  }

  if (step === "final") return;
  img.dataset.logoFallback = "final";
  img.src = defaultLogoSrc;
}

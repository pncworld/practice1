/**
 * 모바일 화면 색 테마 (밝게 / 어둡게 / 휴대폰 설정 따라가기)
 * - 고른 값은 이 휴대폰(브라우저)에 저장되어 다음에 열어도 유지된다
 * - <html data-mtheme="dark|light"> 를 붙이고, 색은 mobileTheme.css 의 변수로 바뀐다
 */
import { ref } from "vue";

const KEY = "pnc-mobile-theme"; // "light" | "dark" | "system"
export const themeMode = ref("system");
export const isDark = ref(false);

let media = null;
let mediaHandler = null;

const readSaved = () => {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  } catch (e) {
    return "system";
  }
};

const systemDark = () => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {
    return false;
  }
};

const apply = (animate) => {
  const dark = themeMode.value === "dark" || (themeMode.value === "system" && systemDark());
  isDark.value = dark;
  const root = document.documentElement;
  if (animate) {
    root.classList.add("m-theme-switching");
    window.setTimeout(() => root.classList.remove("m-theme-switching"), 300);
  }
  root.setAttribute("data-mtheme", dark ? "dark" : "light");
  /* 주소창·상태표시줄 색 */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#131c2e" : "#ffffff");
};

/** 모바일 레이아웃이 열릴 때 한 번 호출 */
export const initMobileTheme = () => {
  themeMode.value = readSaved();
  apply(false);
  try {
    media = window.matchMedia("(prefers-color-scheme: dark)");
    mediaHandler = () => {
      if (themeMode.value === "system") apply(true);
    };
    media.addEventListener("change", mediaHandler);
  } catch (e) {
    media = null;
  }
};

/** 모바일 레이아웃을 떠날 때 (웹 화면으로 갈 때) 원래대로 */
export const disposeMobileTheme = () => {
  if (media && mediaHandler) media.removeEventListener("change", mediaHandler);
  media = null;
  mediaHandler = null;
  document.documentElement.removeAttribute("data-mtheme");
};

export const setThemeMode = (mode) => {
  themeMode.value = mode;
  try {
    window.localStorage.setItem(KEY, mode);
  } catch (e) {
    /* 저장이 막힌 환경: 이번 화면에서만 적용 */
  }
  apply(true);
};

/** 상단 버튼: 지금 보이는 반대로 바꾼다 (밝게 ↔ 어둡게) */
export const toggleTheme = () => {
  setThemeMode(isDark.value ? "light" : "dark");
};

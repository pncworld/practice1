/** 로그인 후 이 시간 동안 클릭·키·스크롤·터치가 없으면 로그아웃 */
const IDLE_MS = 5 * 60 * 60 * 1000;
const STAMP_KEY = "pncLastActivityAt";
const LOGOUT_KEY = "pncIdleLogout";
const TOUCH_GAP_MS = 60 * 1000;
const CHECK_MS = 60 * 1000;

export const IDLE_LOGOUT_MESSAGE =
  "일정시간 동안 사용이 없어 자동로그아웃 되었습니다.";

export function isIdleLogoutLanding() {
  return new URLSearchParams(window.location.search).get("idle") === "1";
}

function isLoggedIn(store) {
  const token = store.state.StoreToken;
  const user = store.state.userData;
  if (!token) return false;
  if (!user || Array.isArray(user)) return false;
  return true;
}

function loginPath() {
  const mobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  return mobile ? "/m?idle=1" : "/?idle=1";
}

export function startIdleLogout(store) {
  let lastWrite = 0;
  let loggingOut = false;

  const readStamp = () => {
    const n = Number(localStorage.getItem(STAMP_KEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const stamp = (force) => {
    if (!isLoggedIn(store)) return;
    const now = Date.now();
    if (!force && now - lastWrite < TOUCH_GAP_MS) return;
    lastWrite = now;
    localStorage.setItem(STAMP_KEY, String(now));
  };

  const logout = () => {
    if (loggingOut || !isLoggedIn(store)) return;
    loggingOut = true;
    localStorage.removeItem(STAMP_KEY);
    store.dispatch("logout");
    sessionStorage.clear();
    localStorage.setItem(LOGOUT_KEY, String(Date.now()));
    window.location.href = loginPath();
  };

  const check = () => {
    if (loggingOut || !isLoggedIn(store)) return;
    const at = readStamp();
    if (!at) {
      stamp(true);
      return;
    }
    if (Date.now() - at >= IDLE_MS) logout();
  };

  ["mousedown", "keydown", "touchstart", "scroll", "wheel"].forEach((name) => {
    window.addEventListener(name, () => stamp(false), {
      passive: true,
      capture: true,
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") check();
  });
  window.addEventListener("focus", check);
  window.addEventListener("storage", (e) => {
    if (e.key === LOGOUT_KEY && e.newValue) {
      window.location.href = loginPath();
    }
  });

  store.watch(
    (state) => state.StoreToken,
    (token, prev) => {
      if (token && token !== prev) stamp(true);
    }
  );

  if (isLoggedIn(store) && !readStamp()) stamp(true);
  check();
  window.setInterval(check, CHECK_MS);
}

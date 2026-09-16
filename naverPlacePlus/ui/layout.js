/**
 * 네이버 연동 화면 공통 레이아웃.
 * PNC Office (LoginView / component.css) 토큰에 맞춘다.
 */

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

const SHARED_CSS = `
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov.min.css");
:root {
  --primary: #2f80ed;
  --primary-dark: #0063c0;
  --primary-deep: #1a3c70;
  --gradient-primary: linear-gradient(90deg, #318cec 0%, #41b6e7 100%);
  --brand-bg: #f5f8fc;
  --tint-100: #f7f8fa;
  --tint-400: #eaf1fa;
  --gray-222: #222;
  --gray-666: #666;
  --gray-888: #888;
  --black-10: rgba(0,0,0,0.1);
  --black-20: rgba(0,0,0,0.2);
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Pretendard GOV Variable", "Pretendard GOV", -apple-system, BlinkMacSystemFont, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
  color: var(--gray-222);
  background: var(--brand-bg);
  letter-spacing: -0.3px;
}
.np-app {
  width: 100%;
  height: 100%;
  max-width: 1024px;
  max-height: 768px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.np-gradient {
  position: absolute; top: 0; left: 0; right: 0; height: 88px;
  background: var(--gradient-primary); z-index: 0;
}
.np-header {
  position: relative; z-index: 2;
  height: 52px; padding: 0 16px;
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;
}
.np-logo {
  height: 40px; padding: 4px 10px;
  background: #fff; border-radius: 8px;
  display: flex; align-items: center;
}
.np-logo img { height: 28px; width: auto; display: block; }
.np-header-title {
  color: #fff; font-size: 14px; font-weight: 600; opacity: 0.95;
  flex: 1;
}
.np-logout {
  color: #fff; font-size: 13px; font-weight: 600;
  text-decoration: none; opacity: 0.9; white-space: nowrap;
}
.np-logout:hover { opacity: 1; text-decoration: underline; }
.np-main {
  position: relative; z-index: 1;
  flex: 1; min-height: 0;
  width: 100%; max-width: 100%;
  margin: 0 auto; padding: 6px 12px 0;
  display: flex; flex-direction: column;
}
.np-main.is-wide { max-width: 100%; }
.np-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 14px 16px 16px;
  flex: 1; min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.np-page-head { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; flex-shrink: 0; }
.np-title-icon {
  width: 6px; height: 22px; margin-top: 2px; flex-shrink: 0;
  border-radius: 3px; background: var(--primary-dark);
}
.np-page-head h1 {
  margin: 0; font-size: 18px; font-weight: 700; line-height: 26px; color: #222;
}
.np-sub { margin: 2px 0 0; font-size: 13px; line-height: 18px; color: var(--gray-666); }
.np-footer {
  position: relative; z-index: 1;
  padding: 6px 12px 8px;
  text-align: center; font-size: 11px; color: rgba(0,0,0,0.45);
  flex-shrink: 0;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; padding: 0 16px;
  border: none; border-radius: 8px;
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: opacity 0.15s, background 0.15s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: var(--gray-222); color: #fff; }
.btn-primary:disabled, .btn-primary.is-disabled {
  background: #d0d1d5; color: #fff; cursor: not-allowed; opacity: 1;
}
.btn-accent { background: var(--primary-dark); color: #fff; }
.btn-accent:hover { background: #0056a6; opacity: 1; }
.btn-ghost {
  background: #fff; color: var(--gray-222); border: 1px solid var(--gray-222);
}
.btn-muted { background: #6b7280; color: #fff; }
.btn-row { display: flex; gap: 8px; flex-shrink: 0; }
.btn-row .btn { flex: 1; }
.btn-row .btn-ghost { flex: 0 0 110px; }
.notice-box {
  background: var(--tint-100); border-radius: 10px; padding: 12px 14px;
  font-size: 13px; line-height: 1.5; color: #555;
  flex: 1; min-height: 0; overflow: auto;
}
.notice-box dl { margin: 0; }
.notice-box .notice-title {
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 13px; color: #222; margin-bottom: 8px;
}
.notice-box .required {
  background: #ffe8e8; color: #c10000;
  font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 6px;
}
.notice-box .notice-lead { margin: 0 0 10px; font-size: 12px; line-height: 1.55; color: #444; }
.notice-box .notice-refuse {
  margin-top: 10px; padding-top: 8px; border-top: 1px solid #e6e8ec;
  font-size: 12px; line-height: 1.55; color: #444;
}
.notice-box dt { font-weight: 600; color: #333; margin-top: 8px; font-size: 12px; }
.notice-box dt:first-child { margin-top: 0; }
.notice-box dd { margin: 2px 0 0; }
.agree {
  display: flex; align-items: center; gap: 8px;
  margin: 12px 0 12px; font-size: 14px; cursor: pointer; user-select: none;
  flex-shrink: 0;
}
.agree input { width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer; }
.biz-table { width: 100%; border-collapse: collapse; }
.biz-table thead th {
  background: var(--tint-400);
  border-top: 1px solid var(--primary-deep);
  border-bottom: 1px solid #95999c;
  padding: 8px 8px; font-size: 12px; font-weight: 600; color: #222; text-align: left;
}
.biz-table td {
  border-bottom: 1px solid #eee; padding: 8px;
  font-size: 13px; vertical-align: middle;
}
.biz-table .biz-name { font-weight: 700; }
.badge {
  display: inline-block; margin-left: 6px;
  background: var(--tint-400); color: var(--primary-dark);
  font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 8px;
}
.muted { color: var(--gray-888); font-size: 13px; }
.empty { text-align: center; padding: 20px 8px 8px; color: var(--gray-666); }
.empty p { margin: 0 0 8px; }
.empty .btn { margin-top: 12px; min-width: 200px; }
.pager { display: flex; justify-content: space-between; margin-top: 12px; }
.pager a { color: var(--primary-dark); text-decoration: none; font-size: 13px; font-weight: 600; }
.lookup-bar {
  margin-top: 12px; background: var(--tint-100); border-radius: 8px;
  padding: 10px 12px; font-size: 12px; color: #555;
}
.lookup-bar a { color: var(--primary-dark); font-weight: 700; text-decoration: none; }
.biz-thumb-wrap {
  position: relative; width: 48px; height: 48px;
}
.biz-thumb-fallback {
  width: 48px; height: 48px; border-radius: 8px;
  background: var(--tint-400); color: var(--primary-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700;
}
.biz-thumb {
  position: absolute; top: 0; left: 0;
  width: 48px; height: 48px; min-width: 48px; max-width: 48px;
  border-radius: 8px; object-fit: cover; background: #f1f1f1; display: block;
}
.biz-table td:first-child { width: 64px; }
.biz-table .btn { height: 36px; padding: 0 14px; font-size: 13px; border-radius: 5px; }
.biz-table form { margin: 0; }
.msg { font-size: 15px; line-height: 24px; color: #444; margin: 0 0 8px; }
.msg-detail {
  margin-top: 16px; padding: 12px 14px; background: var(--tint-100);
  border-radius: 8px; font-size: 12px; color: #888; word-break: break-all;
}
.actions-after { margin-top: 16px; }
@media (max-width: 640px) {
  .np-header { padding: 0 12px; }
  .np-card { padding: 12px 12px 14px; }
  .btn-row { flex-direction: column; }
  .btn-row .btn-ghost { flex: 1; }
}
`;

function renderLayout({
  title,
  heading,
  subtitle = "",
  body,
  wide = false,
  extraScript = "",
  showLogout = false,
  logoutHref = "/naver/start",
}) {
  const subHtml = subtitle ? `<p class="np-sub">${escapeHtml(subtitle)}</p>` : "";
  const headHtml = heading
    ? `<div class="np-page-head">
        <div class="np-title-icon"></div>
        <div>
          <h1>${escapeHtml(heading)}</h1>
          ${subHtml}
        </div>
      </div>`
    : "";
  const logoutHtml = showLogout
    ? `<a class="np-logout" href="/naver/start">로그아웃</a>`
    : "";
  const logoutScript = showLogout
    ? `<script>
(function () {
  var a = document.querySelector(".np-logout");
  if (!a) return;
  a.addEventListener("click", function (e) {
    e.preventDefault();
    try { sessionStorage.setItem("np_close_naver_logout", "1"); } catch (err) {}
    window.open("https://nid.naver.com/nidlogin.logout", "np_naver_logout");
    location.replace("/naver/start");
  });
})();
</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1024, height=768, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>${escapeHtml(title)} · pncoffice</title>
  <link rel="icon" href="/favicon.png" />
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="np-app">
    <div class="np-gradient"></div>
    <header class="np-header">
      <div class="np-logo"><img src="/naver/assets/pncoffice_logo.png" alt="PNC Office" /></div>
      <div class="np-header-title">네이버 스마트플레이스 연동</div>
      ${logoutHtml}
    </header>
    <main class="np-main${wide ? " is-wide" : ""}">
      <div class="np-card">
        ${headHtml}
        ${body}
      </div>
    </main>
    <footer class="np-footer">Copyright©1997 PnCworld ALL RIGHT RESERVED.</footer>
  </div>
  ${extraScript}
  ${logoutScript}
</body>
</html>`;
}

module.exports = { escapeHtml, renderLayout };

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
  min-height: 100%;
  font-family: "Pretendard GOV Variable", "Pretendard GOV", -apple-system, BlinkMacSystemFont, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
  color: var(--gray-222);
  background: var(--brand-bg);
  letter-spacing: -0.3px;
}
.np-app { min-height: 100vh; display: flex; flex-direction: column; position: relative; }
.np-gradient {
  position: absolute; top: 0; left: 0; right: 0; height: 196px;
  background: var(--gradient-primary); z-index: 0;
}
.np-header {
  position: relative; z-index: 2;
  height: 80px; padding: 0 32px;
  display: flex; align-items: center; gap: 16px;
}
.np-logo {
  height: 48px; padding: 0 14px;
  background: #fff; border-radius: 10px;
  display: flex; align-items: center;
  font-size: 18px; font-weight: 800; color: var(--primary-deep);
  letter-spacing: -0.6px;
}
.np-logo span { color: var(--primary); }
.np-header-title {
  color: #fff; font-size: 16px; font-weight: 600; opacity: 0.95;
}
.np-main {
  position: relative; z-index: 1;
  flex: 1; width: 100%; max-width: 560px;
  margin: 0 auto; padding: 8px 20px 40px;
}
.np-main.is-wide { max-width: 840px; }
.np-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  padding: 36px 40px 40px;
}
.np-page-head { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 24px; }
.np-title-icon {
  width: 8px; height: 28px; margin-top: 2px; flex-shrink: 0;
  border-radius: 4px; background: var(--primary-dark);
}
.np-page-head h1 {
  margin: 0; font-size: 22px; font-weight: 700; line-height: 32px; color: #222;
}
.np-sub { margin: 4px 0 0; font-size: 14px; line-height: 22px; color: var(--gray-666); }
.np-footer {
  position: relative; z-index: 1;
  padding: 16px 20px 28px;
  text-align: center; font-size: 12px; color: rgba(0,0,0,0.45);
}
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 48px; padding: 0 22px;
  border: none; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: inherit;
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
.btn-row { display: flex; gap: 8px; }
.btn-row .btn { flex: 1; }
.btn-row .btn-ghost { flex: 0 0 110px; }
.notice-box {
  background: var(--tint-100); border-radius: 12px; padding: 18px 20px;
  font-size: 14px; line-height: 1.65; color: #555;
}
.notice-box .notice-title {
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 14px; color: #222; margin-bottom: 12px;
}
.notice-box .required {
  background: #ffe8e8; color: #c10000;
  font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 6px;
}
.notice-box dl { margin: 0; }
.notice-box dt { font-weight: 600; color: #333; margin-top: 10px; font-size: 13px; }
.notice-box dt:first-child { margin-top: 0; }
.notice-box dd { margin: 2px 0 0; }
.agree {
  display: flex; align-items: center; gap: 10px;
  margin: 18px 0 22px; font-size: 15px; cursor: pointer; user-select: none;
}
.agree input { width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer; }
.biz-table { width: 100%; border-collapse: collapse; }
.biz-table thead th {
  background: var(--tint-400);
  border-top: 1px solid var(--primary-deep);
  border-bottom: 1px solid #95999c;
  padding: 12px 10px; font-size: 13px; font-weight: 600; color: #222; text-align: left;
}
.biz-table td {
  border-bottom: 1px solid #eee; padding: 14px 10px;
  font-size: 14px; vertical-align: middle;
}
.biz-table .biz-name { font-weight: 700; }
.badge {
  display: inline-block; margin-left: 6px;
  background: var(--tint-400); color: var(--primary-dark);
  font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 8px;
}
.muted { color: var(--gray-888); font-size: 13px; }
.empty { text-align: center; padding: 36px 8px 8px; color: var(--gray-666); }
.empty p { margin: 0 0 8px; }
.empty .btn { margin-top: 20px; min-width: 240px; }
.pager { display: flex; justify-content: space-between; margin-top: 20px; }
.pager a { color: var(--primary-dark); text-decoration: none; font-size: 14px; font-weight: 600; }
.lookup-bar {
  margin-top: 20px; background: var(--tint-100); border-radius: 10px;
  padding: 14px 16px; font-size: 13px; color: #555;
}
.lookup-bar a { color: var(--primary-dark); font-weight: 700; text-decoration: none; }
.biz-thumb {
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
.actions-after { margin-top: 28px; }
@media (max-width: 640px) {
  .np-header { padding: 0 16px; }
  .np-card { padding: 24px 20px 28px; }
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

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · pncoffice</title>
  <link rel="icon" href="/favicon.png" />
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="np-app">
    <div class="np-gradient"></div>
    <header class="np-header">
      <div class="np-logo">pnc<span>office</span></div>
      <div class="np-header-title">네이버 스마트플레이스 연동</div>
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
</body>
</html>`;
}

module.exports = { escapeHtml, renderLayout };

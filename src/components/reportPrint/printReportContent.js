/**
 * 레포트 인쇄 — 메인 레이아웃과 분리된 iframe에서만 출력.
 */
import { PO_PRINT_FRAME_CSS, PO_SHEET_CSS } from "./poSheetStyles";

/**
 * @param {HTMLElement} contentEl  .rp-shell__body
 */
export function printReportContent(contentEl) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!contentEl) {
    console.error("[printReportContent] contentEl 없음");
    return;
  }

  const html = contentEl.innerHTML;
  if (!String(html || "").trim()) {
    console.error("[printReportContent] 인쇄 HTML 비어 있음");
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "report-print");
  iframe.setAttribute("aria-hidden", "true");
  Object.assign(iframe.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }

  const css = `${PO_PRINT_FRAME_CSS}\n${PO_SHEET_CSS}`;

  doc.open();
  doc.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>인쇄</title><style>${css}</style></head><body>${html}</body></html>`,
  );
  doc.close();

  const win = iframe.contentWindow;
  const cleanup = () => {
    try {
      iframe.remove();
    } catch (_) {
      /* ignore */
    }
  };

  const run = () => {
    try {
      win.focus();
      win.print();
    } catch (e) {
      console.error("[printReportContent]", e);
    }
    win.addEventListener?.("afterprint", cleanup);
    window.setTimeout(cleanup, 60_000);
  };

  window.setTimeout(run, 300);
}

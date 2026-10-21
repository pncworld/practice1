/**
 * 일일 정산 레포트(SLS02_017) 인쇄 시트 — 미리보기·iframe 공통 CSS
 */
export const SLS0217_SHEET_CSS = `
.sls0217-sheet {
  box-sizing: border-box;
  width: 100%;
  font-family: "Malgun Gothic", "맑은 고딕", sans-serif;
  color: #111;
}
.sls0217-sheet__title-box {
  text-align: center;
  margin: 0 0 6px;
  padding: 4px 0 6px;
  border-bottom: 2px solid #1a3c70;
}
.sls0217-sheet__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #1a3c70;
}
.sls0217-sheet__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}
.sls0217-sheet__meta-item {
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
}
.sls0217-sheet__meta-k {
  color: #1a3c70;
}
.sls0217-sheet__sec {
  margin: 0 0 10px;
}
.sls0217-sheet__sec-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
  font-size: 12.5px;
  font-weight: 700;
  color: #1a3c70;
}
.sls0217-sheet__sec-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 0.95em;
  border-radius: 1px;
  background: #2563eb;
}
.sls0217-sheet__cont {
  margin-left: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}
.sls0217-sheet__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 10.5px;
}
.sls0217-sheet__table th,
.sls0217-sheet__table td {
  border: 1px solid #334155;
  padding: 3px 4px;
  vertical-align: middle;
  word-break: break-all;
}
.sls0217-sheet__table th {
  background: #e2e8f0;
  font-weight: 700;
  text-align: center;
  color: #0f172a;
}
.sls0217-sheet__table td.is-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.sls0217-sheet__table td.is-center {
  text-align: center;
}
.sls0217-sheet__table td.is-left {
  text-align: left;
}
.sls0217-sheet__empty {
  margin: 0;
  padding: 6px 4px;
  font-size: 11px;
  color: #64748b;
}
`;

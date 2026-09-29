/**
 * 발주서 시트 — 미리보기·iframe 인쇄 공통
 * 시인성 우선(60대 기준): 큰 글자·넉넉한 셀·고대비 / 자재명 말줄임 없이 줄바꿈
 */
export const PO_SHEET_CSS = `
.po-sheet {
  box-sizing: border-box;
  width: 100%;
  color: #000;
  font-size: 13px;
  line-height: 1.4;
  font-family: "Batang", "바탕", "Malgun Gothic", "맑은 고딕", serif;
  /* 매장 철·스테이플(상단 제본) 여유 — 살짝 축소해 본문 공간 확보 */
  padding-top: 5mm;
}
.po-sheet__title-box {
  margin: 0 auto 8px;
  width: fit-content;
  min-width: 220px;
  min-height: 44px;
  padding: 10px 36px;
  border: 4px double #000;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.po-sheet__title {
  margin: 0;
  padding: 0;
  /* letter-spacing 시각적 쏠림 보정 → 가운데 정렬 */
  padding-left: 0.45em;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.45em;
  text-align: center;
  font-family: "Batang", "바탕", serif;
  line-height: 1.2;
  width: 100%;
}
.po-sheet__top-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px 16px;
  margin-bottom: 8px;
}
.po-sheet__top-item {
  display: flex;
  gap: 10px;
  align-items: baseline;
  border-bottom: none;
  padding: 4px 2px;
  min-width: 0;
  font-size: 14px;
}
.po-sheet__top-item:nth-child(1) {
  justify-content: flex-start;
  text-align: left;
}
.po-sheet__top-item:nth-child(2) {
  justify-content: center;
  text-align: center;
}
.po-sheet__top-item:nth-child(3) {
  justify-content: flex-end;
  text-align: right;
}
.po-sheet__mark {
  display: inline-block;
  margin-right: 3px;
  font-size: 14px;
  line-height: 1;
  color: #000;
}
.po-sheet__cont {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  color: #000;
}
/* 2장~ 상단: 강조 최소화, 3등분 (전표 가운데) */
.po-sheet__cont-bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  column-gap: 12px;
  margin: 0 0 10px;
  padding: 6px 10px;
  border: 1px solid #94a3b8;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
}
.po-sheet__cont-cell {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 8px;
  min-width: 0;
  border-bottom: none;
  padding: 0;
}
.po-sheet__cont-cell--center {
  justify-content: center;
  text-align: center;
}
.po-sheet__cont-cell--end {
  justify-content: flex-end;
  text-align: right;
}
.po-sheet__cont-k {
  flex-shrink: 0;
  font-weight: 600;
}
.po-sheet__cont-v {
  min-width: 0;
  word-break: break-all;
  font-weight: 500;
}
.po-sheet__cont-page {
  flex-shrink: 0;
  margin-left: 0;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.po-sheet__cont-title {
  margin-right: 4px;
}
.po-sheet__k {
  flex-shrink: 0;
  font-weight: 800;
  color: #000;
  font-size: 14px;
}
.po-sheet__v {
  min-width: 0;
  word-break: break-all;
  font-size: 15px;
  font-weight: 700;
}

/* 수신처·발주처 — Crystal 4행 압축 (매 장 반복), 폰트=발주내역과 동일 */
.po-sheet__party-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 8px;
  font-size: 12.5px;
}
.po-sheet__party-table th,
.po-sheet__party-table td {
  border: 1px solid #000;
  padding: 4px 5px;
  vertical-align: middle;
  line-height: 1.35;
}
.po-party-lbl { width: 9%; }
.po-party-val { width: 16%; }
.po-party-hd {
  text-align: center !important;
  font-weight: 800;
  background: #d0d0d0;
  letter-spacing: 0.35em;
  padding: 5px 4px !important;
  font-size: 13px !important;
  height: auto !important;
  min-height: 0 !important;
}
.po-sheet__party-table th:not(.po-party-hd) {
  text-align: center;
  font-weight: 700;
  background: #e8eef7;
  white-space: nowrap;
  font-size: 13px;
}
/*
 * 데이터 행: Crystal처럼 항상 약 2줄 높이.
 * 테이블 td height는 무시되는 경우가 많아 내부 .po-party-cell min-height로 확보.
 */
.po-sheet__party-table tbody th,
.po-sheet__party-table tbody td {
  box-sizing: border-box;
  padding: 3px 5px;
  vertical-align: middle;
}
.po-sheet__party-table td {
  font-size: 12.5px;
  font-weight: 600;
}
.po-sheet__party-table .po-party-cell {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 2.6em;
  line-height: 1.3;
  white-space: normal;
  word-break: break-all;
  overflow-wrap: anywhere;
}

/* 품목 표 */
.po-sheet__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12.5px;
}
.po-sheet__table th,
.po-sheet__table td {
  border: 1.5px solid #000;
  padding: 6px 5px;
  vertical-align: middle;
  line-height: 1.4;
}
.po-sheet__table th {
  background: #dbe4f0;
  font-weight: 800;
  text-align: center !important;
  white-space: nowrap;
  padding: 8px 4px;
  font-size: 13px;
}

col.po-col-code,
.po-col-code {
  width: 8%;
}
th.po-col-code {
  text-align: center !important;
}
td.po-col-code {
  text-align: center;
  white-space: nowrap;
  word-break: keep-all;
  font-size: 13px;
  font-weight: 600;
  padding-left: 2px !important;
  padding-right: 2px !important;
}

col.po-col-name,
.po-col-name {
  width: 40%;
}
th.po-col-name {
  text-align: center !important;
}
td.po-col-name {
  /* 출력: 한 줄 + 넘치면 ... */
  text-align: left !important;
  max-width: 0;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  font-size: 13px;
  font-weight: 600;
}
td.po-col-name .po-name-text {
  display: block;
  max-width: 100%;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
}

col.po-col-unit,
.po-col-unit {
  width: 7%;
}
th.po-col-unit {
  text-align: center !important;
}
td.po-col-unit,
th.po-col-unit {
  text-align: center;
  white-space: nowrap;
  font-size: 13px;
  padding-left: 3px !important;
  padding-right: 3px !important;
}

col.po-col-qty,
.po-col-qty {
  width: 6%;
}
td.po-col-qty,
th.po-col-qty {
  text-align: right;
  white-space: nowrap !important;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 700;
}

col.po-col-price,
.po-col-price,
col.po-col-amt,
.po-col-amt {
  width: 9.75%;
}
td.po-col-price,
th.po-col-price,
td.po-col-amt,
th.po-col-amt {
  text-align: right;
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow: visible;
  font-variant-numeric: tabular-nums;
  font-size: 12.5px;
  font-weight: 700;
  padding-left: 2px !important;
  padding-right: 4px !important;
}

.po-sheet__sum-label {
  text-align: center;
  font-weight: 800;
  background: #e8eef7;
  font-size: 14px;
}
.po-sheet__empty-line {
  text-align: center;
  color: #444;
  padding: 16px 8px !important;
  font-size: 13px;
}
.po-sheet__comments {
  margin-top: 12px;
  border: 2px solid #000;
}
.po-sheet__comments-hd {
  padding: 7px 10px;
  text-align: center;
  font-weight: 800;
  border-bottom: 1.5px solid #000;
  background: #e8eef7;
  font-size: 14px;
}
.po-sheet__comments-bd {
  min-height: 56px;
  padding: 10px 12px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
}
`;

/** 인쇄 iframe 전용 */
export const PO_PRINT_FRAME_CSS = `
@page {
  size: A4 portrait;
  /* 상단 제본 여유 유지, 하단은 품목·인쇄일자에 양보 */
  margin: 10mm 7mm 6mm 7mm;
}
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #fff !important;
  color: #000 !important;
  width: auto !important;
  height: auto !important;
  overflow: visible !important;
  font-family: "Batang", "바탕", "Malgun Gothic", "맑은 고딕", serif;
}
.rp-shell__body {
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  background: #fff !important;
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
}
.rp-page {
  box-sizing: border-box;
  display: flex !important;
  flex-direction: column !important;
  width: 210mm !important;
  max-width: 210mm !important;
  /* 미리보기와 동일 — A4 한 장 높이 확보 후 푸터 margin-top:auto 하단 고정 */
  min-height: 281mm !important;
  height: auto !important;
  margin: 0 auto !important;
  padding: 2mm 0 1mm !important;
  background: #fff !important;
  color: #000 !important;
  box-shadow: none !important;
  page-break-after: always;
  break-after: page;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.rp-page:last-child {
  page-break-after: auto;
  break-after: auto;
}
.rp-page > .po-sheet {
  flex: 1 1 auto;
  min-height: 0;
}
.rp-page__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-top: auto !important;
  padding-top: 4px;
  padding-bottom: 0;
  border-top: 2px solid #000;
  font-size: 12px;
  font-weight: 700;
  color: #000;
}
.rp-page__footer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
}
.rp-page__footer-page {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  font-size: 13px;
}
.rp-no-print,
.rp-shell__hd,
.rp-shell__loading,
.rp-shell__empty {
  display: none !important;
}
.po-sheet__party-table th,
.po-sheet__party-table td,
.po-sheet__table th,
.po-sheet__table td,
.po-sheet__comments,
.po-sheet__comments-hd {
  border-color: #000 !important;
}
`;

/**
 * 모바일 메뉴 저장: 웹 메뉴코드등록(MST01_003INS) 저장과 같은 saveMenuCode 를 메뉴 1건으로 부른다.
 * 웹은 그리드 행의 값을 컬럼 순서대로 보내므로, 여기서도 행 객체의 같은 컬럼을 같은 순서로 보낸다.
 * - 신규: newMenuRow() 기본값(웹 addRow 기본값과 같음)에 메뉴명·판매가·분류·코드를 넣어 보낸다
 * - 수정: 조회한 행(getMenuCodeEnroll MENULIST) 전체에서 바꾼 항목만 바꿔 보낸다 (나머지 값은 그대로 유지)
 */
import { saveMenuCode } from "@/api/master";
import { assertApiSuccess, normalizeSoldOutYn } from "@/customFunc/customFunc";

// saveMenuCode 인자 순서 (웹 saveButton 과 같음)
const SAVE_COLUMNS = [
  "lngMainGroup",
  "lngSubGroup",
  "lngCode",
  "dtmFromDate",
  "dtmToDate",
  "strName",
  "strNameE",
  "lngDCPrice",
  "lngChain",
  "lngPrice",
  "blnDCPriceYN",
  "lngTax",
  "blnInactive",
  "lngDiscount",
  "intCustCount",
  "blnCondimentprice",
  "lngOrder",
  "lngKPG",
  "strBarCode",
  "blnReceipt",
  "lngMenuOption",
  "blnFloat",
  "strIcon",
  "blnKitSingle",
  "lngSubTitle",
  "blnServing",
  "blnOpen",
  "blnDeliveryYN",
  "blnSoldOutYN",
  "strNutrInfo",
  "strCntryOrg",
  "strMenuComment",
  "strUserFileName",
  "lngType",
  "dtmStart",
  "dtmEnd",
  "lngKDS",
  "strNameK",
  "discountYN",
  "strBigo",
];

/** 신규 메뉴 기본값 (웹 addRow 기본값) */
export const newMenuRow = (values) => ({
  dtmFromDate: new Date().toLocaleDateString("en-CA"),
  dtmToDate: "9999-12-31",
  lngPrice: "0",
  lngTax: "0",
  blnInactive: "0",
  lngDCPrice: "0",
  lngChain: "",
  blnDCPriceYN: "0",
  lngDiscount: "0",
  intCustCount: "0",
  lngOrder: "0",
  lngKPG: "1",
  blnReceipt: "0",
  lngMenuOption: "0",
  blnFloat: "0",
  strIcon: "",
  blnKitSingle: "0",
  lngSubTitle: "",
  blnServing: "0",
  blnOpen: "0",
  blnDeliveryYN: "0",
  blnSoldOutYN: "0",
  ...values,
});

// 조회 결과의 적용기간은 서버 문자열(예: '2025-01-02 오전 12:00:00')이라 신규 등록과 같은 'YYYY-MM-DD' 로 맞춘다
const toDateText = (v) => {
  const m = String(v ?? "").match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` : v;
};

/** 메뉴 1건 저장 (실패하면 예외) */
export const saveMenuRow = async (groupCd, storeCd, row) => {
  const values = SAVE_COLUMNS.map((key) => {
    const v = row[key];
    if (key === "blnSoldOutYN") return normalizeSoldOutYn(v, "0");
    if (key === "dtmFromDate" || key === "dtmToDate") return toDateText(v);
    return v === undefined || v === null ? "" : v;
  });
  // 마지막 두 인자: 메뉴코드 자동 채번 안 함(0), 삭제할 메뉴 없음
  const res = await saveMenuCode(groupCd, storeCd, ...values, 0, "");
  assertApiSuccess(res, "메뉴 저장에 실패했습니다.");
};

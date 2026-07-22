import { saveLoginLog, savePageLog } from "@/api/common";
import store from "@/store";

export function formatLocalDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLocalDate4(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}_${month}_${day}`;
}

export function formatLocalDate2(date) {
  if (!date) return "";

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekDays[date.getDay()];
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} (${weekday})`;
}

export function formatLocalDate3(date) {
  if (!date) return "";

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekDays[date.getDay()];
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일  ${weekday}요일`;
}

export function formatDateTime(date) {
  const options = {
    timeZone: "Asia/Seoul", // 한국 시간대 설정
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24시간제로 표시하고 싶을 때
  };
  if (!date) return "";
  const koreanDateTime = date.toLocaleString("ko-KR", options);
  return koreanDateTime;
}
export function formatTime(date) {
  if (!date) return "";
  const options = {
    timeZone: "Asia/Seoul", // 한국 시간대 설정
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간제로 표시
  };

  // toLocaleTimeString은 기본적으로 "HH:MM" 형태로 반환함
  const timeString = date.toLocaleTimeString("ko-KR", options);
  return timeString; //
}

export function formatDateTime2(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더합니다.
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateTime3(date) {
  if (!date) return "";

  const options = {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Intl.DateTimeFormat으로 한국 시간 문자열 얻기
  const formatter = new Intl.DateTimeFormat("ko-KR", options);
  const parts = formatter.formatToParts(date);

  // 필요한 부분만 뽑아서 YYYY-MM-DD HH:mm:ss 형태로
  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;
  const hour = parts.find((p) => p.type === "hour").value;
  const minute = parts.find((p) => p.type === "minute").value;
  const second = parts.find((p) => p.type === "second").value;

  return `${year}년${month}월${day}일 ${hour}시${minute}분${second}초`;
}

// const dateString = '2025 02 20 18:05:34';
// const formattedDate = formatDate(dateString);
// //comsole.log(formattedDate); // 출력: 2025-02-20 18:05:34

export function excelTitle(target) {
  const first = target.strMajorName;
  const second = target.strSubName;
  const third = target.strTitle;

  return `${first}-${second}-${third}`;
}
export function excelSerialDateToJSDate(serial) {
  const baseDate = new Date(1899, 11, 31); // 1900년 1월 0일 (엑셀의 기준일 이전 날짜)
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysToAdd = serial; // 엑셀은 1부터 시작
  return new Date(baseDate.getTime() + daysToAdd * millisecondsPerDay)
    .toISOString()
    .split("T")[0];
}

export async function insertPageLog(progdata) {
  if (!progdata?.strUrl || typeof progdata.strUrl !== "string") {
    return "";
  }
  //const store = useStore()
  const currenttime = new Date();
  const inserttime = formatDateTime2(currenttime);
  const userGroup = store.state.userData.lngCompanyCode;
  const userStoreCd = store.state.userData.lngPosition;
  const userId = store.state.userData.lngSequence;
  let userIp = "0.0.0.0"; // 기본값

  const userip = async () => {
    try {
      const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
      const data = await result.text();
      userIp = data;
    } catch (err) {
      //console.warn("IP 가져오기 실패:", err);
      // userIp는 기본값 유지
    }
  };

  await userip();
  //comsole.log("내 IP:", userIp);

  const progname = progdata.strUrl.split("::")[1].split(".xml")[0];
  const progid = progdata.lngProgramID.split("_")[0];

  // //comsole.log(inserttime);
  // //comsole.log(userGroup);
  // //comsole.log(userStoreCd);
  // //comsole.log(userId);
  // //comsole.log(progname);
  // //comsole.log(progid);
  const res = await savePageLog(
    inserttime,
    userGroup,
    userStoreCd,
    userId,
    userIp,
    progname,
    progid,
    1
  );
  //comsole.log(res);
  return ``;
}

export async function insertPageLog2(
  page,
  lngStoreGroup,
  lngStoreCode,
  userid
) {
  //const store = useStore()
  const currenttime = new Date();
  const inserttime = formatDateTime2(currenttime);
  const userGroup = lngStoreGroup;
  const userStoreCd = lngStoreCode;
  const userId = userid;
  let userIp = "0.0.0.0"; // 기본값

  const userip = async () => {
    try {
      const result = await fetch("https://api64.ipify.org", { timeout: 3000 });
      const data = await result.text();
      userIp = data;
    } catch (err) {
      //console.warn("IP 가져오기 실패:", err);
      // userIp는 기본값 유지
    }
  };

  await userip();

  const progname = page.split(".xml")[0];
  const progid = "0";

  const res = await savePageLog(
    inserttime,
    userGroup,
    userStoreCd,
    userId,
    userIp,
    progname,
    progid,
    1
  );

  return ``;
}

export async function insertMobilePageLog(progdata) {
  //const store = useStore()
  const currenttime = new Date();
  const inserttime = formatDateTime2(currenttime);

  //comsole.log(store);
  const userGroup = store.state.userData.GROUP_CD;
  const userStoreCd = store.state.userData.STORE_CD;
  const userId = store.state.userData.USER_NO;
  let userIp = "MOBILE_APP";
  // const userip = async () => {
  //   const result = await fetch("https://api64.ipify.org?format=json");
  //   const data = await result.json();
  //   userIp = data.ip;
  // };
  // await userip();
  const progname = progdata.strUrl;
  const progid = progdata.lngProgramID;

  const res = await savePageLog(
    inserttime,
    userGroup,
    userStoreCd,
    userId,
    userIp,
    progname,
    progid,
    2
  );
  //console.log(res);
  return ``;
}

export async function insertLoginLog(id, pw, group, storecd) {
  //const store = useStore()
  const currenttime = new Date();
  const inserttime = formatDateTime2(currenttime);

  //comsole.log(store);
  // const userGroup = store.state.userData.GROUP_CD;
  // const userStoreCd = store.state.userData.STORE_CD;
  // //console.log(userGroup);
  // //console.log(userStoreCd);
  //const userId = store.state.userData.USER_NO;
  let userIp = "";
  const userip = async () => {
    const result = await fetch("https://api64.ipify.org?format=json");
    const data = await result.json();
    userIp = data.ip;
  };
  await userip();

  const res = await saveLoginLog(
    inserttime,
    group,
    storecd,
    id,
    pw,
    userIp,
    "01",
    1
  );
  //console.log(res);
  return ``;
}

// export async function insertMobileLoginLog(id, pw, group, storecd) {
//   //const store = useStore()
//   const currenttime = new Date();
//   const inserttime = formatDateTime2(currenttime);

//   //comsole.log(store);
//   // const userGroup = store.state.userData.GROUP_CD;
//   // const userStoreCd = store.state.userData.STORE_CD;
//   // const userId = store.state.userData.USER_NO;
//   let userIp = "MOBILE";
//   // const userip = async () => {
//   //   const result = await fetch("https://api64.ipify.org?format=json");
//   //   const data = await result.json();
//   //   userIp = data.ip;
//   // };
//   // await userip();

//   const res = await saveLoginLog(
//     inserttime,
//     group,
//     storecd,
//     id,
//     pw,
//     userIp,
//     "01",
//     2
//   );
//   //console.log(res);
//   return ``;
// }

export function formatNumberWithCommas(number) {
  // if (typeof number !== 'number') return number; // 숫자가 아닐 경우 그대로 반환
  return new Intl.NumberFormat().format(Number(number)); // 천 단위로 구분한 숫자 포맷
}

/** 메뉴재고 품절(blnSoldOutYN) — API True/False, 0/1 등을 라디오용 "0"|"1"로 통일 */
export function normalizeSoldOutYn(value, defaultValue = "0") {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (value === true || value === 1) return "1";
  if (value === false || value === 0) return "0";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "1" || normalized === "true") return "1";
  if (normalized === "0" || normalized === "false") return "0";
  return defaultValue;
}

export function normalizeMenuListSoldOutYn(list) {
  return (list ?? []).map((row) => ({
    ...row,
    blnSoldOutYN: normalizeSoldOutYn(row.blnSoldOutYN),
  }));
}

export function getApiResultPayload(response) {
  const data = response?.data;
  if (data == null) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

export function getApiResultCd(response) {
  const payload = getApiResultPayload(response);
  if (payload == null) return "";
  return String(payload.RESULT_CD ?? "").trim();
}

export function assertApiSuccess(
  response,
  defaultMessage = "요청에 실패했습니다."
) {
  const resultCd = getApiResultCd(response);
  if (resultCd && resultCd !== "00") {
    const payload = getApiResultPayload(response);
    throw new Error(payload?.RESULT_NM || defaultMessage);
  }
}

/** 메뉴코드등록(MST01_003/033INS) 저장 시 첫 번째 미입력 필수 항목 라벨 반환 */
function isMenuNameMissing(value) {
  return value === "" || value === undefined || value === null || String(value).trim() === "";
}

export function findFirstMissingMenuCodeRequiredLabel(rows, isNewAutoMenuCode) {
  const checks = [
    {
      label: "메뉴분류",
      isMissing: (item) =>
        item.lngMainGroup === undefined ||
        item.lngMainGroup == 0 ||
        item.lngSubGroup === undefined ||
        item.lngSubGroup == 0,
    },
    {
      label: "메뉴코드",
      isMissing: (item) => {
        if (isNewAutoMenuCode) {
          return false;
        }
        return item.lngCode === "" || item.lngCode === undefined;
      },
    },
    {
      label: "메뉴명",
      isMissing: (item) => isMenuNameMissing(item.strName),
    },
    {
      label: "유효기간",
      isMissing: (item) =>
        item.dtmToDate === undefined || item.dtmFromDate === undefined,
    },
    {
      label: "판매가",
      isMissing: (item) => item.lngPrice === undefined,
    },
    {
      label: "사용여부",
      isMissing: (item) => item.blnInactive === undefined,
    },
    {
      label: "과세구분",
      isMissing: (item) => item.lngTax === undefined,
    },
    {
      label: "주메뉴종속",
      isMissing: (item) => item.lngKPG === "",
    },
  ];

  for (const item of rows ?? []) {
    for (const check of checks) {
      if (check.isMissing(item)) {
        return check.label;
      }
    }
  }
  return null;
}

/** saveMenuCode 전송 필드 — 실제 변경 여부 비교용 (003/033 공통 + 화면별 필드) */
const MENU_CODE_ROW_COMPARE_KEYS = [
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
  "blnRedPrint",
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
  "strAmtCodeList",
];

function normalizeMenuCodeRowCompareValue(key, value) {
  if (value === undefined || value === null) {
    return "";
  }
  if (key === "blnSoldOutYN") {
    return normalizeSoldOutYn(value);
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  if (typeof value === "number") {
    return String(value);
  }
  return String(value).trim();
}

/** 조회 시점(confirmData) 대비 실제 값이 바뀐 updated 행인지 */
export function isMenuCodeRowActuallyChanged(current, original) {
  if (!current) {
    return false;
  }
  if (!original) {
    return true;
  }
  for (const key of MENU_CODE_ROW_COMPARE_KEYS) {
    if (
      normalizeMenuCodeRowCompareValue(key, current[key]) !==
      normalizeMenuCodeRowCompareValue(key, original[key])
    ) {
      return true;
    }
  }
  return false;
}

/** created 전부 + 실제 변경된 updated만 저장 대상 인덱스로 반환 */
export function getMenuCodeRowIndicesToSave(allRows, stateIndexes, originalRows) {
  const created = stateIndexes?.created ?? [];
  const updated = stateIndexes?.updated ?? [];
  const indices = [
    ...created,
    ...updated.filter((index) =>
      isMenuCodeRowActuallyChanged(allRows?.[index], originalRows?.[index])
    ),
  ];
  return [...new Set(indices)].sort((a, b) => a - b);
}

export function getMenuCodeRowsToSave(allRows, stateIndexes, originalRows) {
  return getMenuCodeRowIndicesToSave(allRows, stateIndexes, originalRows).map(
    (index) => allRows[index]
  );
}

/** 저장 대상 중 updated 행의 메뉴명 미입력 — 기존 경고 Swal용 문구 */
export function getUpdatedRowsMissingMenuNameSwalText(
  allRows,
  saveIndices,
  stateIndexes
) {
  const updatedSet = new Set(stateIndexes?.updated ?? []);
  const menuCodes = [];

  for (const index of saveIndices ?? []) {
    if (!updatedSet.has(index)) {
      continue;
    }
    const row = allRows?.[index];
    if (!row || !isMenuNameMissing(row.strName)) {
      continue;
    }
    const code = row.lngCode;
    menuCodes.push(
      code !== "" && code !== undefined && code !== null
        ? String(code)
        : "미지정"
    );
  }

  if (menuCodes.length === 0) {
    return null;
  }

  return `메뉴명 항목이 미입력 되어 있습니다.\n (메뉴명 미등록 메뉴코드: ${menuCodes.join(", ")}) `;
}

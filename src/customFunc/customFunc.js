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

function formatDateTime2(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더합니다.
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  //const store = useStore()
  const currenttime = new Date();
  const inserttime = formatDateTime2(currenttime);
  const userGroup = store.state.userData.lngCompanyCode;
  const userStoreCd = store.state.userData.lngChargerCode;
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

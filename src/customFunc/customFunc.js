import { savePageLog } from "@/api/common";
import { useStore } from "vuex";

export function formatLocalDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
export function formatDateTime(date) {
    const options = {
    timeZone: 'Asia/Seoul', // 한국 시간대 설정
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24시간제로 표시하고 싶을 때
   };
    if (!date) return '';
    const koreanDateTime = date.toLocaleString('ko-KR', options);
    return koreanDateTime;
  }
  export function formatTime(date) {
    if (!date) return '';
    const options = {
      timeZone: 'Asia/Seoul', // 한국 시간대 설정
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24시간제로 표시
    };
  
    // toLocaleTimeString은 기본적으로 "HH:MM" 형태로 반환함
    const timeString = date.toLocaleTimeString('ko-KR', options);
    return timeString; //
  }

  function formatDateTime2(dateString) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다.
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  // const dateString = '2025 02 20 18:05:34';
  // const formattedDate = formatDate(dateString);
  // console.log(formattedDate); // 출력: 2025-02-20 18:05:34
  


export function excelTitle(target) {
      const first = target.strMajorName 
      const second = target.strSubName 
      const third = target.strTitle

      return `${first}-${second}-${third}`;
}
export function excelSerialDateToJSDate(serial) {
  const baseDate = new Date(1899, 11, 31); // 1900년 1월 0일 (엑셀의 기준일 이전 날짜)
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysToAdd = serial ; // 엑셀은 1부터 시작
  return new Date(baseDate.getTime() + daysToAdd * millisecondsPerDay).toISOString().split('T')[0];
}

export async function insertPageLog(progdata) {

  const store = useStore()
  const currenttime = new Date()
  const inserttime = formatDateTime2(currenttime)
  const userGroup = store.state.userData.lngCompanyCode
  const userStoreCd = store.state.userData.lngChargerCode
  const userId = store.state.userData.lngSequence
  let userIp ;
  const userip = async()=>{
    const result = await fetch('https://api64.ipify.org?format=json');
    const data = await result.json();
    userIp = data.ip;
  
  }
  await userip()
  const progname = progdata.strUrl.split('::')[1].split('.xml')[0]
  const progid = progdata.lngProgramID


  const res = await savePageLog(inserttime,userGroup,userStoreCd,userId,userIp,progname,progid,1)
 
  return ``;
}
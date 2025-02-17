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
  


export function excelTitle(target) {
      const first = target.strMajorName 
      const second = target.strSubName 
      const third = target.strTitle

      return `${first}-${second}-${third}`;
  }
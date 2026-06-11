/** 대한민국 공휴일 (양력 고정 + 연도별 음력 연휴 일자 MM-DD) */
const KR_SOLAR_HOLIDAY_NAMES = {
  "01-01": "신정",
  "03-01": "삼일절",
  "05-05": "어린이날",
  "06-06": "현충일",
  "08-15": "광복절",
  "10-03": "개천절",
  "10-09": "한글날",
  "12-25": "성탄절",
};

const KR_LUNAR_HOLIDAYS_BY_YEAR = {
  2018: ["02-15", "02-16", "02-17", "05-22", "09-23", "09-24", "09-25"],
  2019: ["02-04", "02-05", "02-06", "05-12", "09-12", "09-13", "09-14"],
  2020: ["01-24", "01-25", "01-26", "01-27", "04-30", "09-30", "10-01", "10-02"],
  2021: ["02-11", "02-12", "02-13", "05-19", "09-20", "09-21", "09-22"],
  2022: ["01-31", "02-01", "02-02", "05-08", "09-09", "09-10", "09-11"],
  2023: ["01-21", "01-22", "01-23", "01-24", "05-27", "09-28", "09-29", "09-30", "10-01", "10-02", "10-03"],
  2024: ["02-09", "02-10", "02-11", "02-12", "05-15", "09-16", "09-17", "09-18"],
  2025: ["01-28", "01-29", "01-30", "05-05", "10-05", "10-06", "10-07"],
  2026: ["02-16", "02-17", "02-18", "05-24", "09-24", "09-25", "09-26"],
  2027: ["02-06", "02-07", "02-08", "05-13", "09-14", "09-15", "09-16"],
  2028: ["01-26", "01-27", "01-28", "05-02", "10-02", "10-03", "10-04"],
  2029: ["02-12", "02-13", "02-14", "05-20", "09-21", "09-22", "09-23"],
  2030: ["02-02", "02-03", "02-04", "05-09", "09-11", "09-12", "09-13"],
  2031: ["01-22", "01-23", "01-24", "05-28", "09-30", "10-01", "10-02"],
};

const toMonthDay = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** 음력 연휴·대체휴일 일자 — 대체휴일은 「설/추석/석가탄신일」으로만 표기 */
const getLunarHolidayShortName = (year, md) => {
  const yearList = KR_LUNAR_HOLIDAYS_BY_YEAR[year];
  if (!yearList?.includes(md)) return null;

  const month = Number(md.slice(0, 2));
  if (month <= 2) return "설";
  if (month <= 5) return "석가탄신일";
  if (month >= 9) return "추석";
  return null;
};

/** 공휴일 짧은 명칭 (없으면 null). 양력 고정명 우선 */
export function getKoreanPublicHolidayShortName(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  const md = toMonthDay(d);
  if (KR_SOLAR_HOLIDAY_NAMES[md]) return KR_SOLAR_HOLIDAY_NAMES[md];

  return getLunarHolidayShortName(d.getFullYear(), md);
}

export function isKoreanPublicHoliday(date) {
  return getKoreanPublicHolidayShortName(date) != null;
}

/** 달력 셀 표시용 — 길면 앞 N글자 + … (레이아웃 영향 최소화) */
export const SLS01_CAL_HOLIDAY_LABEL_MAX = 6;

export function formatHolidayLabelForCalendar(
  name,
  maxLen = SLS01_CAL_HOLIDAY_LABEL_MAX
) {
  const s = String(name ?? "").trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen)}...`;
}

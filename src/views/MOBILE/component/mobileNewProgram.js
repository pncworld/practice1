/*
 * 모바일 신규 프로그램 N 표시
 * - 공통코드 449 (mstCommonDetail): strDCode = 프로그램 번호(PROGID), strSCode = 표시 시작일(yyyyMMdd)
 * - 시작일부터 NEW_DAYS 일 동안만 메뉴 이름 옆에 N 표시
 * - 왼쪽 서랍 메뉴(mobileTotalMenu)와 매출조회 메뉴(mobileLayout)가 같이 쓴다. 로그인 후 한 번만 불러온다
 */
import { ref } from "vue";
import { getCommonList } from "@/api/common";

export const NEW_PROGRAM_CODE = 449;
export const NEW_DAYS = 20;

/** 프로그램 번호 → 표시 시작일(Date) */
const startByProg = ref(new Map());
let loading = null;

const parseYmd = (s) => {
  const t = String(s || "").replace(/\D/g, "");
  if (t.length !== 8) return null;
  const d = new Date(Number(t.slice(0, 4)), Number(t.slice(4, 6)) - 1, Number(t.slice(6, 8)));
  return isNaN(d.getTime()) ? null : d;
};

export const loadNewPrograms = () => {
  if (loading) return loading;
  loading = getCommonList(NEW_PROGRAM_CODE)
    .then((res) => {
      const list = res?.data?.List || [];
      const map = new Map();
      for (const r of list) {
        const d = parseYmd(r.strSCode);
        if (r.strDCode && d) map.set(String(r.strDCode).trim(), d);
      }
      startByProg.value = map;
    })
    .catch(() => {
      // 못 불러오면 N 표시만 안 한다 (메뉴 동작에는 영향 없음). 다음 화면 진입 때 다시 시도
      loading = null;
    });
  return loading;
};

/** 시작일 0시 ~ 시작일 + NEW_DAYS 일 0시 전까지 */
export const isNewProgram = (progId) => {
  const start = startByProg.value.get(String(progId ?? "").trim());
  if (!start) return false;
  const end = new Date(start.getTime());
  end.setDate(end.getDate() + NEW_DAYS);
  const now = new Date();
  return now >= start && now < end;
};

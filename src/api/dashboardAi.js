import axios from "axios";
import { commonUrl2 } from "./common";
import router from "@/router";
import store from "@/store";

/**
 * 기본 대시보드 AI 매출 질문창 (MISALES/SLS00_002AI.asmx)
 * - 조회 범위(매장)는 서버가 토큰의 사용자 기준으로 정한다. 화면에서 그룹·매장 코드를 보내지 않는다.
 */
const api2 = axios.create({
  baseURL: commonUrl2, // API 기본 URL
  timeout: 300000, // AI 호출 2회(해석·요약) + 조회. 고객 질문은 사내 로컬 AI(CPU)라 더 오래 걸릴 수 있다 (2026-11-25)
});

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api2.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      let newtoken = response.headers.authorization.substring(7);

      store.state.StoreToken = newtoken;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      store.commit("clearSession");
      router.push("/");
    }
    return Promise.reject(error);
  }
);

/** 로그인 계정의 AI 조회 범위 (SCOPE_TYPE: BLOCK / BRAND / SUPERVISOR / HQ / STORE) */
export const getDashboardAiScope = () => {
  return api2.post("/MISALES/SLS00_002AI.asmx/getAiScope", {});
};

/**
 * 매출 질문
 * @param {Array<{role: "user"|"assistant", content: string}>} messages 대화 기록 (user 로 시작·끝)
 */
export const chatDashboardSales = (messages) => {
  return api2.post("/MISALES/SLS00_002AI.asmx/chatSales", {
    MESSAGES: JSON.stringify(messages),
  });
};

/**
 * 고객 원본 자료 신청: 신청번호(24시간 유효)를 받는다. 원본 자료는 내려오지 않고 담당자가 따로 추출한다
 * @param {string} exportKey 고객 목록 응답의 EXPORT_KEY
 */
export const requestCustomerExport = (exportKey) => {
  return api2.post("/MISALES/SLS00_002AI.asmx/requestCustomerExport", {
    EXPORT_KEY: exportKey,
  });
};

/**
 * 메뉴 등록 진행 (매장 → 메뉴명 → 판매가 → 대분류 → 소분류 → 과세구분 → 확인 순서를 서버가 정한다)
 * @param {Array<{role: "user"|"assistant", content: string}>} messages 등록 대화 기록 (user 로 끝)
 * @param {object|null} draft 지금까지 받은 값 (서버가 돌려준 DRAFT 그대로)
 */
export const chatDashboardMenuRegister = (messages, draft) => {
  return api2.post("/MISALES/SLS00_002AI.asmx/chatMenuRegister", {
    MESSAGES: JSON.stringify(messages),
    DRAFT: draft ? JSON.stringify(draft) : "",
  });
};

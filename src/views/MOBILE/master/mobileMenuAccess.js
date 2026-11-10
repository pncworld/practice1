/**
 * 모바일 메뉴 조회·AI 메뉴 등록 사용 조건 (모바일 홈 homePage.vue, 메뉴 조회 menuManage.vue 에서 함께 사용)
 *
 * 모바일 로그인 세션에는 GROUP_CD·STORE_CD·USER_NO 만 있어 웹 권한 값이 없다.
 * 모바일 토큰도 웹과 같은 사용자 번호(lngSequence)로 만들어지므로, 웹 새로고침용 alreadyLogined 로 웹 세션을 받고
 * 웹 왼쪽 메뉴와 같은 get_sys_list 로 메뉴코드등록(MST01_003INS) 메뉴가 있는지 확인한다.
 * 아래 조건은 웹 MST01_003INS.vue 와 같게 맞춘다.
 */
import { alreadyLogined, get_store_list, get_sys_list } from "@/api/common";

export const MST003_URL = "MIMASTER::MST01_003INS.xml";

// AI 메뉴 관리를 쓰지 않는 매장 그룹 (웹 AI_DISABLED_STORE_GROUPS)
const AI_DISABLED_STORE_GROUPS = [3015];

// 같은 토큰으로 받은 결과는 화면 사이에서 다시 쓴다 (홈에서 받은 값을 메뉴 목록 화면이 바로 사용, 5분까지)
const ACCESS_CACHE_MS = 5 * 60 * 1000;
let accessCache = null; // { token, at, value }

/** 웹 세션과 메뉴코드등록 메뉴 항목. 못 받으면 { user: null, menu: null } */
export const loadMenuAccess = async (token) => {
  if (accessCache && accessCache.token === token && Date.now() - accessCache.at < ACCESS_CACHE_MS) {
    return accessCache.value;
  }
  try {
    const res = await alreadyLogined(token);
    const user = res?.data?.RESULT === true ? res.data.List?.[0] : null;
    if (!user || !user.lngStoreGroup) return { user: null, menu: null };
    const res2 = await get_sys_list(user.lngStoreGroup, user.lngUserAdminID, user.strLanguage);
    const menu = (res2?.data?.sysMenu || []).find(
      (item) => Number(item.strMenuLevel) === 3 && String(item.strUrl || "").includes(MST003_URL)
    );
    const value = { user, menu: menu || null };
    accessCache = { token, at: Date.now(), value };
    return value;
  } catch (error) {
    return { user: null, menu: null };
  }
};

/** 웹 로그인과 같은 매장 목록 (get_store_list 의 store). 실패하면 빈 배열 */
export const loadStoreList = async (user) => {
  try {
    const res = await get_store_list(
      user.lngStoreGroup,
      user.lngPositionType,
      user.blnBrandAdmin == "False" ? 0 : 1,
      user.lngPosition,
      user.lngJoinType,
      user.lngTeamCode,
      user.lngSupervisor
    );
    return (res?.data?.store || [])
      .map((s) => ({
        code: String(s.lngStoreCode ?? s.storeCd ?? ""),
        name: s.strName ?? s.strStoreName ?? String(s.lngStoreCode ?? ""),
      }))
      .filter((s) => s.code !== "" && s.code !== "0");
  } catch (error) {
    return [];
  }
};

/** 브랜드 공통 메뉴 사용 그룹 (웹 isStoreImageFeatureEnabled) */
export const isCommonMenuUser = (user) =>
  !!user && String(user.intCommonMenu ?? user.lngCommonMenu) === "1";

/** 매장 계정 — pickStore.vue 와 같은 기준 (브랜드 관리자도 아니고 lngPositionType 1 도 아니면 매장 계정) */
export const isStoreAccountUser = (user) =>
  !!user && String(user.blnBrandAdmin) !== "True" && String(user.lngPositionType) !== "1";

/** 매장 계정 + 공통 메뉴: 메뉴는 조회만 (웹 isCommonMenuReadOnly) */
export const isCommonMenuReadOnly = (user) => isStoreAccountUser(user) && isCommonMenuUser(user);

/** AI 기능(초간단·AI 메뉴관리)을 쓰는 그룹인지 */
export const isAiEnabledGroup = (user) =>
  !!user && !AI_DISABLED_STORE_GROUPS.includes(Number(user.lngStoreGroup));

/** 초간단 메뉴등록 사용 가능: 메뉴코드등록 메뉴 있음 + AI 사용 그룹 + 조회 전용 계정 아님 */
export const canUseQuickMenu = (user, menu) =>
  !!user && !!menu && isAiEnabledGroup(user) && !isCommonMenuReadOnly(user);

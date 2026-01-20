import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";
import { toDate } from "date-fns";

const url = commonUrl;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
export const url2 = commonUrl2;
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 100000, // 요청 타임아웃 설정
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
      return new Promise(() => {});
    }
    return new Promise(() => {});
  }
);

// API 요청 메서드들
export const get_pos = (groupCd, storeCd) => {
  return api.post("/VUE_usp_MST01_032INS_GET_POS", {
    P_GROUP_CD: groupCd,
    P_STORE_CD: storeCd,
  });
};
export const get_area = (groupCd, storeCd, posNo) => {
  return api.post("/VUE_usp_MST01_032INS_GET_AREA", {
    P_GROUP_CD: groupCd,
    P_STORE_CD: storeCd,
    POS_NO: posNo,
  });
};
export const get_ins_list1 = (min, max) => {
  return api.post("/VUE_usp_MST01_032INS_GET_LIST1", {
    MIN_TABLE_ID: min,
    MAX_TABLE_ID: max,
  });
};
export const get_ins_list2 = (
  groupCd,
  storeCd,
  lngAreaCd,
  posNo,
  selectedDate
) => {
  return api.post("/VUE_usp_MST01_032INS_GET_LIST2", {
    P_GROUP_CD: groupCd,
    P_STORE_CD: storeCd == "0" ? "0" : storeCd,
    P_AREA_CD: lngAreaCd == "0" ? "0" : lngAreaCd,
    POS_NO: posNo == "0" ? "0" : posNo,
    DTM_DATE: selectedDate,
  });
};
export const master_save = (
  groupCd,
  storeCd,
  lngAreaCd,
  posNo,
  selectedrows,
  selectedDate
) => {
  return api.post("/VUE_usp_MST01_032INS_INSERT", {
    P_GROUP_CD: groupCd,
    P_STORE_CD: storeCd,
    P_AREA_CD: lngAreaCd,
    POS_NO: posNo,
    TABLE_ID: selectedrows,
    DTM_DATE: selectedDate,
  });
};
export const master_delete = (
  groupCd,
  storeCd,
  lngAreaCd,
  posNo,
  selectedrows,
  selectedDate
) => {
  return api.post("/VUE_usp_MST01_032INS_DEL", {
    P_GROUP_CD: groupCd,
    P_STORE_CD: storeCd,
    P_AREA_CD: lngAreaCd,
    POS_NO: posNo,
    TABLE_ID: selectedrows,
    DTM_DATE: selectedDate,
  });
};

export const getstoreInfo = (groupCd, storeType, storeCd, searchStoreName) => {
  return api2.post("/MIMASTER/MST01_002INS.asmx/getstoreInfo", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeType,
    STORE_CD: storeCd,
    SEARCH_TEXT: searchStoreName,
  });
};
export const saveStoreInfo = async (
  id,
  groupCd,
  deleteStore,
  updateStoreCd,
  updateStoreNm,
  updatestrRegistNo,
  updatestrDirector,
  updatestrDealType,
  updatestrDealKind,
  updatelngJoinType,
  updatelngSubLease,
  updatelngStoreAttr,
  updatelngStoreArea,
  updatedtmOpenDate,
  updatedtmStop,
  updatestrConvCode,
  updatestrZipCode,
  updatestrAddress,
  updatestrAddressetc,
  updatestrTel,
  updatestrPhone,
  updatestrFax,
  updatelngFloorSpace,
  updatelngLease,
  updatelngBEP,
  updatelngSaleType,
  updatelngSupervisor,
  updatestrDev1,
  updatelngTable,
  updatestrStoreHistory,
  updatelngMultiPriceGroupCode,
  insertStoreCd,
  insertStoreNm,
  insertstrRegistNo,
  insertstrDirector,
  insertstrDealType,
  insertstrDealKind,
  insertlngJoinType,
  insertlngSubLease,
  insertlngStoreAttr,
  insertlngStoreArea,
  insertedtmOpenDate,
  insertedtmStop,
  insertstrConvCode,
  insertstrZipCode,
  insertstrAddress,
  insertstrAddressetc,
  insertstrTel,
  insertstrPhone,
  insertstrFax,
  insertlngFloorSpace,
  insertlngLease,
  insertlngBEP,
  insertlngSaleType,
  insertlngSupervisor,
  insertstrDev1,
  insertlngTable,
  insertstrStoreHistory,
  insertlngMultiPriceGroupCode
) => {
  const data = {
    ID: id,
    GROUP_CD: groupCd,
    DELETE_STORE: deleteStore,
    UPDATE_STORE_CD: updateStoreCd,
    UPDATE_STORE_NM: updateStoreNm,
    UPDATE_STR_REGIST_NO: updatestrRegistNo,
    UPDATE_STR_DIRECTOR: updatestrDirector,
    UPDATE_STR_DEALTYPE: updatestrDealType,
    UPDATE_STR_DEALKIND: updatestrDealKind,
    UPDATE_LNG_JOIN_TYPE: updatelngJoinType,
    UPDATE_LNG_SUB_LEASE: updatelngSubLease,
    UPDATE_LNG_STORE_ATTR: updatelngStoreAttr,
    UPDATE_LNG_STORE_AREA: updatelngStoreArea,
    UPDATE_DTM_OPEN_DATE: updatedtmOpenDate,
    UPDATE_DTM_STOP: updatedtmStop,
    UPDATE_STR_CONV_CODE: updatestrConvCode,
    UPDATE_STR_ZIP_CODE: updatestrZipCode,
    UPDATE_STR_ADDRESS: updatestrAddress,
    UPDATE_STR_ADDRESSETC: updatestrAddressetc,
    UPDATE_STR_TEL: updatestrTel,
    UPDATE_STR_PHONE: updatestrPhone,
    UPDATE_STR_FAX: updatestrFax,
    UPDATE_LNG_FLOOR_SPACE: updatelngFloorSpace,
    UPDATE_LNG_LEASE: updatelngLease,
    UPDATE_LNG_BEP: updatelngBEP,
    UPDATE_LNG_SALE_TYPE: updatelngSaleType,
    UPDATE_LNG_SUPERVISOR: updatelngSupervisor,
    UPDATE_STR_DEV1: updatestrDev1,
    UPDATE_LNG_TABLE: updatelngTable,
    UPDATE_STR_STORE_HISTORY: updatestrStoreHistory,
    UPDATE_MULTI_GROUP_CODE: updatelngMultiPriceGroupCode,
    INSERT_STORE_CD: insertStoreCd,
    INSERT_STORE_NM: insertStoreNm,
    INSERT_STR_REGIST_NO: insertstrRegistNo,
    INSERT_STR_DIRECTOR: insertstrDirector,
    INSERT_STR_DEALTYPE: insertstrDealType,
    INSERT_STR_DEALKIND: insertstrDealKind,
    INSERT_LNG_JOIN_TYPE: insertlngJoinType,
    INSERT_LNG_SUB_LEASE: insertlngSubLease,
    INSERT_LNG_STORE_ATTR: insertlngStoreAttr,
    INSERT_LNG_STORE_AREA: insertlngStoreArea,
    INSERT_DTM_OPEN_DATE: insertedtmOpenDate,
    INSERT_DTM_STOP: insertedtmStop,
    INSERT_STR_CONV_CODE: insertstrConvCode,
    INSERT_STR_ZIP_CODE: insertstrZipCode,
    INSERT_STR_ADDRESS: insertstrAddress,
    INSERT_STR_ADDRESSETC: insertstrAddressetc,
    INSERT_STR_TEL: insertstrTel,
    INSERT_STR_PHONE: insertstrPhone,
    INSERT_STR_FAX: insertstrFax,
    INSERT_LNG_FLOOR_SPACE: insertlngFloorSpace,
    INSERT_LNG_LEASE: insertlngLease,
    INSERT_LNG_BEP: insertlngBEP,
    INSERT_LNG_SALE_TYPE: insertlngSaleType,
    INSERT_LNG_SUPERVISOR: insertlngSupervisor,
    INSERT_STR_DEV1: insertstrDev1,
    INSERT_LNG_TABLE: insertlngTable,
    INSERT_STR_STORE_HISTORY: insertstrStoreHistory,
    INSERT_MULTI_GROUP_CODE: insertlngMultiPriceGroupCode,
  };

  return await api2.post("/MIMASTER/MST01_002INS.asmx/saveStoreInfo", data);
};

export const tablePosMenu = async (data) => {
  return await api2.post("/MIMASTER/MST57_002INS.asmx/getTablePosMenu", data);
};

export const tablePosMenuKey = async (data) => {
  return await api2.post(
    "/MIMASTER/MST57_002INS.asmx/getTablePosMenuKey",
    data
  );
};
export const tablePosMenuKey_v2 = async (groupCd, storeCd, areaCd) => {
  return await api2.post("/MIMASTER/MST57_002INS.asmx/getTablePosMenuKey_V2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};

export const savetablePosMenuKey = async (data) => {
  return await api2.post(
    "/MIMASTER/MST57_002INS.asmx/insertTablePosMenuKey",
    data
  );
};

export const deletetablePosMenuKey = async (data) => {
  return await api2.post(
    "/MIMASTER/MST57_002INS.asmx/deleteTablePosMenuKey",
    data
  );
};
export const get_category_info = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/getCategoryInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};

export const setSubCategoryDelete = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  subCd
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setSubCategoryDelete", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    SUB_CD: subCd,
  });
};
export const setMainCategoryDELETE = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  subCd
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setMainCategoryDelete", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    SUB_CD: subCd,
  });
};
export const getCategoryInfo = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/getCategoryInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const getMultiLingual = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/getMultiLingual", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const setMainCategoryUpdate = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  majorNm,
  subCd,
  subNm,
  langId,
  useYn,
  allDate,
  fromDate,
  toDate,
  allTime,
  fromTime,
  toTime,
  selDay,
  extraNm
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setMainCategoryUpdate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    MAJOR_NM: majorNm,
    SUB_CD: subCd,
    SUB_NM: subNm,
    LANGUAGE_ID: langId,
    USE_YN: useYn,
    ALL_DATE: allDate,
    FROM_DATE: fromDate,
    TO_DATE: toDate,
    ALL_TIME: allTime,
    FROM_TIME: fromTime,
    TO_TIME: toTime,
    SEL_DAY: selDay,
    EXTRA_NM: extraNm,
  });
};
export const setMainCategoryINSERT = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  majorNm,
  subCd,
  subNm,
  langId,
  useYn,
  allDate,
  fromDate,
  toDate,
  allTime,
  fromTime,
  toTime,
  selDay,
  extraNm
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setMainCategoryInsert", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    MAJOR_NM: majorNm,
    SUB_CD: subCd,
    SUB_NM: subNm,
    LANGUAGE_ID: langId,
    USE_YN: useYn,
    ALL_DATE: allDate,
    FROM_DATE: fromDate,
    TO_DATE: toDate,
    ALL_TIME: allTime,
    FROM_TIME: fromTime,
    TO_TIME: toTime,
    SEL_DAY: selDay,
    EXTRA_NM: extraNm,
  });
};

export const setSubCategoryINSERT = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  majorNm,
  subCd,
  subNm,
  langId,
  useYn,
  allDate,
  fromDate,
  toDate,
  allTime,
  fromTime,
  toTime,
  selDay,
  extraNm
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setSubCategoryInsert", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    MAJOR_NM: majorNm,
    SUB_CD: subCd,
    SUB_NM: subNm,
    LANGUAGE_ID: langId,
    USE_YN: useYn,
    ALL_DATE: allDate,
    FROM_DATE: fromDate,
    TO_DATE: toDate,
    ALL_TIME: allTime,
    FROM_TIME: fromTime,
    TO_TIME: toTime,
    SEL_DAY: selDay,
    EXTRA_NM: extraNm,
  });
};
export const setSubCategoryUPDATE = (
  groupCd,
  storeCd,
  areaCd,
  majorCd,
  majorNm,
  subCd,
  subNm,
  langId,
  useYn,
  allDate,
  fromDate,
  toDate,
  allTime,
  fromTime,
  toTime,
  selDay,
  extraNm
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/setSubCategoryUpdate", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    MAJOR_CD: majorCd,
    MAJOR_NM: majorNm,
    SUB_CD: subCd,
    SUB_NM: subNm,
    LANGUAGE_ID: langId,
    USE_YN: useYn,
    ALL_DATE: allDate,
    FROM_DATE: fromDate,
    TO_DATE: toDate,
    ALL_TIME: allTime,
    FROM_TIME: fromTime,
    TO_TIME: toTime,
    SEL_DAY: selDay,
    EXTRA_NM: extraNm,
  });
};

export const getMenuList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/getTablePosMenu", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMenuList3 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/getMenuList3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMenuList2 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/getMenuList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getKitchenGroupList = (groupCd) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/getKitchenGroupList", {
    GROUP_CD: groupCd,
    STORE_CD: 0,
  });
};
export const getKitchenGroupList2 = (groupCd) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/getKitchenGroupList2", {
    GROUP_CD: groupCd,
    STORE_CD: 0,
  });
};
export const getKitchenPortList = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/getKitchenPortList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const saveKitchenGroupList = (
  deletegroupCd,
  deletegroupCd2,
  groupCd,
  groupcds,
  groupNms,
  loginid
) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/saveKitchenGroupList", {
    DELETE_GROUP_CD: deletegroupCd,
    DELETE_GROUP_CD2: deletegroupCd2,
    GROUP_CD: groupCd,
    GROUP_CDS: groupcds,
    GROUP_NMS: groupNms,
    ID: loginid,
  });
};
export const saveMenuKPG = (groupCd, storeCd, lngCodes, lngkpg) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/saveMenuKPG", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngCodes,
    LNG_KPG: lngkpg,
  });
};
export const savePortKitchenConfig = (
  groupCd,
  storeCds,
  areaCds,
  posNos,
  lngpo,
  lngprinttype,
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
  p16,
  p17,
  p18,
  p19,
  p20,
  strname
) => {
  return api2.post("/MIMASTER/MST44_064INS.asmx/savePortKitchenConfig", {
    GROUP_CD: groupCd,
    STORE_CD: storeCds,
    AREA_CD: areaCds,
    POS_NO: posNos,
    LNG_POSITION: lngpo,
    LNG_PRINTTYPE: lngprinttype,
    P1: p1,
    P2: p2,
    P3: p3,
    P4: p4,
    P5: p5,
    P6: p6,
    P7: p7,
    P8: p8,
    P9: p9,
    P10: p10,
    P11: p11,
    P12: p12,
    P13: p13,
    P14: p14,
    P15: p15,
    P16: p16,
    P17: p17,
    P18: p18,
    P19: p19,
    P20: p20,
    STRNAME: strname,
  });
};
export const getMenuListIncludeCommon = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST36_001INS.asmx/getMenuListIncludeCommon", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getTablePosMenuKey = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/getTablePosMenuKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getScreenList = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/getScreenList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getLSCategoryList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST57_003INS.asmx/getLSCategoryList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getMenuKeyList = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/getMenuKeyList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const getMenuKeyList3 = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST44_052INS.asmx/getMenuKeyList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const getMenuKeyList4 = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST57_003INS.asmx/getMenuKeyList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
  });
};

export const getTLUList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/getTLUList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getTLUList2 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/getTLUList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const saveScreenKeys = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  screenNo_arr,
  screenName_arr
) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/saveScreenKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_NO_ARR: screenNo_arr,
    SCREEN_NAME_ARR: screenName_arr,
  });
};
export const saveScreenKeys2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  screenNo_arr,
  screenName_arr,
  screenDisc,
  screenType
) => {
  return api2.post("/MIMASTER/MST44_054INS.asmx/saveScreenKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_NO_ARR: screenNo_arr,
    SCREEN_NAME_ARR: screenName_arr,
    SCREEN_DISC: screenDisc,
    SCREEN_TYPE: screenType,
  });
};

export const saveTablePosMenuKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intKeySeq_arr,
  intScreenNo_arr,
  lngScrNo_arr,
  strKeyName_arr
) => {
  return api2.post("/MIMASTER/MST57_003INS.asmx/saveMenuKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    INTKEYSEQ_ARR: intKeySeq_arr,
    INTSCREENNO_ARR: intScreenNo_arr,
    LNGKEYSCRNO_ARR: lngScrNo_arr,
    STRKEYNAME_ARR: strKeyName_arr,
  });
};

export const saveAllMenuKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intKeySeq_arr,
  intScreenNo_arr,
  lngScrNo_arr,
  strKeyName_arr,
  intKeyNos,
  lngKeyColor_arr,
  strIcon_arr
) => {
  return api2.post("/MIMASTER/MST05_011INS.asmx/saveMenuKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    INTKEYSEQ_ARR: intKeySeq_arr,
    INTSCREENNO_ARR: intScreenNo_arr,
    LNGKEYSCRNO_ARR: lngScrNo_arr,
    STRKEYNAME_ARR: strKeyName_arr,
    INTKEYNOS: intKeyNos,
    LNGKEYCOLOR_ARR: lngKeyColor_arr,
    STRICON_ARR: strIcon_arr,
  });
};

export const saveKioskAllMenuKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intKeySeq_arr,
  intScreenNo_arr,
  lngScrNo_arr,
  strKeyName_arr,
  intKeyNos,
  lngKeyColor_arr,
  strIcon_arr
) => {
  return api2.post("/MIMASTER/MST44_052INS.asmx/saveKioskAllMenuKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    INTKEYSEQ_ARR: intKeySeq_arr,
    INTSCREENNO_ARR: intScreenNo_arr,
    LNGKEYSCRNO_ARR: lngScrNo_arr,
    STRKEYNAME_ARR: strKeyName_arr,
    INTKEYNOS: intKeyNos,
    LNGKEYCOLOR_ARR: lngKeyColor_arr,
    STRICON_ARR: strIcon_arr,
  });
};

export const saveAllMenuKey2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intKeySeq_arr,
  intScreenNo_arr,
  lngScrNo_arr,
  strKeyName_arr,
  screenType,
  itemdisc
) => {
  return api2.post("/MIMASTER/MST44_054INS.asmx/saveKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    INTKEYSEQ_ARR: intKeySeq_arr,
    INTSCREENNO_ARR: intScreenNo_arr,
    LNGKEYSCRNO_ARR: lngScrNo_arr,
    STRKEYNAME_ARR: strKeyName_arr,
    SCREEN_TYPE: screenType,
    ITEMDISC_YN: itemdisc,
  });
};
export const saveAllMenuKey3 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intKeySeq_arr,
  menuCd_arr,
  strKeyName_arr,
  stricon_arr,
  screenType
) => {
  return api2.post("/MIMASTER/MST44_058INS.asmx/saveKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    INTKEYSEQ_ARR: intKeySeq_arr,
    LNGKEYSCRNO_ARR: menuCd_arr,
    STRKEYNAME_ARR: strKeyName_arr,
    STRICON_ARR: stricon_arr,
    SCREEN_TYPE: screenType,
  });
};
export const getMenuKeyList2 = (groupCd, storeCd, areaCd, posNo, screenNo) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/getMenuKeyList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_NO: screenNo,
  });
};

export const getScreenList2 = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/getScreenList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const DUPLIALLPOSDATA = async (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tgroupCd,
  tstoreCd,
  tareaCd,
  tposNo
) => {
  const res = await api2.post("/MIMASTER/MST05_011INS.asmx/DUPLIALLPOSDATA", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: tgroupCd,
    T_STORE_CD: tstoreCd,
    T_AREA_CD: tareaCd,
    T_POSNO: tposNo,
  });
  return res;
};

export const dupliAllTablePosData = async (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tgroupCd,
  tstoreCd,
  tareaCd,
  tposNo
) => {
  const res = await api2.post(
    "/MIMASTER/MST57_003INS.asmx/dupliAllTablePosData",
    {
      GROUP_CD: groupCd,
      STORE_CD: storeCd,
      AREA_CD: areaCd,
      POSNO: posNo,
      T_GROUP_CD: tgroupCd,
      T_STORE_CD: tstoreCd,
      T_AREA_CD: tareaCd,
      T_POSNO: tposNo,
    }
  );
  return res;
};

export const DUPLIALLKIOSKDATA = async (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tgroupCd,
  tstoreCd,
  tareaCd,
  tposNo
) => {
  const res = await api2.post("/MIMASTER/MST44_058INS.asmx/DUPLIALLKIOSKDATA", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: tgroupCd,
    T_STORE_CD: tstoreCd,
    T_AREA_CD: tareaCd,
    T_POSNO: tposNo,
  });
  return res;
};
export const DUPLIALLKDS = async (groupCd, storeCd, tgroupCd, tstoreCd) => {
  const res = await api2.post("/MIMASTER/MST44_061INS.asmx/DUPLIALLKDS", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    T_GROUP_CD: tgroupCd,
    T_STORE_CD: tstoreCd,
  });
  return res;
};
export const saveMenuKey2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  keyseq,
  keyname,
  keyscrno,
  keycolor,
  keyNo
) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/saveMenuKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    KEYSEQ: keyseq,
    KEYNAME: keyname,
    KEYSCRNO: keyscrno,
    KEYCOLOR: keycolor,
    KEYNO: keyNo,
  });
};

export const saveMenuKey3 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  keyseq,
  keyname,
  keyscrno,
  keycolor,
  keyNo
) => {
  return api2.post("/VUEPOS/MST01_001POS.asmx/saveMenuKeys3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    KEYSEQ: keyseq,
    KEYNAME: keyname,
    KEYSCRNO: keyscrno,
    KEYCOLOR: keycolor,
    KEYNO: keyNo,
  });
};

export const dupliPos = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tgroupCd,
  tstoreCd,
  tareaCd,
  tposNo
) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/dupliMenuKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: tgroupCd,
    T_STORE_CD: tstoreCd,
    T_AREA_CD: tareaCd,
    T_POSNO: tposNo,
  });
};

export const dupliPos2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tgroupCd,
  tstoreCd,
  tareaCd,
  tposNo,
  screenNo,
  tscreenNo
) => {
  return api2.post("/MIMASTER/MST05_004INS.asmx/dupliSpecificMenuKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: tgroupCd,
    T_STORE_CD: tstoreCd,
    T_AREA_CD: tareaCd,
    T_POSNO: tposNo,
    SCREEN_NO: screenNo,
    T_SCREEN_NO: tscreenNo,
  });
};
export const getAmountList = (groupCd, storeCd, areaCd, posNo, screenType) => {
  return api2.post("/MIMASTER/MST44_054INS.asmx/getAmountList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_TYPE: screenType,
  });
};
export const getAmountList2 = (groupCd, storeCd, areaCd, posNo, screenType) => {
  return api2.post("/MIMASTER/MST44_058INS.asmx/getAmountList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_TYPE: screenType,
  });
};
export const getDynamicGrid2 = (groupCd, count) => {
  return api2.post("/MIMASTER/MST44_061INS.asmx/getDynamicGrid2", {
    GROUP_CD: groupCd,
    COUNT: count,
  });
};
export const getDynamicGrid3 = (groupCd, storeCd, count) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/getDynamicGrid3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COUNT: count,
  });
};

export const getAmountList3 = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_055INS.asmx/getAmountList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getFuncKeyList = () => {
  return api2.post("/MIMASTER/MST44_043INS.asmx/getFuncKeyList", {});
};
export const getAllScreenList = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_054INS.asmx/getAllScreenList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getScreenList3 = async (groupCd, storeCd, areaCd, posNo) => {
  return await api2.post("/MIMASTER/MST_001INS.asmx/getScreenList3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
  });
};
export const getFuncKeys = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_043INS.asmx/getFuncKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getFuncKeys2 = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_059INS.asmx/getFuncKeys2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getCustomorList = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_002INS.asmx/getCustomorList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getAgeList = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_060INS.asmx/getAgeList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
};
export const getPrintList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/getPrintList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMenuLists = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_008INS.asmx/getMenuLists", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getKitchenSettingList = (groupCd, storeCd, common) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/getKitchenSettingList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COMMON: common,
  });
};
export const getPortConnectionList = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/getPortConnectionList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const getPrintDefaultSetting = (groupCd, storeCd, areaCd) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/getPrintDefaultSetting", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
  });
};
export const savePortConfig = (
  groupCd,
  storeCd,
  posno,
  lngpositions,
  lngposs,
  lngports,
  portidvalues,
  lngstorecodes,
  areaCds,
  originPort,
  originPos,
  deleteposs,
  deletestorecd,
  deletelngposition,
  deleteareacode
) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/savePortConfig", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posno,
    LNG_POSITION: lngpositions,
    LNG_POS: lngposs,
    LNG_PORT: lngports,
    PORT_ID_VALUE: portidvalues,
    STORE_CDS: lngstorecodes,
    AREA_CDS: areaCds,
    ORIGIN_PORT: originPort,
    ORIGIN_POS: originPos,
    DELETE_POSS: deleteposs,
    DELETE_STORE_CDS: deletestorecd,
    DELETE_LNG_POSITION: deletelngposition,
    DELETE_AREACODE: deleteareacode,
  });
};
export const DUPLIPAYKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  screenNo,
  screenType,
  store_arr
) => {
  return api2.post("/MIMASTER/MST44_054INS.asmx/DUPLIPAYKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_NO: screenNo,
    SCREEN_TYPE: screenType,
    STORECD_ARR: store_arr,
  });
};
export const savePayKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intkeyseqarr,
  keyscrnoarr,
  keynmarr,
  intkeynos,
  gp
) => {
  return api2.post("/MIMASTER/MST44_055INS.asmx/savePayKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    KEY_SEQARR: intkeyseqarr,
    KEYSCR_NOARR: keyscrnoarr,
    KEY_NMARR: keynmarr,
    INT_KEY_NOARR: intkeynos,
    GPARR: gp,
  });
};
export const saveAllCustomor = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  lngcode,
  strname,
  intkeyseq,
  strkeyname,
  lngkeyscrno
) => {
  return api2.post("/MIMASTER/MST44_002INS.asmx/saveAllCustomor", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    LNGCODES: lngcode,
    STRNAMES: strname,
    INTKEYSEQS: intkeyseq,
    STRKEYNAMES: strkeyname,
    KEYSCRNOS: lngkeyscrno,
  });
};
export const saveAllAge = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  lngcode,
  strname,
  intkeyseq,
  strkeyname,
  lngkeyscrno
) => {
  return api2.post("/MIMASTER/MST44_060INS.asmx/saveAllAge", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    LNGCODES: lngcode,
    STRNAMES: strname,
    INTKEYSEQS: intkeyseq,
    STRKEYNAMES: strkeyname,
    KEYSCRNOS: lngkeyscrno,
  });
};
export const savePrintNm = (groupCd, storeCd, printNo, printNm) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/savePrintNm", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    PRINT_NO: printNo,
    PRINT_NM: printNm,
  });
};

export const saveGroupPayKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  intkeyseqarr,
  keyamtarr,
  groupcodearr,
  intkeyNmarr
) => {
  return api2.post("/MIMASTER/MST44_055INS.asmx/saveGroupPayKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    KEY_SEQARR: intkeyseqarr,
    KEYSCR_NOARR: keyamtarr,
    GROUP_CODEARR: groupcodearr,
    KEY_NMARR: intkeyNmarr,
  });
};

export const DUPLIALLPAYKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST44_055INS.asmx/DUPLIALLPAYKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};
export const DUPLIFUNCKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST44_043INS.asmx/DUPLIFUNCKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};
export const DUPLICUSTOMORKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST44_002INS.asmx/DUPLICUSTOMORKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};
export const DUPLIAGEKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST44_060INS.asmx/DUPLIAGEKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};

export const DUPLITABLEKEY = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/DUPLITABLEKEY", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};

export const DUPLITABLEKEY2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  t_groupCd,
  t_storeCd,
  t_areaCd,
  t_posNo
) => {
  return api2.post("/MIMASTER/MST_001INS.asmx/DUPLITABLEKEY2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    T_GROUP_CD: t_groupCd,
    T_STORE_CD: t_storeCd,
    T_AREA_CD: t_areaCd,
    T_POS_NO: t_posNo,
  });
};

export const DUPLIPAYCD = (groupCd, storeCd, groupCd2, storeCd2) => {
  return api2.post("/MIMASTER/MST36_055INS.asmx/DUPLIPAYCD", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    T_GROUP_CD: groupCd2,
    T_STORE_CD: storeCd2,
  });
};

export const saveAllFuncKey = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  lngDCodes,
  lngDCodes2
) => {
  return api2.post("/MIMASTER/MST44_043INS.asmx/saveAllFuncKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    LNGDCODES: lngDCodes,
    LNGDCODES2: lngDCodes2,
  });
};
export const saveAllFuncKey2 = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  screenNo,
  lngDCodes
) => {
  return api2.post("/MIMASTER/MST44_059INS.asmx/saveAllFuncKey", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREEN_NO: screenNo,
    LNGDCODES: lngDCodes,
  });
};
export const saveKDSList = (groupCd, kdsNo, kdsNm, id, deleteNo) => {
  return api2.post("/MIMASTER/MST44_061INS.asmx/saveKDSList", {
    GROUP_CD: groupCd,
    KDS_NO: kdsNo,
    KDS_NM: kdsNm,
    ID: id,
    DELETE_NO: deleteNo,
  });
};
export const saveKDSSettingAll = (groupCd, storeCd, Menu2arr, id) => {
  return api2.post("/MIMASTER/MST44_061INS.asmx/saveKDSSettingAll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_ARR: Menu2arr,
    ID: id,
  });
};
export const saveKitchenSettingAll = (
  groupCd,
  storeCd,
  Menu2arr,
  uniquearr,
  calculatearr,
  id
) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/saveKitchenSettingAll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_ARR: Menu2arr,
    TOTAL_ARR: uniquearr,
    CALCULATE_ARR: calculatearr,
    ID: id,
  });
};
export const saveReceiptData = (
  groupCd,
  storeCd,
  posnos,
  areaCds,
  receiptu,
  receiptd
) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/saveReceiptData", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posnos,
    AREA_CD: areaCds,
    RECEIPTU: receiptu,
    RECEIPTD: receiptd,
  });
};
export const saveScreenKeys3 = (
  groupCd,
  storeCd,
  posnos,
  areaCds,
  screenNm,
  screenNo
) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/saveScreenKeys3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posnos,
    AREA_CD: areaCds,
    SCREEN_NM: screenNm,
    SCREEN_NO: screenNo,
  });
};
export const saveAccInfo = (
  groupCd,
  clngAccCode,
  cstrName,
  cblnOut,
  cblnGear,
  ilngAccCode,
  istrName,
  iblnOut,
  iblnGear,
  dlngAccCode
) => {
  return api2.post("/MIMASTER/MST40_001INS.asmx/saveAccInfo", {
    GROUP_CD: groupCd,
    CACC_CD: clngAccCode,
    CSTR_NAME: cstrName,
    CBLNOUT: cblnOut,
    CBLNGEAR: cblnGear,
    IACCCD: ilngAccCode,
    ISTR_NAME: istrName,
    IBLNOUT: iblnOut,
    IBLNGEAR: iblnGear,
    DACCCD: dlngAccCode,
  });
};
export const savePayGroup = (
  groupCd,
  lngstoregroup,
  lnggroupCd,
  groupNm,
  strrk,
  dgroupCd
) => {
  return api2.post("/MIMASTER/MST36_003INS.asmx/savePayGroup", {
    GROUP_CD: groupCd,
    PAYSTOREGROUP: lngstoregroup,
    PAYGROUP_CD: lnggroupCd,
    PAYGROUP_NM: groupNm,
    STR_REMARK: strrk,
    DGROUP_CD: dgroupCd,
  });
};
export const saveStorePayCd = (groupCd, storeCd, lngcode) => {
  return api2.post("/MIMASTER/MST36_055INS.asmx/saveStorePayCd", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngcode,
  });
};
export const saveTables = (
  groupCd,
  storeCd,
  posnos,
  areaCds,
  screenNo,
  lngKeyscrNo,
  lngKeyColors,
  lngShapes,
  strNames,
  lngCounts,
  xs,
  ys,
  ws,
  hs,
  newNm,
  newlngCount
) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/saveTables", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posnos,
    AREA_CD: areaCds,
    SCREEN_NO: screenNo,
    KEYSCR_NO: lngKeyscrNo,
    KEY_COLOR: lngKeyColors,
    KEY_SHAPE: lngShapes,
    KEY_NAME: strNames,
    KEY_LNGCOUNT: lngCounts,
    X: xs,
    Y: ys,
    W: ws,
    H: hs,
    NEW_NM: newNm,
    NEW_COUNT: newlngCount,
  });
};
export const saveTables2 = (
  groupCd,
  storeCd,
  posnos,
  areaCds,
  screenNo,
  lngKeyscrNo,
  lngKeyColors,
  lngShapes,
  strNames,
  lngCounts,
  xs,
  ys,
  ws,
  hs,
  newNm,
  newlngCount,
  intkeynos
) => {
  return api2.post("/MIMASTER/MST_001INS.asmx/saveTables2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posnos,
    AREA_CD: areaCds,
    SCREEN_NO: screenNo,
    KEYSCR_NO: lngKeyscrNo,
    KEY_COLOR: lngKeyColors,
    KEY_SHAPE: lngShapes,
    KEY_NAME: strNames,
    KEY_LNGCOUNT: lngCounts,
    X: xs,
    Y: ys,
    W: ws,
    H: hs,
    NEW_NM: newNm,
    NEW_COUNT: newlngCount,
    INTKEYNO: intkeynos,
  });
};

export const saveNewTables = (
  groupCd,
  storeCd,
  posnos,
  areaCds,
  screenNo,
  lngKeyscrNo,
  lngKeyColors,
  lngShapes,
  strNames,
  lngCounts,
  xs,
  ys,
  ws,
  hs
) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/saveNewTables", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posnos,
    AREA_CD: areaCds,
    SCREEN_NO: screenNo,
    KEYSCR_NO: lngKeyscrNo,
    KEY_COLOR: lngKeyColors,
    KEY_SHAPE: lngShapes,
    KEY_NAME: strNames,
    KEY_LNGCOUNT: lngCounts,
    X: xs,
    Y: ys,
    W: ws,
    H: hs,
  });
};
export const saveMenuManage = (
  groupCd,
  storeCd,
  maincode,
  mainnm,
  subcode,
  subnm,
  submajor,
  selectCode
) => {
  return api2.post("/MIMASTER/MST01_008INS.asmx/saveMenuManage", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MAIN_CD: maincode,
    MAIN_NM: mainnm,
    SUB_CD: subcode,
    SUB_NM: subnm,
    SUB_MJ: submajor,
    SMAINCD: selectCode,
  });
};
export const saveCreditCardEnroll = (
  groupCd,
  storeCd,
  cstorecd,
  cbuyCd,
  cbuyNm,
  cbuyENm,
  clngrate,
  cifCode,
  istorecd,
  ibuyCd,
  ibuyNm,
  ibuyENm,
  ilngrate,
  iifCode,
  dstoreCd,
  dstorebuyCd
) => {
  return api2.post("/MIMASTER/MST43_001INS.asmx/saveCreditCardEnroll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    C_STORECD: cstorecd,
    C_BUYCD: cbuyCd,
    C_BUYNM: cbuyNm,
    C_BUYENM: cbuyENm,
    C_LNGRATE: clngrate,
    C_IFCODE: cifCode,
    I_STORECD: istorecd,
    I_BUYCD: ibuyCd,
    I_BUYNM: ibuyNm,
    I_BUYENM: ibuyENm,
    I_LNGRATE: ilngrate,
    I_IFCODE: iifCode,
    D_STORECD: dstoreCd,
    D_STOREBCD: dstorebuyCd,
  });
};
// API 요청 함수 정의
export const savePayCode = (
  groupCd,
  storeCd,
  lngStoreCode,
  strName,
  strNameE,
  lngCode,
  blnInactive,
  dtmFromDate,
  dtmToDate,
  lngRate,
  lngAmt,
  blnAuto,
  lngDiscAmtLimit,
  blnDrawer,
  lngPrior,
  blnReceipt,
  lngChangeRateLimit,
  lngMenu,
  lngDiscType,
  blnDuplicate,
  lngRoundType,
  lngRound,
  lngTax,
  strIcon,
  checkmenu,
  uncheckcode,
  deleteCd
) => {
  // POST 요청
  return api2.post("/MIMASTER/MST36_001INS.asmx/savePayCode", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_STORE_CODE: lngStoreCode,
    STR_NAME: strName,
    STR_NAME_E: strNameE,
    LNG_CODE: lngCode,
    BLN_INACTIVE: blnInactive,
    DTM_FROM_DATE: dtmFromDate,
    DTM_TO_DATE: dtmToDate,
    LNG_RATE: lngRate,
    LNG_AMT: lngAmt,
    BLN_AUTO: blnAuto,
    LNG_DISC_AMT_LIMIT: lngDiscAmtLimit,
    BLN_DRAWER: blnDrawer,
    LNG_PRIOR: lngPrior,
    BLN_RECEIPT: blnReceipt,
    LNG_CHANGE_RATE_LIMIT: lngChangeRateLimit,
    LNG_MENU: lngMenu,
    LNG_DISC_TYPE: lngDiscType,
    BLN_DUPLICATE: blnDuplicate,
    LNG_ROUND_TYPE: lngRoundType,
    LNG_ROUND: lngRound,
    LNG_TAX: lngTax,
    STR_ICON: strIcon,
    CHECK_MENU: checkmenu,
    UNCHECK_CODE: uncheckcode,
    DELETE_CD: deleteCd,
  });
};
export const saveMenuCode = (
  groupCd,
  storeCd,
  lngMainGroup,
  lngSubGroup,
  lngCode,
  dtmFromDate,
  dtmToDate,
  strName,
  strNameE,
  lngDCPrice,
  lngChain,
  lngPrice,
  blnDCPriceYN,
  lngTax,
  blnInactive,
  lngDiscount,
  intCustCount,
  blnCondimentprice,
  lngOrder,
  lngKPG,
  strBarCode,
  blnReceipt,
  lngMenuOption,
  blnRedPrint,
  strIcon,
  blnKitSingle,
  lngSubTitle,
  blnServing,
  blnOpen,
  blnDeliveryYN,
  strNutrInfo,
  strCntryOrg,
  strMenuComment,
  strUserFileName,
  lngtype,
  dtmstart,
  dtmend,
  lngkds,
  strnamek,
  discountyn,
  bigo,
  AutoMenuCode,
  deleteCd
) => {
  // POST 요청

  return api2.post("/MIMASTER/MST01_033INS.asmx/saveMenuCode", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_MAIN_GROUP: lngMainGroup,
    LNG_SUB_GROUP: lngSubGroup,
    LNG_CODE: lngCode,
    DTM_FROM_DATE: dtmFromDate,
    DTM_TO_DATE: dtmToDate,
    STR_NAME: strName,
    STR_NAME_E: strNameE,
    LNG_DC_PRICE: lngDCPrice,
    LNG_CHAIN: lngChain,
    LNG_PRICE: lngPrice,
    BLN_DC_PRICE_YN: blnDCPriceYN,
    LNG_TAX: lngTax,
    BLN_INACTIVE: blnInactive,
    LNG_DISCOUNT: lngDiscount,
    INT_CUST_COUNT: intCustCount,
    BLN_CONDIMENTPRICE: blnCondimentprice,
    LNG_ORDER: lngOrder,
    LNG_KPG: lngKPG,
    STR_BAR_CODE: strBarCode,
    BLN_RECEIPT: blnReceipt,
    LNG_MENU_OPTION: lngMenuOption,
    BLN_RED_PRINT: blnRedPrint,
    STR_ICON: strIcon,
    BLN_KIT_SINGLE: blnKitSingle,
    LNG_SUB_TITLE: lngSubTitle,
    BLN_SERVING: blnServing,
    BLN_OPEN: blnOpen,
    BLN_DELIVERY_YN: blnDeliveryYN,
    STR_NUTR_INFO: strNutrInfo,
    STR_CNTRY_ORG: strCntryOrg,
    STR_MENU_COMMENT: strMenuComment,
    STR_USER_FILE_NAME: strUserFileName,
    INSERT_AUTO: AutoMenuCode,
    DELETE_CD: deleteCd,

    LNGTYPE: lngtype,
    DTMSTART: dtmstart,
    DTMEND: dtmend,
    LNGKDS: lngkds,
    STRNAMEK: strnamek,
    DISCOUNTYN: discountyn,
    STRBIGO: bigo,
  });
};

export const saveDiscountCode = (
  groupCd,
  storeCd,
  lngCode,
  strAmtCodeList,
  lngPrice,
  discountyn,
  insertAuto
) => {
  // POST 요청
  return api2.post("/MIMASTER/MST01_033INS.asmx/saveDiscountCode", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngCode,
    STR_AMT_CODE_LIST: strAmtCodeList,
    LNG_PRICE: lngPrice,
    DISCOUNTYN: discountyn,
    INSERT_AUTO: insertAuto,
  });
};

export const saveOptions = (
  groupCd,
  storeCd,
  lngcode1,
  strNames1,
  blnMustSels1,
  intMultiples1,
  lngChainMenu1,
  lngChainMenu2,
  lngChainMenu3,
  lngChainMenu4,
  lngChainMenu5,
  lngChainMenu6,
  lngChainMenu7,
  lngChainMenu8,
  lngChainMenu9,
  lngChainMenu10,
  lngChainMenu11,
  lngChainMenu12,
  lngChainMenu13,
  lngChainMenu14,
  lngChainMenu15,
  lngChainMenu16,
  lngChainMenu17,
  lngChainMenu18,
  lngChainMenu19,
  lngChainMenu20,
  lngChainMenu21
) => {
  return api2.post("/MIMASTER/MST01_011INS_01.asmx/saveOptions", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE1: lngcode1,
    STR_NAMES1: strNames1,
    BLN_MUST_SELS1: blnMustSels1,
    INT_MULTIPLES1: intMultiples1,
    LNG_CHAIN_MENU1: lngChainMenu1,
    LNG_CHAIN_MENU2: lngChainMenu2,
    LNG_CHAIN_MENU3: lngChainMenu3,
    LNG_CHAIN_MENU4: lngChainMenu4,
    LNG_CHAIN_MENU5: lngChainMenu5,
    LNG_CHAIN_MENU6: lngChainMenu6,
    LNG_CHAIN_MENU7: lngChainMenu7,
    LNG_CHAIN_MENU8: lngChainMenu8,
    LNG_CHAIN_MENU9: lngChainMenu9,
    LNG_CHAIN_MENU10: lngChainMenu10,
    LNG_CHAIN_MENU11: lngChainMenu11,
    LNG_CHAIN_MENU12: lngChainMenu12,
    LNG_CHAIN_MENU13: lngChainMenu13,
    LNG_CHAIN_MENU14: lngChainMenu14,
    LNG_CHAIN_MENU15: lngChainMenu15,
    LNG_CHAIN_MENU16: lngChainMenu16,
    LNG_CHAIN_MENU17: lngChainMenu17,
    LNG_CHAIN_MENU18: lngChainMenu18,
    LNG_CHAIN_MENU19: lngChainMenu19,
    LNG_CHAIN_MENU20: lngChainMenu20,
    LNG_CHAIN_MENU21: lngChainMenu21,
  });
};
export const saveOptions2 = (
  groupCd,
  storeCd,
  lngCodes2,
  strNames2,
  lngChainGroup1,
  lngChainGroup2,
  lngChainGroup3,
  lngChainGroup4,
  lngChainGroup5,
  lngChainGroup6,
  lngChainGroup7,
  lngChainGroup8,
  lngChainGroup9,
  lngChainGroup10,
  lngChainGroup11,
  lngChainGroup12,
  lngChainGroup13,
  lngChainGroup14,
  lngChainGroup15,
  lngChainGroup16,
  lngChainGroup17,
  lngChainGroup18,
  lngChainGroup19,
  lngChainGroup20
) => {
  return api2.post("/MIMASTER/MST01_011INS_01.asmx/saveOptions2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODES2: lngCodes2,
    STR_NAMES2: strNames2,
    LNG_CHAIN_GROUP1: lngChainGroup1,
    LNG_CHAIN_GROUP2: lngChainGroup2,
    LNG_CHAIN_GROUP3: lngChainGroup3,
    LNG_CHAIN_GROUP4: lngChainGroup4,
    LNG_CHAIN_GROUP5: lngChainGroup5,
    LNG_CHAIN_GROUP6: lngChainGroup6,
    LNG_CHAIN_GROUP7: lngChainGroup7,
    LNG_CHAIN_GROUP8: lngChainGroup8,
    LNG_CHAIN_GROUP9: lngChainGroup9,
    LNG_CHAIN_GROUP10: lngChainGroup10,
    LNG_CHAIN_GROUP11: lngChainGroup11,
    LNG_CHAIN_GROUP12: lngChainGroup12,
    LNG_CHAIN_GROUP13: lngChainGroup13,
    LNG_CHAIN_GROUP14: lngChainGroup14,
    LNG_CHAIN_GROUP15: lngChainGroup15,
    LNG_CHAIN_GROUP16: lngChainGroup16,
    LNG_CHAIN_GROUP17: lngChainGroup17,
    LNG_CHAIN_GROUP18: lngChainGroup18,
    LNG_CHAIN_GROUP19: lngChainGroup19,
    LNG_CHAIN_GROUP20: lngChainGroup20,
  });
};

export const saveOptions3 = (
  groupCd,
  storeCd,
  lngcode1,
  strNames1,
  blnMustSels1,
  intMultiples1,
  lngChainMenu1,
  lngChainMenu2,
  lngChainMenu3,
  lngChainMenu4,
  lngChainMenu5,
  lngChainMenu6,
  lngChainMenu7,
  lngChainMenu8,
  lngChainMenu9,
  lngChainMenu10,
  lngChainMenu11,
  lngChainMenu12,
  lngChainMenu13,
  lngChainMenu14,
  lngChainMenu15,
  lngChainMenu16,
  lngChainMenu17,
  lngChainMenu18,
  lngChainMenu19,
  lngChainMenu20,
  lngChainMenu21
) => {
  return api2.post("/MIMASTER/MST01_011INS_02.asmx/saveOptions3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE1: lngcode1,
    STR_NAMES1: strNames1,
    BLN_MUST_SELS1: blnMustSels1,
    INT_MULTIPLES1: intMultiples1,
    LNG_CHAIN_MENU1: lngChainMenu1,
    LNG_CHAIN_MENU2: lngChainMenu2,
    LNG_CHAIN_MENU3: lngChainMenu3,
    LNG_CHAIN_MENU4: lngChainMenu4,
    LNG_CHAIN_MENU5: lngChainMenu5,
    LNG_CHAIN_MENU6: lngChainMenu6,
    LNG_CHAIN_MENU7: lngChainMenu7,
    LNG_CHAIN_MENU8: lngChainMenu8,
    LNG_CHAIN_MENU9: lngChainMenu9,
    LNG_CHAIN_MENU10: lngChainMenu10,
    LNG_CHAIN_MENU11: lngChainMenu11,
    LNG_CHAIN_MENU12: lngChainMenu12,
    LNG_CHAIN_MENU13: lngChainMenu13,
    LNG_CHAIN_MENU14: lngChainMenu14,
    LNG_CHAIN_MENU15: lngChainMenu15,
    LNG_CHAIN_MENU16: lngChainMenu16,
    LNG_CHAIN_MENU17: lngChainMenu17,
    LNG_CHAIN_MENU18: lngChainMenu18,
    LNG_CHAIN_MENU19: lngChainMenu19,
    LNG_CHAIN_MENU20: lngChainMenu20,
    LNG_CHAIN_MENU21: lngChainMenu21,
  });
};

export const saveOptions4 = (
  groupCd,
  storeCd,
  lngCodes2,
  strNames2,
  lngChainGroup1,
  lngChainGroup2,
  lngChainGroup3,
  lngChainGroup4,
  lngChainGroup5,
  lngChainGroup6,
  lngChainGroup7,
  lngChainGroup8,
  lngChainGroup9,
  lngChainGroup10,
  lngChainGroup11,
  lngChainGroup12,
  lngChainGroup13,
  lngChainGroup14,
  lngChainGroup15,
  lngChainGroup16,
  lngChainGroup17,
  lngChainGroup18,
  lngChainGroup19,
  lngChainGroup20
) => {
  return api2.post("/MIMASTER/MST01_011INS_02.asmx/saveOptions4", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODES2: lngCodes2,
    STR_NAMES2: strNames2,
    LNG_CHAIN_GROUP1: lngChainGroup1,
    LNG_CHAIN_GROUP2: lngChainGroup2,
    LNG_CHAIN_GROUP3: lngChainGroup3,
    LNG_CHAIN_GROUP4: lngChainGroup4,
    LNG_CHAIN_GROUP5: lngChainGroup5,
    LNG_CHAIN_GROUP6: lngChainGroup6,
    LNG_CHAIN_GROUP7: lngChainGroup7,
    LNG_CHAIN_GROUP8: lngChainGroup8,
    LNG_CHAIN_GROUP9: lngChainGroup9,
    LNG_CHAIN_GROUP10: lngChainGroup10,
    LNG_CHAIN_GROUP11: lngChainGroup11,
    LNG_CHAIN_GROUP12: lngChainGroup12,
    LNG_CHAIN_GROUP13: lngChainGroup13,
    LNG_CHAIN_GROUP14: lngChainGroup14,
    LNG_CHAIN_GROUP15: lngChainGroup15,
    LNG_CHAIN_GROUP16: lngChainGroup16,
    LNG_CHAIN_GROUP17: lngChainGroup17,
    LNG_CHAIN_GROUP18: lngChainGroup18,
    LNG_CHAIN_GROUP19: lngChainGroup19,
    LNG_CHAIN_GROUP20: lngChainGroup20,
  });
};
export const saveTLUList = (
  groupcd,
  storecd,
  lngcode,
  strname,
  lngmenu1,
  lngmenu2,
  lngmenu3,
  lngmenu4,
  lngmenu5,
  lngmenu6,
  lngmenu7,
  lngmenu8,
  lngmenu9,
  lngmenu10,
  lngmenu11,
  lngmenu12,
  lngmenu13,
  lngmenu14,
  lngmenu15,
  lngmenu16,
  lngmenu17,
  lngmenu18,
  lngmenu19,
  lngmenu20,
  lngmenu21,
  lngmenu22,
  lngmenu23,
  lngmenu24,
  lngmenu25,
  lngmenu26,
  lngmenu27,
  lngmenu28,
  lngmenu29
) => {
  return api2.post("/MIMASTER/MST01_010INS.asmx/saveTLUList", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    LNG_CD: lngcode,
    STRNAME: strname,
    LNGMENU1: lngmenu1,
    LNGMENU2: lngmenu2,
    LNGMENU3: lngmenu3,
    LNGMENU4: lngmenu4,
    LNGMENU5: lngmenu5,
    LNGMENU6: lngmenu6,
    LNGMENU7: lngmenu7,
    LNGMENU8: lngmenu8,
    LNGMENU9: lngmenu9,
    LNGMENU10: lngmenu10,
    LNGMENU11: lngmenu11,
    LNGMENU12: lngmenu12,
    LNGMENU13: lngmenu13,
    LNGMENU14: lngmenu14,
    LNGMENU15: lngmenu15,
    LNGMENU16: lngmenu16,
    LNGMENU17: lngmenu17,
    LNGMENU18: lngmenu18,
    LNGMENU19: lngmenu19,
    LNGMENU20: lngmenu20,
    LNGMENU21: lngmenu21,
    LNGMENU22: lngmenu22,
    LNGMENU23: lngmenu23,
    LNGMENU24: lngmenu24,
    LNGMENU25: lngmenu25,
    LNGMENU26: lngmenu26,
    LNGMENU27: lngmenu27,
    LNGMENU28: lngmenu28,
    LNGMENU29: lngmenu29,
  });
};

export const savePrintConfig = (
  groupCd,
  storeCd,
  posNos,
  issuecounts,
  issuetypes,
  issuesums,
  rissuecounts,
  rissuetypes,
  kitchenordervoids,
  kitchenmenuvoids,
  kitchenus,
  kitchends,
  floormaxs,
  lnglogos,
  lngstoregroup,
  lngstorecode,
  lngareacode,
  poskiosk,
  lngoption,
  deleteposnos
) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/savePrintConfig", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNos,
    ISSUE_COUNT: issuecounts,
    ISSUE_TYPE: issuetypes,
    ISSUE_SUM: issuesums,
    RISSUE_COUNT: rissuecounts,
    RISSUE_TYPE: rissuetypes,
    KITCHEN_ORDER_VOID: kitchenordervoids,
    KITCHEN_MENU_VOID: kitchenmenuvoids,
    KITCHEN_US: kitchenus,
    KITCHEN_DS: kitchends,
    FLOOR_MAX: floormaxs,
    LNG_LOGO: lnglogos,
    LNG_STOREGROUP: lngstoregroup,
    LNG_STORECODE: lngstorecode,
    LNG_AREACODE: lngareacode,
    POS_KIOSK: poskiosk,
    LNG_OPTION: lngoption,
    DELETE_POSNO: deleteposnos,
  });
};
export const savePosInfo = (
  groupCds,
  storeCds,
  areacds,
  posnos,
  posipeqcl,
  posEqipk,
  dates,
  printcnt,
  lanprintcnt,
  kdscnt,
  didcnt,
  storefg,
  lngprepaid,
  tablecnt,
  posclcd,
  useyn,
  remark,
  deleteGROUP,
  deleteSTORECD,
  deleteAreaCd,
  deletePoss
) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/savePosInfo", {
    GROUP_CDS: groupCds,
    STORE_CDS: storeCds,
    AREA_CDS: areacds,
    POS_NOS: posnos,
    POS_IP_CL: posipeqcl,
    POS_IPK: posEqipk,
    DATES: dates,
    PRINT_CNT: printcnt,
    LANPRINT_CNT: lanprintcnt,
    KDS_CNT: kdscnt,
    DID_CNT: didcnt,
    STORE_FG: storefg,
    LNG_PREPAID: lngprepaid,
    TABLE_CNT: tablecnt,
    POS_CLCDS: posclcd,
    USE_YNS: useyn,
    REMARKS: remark,
    DELETE_GROUP: deleteGROUP,
    DELETE_STORE: deleteSTORECD,
    DELETE_AREA: deleteAreaCd,
    DELETE_POS: deletePoss,
  });
};
export const savePortDefaultSetting = (
  groupCds,
  storeCds,
  areacds,
  posnos,
  ports,
  strnames,
  strsettings,
  lngoleType,
  lngmachineType,
  blnopen,
  blnshare,
  lngmachine,
  deleteGROUP,
  deleteSTORECD,
  deleteAreaCd,
  deletePoss,
  deletePort
) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/savePortDefaultSetting", {
    GROUP_CDS: groupCds,
    STORE_CDS: storeCds,
    AREA_CDS: areacds,
    POS_NOS: posnos,
    PORTS: ports,
    STRNAMES: strnames,
    STRSETTINGS: strsettings,
    LNGOLETYPES: lngoleType,
    LNG_MATCHINETYPE: lngmachineType,
    BLNOPEN: blnopen,
    BLNSHARE: blnshare,
    LNG_MACHINE: lngmachine,
    DELETE_GROUP: deleteGROUP,
    DELETE_STORE: deleteSTORECD,
    DELETE_AREA: deleteAreaCd,
    DELETE_POS: deletePoss,
    DELETE_PORT: deletePort,
  });
};

export const getPortDefaultInfo = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/getPortDefaultInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getPosInfo = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_063INS.asmx/getPosInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getKDSList = (groupCd) => {
  return api2.post("/MIMASTER/MST44_061INS.asmx/getKDSList", {
    GROUP_CD: groupCd,
  });
};
export const getAllOptionManageData = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_011INS_01.asmx/getAllOptionManageData", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getAllOptionManageData2 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_011INS_02.asmx/getAllOptionManageData2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMostColumnMenuList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_011INS_01.asmx/getMostColumnMenuList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getTableList = (groupCd, storeCd, posNo, areaCd) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/getTableList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNo,
    AREA_CD: areaCd,
  });
};

export const getTableList2 = (groupCd, storeCd, areaCd, posNo, screenNo) => {
  return api2.post("/MIMASTER/MST_001INS.asmx/getTableList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
    SCREENNO: screenNo,
  });
};
export const getacc = (groupCd) => {
  return api2.post("/MIMASTER/MST40_001INS.asmx/getacc", {
    GROUP_CD: groupCd,
  });
};

export const getTableScreenKeys = (groupCd, storeCd, posNo, AreaCd) => {
  return api2.post("/MIMASTER/MST_002INS.asmx/getTableScreenKeys", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNo,
    AREA_CD: AreaCd,
  });
};
export const getStorePosList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/getStorePosList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getKDSSettingList = (groupCd, store_cd) => {
  return api2.post("/MIMASTER/MST44_061INS.asmx/getKDSSettingList", {
    GROUP_CD: groupCd,
    STORE_CD: store_cd,
  });
};
export const getTLUManageInfo = (groupCd, store_cd) => {
  return api2.post("/MIMASTER/MST01_010INS.asmx/getTLUManageInfo", {
    GROUP_CD: groupCd,
    STORE_CD: store_cd,
  });
};
export const getCardInfo = (groupCd, store_cd) => {
  return api2.post("/MIMASTER/MST43_001INS.asmx/getCardInfo", {
    GROUP_CD: groupCd,
    STORE_CD: store_cd,
  });
};
export const getAmountGroup = (groupCd) => {
  return api2.post("/MIMASTER/MST36_003INS.asmx/getAmountGroup", {
    GROUP_CD: groupCd,
  });
};
export const getAllPayList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST36_055INS.asmx/getAllPayList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getPayCodeEnrollInfo = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST36_001INS.asmx/getPayCodeEnrollInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMenuCodeEnroll = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_033INS.asmx/getMenuCodeEnroll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const uploadFile = (formData) => {
  return api2.post("/MIMASTER/FileUpload.ashx", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 일부 서버에서 필요할 수 있음
    },
  });
};

export const getPosList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/getPosList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getAreaList = (groupCd, storeCd, posNo) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/getAreaList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNo,
  });
};
export const getMasterList = (min_table, max_table) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/getMasterList", {
    MIN_TABLE_ID: min_table,
    MAX_TABLE_ID: max_table,
  });
};
export const getMaster2List = (groupCd, storeCd, areaCd, posNo, date) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/getMaster2List", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
    DTM_DATE: date,
  });
};
export const insertMasterList = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tableIds,
  date
) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/insertMasterList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
    TABLE_ID: tableIds,
    DTM_DATE: date,
  });
};
export const deleteMasterList = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  tableIds,
  date
) => {
  return api2.post("/MIMASTER/MST01_032INS.asmx/deleteMasterList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
    TABLE_ID: tableIds,
    DTM_DATE: date,
  });
};

export const getPayCodeListbyCode = (groupCd, lngcode) => {
  return api2.post("/MIMASTER/MST36_001INS.asmx/getPayCodeListbyCode", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
  });
};
export const CopyDiscountMenuList = (groupCd, lngcode, copyList) => {
  return api2.post("/MIMASTER/MST36_001INS.asmx/CopyDiscountMenuList", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
    COPYLIST: copyList,
  });
};
export const getAmountListByMenuCode = (groupCd, lngcode) => {
  return api2.post("/MIMASTER/MST01_033INS.asmx/getAmountListByMenuCode", {
    GROUP_CD: groupCd,
    MENUCODE: lngcode,
  });
};
export const copyMenuListByCode = (groupCd, lngcode, menucdlist) => {
  return api2.post("/MIMASTER/MST01_033INS.asmx/copyMenuListByCode", {
    GROUP_CD: groupCd,
    MENUCODE: lngcode,
    COPYLIST: menucdlist,
  });
};
export const getMenuGroupList = (groupCd, storecd, cond) => {
  return api2.post("/MIMASTER/MST01_014INS.asmx/getMenuGroupList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};

export const getSalesUnitbyStore = (
  groupCd,
  storecd,
  maincode,
  subcode,
  stype,
  cond
) => {
  return api2.post("/MIMASTER/MST01_014INS.asmx/getSalesUnitbyStore", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    MAINCODE: maincode,
    SUBCODE: subcode,
    SEARCH_TYPE: stype,
    COND: cond,
  });
};
export const getMenuStoreList = (groupCd) => {
  return api2.post("/MIMASTER/MST37_068INS.asmx/getMenuStoreList", {
    GROUP_CD: groupCd,
  });
};
export const getSubGroup = (groupCd) => {
  return api2.post("/MIMASTER/MST37_068INS.asmx/getSubGroup", {
    GROUP_CD: groupCd,
  });
};
export const getSubGroup2 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/getSubGroup2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getMultiGroup = (groupCd) => {
  return api2.post("/MIMASTER/MST37_068INS.asmx/getMultiGroup", {
    GROUP_CD: groupCd,
  });
};
export const getMultiGroup2 = (groupCd, multiNm) => {
  return api2.post("/MIMASTER/MST37_067INS.asmx/getMultiGroup2", {
    GROUP_CD: groupCd,
    MULTINAME: multiNm,
  });
};
export const getMenuStock = (groupCd, storecd, cond) => {
  return api2.post("/MIMASTER/MST37_071INS.asmx/getMenuStock", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};

export const saveMenuStock = (groupCd, storecd, cond) => {
  return api2.post("/MIMASTER/MST37_071INS.asmx/saveMenuStock", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};
export const saveUpdatelngPrice = (groupCd, storecd, menucds, lngprices) => {
  return api2.post("/MIMASTER/MST01_014INS.asmx/saveUpdatelngPrice", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    MENU_CD: menucds,
    LNG_PRICE: lngprices,
  });
};
export const getMultiPrice = (groupCd, multigroup, subgroup, searchword) => {
  return api2.post("/MIMASTER/MST37_068INS.asmx/getMultiPrice", {
    GROUP_CD: groupCd,
    MULTIGROUP: multigroup,
    SUBGROUP: subgroup,
    SEARCH_WORD: searchword,
  });
};
export const overLapCheck = (
  groupCd,
  menucodes,
  storecodes,
  startdate,
  enddate
) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/overLapCheck", {
    GROUP_CD: groupCd,
    MENU_CD: menucodes,
    STORE_CD: storecodes,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};

export const saveMultiPrice = (
  groupCd,
  multipricegroupcode,
  lngMenuCode,
  lngMultiPrice
) => {
  return api2.post("/MIMASTER/MST37_068INS.asmx/saveMultiPrice", {
    GROUP_CD: groupCd,
    MULTI_GROUPCODE: multipricegroupcode,
    MENU_CODES: lngMenuCode,
    MULTI_PRICES: lngMultiPrice,
  });
};

export const getSpecialPriceList = (
  groupCd,
  startdate,
  enddate,
  subgroup,
  cond2,
  storeCd
) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/getSpecialPriceList", {
    GROUP_CD: groupCd,
    START_DATE: startdate,
    END_DATE: enddate,
    SUBGROUP: subgroup,
    COND: cond2,
    STORE_CD: storeCd,
  });
};
export const saveExceptionSpecialPrice = (
  groupCd,
  storeCd,
  menucodes,
  prices,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/saveExceptionSpecialPrice", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_CD: menucodes,
    PRICES: prices,
    START_DATE: startdate,
    END_DATE: enddate,
    APPLY: cond,
    IGNORE: cond2,
  });
};
export const deleteSpecialPrices = (SpecialMenuCode) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/deleteSpecialPrices", {
    MENU_CD: SpecialMenuCode,
  });
};
export const updateMultiPrice = (SpecialMenuCode, prices, date) => {
  return api2.post("/MIMASTER/MST37_069INS.asmx/updateMultiPrice", {
    MENU_CDS: SpecialMenuCode,
    PRICES: prices,
    DATE: date,
  });
};

export const getClientList = (groupCd, clientcd, clientNm) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/getClientList", {
    GROUP_CD: groupCd,
    CLIENT_CD: clientcd,
    CLIENT_NM: clientNm,
  });
};
export const saveClientInfo = (
  groupCd,
  sd,
  sn,
  rn,
  sdr,
  dt,
  dk,
  sds,
  sz,
  st,
  sf,
  sm,
  smt,
  sh,
  se,
  at,
  cc,
  sl
) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/saveClientInfo", {
    GROUP_CDS: groupCd,
    SUPPLIER_ID: sd,
    SUPPLIER_NM: sn,
    REGISTER_NO: rn,
    STR_DIRECTOR: sdr,
    DEALTYPE: dt,
    DEALKIND: dk,
    STRADDRESS: sds,
    STRZIPCODE: sz,
    STRTELNO: st,
    STRFAXNO: sf,
    STRMANAGER: sm,
    STRMANAGERTELNO: smt,
    STRHPNO: sh,
    STREMAIL: se,
    ACCTYPE: at,
    CONVCODE: cc,
    SUPPLIERTYPE: sl,
  });
};

export const deleteClientInfo = (groupCd, supid, suptype) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/deleteClientInfo", {
    GROUP_CD: groupCd,
    SUP_ID: supid,
    SUP_TYPE: suptype,
  });
};

export const getCustCompany3 = (groupCd) => {
  return api2.post("/MIMASTER/MST49_008INS.asmx/getCustCompany3", {
    GROUP_CD: groupCd,
  });
};
export const getStoreInfoList = (compCode, storeCd) => {
  return api2.post("/MIMASTER/MST49_008INS.asmx/getStoreInfoList", {
    COMP_CD: compCode,
    STORE_CD: storeCd,
  });
};
export const saveCompInfo = (groupCd, compCode, bpid, bpnm, useyn, regid) => {
  return api2.post("/MIMASTER/MST49_008INS.asmx/saveCompInfo", {
    GROUP_CD: groupCd,
    COMP_CD: compCode,
    BP_ID: bpid,
    BP_NM: bpnm,
    USE_YN: useyn,
    REG_ID: regid,
  });
};
export const getMasterAutoDownloadList = (
  groupCd,
  attr,
  storeCd,
  cond,
  cond2
) => {
  return api2.post("/MIMASTER/MST01_032RPT.asmx/getMasterAutoDownloadList", {
    GROUP_CD: groupCd,
    ATTR: attr,
    STORE_CD: storeCd,
    SDATE: cond,
    EDATE: cond2,
  });
};
export const getSubTitleList = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST37_001INS.asmx/getSubTitleList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const deleteSubTitles = (groupCd, storeCd, lngCode) => {
  return api2.post("/MIMASTER/MST37_001INS.asmx/deleteSubTitles", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngCode,
  });
};
export const saveSubTitle = (
  groupCd,
  storeCd,
  lngCode,
  strName,
  lngmenu1,
  lngmenu2,
  lngmenu3,
  lngmenu4,
  lngmenu5,
  lngmenu6,
  lngmenu7,
  lngmenu8
) => {
  return api2.post("/MIMASTER/MST37_001INS.asmx/saveSubTitle", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngCode,
    STRNAME: strName,
    LNGMENU1: lngmenu1,
    LNGMENU2: lngmenu2,
    LNGMENU3: lngmenu3,
    LNGMENU4: lngmenu4,
    LNGMENU5: lngmenu5,
    LNGMENU6: lngmenu6,
    LNGMENU7: lngmenu7,
    LNGMENU8: lngmenu8,
  });
};

export const getSalesInfoByCorner = (groupCd, type, storeCd, cornerCd) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/getSalesInfoByCorner", {
    GROUP_CD: groupCd,
    TYPE: type,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
  });
};
export const getSoldMenuList = (
  groupCd,
  storeCd,
  cornerCd,
  cond,
  cond2,
  sortType
) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/getSoldMenuList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
    COND: cond,
    COND2: cond2,
    SORT: sortType,
  });
};
export const getMenuConList = (
  groupCd,
  storeCd,
  cornerCd,
  cond,
  cond2,
  cond3
) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/getMenuConList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};

export const saveMenuInfo = (groupCd, storeCd, menuCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/saveMenuInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_CD: menuCd,
    STS: cond,
    USER_ID: cond2,
  });
};
export const getSCTeamList = (groupCd) => {
  return api2.post("/MIMASTER/MST01_005INS.asmx/getSCTeamList", {
    GROUP_CD: groupCd,
  });
};

export const saveSCTeamList = (groupCd, teamcd, teamnm, id, ip) => {
  return api2.post("/MIMASTER/MST01_005INS.asmx/saveSCTeamList", {
    GROUP_CD: groupCd,
    TEAM_CD: teamcd,
    TEAM_NM: teamnm,
    USER_ID: id,
    USER_IP: ip,
  });
};
export const deleteSCTeam = (groupCd, teamcd, id, ip) => {
  return api2.post("/MIMASTER/MST01_005INS.asmx/deleteSCTeam", {
    GROUP_CD: groupCd,
    TEAM_CD: teamcd,
    USER_ID: id,
    USER_IP: ip,
  });
};
export const getSAFMasterDownload = (cond, cond2) => {
  return api2.post("/MIMASTER/MST44_057INS.asmx/getSAFMasterDownload", {
    COND: cond,
    COND2: cond2,
  });
};

export const deleteStoreConTable = (groupCd, storecd, cond) => {
  return api2.post("/MIMASTER/MST01_011INS_02.asmx/deleteStoreConTable", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};
export const deleteOptionGroup = (groupCd, storecd, cond) => {
  return api2.post("/MIMASTER/MST01_011INS_02.asmx/deleteOptionGroup", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};

export const getMaterialUnit = (groupCd) => {
  return api2.post("/MIMASTER/MST45_033INS.asmx/getMaterialUnit", {
    GROUP_CD: groupCd,
  });
};

export const saveMaterialUnit = (
  groupCd,
  lngUnitID,
  strUnitName,
  groupCds,
  dlngUnitID
) => {
  return api2.post("/MIMASTER/MST45_033INS.asmx/saveMaterialUnit", {
    GROUP_CD: groupCd,
    UNIT_ID: lngUnitID,
    UNIT_NM: strUnitName,
    GROUP_CDS: groupCds,
    D_UNIT_ID: dlngUnitID,
  });
};

export const getMaterialGroup = (groupCd) => {
  return api2.post("/MIMASTER/MST04_026INS.asmx/getMaterialGroup", {
    GROUP_CD: groupCd,
  });
};

export const saveMaterialGroup = (
  groupCd,
  lngStockGroupID,
  strStockGroupName,
  groupCds,
  dlngStockGroupID
) => {
  return api2.post("/MIMASTER/MST04_026INS.asmx/saveMaterialGroup", {
    GROUP_CD: groupCd,
    ST_GROUP_ID: lngStockGroupID,
    ST_GROUP_NM: strStockGroupName,
    GROUP_CDS: groupCds,
    D_GROUP_ID: dlngStockGroupID,
  });
};

export const getStandard = (groupCd) => {
  return api2.post("/MIMASTER/MST45_051INS.asmx/getStandard", {
    GROUP_CD: groupCd,
  });
};

export const saveStandard = (
  groupCd,
  lngStandardID,
  strStandardName,
  groupCds,
  dlngStandardID
) => {
  return api2.post("/MIMASTER/MST45_051INS.asmx/saveStandard", {
    GROUP_CD: groupCd,
    ST_GROUP_ID: lngStandardID,
    ST_GROUP_NM: strStandardName,
    GROUP_CDS: groupCds,
    D_GROUP_ID: dlngStandardID,
  });
};
export const getLossType = async (groupCd, lang) => {
  return api2.post("/MIMASTER/MST04_014INS.asmx/getLossType", {
    GROUP_CD: groupCd,
    LANG: lang,
  });
};
export const saveLossType = async (
  groupCd,
  storeCd,
  itype,
  codes,
  names,
  flag,
  cond
) => {
  return api2.post("/MIMASTER/MST04_014INS.asmx/saveLossType", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ITEMTYPE: itype,
    CODES: codes,
    NAMES: names,
    FLAGS: flag,
    COND: cond,
  });
};
export const getStockGroup = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getStockGroup", {
    GROUP_CD: groupCd,
  });
};
export const getStockCategory = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getStockCategory", {
    GROUP_CD: groupCd,
  });
};
export const getStockGeneric = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getStockGeneric", {
    GROUP_CD: groupCd,
  });
};
export const getSuppliers = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getSuppliers", {
    GROUP_CD: groupCd,
  });
};
export const getStandardList = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getStandardList", {
    GROUP_CD: groupCd,
  });
};
export const getUnitList = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getUnitList", {
    GROUP_CD: groupCd,
  });
};
export const getStockItemList = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  lang
) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getStockItemList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
    COND8: cond8,
    LANG: lang,
  });
};

export const saveMaterialCode = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10,
  cond11,
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26
) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/saveMaterialCode", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
    COND8: cond8,
    COND9: cond9,
    COND10: cond10,
    COND11: cond11,
    COND12: cond12,
    COND13: cond13,
    COND14: cond14,
    COND15: cond15,
    COND16: cond16,
    COND17: cond17,
    COND18: cond18,
    COND19: cond19,
    COND20: cond20,
    COND21: cond21,
    COND22: cond22,
    COND23: cond23,
    COND24: cond24,
    COND25: cond25,
    COND26: cond26,
  });
};

export const saveStockAddInfo = async (groupCd, cond, cond2, cond3, cond4) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/saveStockAddInfo", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
  });
};
export const deleteStockAddInfo = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/deleteStockAddInfo", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const deleteStockItem = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/deleteStockItem", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};

export const getMaterialDetail = async (groupCd, cond, cond2, cond3) => {
  return api2.post("/MIMASTER/MST04_001INS.asmx/getMaterialDetail", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const saveStockExcelData = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10,
  cond11,
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22
) => {
  return api2.post("/MIMASTER/MST04_002INS.asmx/saveStockExcelData", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
    COND8: cond8,
    COND9: cond9,
    COND10: cond10,
    COND11: cond11,
    COND12: cond12,
    COND13: cond13,
    COND14: cond14,
    COND15: cond15,
    COND16: cond16,
    COND17: cond17,
    COND18: cond18,
    COND19: cond19,
    COND20: cond20,
    COND21: cond21,
    SEQUENCE: cond22,
  });
};

export const getStockEnrollList = async (groupCd, cond, cond2, cond3) => {
  return api2.post("/MIMASTER/MST04_002INS.asmx/getStockEnrollList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const getStoreForMenuReceipt = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/getStoreForMenuReceipt", {
    GROUP_CD: groupCd,
  });
};
export const getMenuList4 = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/getMenuList4", {
    GROUP_CD: groupCd,
  });
};
export const getItemsList = async (groupCd) => {
  return api2.post("/MIMASTER/MST04_025INS.asmx/getItemsList", {
    GROUP_CD: groupCd,
  });
};
export const getMenuMasterList = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/getMenuMasterList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getProductDetailList = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_025INS.asmx/getProductDetailList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getMenuReceipt = async (groupCd, storeCd, cond, cond2, cond3) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/getMenuReceipt", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const deleteMenuDetail = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5
) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/deleteMenuDetail", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
  });
};

export const getStockItemSearch = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/getStockItemSearch", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
  });
};

export const saveMenuDetails = async (
  groupCd,
  storeCd,
  menuCd,
  fdate,
  edate,
  itemids,
  dblquantity,
  classtypes,
  unitids,
  seqids,
  classnms,
  flag,
  byexcel
) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/saveMenuDetails", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_CD: menuCd,
    F_DATE: fdate,
    E_DATE: edate,
    ITEMIDS: itemids,
    DBLQUAN: dblquantity,
    CLASSTYPES: classtypes,
    UNITIDS: unitids,

    SEQIDS: seqids,
    CLASSNMS: classnms,
    FLAG: flag,
    EXCEL: byexcel,
  });
};

export const saveNewMenuMaster = async (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIMASTER/MST04_024INS.asmx/saveNewMenuMaster", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
  });
};

export const saveProduct = async (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5
) => {
  return api2.post("/MIMASTER/MST04_025INS.asmx/saveProduct", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
  });
};
export const getStockItemSearch2 = async (groupCd, cond, cond2, cond3) => {
  return api2.post("/MIMASTER/MST04_025INS.asmx/getStockItemSearch2", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const saveProductDetails = async (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7
) => {
  return api2.post("/MIMASTER/MST04_025INS.asmx/saveProductDetails", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
  });
};

export const getStockCycle = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_027INS.asmx/getStockCycle", {
    GROUP_CD: groupCd,
    STORE_CD: cond,
    COND: cond2,
  });
};
export const getStockCycle2 = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST45_034INS.asmx/getStockCycle2", {
    GROUP_CD: groupCd,
    STORE_CD: cond,
    COND: cond2,
  });
};

export const saveStockCycle = async (
  groupCd,
  storeCd,
  cond,
  leadtimes,
  blnsun,
  blnmon,
  blntue,
  blnwed,
  blnthur,
  blnfri,
  blnsat
) => {
  return api2.post("/MIMASTER/MST04_027INS.asmx/saveStockCycle", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: leadtimes,
    COND3: blnsun,
    COND4: blnmon,
    COND5: blntue,
    COND6: blnwed,
    COND7: blnthur,
    COND8: blnfri,
    COND9: blnsat,
  });
};

export const saveStockCycle2 = async (
  groupCd,
  storeCd,
  cond,
  leadtimes,
  blnsun,
  blnmon,
  blntue,
  blnwed,
  blnthur,
  blnfri,
  blnsat
) => {
  return api2.post("/MIMASTER/MST45_034INS.asmx/saveStockCycle2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
    COND2: leadtimes,
    COND3: blnsun,
    COND4: blnmon,
    COND5: blntue,
    COND6: blnwed,
    COND7: blnthur,
    COND8: blnfri,
    COND9: blnsat,
  });
};

export const getStockDemandList = async (groupCd, cond) => {
  return api2.post("/MIMASTER/MST04_016INS.asmx/getStockDemandList", {
    GROUP_CD: groupCd,
    COND: cond,
  });
};

export const saveStockDemandList = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_016INS.asmx/saveStockDemandList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getSubLeaseList = async (groupCd, cond) => {
  return api2.post("/MIMASTER/MST04_016INS.asmx/getSubLeaseList", {
    GROUP_CD: groupCd,
    COND: cond,
  });
};
export const copyStockDemand = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST04_016INS.asmx/copyStockDemand", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getStockItemList2 = async (groupCd, cond, cond2) => {
  return api2.post("/MIMASTER/MST45_043INS.asmx/getStockItemList2", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
  });
};
export const getStockStoreList = async (groupCd, storetype, storeCd, cond) => {
  return api2.post("/MIMASTER/MST45_043INS.asmx/getStockStoreList", {
    GROUP_CD: groupCd,
    STORE_TY: storetype,
    STORE_CD: storeCd,
    COND: cond,
  });
};

export const saveStockStore = async (
  groupCd,
  storecds,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MIMASTER/MST45_043INS.asmx/saveStockStore", {
    GROUP_CD: groupCd,
    STORE_CD: storecds,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
  });
};

export const getStockPartInfo = (groupCd) => {
  return api2.post("/MIMASTER/MST45_031INS.asmx/getStockPartInfo", {
    GROUP_CD: groupCd,
  });
};

export const saveStockPartInfo = async (
  lngstoregroup,
  partCds,
  strPartNames,
  blnUseYn,
  strRegID
) => {
  return api2.post("/MIMASTER/MST45_031INS.asmx/saveStockPartInfo", {
    GROUP_CD: lngstoregroup,
    PART_CD: partCds,
    PART_NM: strPartNames,
    USE_YN: blnUseYn,
    REG_ID: strRegID,
  });
};

export const getStockStoreInfo = (groupCd, partCd) => {
  return api2.post("/MIMASTER/MST45_031INS.asmx/getStockStoreInfo", {
    GROUP_CD: groupCd,
    PART_CD: partCd,
  });
};

export const saveStockStoreInfo = async (
  lngstoregroup,
  partCds,
  storeCds,
  lngChecks,
  strRegID
) => {
  return api2.post("/MIMASTER/MST45_031INS.asmx/saveStockStoreInfo", {
    GROUP_CD: lngstoregroup,
    PART_CD: partCds,
    STORE_CD: storeCds,
    USE_YN: lngChecks,
    REG_ID: strRegID,
  });
};

export const saveMajorCategory = async (
  lngstoregroup,
  lngstoreCode,
  oldCateValues,
  NewCateValues
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/saveMajorCategory", {
    GROUP_CD: lngstoregroup,
    STORE_CD: lngstoreCode,
    OLD_CATE: oldCateValues,
    NEW_CATE: NewCateValues,
  });
};

export const saveSubCategory = async (
  lngstoregroup,
  lngstoreCode,
  orgCateValues,
  oldCateValues,
  NewCateValues
) => {
  return api2.post("/MIMASTER/MST57_001INS.asmx/saveSubCategory", {
    GROUP_CD: lngstoregroup,
    STORE_CD: lngstoreCode,
    ORG_CATE: orgCateValues,
    OLD_CATE: oldCateValues,
    NEW_CATE: NewCateValues,
  });
};
export const getStockCycle3 = async (groupCd, storeCd, cond) => {
  return api2.post("/MIMASTER/MST45_030INS.asmx/getStockCycle3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
  });
};

export const saveStockCycle3 = async (
  groupCd,
  storeCd,
  cond,
  leadtimes,
  blnsun,
  blnmon,
  blntue,
  blnwed,
  blnthur,
  blnfri,
  blnsat
) => {
  return api2.post("/MIMASTER/MST45_030INS.asmx/saveStockCycle3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SUPPLIER: cond,
    COND2: leadtimes,
    COND3: blnsun,
    COND4: blnmon,
    COND5: blntue,
    COND6: blnwed,
    COND7: blnthur,
    COND8: blnfri,
    COND9: blnsat,
  });
};

export const getOrderEmailList = (groupCd, supplier) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/getOrderEmailList", {
    GROUP_CD: groupCd,
    SUPPLIER: supplier,
  });
};

export const setSupplierEmail = (
  groupCd,
  supplier,
  email,
  managernm,
  userid
) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/setSupplierEmail", {
    GROUP_CD: groupCd,
    SUPPLIER: supplier,
    EMAIL: email,
    MANAGERNM: managernm,
    USERID: userid,
  });
};

export const deleteOrderEmail = (groupCd, supplier, sequence, userid) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/deleteOrderEmail", {
    GROUP_CD: groupCd,
    SUPPLIER: supplier,
    SEQUENCE: sequence,
    USERID: userid,
  });
};

export const getNewSupplierID = (groupCd) => {
  return api2.post("/MIMASTER/MST42_001INS.asmx/getNewSupplierID", {
    GROUP_CD: groupCd,
  });
};

export const saveCornerInfoList = (
  groupCd,
  storecds,
  cornercds,
  stktypes,
  openhours,
  openmins,
  closehours,
  closemins,
  userid
) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/saveCornerInfoList", {
    GROUP_CD: groupCd,
    STORE_CD: storecds,
    CORNER_CD: cornercds,
    STK_TYPES: stktypes,
    OPENHOURS: openhours,
    OPENMINS: openmins,
    CLOSEHOURS: closehours,
    CLOSEMINS: closemins,
    USERID: userid,
  });
};

export const saveCornerInfoList2 = (
  groupCd,
  storecds,
  menucds,
  stktypes,
  openhours,
  openmins,
  closehours,
  closemins,
  userid
) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/saveCornerInfoList2", {
    GROUP_CD: groupCd,
    STORE_CD: storecds,
    MENU_CD: menucds,
    STK_TYPES: stktypes,
    OPENHOURS: openhours,
    OPENMINS: openmins,
    CLOSEHOURS: closehours,
    CLOSEMINS: closemins,
    USERID: userid,
  });
};

export const getMstBasic = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_062INS.asmx/getMstBasic", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const saveMultiPriceGroup = (
  groupCd,
  multipricegroupcode,
  multipricegroupNm,
  order
) => {
  return api2.post("/MIMASTER/MST37_067INS.asmx/saveMultiPriceGroup", {
    GROUP_CD: groupCd,
    MULTI_GROUPCODE: multipricegroupcode,
    MULTI_GROUPNM: multipricegroupNm,
    ORDER: order,
  });
};

export const deleteMultiPriceGroup = (groupCd, multipricegroupcode) => {
  return api2.post("/MIMASTER/MST37_067INS.asmx/deleteMultiPriceGroup", {
    GROUP_CD: groupCd,
    MULTI_GROUPCODE: multipricegroupcode,
  });
};
export const getCustomerControlDisp = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_065INS.asmx/getCustomerControlDisp", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
  });
};
export const saveCustDispInfo = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  operTypes,
  seqs,
  dispTypes,
  dispTimes,
  strNames
) => {
  return api2.post("/MIMASTER/MST44_065INS.asmx/saveCustDispInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
    OPER_TYPE: operTypes,
    SEQ: seqs,
    DISTYPES: dispTypes,
    DISPTIMES: dispTimes,
    STRNAMES: strNames,
  });
};

export const getSoldMenuList3 = (groupCd, potype, position, cond, sortType) => {
  return api2.post("/MIMASTER/MST56_001INS.asmx/getSoldMenuList3", {
    GROUP_CD: groupCd,
    POSITION_TYPE: potype,
    POSITION: position,
    COND: cond,
    SORT: sortType,
  });
};

export const pncInterFaceAPI = (path, paraNm, paraCd) => {
  return api2.post("/MIMASTER/MST44_057INS.asmx/pncInterFaceAPI", {
    PATH: path,
    PARANM: paraNm,
    PARACD: paraCd,
  });
};

export const getMenuDiscCount = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST01_033INS.asmx/getMenuDiscCount", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getMenuDiscCount2 = (groupCd) => {
  return api2.post("/MIMASTER/MST01_033INS.asmx/getMenuDiscCount2", {
    GROUP_CD: groupCd,
  });
};

export const getMultiLingual2 = (groupCd, storeCd, menuCd) => {
  return api2.post("/MIMASTER/MST44_066INS.asmx/getMultiLingual2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_CD: menuCd,
  });
};
export const saveMultiLang = (
  groupCd,
  storeCd,
  lngtype,
  managecode,
  langid,
  managenm,
  dgroupCd,
  dstoreCd,
  dlngtype,
  dmanagecode,
  dlangid
) => {
  return api2.post("/MIMASTER/MST44_066INS.asmx/saveMultiLang", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNGTYPE: lngtype,
    MANAGECODE: managecode,
    LANGID: langid,
    MAANGENM: managenm,
    DGROUP_CD: dgroupCd,
    DSTORE_CD: dstoreCd,
    DLNGTYPE: dlngtype,
    DMANAGECODE: dmanagecode,
    DLANGID: dlangid,
  });
};

export const getMenuList5 = (groupCd, storeCd) => {
  return api2.post("/MIMASTER/MST44_066INS.asmx/getMenuList5", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getScreenList5 = (groupCd, storeCd, areaCd, posNo) => {
  return api2.post("/MIMASTER/MST44_066INS.asmx/getScreenList5", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
  });
};

export const getMultiLingual3 = (groupCd, storeCd, screenNo) => {
  return api2.post("/MIMASTER/MST44_066INS.asmx/getMultiLingual3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SCREEN_NO: screenNo,
  });
};

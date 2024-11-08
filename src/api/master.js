
import axios from 'axios';
import {commonUrl,commonUrl2} from './common';

const url = commonUrl;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
export const url2 = commonUrl2;
const api2 = axios.create({
    baseURL: url2, // API 기본 URL
    timeout: 10000, // 요청 타임아웃 설정
  });
// API 요청 메서드들
export const get_pos = (groupCd, storeCd) => {
    return api.post('/VUE_usp_MST01_032INS_GET_POS', {
        P_GROUP_CD: groupCd,
        P_STORE_CD: storeCd
    });
};
export const get_area = (groupCd, storeCd , posNo) => {
    return api.post('/VUE_usp_MST01_032INS_GET_AREA', {
        P_GROUP_CD: groupCd,
        P_STORE_CD: storeCd ,
        POS_NO : posNo
    });
};
export const get_ins_list1 = (min , max) => {
    return api.post('/VUE_usp_MST01_032INS_GET_LIST1', {
         MIN_TABLE_ID : min,
         MAX_TABLE_ID  : max
    });
};
export const get_ins_list2 = (groupCd , storeCd , lngAreaCd , posNo ,selectedDate) => {
    return api.post('/VUE_usp_MST01_032INS_GET_LIST2', {
        P_GROUP_CD: groupCd,
        P_STORE_CD : storeCd == '0' ? '0' : storeCd,
        P_AREA_CD : lngAreaCd == '0' ? '0' : lngAreaCd,
        POS_NO : posNo == '0' ? '0' : posNo,
        DTM_DATE : selectedDate
    });
};
export const master_save = (groupCd , storeCd , lngAreaCd , posNo ,selectedrows,selectedDate) => {
    return api.post('/VUE_usp_MST01_032INS_INSERT', {
        P_GROUP_CD: groupCd,
        P_STORE_CD : storeCd,
        P_AREA_CD : lngAreaCd,
        POS_NO : posNo,
        TABLE_ID : selectedrows ,
        DTM_DATE : selectedDate
    });
};
export const master_delete = (groupCd , storeCd , lngAreaCd , posNo ,selectedrows,selectedDate) => {
    return api.post('/VUE_usp_MST01_032INS_DEL', {
        P_GROUP_CD: groupCd,
        P_STORE_CD : storeCd,
        P_AREA_CD : lngAreaCd,
        POS_NO : posNo,
        TABLE_ID : selectedrows ,
        DTM_DATE : selectedDate
    });
};
export const getMultiPrice = (groupCd ) => {
    return api.post('/VUE_usp_getMultiPriceGroup', {
        P_GROUP_CD: groupCd
    });
};
export const storeAttr = (groupCd ,storeType ) => {
    return api.post('/VUE_usp_mstStoreAttr_Query', {
        P_GROUP_CD: groupCd ,
        P_STORE_ATTR: storeType
    });
};
export const joinType_query = (groupCd) => {
    return api.post('/VUE_usp_mstJoinType_Query', {
        P_GROUP_CD: groupCd 
    });
};
export const subLease_query = (groupCd) => {
    return api.post('/VUE_usp_mstSubLease_Query', {
        P_GROUP_CD: groupCd 
    });
};
export const storeArea = (groupCd) => {
    return api.post('/VUE_usp_mstStoreArea', {
        P_GROUP_CD: groupCd 
    });
};
export const INS006_select = (groupCd) => {
    return api.post('/VUE_usp_MST01_006INS_SELECT', {
        P_GROUP_CD: groupCd 
    });
};
export const INS004_select = (groupCd) => {
    return api.post('/VUE_usp_MST01_004INS_SELECT', {
        P_GROUP_CD: groupCd 
    });
};
export const store_query = (groupCd ,storeType ,storeCd ,searchStoreName) => {
    return api.post('/VUE_usp_mstStore_Query', {
         P_GROUP_CD: groupCd,
         P_STORE_ATTR : storeType,
         P_STORE_CD : storeCd,
         P_SEARCH_TEXT : searchStoreName ? searchStoreName : ''
    });
};
export const store_delete = (groupCd ,lngStoreCode) => {
    return api.post('/VUE_usp_mstStore_Delete', {
         P_GROUP_CD: groupCd,
         P_STORE_CD : lngStoreCode,
       
    });
};
export const store_insert = (finalObject) => {
    return api.post('/VUE_usp_mstStore_Insert', finalObject);
};
export const store_update = (finalObject1) => {
    return api.post('/VUE_usp_mstStore_Update', finalObject1);
};

export const tablePosMenu = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/getTablePosMenu', data);
};

export const tablePosMenuKey = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/getTablePosMenuKey', data);
};

export const savetablePosMenuKey = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/insertTablePosMenuKey', data);
};

export const deletetablePosMenuKey = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/deleteTablePosMenuKey', data);
};

export const setSubCategoryDelete = (groupCd ,storeCd , areaCd,majorCd , subCd) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setSubCategoryDelete', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd,
        MAJOR_CD: majorCd,
        SUB_CD: subCd
    });
};
export const setMainCategoryDELETE = (groupCd ,storeCd , areaCd,majorCd , subCd) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setMainCategoryDELETE', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd,
        MAJOR_CD: majorCd,
        SUB_CD: subCd
    });
};
export const getCategoryInfo = (groupCd ,storeCd , areaCd) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/getCategoryInfo', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd
    });
};
export const getMultiLingual = (groupCd ,storeCd ) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/getMultiLingual', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,

    });
};
export const setMainCategoryUpdate = (groupCd ,storeCd, areaCd,majorCd , majorNm ,langId ) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setMainCategoryUpdate', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd,
        AREA_CD  : areaCd,
        MAJOR_CD  : majorCd,
        MAJOR_NM  : majorNm,
        LANGUAGE_ID : langId
    });
};
export const setMainCategoryINSERT = (groupCd ,storeCd, areaCd,majorCd , majorNm ,langId ) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setMainCategoryINSERT', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd,
        AREA_CD  : areaCd,
        MAJOR_CD  : majorCd,
        MAJOR_NM  : majorNm,
        LANGUAGE_ID : langId
    });
};

export const setSubCategoryINSERT = (groupCd ,storeCd, areaCd,majorCd , subCd , subNm ,langId ) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setSubCategoryINSERT', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd,
        MAJOR_CD: majorCd,
        SUB_CD: subCd,
        SUB_NM: subNm,
        LANGUAGE_ID: langId } );
};
export const setSubCategoryUPDATE = (groupCd ,storeCd, areaCd,majorCd , subCd , subNm ,langId ) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/setSubCategoryUPDATE', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd,
        MAJOR_CD: majorCd,
        SUB_CD: subCd,
        SUB_NM: subNm,
        LANGUAGE_ID: langId } );
};






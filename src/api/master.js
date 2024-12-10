
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
export const get_pos = async(groupCd, storeCd) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/getPosList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd
    });
};
export const get_area = async(groupCd, storeCd , posNo) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/getAreaList', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd,
        POS_NO : posNo
    });
};
export const get_ins_list1 = async(min , max) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/getMasterList', {
        MIN_TABLE_ID : min,
        MAX_TABLE_ID : max
    });
};
export const get_ins_list2 = async(groupCd , storeCd , lngAreaCd , posNo ,selectedDate) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/getMaster2List', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd == '0' ? '0' : storeCd,
        AREA_CD  : lngAreaCd == '0' ? '0' : lngAreaCd,
        POS_NO   : posNo == '0' ? '0' : posNo,
        DTM_DATE : selectedDate
    });
};
export const master_save = async(groupCd , storeCd , lngAreaCd , posNo ,selectedrows, selectedDate) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/insertMasterList', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd,
        AREA_CD  : lngAreaCd,
        POS_NO   : posNo,
        TABLE_ID : selectedrows,
        DTM_DATE : selectedDate
    });
};
export const master_delete = async(groupCd , storeCd , lngAreaCd , posNo ,selectedrows, selectedDate) => {
    return await api2.post('/MIMASTER/MST01_032INS.asmx/deleteMasterList', {
        GROUP_CD : groupCd,
        STORE_CD : storeCd == '0' ? '0' : storeCd,
        AREA_CD  : lngAreaCd,
        POS_NO   : posNo,
        TABLE_ID : selectedrows,
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
export const store_query = async(groupCd ,storeType ,storeCd ,searchStoreName) => {
    return await api2.post('/MIMASTER/MST01_002INS.asmx/getStoreQuery', {
        GROUP_CD    : groupCd,
        STORE_ATTR  : storeType == '0' ? '0' : storeType,
        STORE_CD    : storeCd == '0' ? '0' : storeCd,
        SEARCH_TEXT : searchStoreName ? searchStoreName : ''
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
export const tablePosMenuKey_v2 = async(groupCd, storeCd, areaCd) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/getTablePosMenuKey_V2', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd
     
    });
};

export const savetablePosMenuKey = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/insertTablePosMenuKey', data);
};

export const deletetablePosMenuKey = async(data) => {
    return await api2.post('/MIMASTER/MST57_002INS.asmx/deleteTablePosMenuKey', data);
};
export const get_category_info = (groupCd,storeCd, areaCd) => {
    return api2.post('/MIMASTER/MST57_001INS.asmx/getCategoryInfo',{
          GROUP_CD : groupCd,
          STORE_CD : storeCd,
          AREA_CD  : areaCd
    })
  }
  
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

export const getMenuList = ( groupCd , storeCd) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/getTablePosMenu' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd
    })
}

export const getTablePosMenuKey = ( groupCd , storeCd , areaCd , posNo) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/getTablePosMenuKey' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD : areaCd ,
        POSNO : posNo
    })
}
export const getScreenList = ( groupCd , storeCd , areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/getScreenList' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD : areaCd ,
        POSNO : posNo 
    })
}

export const getMenuKeyList = ( groupCd , storeCd , areaCd) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/getMenuKeyList' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD : areaCd 
    })
}

export const getTLUList = ( groupCd , storeCd ) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/getTLUList' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
    })
}


export const saveScreenKeys = ( groupCd , storeCd ,areaCd , posNo , screenNo_arr , screenName_arr ) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/saveScreenKeys' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        SCREEN_NO_ARR :  screenNo_arr ,
        SCREEN_NAME_ARR : screenName_arr
    })
}

export const saveAllMenuKey = ( groupCd , storeCd ,areaCd , posNo , intKeySeq_arr , intScreenNo_arr , lngScrNo_arr ,strKeyName_arr) => {
    return api2.post('/MIMASTER/MST05_011INS.asmx/saveMenuKeys' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        INTKEYSEQ_ARR :  intKeySeq_arr ,
        INTSCREENNO_ARR : intScreenNo_arr,
        LNGKEYSCRNO_ARR : lngScrNo_arr,
        STRKEYNAME_ARR : strKeyName_arr
    })
}
export const getMenuKeyList2 = ( groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST05_004INS.asmx/getMenuKeyList' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
    })
}

export const getScreenList2 = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST05_004INS.asmx/getScreenList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
    })
}

export const MST36_003INS_GET_LIST = (groupCd , groupNm) => {
    return api2.post('/MIMASTER/MST36_003INS.asmx/getKeyAmountGroupList', {
        GROUP_CD: groupCd,
        GROUP_NM: groupNm ? groupNm : ''
    })
}




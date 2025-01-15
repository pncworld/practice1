
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

export const getstoreInfo = (groupCd ,storeType ,storeCd ,searchStoreName) => {
    return api2.post('/MIMASTER/MST01_002INS.asmx/getstoreInfo', {
         GROUP_CD: groupCd,
         STORE_ATTR : storeType,
         STORE_CD : storeCd,
         SEARCH_TEXT : searchStoreName 
    });
};
export const saveStoreInfo = async (id, groupCd, deleteStore, 
    updateStoreCd, updateStoreNm, updatestrRegistNo,updatestrDirector , updatestrDealType , updatestrDealKind, updatelngJoinType, 
    updatelngSubLease, updatelngStoreAttr, updatelngStoreArea, 
    updatedtmOpenDate, updatedtmStop, updatestrConvCode, updatestrZipCode, 
    updatestrAddress ,updatestrAddressetc, updatestrTel, updatestrPhone, updatestrFax, 
    updatelngFloorSpace, updatelngLease, updatelngBEP, updatelngSaleType, 
    updatelngSupervisor, updatestrDev1, updatelngTable, updatestrStoreHistory, updatelngMultiPriceGroupCode,
    insertStoreCd, insertStoreNm, insertstrRegistNo, insertstrDirector , insertstrDealType , insertstrDealKind, insertlngJoinType, 
    insertlngSubLease, insertlngStoreAttr, insertlngStoreArea, 
    insertedtmOpenDate, insertedtmStop, insertstrConvCode, insertstrZipCode, 
    insertstrAddress, insertstrAddressetc,insertstrTel, insertstrPhone, insertstrFax, 
    insertlngFloorSpace, insertlngLease, insertlngBEP, insertlngSaleType, 
    insertlngSupervisor, insertstrDev1, insertlngTable, insertstrStoreHistory , insertlngMultiPriceGroupCode
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
  
    return await api2.post('/MIMASTER/MST01_002INS.asmx/saveStoreInfo', data);
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
export const getMenuKeyList3 = ( groupCd , storeCd , areaCd) => {
    return api2.post('/MIMASTER/MST44_052INS.asmx/getMenuKeyList' , {
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
export const saveScreenKeys2 = ( groupCd , storeCd ,areaCd , posNo , screenNo_arr , screenName_arr , screenDisc ,screenType ) => {
    return api2.post('/MIMASTER/MST44_054INS.asmx/saveScreenKeys' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        SCREEN_NO_ARR :  screenNo_arr ,
        SCREEN_NAME_ARR : screenName_arr ,
        SCREEN_DISC : screenDisc,
        SCREEN_TYPE : screenType
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
export const saveAllMenuKey2 = ( groupCd , storeCd ,areaCd , posNo , intKeySeq_arr , intScreenNo_arr , lngScrNo_arr ,strKeyName_arr , screenType ,itemdisc) => {
    return api2.post('/MIMASTER/MST44_054INS.asmx/saveKeys' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        INTKEYSEQ_ARR :  intKeySeq_arr ,
        INTSCREENNO_ARR : intScreenNo_arr,
        LNGKEYSCRNO_ARR : lngScrNo_arr,
        STRKEYNAME_ARR : strKeyName_arr ,
        SCREEN_TYPE : screenType ,
        ITEMDISC_YN : itemdisc
    })
}
export const saveAllMenuKey3 = ( groupCd , storeCd ,areaCd , posNo , intKeySeq_arr, menuCd_arr  ,strKeyName_arr , screenType ) => {
    return api2.post('/MIMASTER/MST44_058INS.asmx/saveKeys' , {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        INTKEYSEQ_ARR :  intKeySeq_arr ,
        LNGKEYSCRNO_ARR : menuCd_arr ,
        STRKEYNAME_ARR : strKeyName_arr ,
        SCREEN_TYPE : screenType ,
     
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
export const DUPLIALLPOSDATA = async(groupCd, storeCd, areaCd,posNo ,tgroupCd ,tstoreCd , tareaCd, tposNo) => {
    const res = await api2.post("/MIMASTER/MST05_011INS.asmx/DUPLIALLPOSDATA" , {
     
      GROUP_CD : groupCd,
      STORE_CD : storeCd ,
      AREA_CD : areaCd,
      POSNO : posNo ,
      T_GROUP_CD : tgroupCd ,
      T_STORE_CD : tstoreCd,
      T_AREA_CD : tareaCd,
      T_POSNO : tposNo
  })
  return res ;
  }

  export const DUPLIALLKIOSKDATA = async(groupCd, storeCd, areaCd,posNo ,tgroupCd ,tstoreCd , tareaCd, tposNo) => {
    const res = await api2.post("/MIMASTER/MST44_058INS.asmx/DUPLIALLKIOSKDATA" , {
     
      GROUP_CD : groupCd,
      STORE_CD : storeCd ,
      AREA_CD : areaCd,
      POSNO : posNo ,
      T_GROUP_CD : tgroupCd ,
      T_STORE_CD : tstoreCd,
      T_AREA_CD : tareaCd,
      T_POSNO : tposNo
  })
  return res ;
  }
  export const DUPLIALLKDS = async(groupCd, storeCd, tgroupCd ,tstoreCd ) => {
    const res = await api2.post("/MIMASTER/MST44_061INS.asmx/DUPLIALLKDS" , {
     
      GROUP_CD : groupCd,
      STORE_CD : storeCd ,
      T_GROUP_CD : tgroupCd ,
      T_STORE_CD : tstoreCd,
  })
  return res ;
  }
export const saveMenuKey2 = (groupCd , storeCd ,areaCd , posNo , keyseq ,keyname, keyscrno, keycolor ,keyNo ) => {
    return api2.post('/MIMASTER/MST05_004INS.asmx/saveMenuKeys', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        KEYSEQ:  keyseq ,
        KEYNAME: keyname,
        KEYSCRNO: keyscrno,
        KEYCOLOR: keycolor,
        KEYNO :keyNo
    })
}
export const dupliPos = (groupCd , storeCd ,areaCd , posNo ,tgroupCd ,tstoreCd , tareaCd, tposNo ) => {
    return api2.post('/MIMASTER/MST05_004INS.asmx/dupliMenuKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD:  tgroupCd ,
        T_STORE_CD: tstoreCd,
        T_AREA_CD: tareaCd,
        T_POSNO: tposNo,
    })
}


export const dupliPos2 = (groupCd , storeCd ,areaCd , posNo ,tgroupCd ,tstoreCd , tareaCd, tposNo ,screenNo, tscreenNo ) => {
    return api2.post('/MIMASTER/MST05_004INS.asmx/dupliSpecificMenuKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD:  tgroupCd ,
        T_STORE_CD: tstoreCd,
        T_AREA_CD: tareaCd,
        T_POSNO: tposNo,
        SCREEN_NO: screenNo,
        T_SCREEN_NO : tscreenNo
    })
}
export const getAmountList = (groupCd , storeCd ,areaCd , posNo ,screenType ) => {
    return api2.post('/MIMASTER/MST44_054INS.asmx/getAmountList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        SCREEN_TYPE : screenType
    })
}
export const getAmountList2 = (groupCd , storeCd ,areaCd , posNo ,screenType ) => {
    return api2.post('/MIMASTER/MST44_058INS.asmx/getAmountList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        SCREEN_TYPE : screenType
    })
}
export const getAmountList3 = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST44_055INS.asmx/getAmountList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
 
    })
}
export const getFuncKeyList = () => {
    return api2.post('/MIMASTER/MST44_043INS.asmx/getFuncKeyList', {
    })
}
export const getAllScreenList = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST44_054INS.asmx/getAllScreenList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
     
    })
}
export const getScreenList3 = async(groupCd , storeCd ,areaCd , posNo ) => {
    return await api2.post('/MIMASTER/MST_001INS.asmx/getScreenList3', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POS_NO : posNo
     
    })
}
export const getFuncKeys = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST44_043INS.asmx/getFuncKeys', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
     
    })
}
export const getCustomorList = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST44_002INS.asmx/getCustomorList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
     
    })
}
export const getAgeList = (groupCd , storeCd ,areaCd , posNo ) => {
    return api2.post('/MIMASTER/MST44_060INS.asmx/getAgeList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
     
    })
}
export const getPrintList = (groupCd , storeCd  ) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/getPrintList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd 

    })
}
export const getMenuLists = (groupCd , storeCd  ) => {
    return api2.post('/MIMASTER/MST01_008INS.asmx/getMenuLists', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd 

    })
}
export const getKitchenSettingList = (groupCd , storeCd  ) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/getKitchenSettingList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd 

    })
}
export const DUPLIPAYKEY = (groupCd , storeCd ,areaCd , posNo , screenNo , screenType, store_arr ) => {
    return api2.post('/MIMASTER/MST44_054INS.asmx/DUPLIPAYKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        SCREEN_NO : screenNo,
        SCREEN_TYPE : screenType,
        STORECD_ARR : store_arr

     
    })
}
export const savePayKey = (groupCd , storeCd ,areaCd , posNo , intkeyseqarr , keyscrnoarr, keynmarr , intkeynos , gp ) => {
    return api2.post('/MIMASTER/MST44_055INS.asmx/savePayKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        KEY_SEQARR : intkeyseqarr,
        KEYSCR_NOARR : keyscrnoarr,
        KEY_NMARR : keynmarr ,
        INT_KEY_NOARR : intkeynos,
        GPARR : gp

    })
}
export const saveAllCustomor = (groupCd , storeCd ,areaCd , posNo , lngcode , strname , intkeyseq , strkeyname , lngkeyscrno ) => {
    return api2.post('/MIMASTER/MST44_002INS.asmx/saveAllCustomor', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        LNGCODES : lngcode,
        STRNAMES : strname,
        INTKEYSEQS : intkeyseq ,
        STRKEYNAMES : strkeyname,
        KEYSCRNOS : lngkeyscrno

    })
}
export const saveAllAge = (groupCd , storeCd ,areaCd , posNo , lngcode , strname , intkeyseq , strkeyname , lngkeyscrno ) => {
    return api2.post('/MIMASTER/MST44_060INS.asmx/saveAllAge', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        LNGCODES : lngcode,
        STRNAMES : strname,
        INTKEYSEQS : intkeyseq ,
        STRKEYNAMES : strkeyname,
        KEYSCRNOS : lngkeyscrno

    })
}
export const savePrintNm = (groupCd , storeCd ,printNo , printNm ) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/savePrintNm', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        PRINT_NO: printNo,
        PRINT_NM : printNm

    })
}

export const saveGroupPayKey = (groupCd , storeCd ,areaCd , posNo , intkeyseqarr , keyamtarr, groupcodearr , intkeyNmarr ) => {
    return api2.post('/MIMASTER/MST44_055INS.asmx/saveGroupPayKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        KEY_SEQARR : intkeyseqarr,
        KEYSCR_NOARR : keyamtarr,
        GROUP_CODEARR : groupcodearr,
        KEY_NMARR : intkeyNmarr ,
       
    })
}


export const DUPLIALLPAYKEY = (groupCd , storeCd ,areaCd , posNo , t_groupCd , t_storeCd, t_areaCd , t_posNo ) => {
    return api2.post('/MIMASTER/MST44_055INS.asmx/DUPLIALLPAYKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD : t_groupCd,
        T_STORE_CD : t_storeCd,
        T_AREA_CD : t_areaCd ,
        T_POS_NO : t_posNo

     
    })
}
export const DUPLIFUNCKEY = (groupCd , storeCd ,areaCd , posNo , t_groupCd , t_storeCd, t_areaCd , t_posNo ) => {
    return api2.post('/MIMASTER/MST44_043INS.asmx/DUPLIFUNCKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD : t_groupCd,
        T_STORE_CD : t_storeCd,
        T_AREA_CD : t_areaCd ,
        T_POS_NO : t_posNo

     
    })
}
export const DUPLICUSTOMORKEY = (groupCd , storeCd ,areaCd , posNo , t_groupCd , t_storeCd, t_areaCd , t_posNo ) => {
    return api2.post('/MIMASTER/MST44_002INS.asmx/DUPLICUSTOMORKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD : t_groupCd,
        T_STORE_CD : t_storeCd,
        T_AREA_CD : t_areaCd ,
        T_POS_NO : t_posNo

     
    })
}
export const DUPLIAGEKEY = (groupCd , storeCd ,areaCd , posNo , t_groupCd , t_storeCd, t_areaCd , t_posNo ) => {
    return api2.post('/MIMASTER/MST44_060INS.asmx/DUPLIAGEKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD : t_groupCd,
        T_STORE_CD : t_storeCd,
        T_AREA_CD : t_areaCd ,
        T_POS_NO : t_posNo

     
    })
}

export const DUPLITABLEKEY = (groupCd , storeCd ,areaCd , posNo , t_groupCd , t_storeCd, t_areaCd , t_posNo ) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/DUPLITABLEKEY', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        T_GROUP_CD : t_groupCd,
        T_STORE_CD : t_storeCd,
        T_AREA_CD : t_areaCd ,
        T_POS_NO : t_posNo

     
    })
}

export const saveAllFuncKey = (groupCd , storeCd ,areaCd , posNo , lngDCodes , lngDCodes2  ) => {
    return api2.post('/MIMASTER/MST44_043INS.asmx/saveAllFuncKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        LNGDCODES : lngDCodes,
        LNGDCODES2 : lngDCodes2


    })
}
export const saveAllFuncKey2 = (groupCd , storeCd ,areaCd , posNo , lngDCodes , lngDCodes2  ) => {
    return api2.post('/MIMASTER/MST44_059INS.asmx/saveAllFuncKey', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd ,
        AREA_CD: areaCd,
        POSNO : posNo,
        LNGDCODES : lngDCodes,
        LNGDCODES2 : lngDCodes2


    })
}
export const saveKDSList = (groupCd ,kdsNo, kdsNm , id  , deleteNo ) => {
    return api2.post('/MIMASTER/MST44_061INS.asmx/saveKDSList', {
        GROUP_CD: groupCd,
        KDS_NO : kdsNo,
        KDS_NM : kdsNm ,
        ID: id ,
        DELETE_NO : deleteNo


    })
}
export const saveKDSSettingAll = (groupCd , storeCd , Menu2arr , id) => {
    return api2.post('/MIMASTER/MST44_061INS.asmx/saveKDSSettingAll', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        MENU_ARR : Menu2arr ,
        ID : id


    })
}
export const saveKitchenSettingAll = (groupCd , storeCd , Menu2arr , uniquearr,calculatearr , id) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/saveKitchenSettingAll', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        MENU_ARR : Menu2arr ,
        TOTAL_ARR : uniquearr ,
        CALCULATE_ARR : calculatearr ,
        ID : id


    })
}
export const saveReceiptData = (groupCd , storeCd , posnos , areaCds, receiptu , receiptd) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/saveReceiptData', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        POS_NO : posnos ,
        AREA_CD : areaCds ,
        RECEIPTU : receiptu ,
        RECEIPTD : receiptd

    })
}
export const saveScreenKeys3 = (groupCd , storeCd , posnos , areaCds, screenNm , screenNo) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/saveScreenKeys3', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        POS_NO : posnos ,
        AREA_CD : areaCds ,
        SCREEN_NM : screenNm ,
        SCREEN_NO : screenNo

    })
}
export const saveAccInfo = (groupCd , clngAccCode,cstrName ,cblnOut,cblnGear,ilngAccCode ,istrName,iblnOut,iblnGear ,dlngAccCode) => {
    return api2.post('/MIMASTER/MST40_001INS.asmx/saveAccInfo', {
        GROUP_CD: groupCd,
        CACC_CD : clngAccCode ,
        CSTR_NAME : cstrName ,
        CBLNOUT : cblnOut ,
        CBLNGEAR : cblnGear ,
        IACCCD : ilngAccCode ,
        ISTR_NAME : istrName ,
        IBLNOUT : iblnOut ,
        IBLNGEAR : iblnGear ,
        DACCCD : dlngAccCode 

    })
}
export const savePayGroup = (groupCd , lngstoregroup , lnggroupCd ,groupNm ,strrk ,dgroupCd) => {
    return api2.post('/MIMASTER/MST36_003INS.asmx/savePayGroup', {
        GROUP_CD: groupCd,
        PAYSTOREGROUP : lngstoregroup,
        PAYGROUP_CD : lnggroupCd ,
        PAYGROUP_NM : groupNm ,
        STR_REMARK : strrk ,
        DGROUP_CD : dgroupCd

    })
}
export const saveTables = (groupCd , storeCd , posnos , areaCds, screenNo ,lngKeyscrNo ,lngKeyColors ,lngShapes ,strNames ,lngCounts , xs, ys, ws,hs , newNm , newlngCount) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/saveTables', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        POS_NO : posnos ,
        AREA_CD : areaCds ,
        SCREEN_NO : screenNo ,
        KEYSCR_NO : lngKeyscrNo ,
        KEY_COLOR : lngKeyColors ,
        KEY_SHAPE : lngShapes ,
        KEY_NAME : strNames ,
        KEY_LNGCOUNT : lngCounts ,
        X : xs ,
        Y : ys ,
        W : ws ,
        H : hs ,
        NEW_NM : newNm ,
        NEW_COUNT : newlngCount ,



    })
}
export const saveTables2 = (groupCd , storeCd , posnos , areaCds, screenNo ,lngKeyscrNo ,lngKeyColors ,lngShapes ,strNames ,lngCounts , xs, ys, ws,hs , newNm , newlngCount , intkeynos) => {
    return api2.post('/MIMASTER/MST_001INS.asmx/saveTables2', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        POS_NO : posnos ,
        AREA_CD : areaCds ,
        SCREEN_NO : screenNo ,
        KEYSCR_NO : lngKeyscrNo ,
        KEY_COLOR : lngKeyColors ,
        KEY_SHAPE : lngShapes ,
        KEY_NAME : strNames ,
        KEY_LNGCOUNT : lngCounts ,
        X : xs ,
        Y : ys ,
        W : ws ,
        H : hs ,
        NEW_NM : newNm ,
        NEW_COUNT : newlngCount ,
        INTKEYNO : intkeynos



    })
}

export const saveNewTables = (groupCd , storeCd , posnos , areaCds, screenNo ,lngKeyscrNo ,lngKeyColors ,lngShapes ,strNames ,lngCounts , xs, ys, ws,hs) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/saveNewTables', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        POS_NO : posnos ,
        AREA_CD : areaCds ,
        SCREEN_NO : screenNo ,
        KEYSCR_NO : lngKeyscrNo ,
        KEY_COLOR : lngKeyColors ,
        KEY_SHAPE : lngShapes ,
        KEY_NAME : strNames ,
        KEY_LNGCOUNT : lngCounts ,
        X : xs ,
        Y : ys ,
        W : ws ,
        H : hs 
    })
}
export const saveMenuManage = (groupCd , storeCd , maincode , mainnm, subcode ,subnm ,submajor) => {
    return api2.post('/MIMASTER/MST01_008INS.asmx/saveMenuManage', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        MAIN_CD : maincode ,
        MAIN_NM : mainnm ,
        SUB_CD : subcode ,
        SUB_NM : subnm ,
        SUB_MJ : submajor ,
    })
}
export const saveCreditCardEnroll = (groupCd , storeCd , cstorecd , cbuyCd ,cbuyNm , cbuyENm, clngrate , cifCode, istorecd , ibuyCd ,ibuyNm , ibuyENm, ilngrate , iifCode ,dstoreCd , dstorebuyCd) => {
    return api2.post('/MIMASTER/MST43_001INS.asmx/saveCreditCardEnroll', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        C_STORECD : cstorecd ,
        C_BUYCD : cbuyCd ,
        C_BUYNM : cbuyNm ,
        C_BUYENM : cbuyENm ,
        C_LNGRATE : clngrate ,
        C_IFCODE : cifCode ,
        I_STORECD : istorecd ,
        I_BUYCD : ibuyCd ,
        I_BUYNM : ibuyNm ,
        I_BUYENM : ibuyENm ,
        I_LNGRATE : ilngrate ,
        I_IFCODE : iifCode ,
        D_STORECD : dstoreCd ,
        D_STOREBCD : dstorebuyCd
       
    })
}
export const saveOptions = (groupCd , storeCd , lngcode1 , strNames1, blnMustSels1 ,intMultiples1 ,lngChainMenu1,lngChainMenu2,lngChainMenu3,
  lngChainMenu4,lngChainMenu5,lngChainMenu6,lngChainMenu7,lngChainMenu8,lngChainMenu9,lngChainMenu10,lngChainMenu11,lngChainMenu12,lngChainMenu13,
  lngChainMenu14,lngChainMenu15,lngChainMenu16,lngChainMenu17,lngChainMenu18,lngChainMenu19,lngChainMenu20,lngChainMenu21,lngCodes2,strNames2,
  lngChainGroup1,lngChainGroup2,lngChainGroup3,lngChainGroup4,lngChainGroup5,lngChainGroup6,lngChainGroup7,lngChainGroup8,lngChainGroup9, 
  lngChainGroup10,lngChainGroup11,lngChainGroup12,lngChainGroup13,lngChainGroup14,lngChainGroup15,lngChainGroup16,lngChainGroup17,lngChainGroup18,
  lngChainGroup19,lngChainGroup20
) => {
    return api2.post('/MIMASTER/MST01_011INS_01.asmx/saveOptions', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd ,
        LNG_CODE1 : lngcode1 ,
        STR_NAMES1 : strNames1 ,
        BLN_MUST_SELS1 : blnMustSels1 ,
        INT_MULTIPLES1 : intMultiples1 ,
        LNG_CHAIN_MENU1 : lngChainMenu1 ,
        LNG_CHAIN_MENU2 : lngChainMenu2 ,
        LNG_CHAIN_MENU3 : lngChainMenu3 ,
        LNG_CHAIN_MENU4 : lngChainMenu4 ,
        LNG_CHAIN_MENU5 : lngChainMenu5 ,
        LNG_CHAIN_MENU6 : lngChainMenu6 ,
        LNG_CHAIN_MENU7 : lngChainMenu7 ,
        LNG_CHAIN_MENU8 : lngChainMenu8 ,
        LNG_CHAIN_MENU9 : lngChainMenu9 ,
        LNG_CHAIN_MENU10 : lngChainMenu10 ,
        LNG_CHAIN_MENU11 : lngChainMenu11 ,
        LNG_CHAIN_MENU12 : lngChainMenu12 ,
        LNG_CHAIN_MENU13 : lngChainMenu13 ,
        LNG_CHAIN_MENU14 : lngChainMenu14 ,
        LNG_CHAIN_MENU15 : lngChainMenu15 ,
        LNG_CHAIN_MENU16 : lngChainMenu16 ,
        LNG_CHAIN_MENU17 : lngChainMenu17 ,
        LNG_CHAIN_MENU18 : lngChainMenu18 ,
        LNG_CHAIN_MENU19 : lngChainMenu19 ,
        LNG_CHAIN_MENU20 : lngChainMenu20 ,
        LNG_CHAIN_MENU21 : lngChainMenu21 ,
        LNG_CODES2 : lngCodes2 ,
        STR_NAMES2 : strNames2 ,
        LNG_CHAIN_GROUP1 : lngChainGroup1 ,
        LNG_CHAIN_GROUP2 : lngChainGroup2 ,
        LNG_CHAIN_GROUP3 : lngChainGroup3 ,
        LNG_CHAIN_GROUP4 : lngChainGroup4 ,
        LNG_CHAIN_GROUP5 : lngChainGroup5 ,
        LNG_CHAIN_GROUP6 : lngChainGroup6 ,
        LNG_CHAIN_GROUP7 : lngChainGroup7 ,
        LNG_CHAIN_GROUP8 : lngChainGroup8 ,
        LNG_CHAIN_GROUP9 : lngChainGroup9 ,
        LNG_CHAIN_GROUP10 : lngChainGroup10 ,
        LNG_CHAIN_GROUP11 : lngChainGroup11 ,
        LNG_CHAIN_GROUP12 : lngChainGroup12 ,
        LNG_CHAIN_GROUP13 : lngChainGroup13 ,
        LNG_CHAIN_GROUP14 : lngChainGroup14 ,
        LNG_CHAIN_GROUP15 : lngChainGroup15 ,
        LNG_CHAIN_GROUP16 : lngChainGroup16 ,
        LNG_CHAIN_GROUP17 : lngChainGroup17 ,
        LNG_CHAIN_GROUP18 : lngChainGroup18 ,
        LNG_CHAIN_GROUP19 : lngChainGroup19 ,
        LNG_CHAIN_GROUP20 : lngChainGroup20
    })
}
export const saveTLUList = (groupcd, storecd, lngcode, strname, lngmenu1, lngmenu2, lngmenu3, lngmenu4, lngmenu5, lngmenu6, lngmenu7, lngmenu8, lngmenu9, lngmenu10, lngmenu11, lngmenu12, lngmenu13, lngmenu14, lngmenu15, lngmenu16, lngmenu17, lngmenu18, lngmenu19, lngmenu20, lngmenu21, lngmenu22, lngmenu23, lngmenu24, lngmenu25, lngmenu26, lngmenu27, lngmenu28, lngmenu29)=> {
    return api2.post('/MIMASTER/MST01_010INS.asmx/saveTLUList', {
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
            LNGMENU29: lngmenu29

    })
}
export const getKDSList = (groupCd ) => {
    return api2.post('/MIMASTER/MST44_061INS.asmx/getKDSList', {
        GROUP_CD: groupCd


    })
}
export const getAllOptionManageData = (groupCd ,storeCd ) => {
    return api2.post('/MIMASTER/MST01_011INS_01.asmx/getAllOptionManageData', {
        GROUP_CD: groupCd ,
        STORE_CD: storeCd


    })
}
export const getMostColumnMenuList = (groupCd ,storeCd ) => {
    return api2.post('/MIMASTER/MST01_011INS_01.asmx/getMostColumnMenuList', {
        GROUP_CD: groupCd ,
        STORE_CD: storeCd


    })
}
export const getTableList = (groupCd ,storeCd , posNo , areaCd ) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/getTableList', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        POS_NO: posNo,
        AREA_CD: areaCd


    })
}

export const getTableList2 = (groupCd ,storeCd , areaCd , posNo  , screenNo) => {
    return api2.post('/MIMASTER/MST_001INS.asmx/getTableList2', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        AREA_CD: areaCd , 
        POSNO: posNo,
        SCREENNO : screenNo
    


    })
}
export const getacc = (groupCd ) => {
    return api2.post('/MIMASTER/MST40_001INS.asmx/getacc', {
        GROUP_CD: groupCd
    })
}

export const getTableScreenKeys = (groupCd ,storeCd , posNo , AreaCd ) => {
    return api2.post('/MIMASTER/MST_002INS.asmx/getTableScreenKeys', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        POS_NO: posNo,
        AREA_CD: AreaCd,


    })
}
export const getStorePosList = (groupCd ,storeCd) => {
    return api2.post('/MIMASTER/MST44_062INS.asmx/getStorePosList', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd


    })
}
export const getKDSSettingList = (groupCd  , store_cd) => {
    return api2.post('/MIMASTER/MST44_061INS.asmx/getKDSSettingList', {
        GROUP_CD: groupCd,
        STORE_CD : store_cd


    })
}
export const getTLUManageInfo = (groupCd  , store_cd) => {
    return api2.post('/MIMASTER/MST01_010INS.asmx/getTLUManageInfo', {
        GROUP_CD: groupCd,
        STORE_CD : store_cd


    })
}
export const getCardInfo = (groupCd  , store_cd) => {
    return api2.post('/MIMASTER/MST43_001INS.asmx/getCardInfo', {
        GROUP_CD: groupCd,
        STORE_CD : store_cd
    })
}
export const getAmountGroup = (groupCd ) => {
    return api2.post('/MIMASTER/MST36_003INS.asmx/getAmountGroup', {
        GROUP_CD: groupCd

    })
}
export const getAllPayList = (groupCd , storeCd) => {
    return api2.post('/MIMASTER/MST36_055INS.asmx/getAllPayList', {
        GROUP_CD: groupCd,
        STORE_CD : storeCd

    })
}







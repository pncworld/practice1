
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







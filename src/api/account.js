
import axios from 'axios';
import { commonUrl, commonUrl2 } from './common';

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});

export const getEmployeesData = (groupCd ,searchType, searchText ) => {
    return api2.post('/MIACCOUNT/ACT09_001RPT.asmx/getEmployeesData', {
      GROUP_CD    : groupCd,
      SEARCH_TYPE   : searchType ,
      SEARCH_TEXT :  searchText
  
  
    });
  };
export const getEmployeeSummary = (groupCd ,storeAttr, storeCd , startDate , endDate ,trantype, empid ,lngoption , optionValue ) => {
    return api2.post('/MIACCOUNT/ACT09_001RPT.asmx/getEmployeeSummary', {
      GROUP_CD    : groupCd,
        STORE_ATTR   : storeAttr ,
        STORE_CD :  storeCd ,
        START_DATE :  startDate,
        END_DATE : endDate  ,
        TRAN_TYPE :  trantype ,
        EMP_ID : empid ,
        LNG_OPTION : lngoption ,
        OPTION_VALUE : optionValue  ,
  
  
    });
  };
export const getEmployeeDetailSummary = (groupCd ,storeAttr, storeCd , startDate , endDate ,trantype, empid ,lngoption , optionValue ) => {
    return api2.post('/MIACCOUNT/ACT09_002RPT.asmx/getEmployeeDetailSummary', {
        GROUP_CD    : groupCd,
        STORE_ATTR   : storeAttr ,
        STORE_CD :  storeCd ,
        START_DATE :  startDate,
        END_DATE : endDate  ,
        TRAN_TYPE :  trantype ,
        EMP_ID : empid ,
        LNG_OPTION : lngoption ,
        OPTION_VALUE : optionValue  ,
  
  
    });
  };
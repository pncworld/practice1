
import axios from 'axios';
import {commonUrl} from './common';

const url = commonUrl;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});

// API 요청 메서드들
export const dailySaleReport = (groupCd, storeCd,startDate,endDate,strLanguage) => {
    return api.post('/usp_AppDailySaleReportTest', {
        P_GROUP_CD: groupCd,
        P_STORE_CD: storeCd,
        P_START_DT: startDate,
        P_END_DT: endDate,
        P_REPORT_TYPE: '1',
        P_LANGUAGE: strLanguage
    });
};
export const get_sys_list = ( lngStoreGroup , lngUserAdminID ,strLanguage ) => {
  return api.post('/usp_APP_SYS_MENU_GET_LIST',{
    P_GROUP_CD : lngStoreGroup ,
    P_USER_ADMIN_ID : lngUserAdminID ,
    P_STR_LANGUAGE : strLanguage
  })

};
export const get_store_list = (lngStoreGroup) => {
  return api.post('/usp_APP_COMSTORE_GET_LIST',{
    P_STORE_CD : lngStoreGroup
  })
}




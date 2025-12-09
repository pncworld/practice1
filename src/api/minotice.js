import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 100000, // 요청 타임아웃 설정
});

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;
    //comsole.log(token);
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
      //alert("로그인 시간이 1분 이상 지났습니다. 재로그인 해주세요.");
      store.commit("clearSession");
      router.push("/");
      return new Promise(() => {});
    }
    return new Promise(() => {});
  }
);

export const getNoticeList2 = (
  groupCd,
  storeCd,
  adminid,
  index,
  searchoption,
  sv,
  lang
) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getNoticeList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ADMIN_ID: adminid,
    INDEX: index,
    SEARCHO: searchoption,
    SEARCHV: sv,
    LANG: lang,
  });
};
export const getNoticeDocCount = (groupCd, storeCd, adminid, so, sv) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getNoticeDocCount", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ADMIN_ID: adminid,
    SEARCHO: so,
    SEARCHV: sv,
  });
};
export const getInitNoticeInfo = (groupCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getInitNoticeInfo", {
    GROUP_CD: groupCd,
  });
};
export const getAdminUserList = (groupCd, adminCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getAdminUserList", {
    GROUP_CD: groupCd,
    ADMIN_CD: adminCd,
  });
};
export const getTeamUserList = (groupCd, adminCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getTeamUserList", {
    GROUP_CD: groupCd,
    TEAM_CD: adminCd,
  });
};
export const getSCUserList = (groupCd, sccds) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getSCUserList", {
    GROUP_CD: groupCd,
    SC_CD: sccds,
  });
};
export const saveNoticeDoc = (
  writer,
  groupCd,
  allstore,
  adminlist,
  teamlist,
  sclist,
  storelist,
  important,
  topdist,
  posdown,
  apppush,
  pnotice,
  pfdate,
  ptdate,
  allinform,
  informfdate,
  informtdate,
  realarm,
  realarmfdate,
  realarmtdate,
  pass,
  ntype,
  subject,
  body,
  seq,
  filecount,
  savetype,
  noticeseq
) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/saveNoticeDoc", {
    WRITER: writer,
    GROUP_CD: groupCd,
    ALLSTORE: allstore,
    ADMINLIST: adminlist,
    TEAMLIST: teamlist,
    SCLIST: sclist,
    STORELIST: storelist,
    IMPORTANT: important,
    TOP_DIST: topdist,
    POS_DOWN: posdown,
    APP_PUSH: apppush,
    P_NOTICE: pnotice,
    P_FDATE: pfdate,
    P_TDATE: ptdate,
    ALL_INFORM: allinform,
    INFORMF_DATE: informfdate,
    INFORMT_DATE: informtdate,
    REALARM: realarm,
    REALARMF_DATE: realarmfdate,
    REALARMT_DATE: realarmtdate,
    PASSWORD: pass,
    NOTICE_TYPE: ntype,
    SUBJECT: subject,
    BODY: body,
    SEQUENCE: seq,
    FILE_COUNT: filecount,
    SAVETYPE: savetype,
    NOTICE_SEQ: noticeseq,
  });
};

export const saveNoticeFileInsert = (
  groupCd,
  noticeseq,
  seqno,
  filepath,
  file,
  filesize
) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/saveNoticeFileInsert", {
    GROUP_CD: groupCd,
    NOTICE_SEQ: noticeseq,
    SEQNO: seqno,
    FILE_PATH: filepath,
    STR_FILE: file,
    FILE_SIZE: filesize,
  });
};
export const getNoticeDocDetail = (groupCd, storeCd, adminid, seqid) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getNoticeDocDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ADMINID: adminid,
    SEQNO: seqid,
  });
};
export const deleteNoticeDoc = (seqid) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/deleteNoticeDoc", {
    SEQNO: seqid,
  });
};
export const deleteNoticeFiles = (groupcd, noticeseq, seqid) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/deleteNoticeFiles", {
    GROUP_CD: groupcd,
    NOTICE_SEQ: noticeseq,
    SEQNO: seqid,
  });
};
export const deleteFiles = (filename) => {
  return api2.post(
    "/MINOTICE/FileDelete.ashx",
    {
      filename: filename,
    },
    {
      headers: {
        "Content-Type": "application/json", // 일부 서버에서 필요할 수 있음
      },
    }
  );
};

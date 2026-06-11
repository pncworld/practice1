// src/store/index.js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { USER_ADMIN_ID_SUPPLIER_ACCOUNT } from "@/constants/sessionUser";

export default createStore({
  state() {
    return {
      userData: [], // 사용자 데이터를 저장할 상태
      selectedCategoryId: null,
      mainCategory: [],
      subCategory: [],
      minorCategory: [],
      storeGroup: [],
      storeType: [],
      storeCd: [],
      storeTeamCode: [],
      storeSupervisor: [],
      storeAreaCd: [],
      storeSubLease: [],
      loading: false,
      loading2: false,
      favoriteList: [],
      isMobile: false,
      inActiveBackGround: false,
      mobileFunction: [],
      mobileCategory: [],
      StoreToken: "",
      mobileSelectProgName: "",
      moveOtherTab: "",
      mobileReSearch: false,
      currentActiveTab: [],
      mUSER_NO: "",
    };
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data; // 상태를 업데이트하는 메소드
    },
    setSelectedCategoryId(state, id) {
      state.selectedCategoryId = id;
    },
    resetSelectedCategoryId(state) {
      state.selectedCategoryId = null; // 원하는 초기값으로 설정
    },
    addTab(state, tab) {
      const existingTabs = state.currentTabs.filter(
        (existingTab) => existingTab.lngProgramID == tab.lngProgramID
      );

      let newlngProgramID = tab.lngProgramID;
      let newstrTitle = tab.strTitle;
      let newstrUrl = tab.strUrl;

      if (existingTabs.length > 0) {
        const count = existingTabs.length + 1;

        newstrTitle = `${tab.strTitle}`;
      }

      state.currentTabs.push({
        strUrl: newstrUrl,
        lngProgramID: newlngProgramID,
        strTitle: newstrTitle,
      }); // 새로운 탭을 추가
      state.activeTab = newlngProgramID;
      //state.activeTab2 = tab.lngProgramID ;
    },
    removeAllTabs(state) {
      state.currentTabs = []; // 새로운 탭을 추가
      state.activeTab = "";
    },
    setActiveTab(state, tab) {
      state.activeTab = tab != undefined ? tab.lngProgramID : ""; // 현재 활성화된 탭으로 변경
      //state.activeTab2 = tab.lngProgramID; // 현재 활성화된 탭으로 변경
    },
    setOtherTab(state, tab) {
      state.moveOtherTab = tab;
    },
    removeTab(state, data) {
      state.currentTabs = state.currentTabs.filter(
        (tab) => tab.lngProgramID !== data
      ); // 해당 탭 제거
    },
    setMainCategory(state, data) {
      state.mainCategory = data;
    },
    setSubCategory(state, data) {
      state.subCategory = data;
    },
    setMinorCategory(state, data) {
      state.minorCategory = data;
    },

    setMobilFunction(state, data) {
      state.mobileFunction = data;
    },
    setStoreGroup(state, data) {
      state.storeGroup = data;
    },
    setStoreType(state, data) {
      state.storeType = data;
    },
    setStoreCd(state, data) {
      state.storeCd = data;
    },
    setstoreTeamCode(state, data) {
      state.storeTeamCode = data;
    },
    setstoreSupervisor(state, data) {
      state.storeSupervisor = data;
    },
    setstoreAreaCd(state, data) {
      state.storeAreaCd = data;
    },
    setstoreSubLease(state, data) {
      state.storeSubLease = data;
    },
    refreshTAB(state, data) {
      const tab = state.currentTabs.find((tab) => tab.lngProgramID === data);
      if (tab) {
        tab.lngProgramID = tab.lngProgramID + new Date().getTime();
      }
      state.activeTab = tab.lngProgramID;
    },
    setLoading(state, data) {
      state.loading = data;
    },
    setLoading2(state, data) {
      state.loading2 = data;
    },
    setinActiveBackGround(state, data) {
      state.inActiveBackGround = data;
    },
    addFavoriteList(state, data) {
      state.favoriteList = data;
    },
    setMobileState(state, data) {
      state.isMobile = data;
    },
    saveactiveTab(state, data) {
      state.activeTab2 = data;
    },
    saveToken(state, data) {
      state.StoreToken = data;
    },
    saveMobileCategory(state, data) {
      state.mobileCategory = data;
    },
    setMobileProgName(state, data) {
      state.mobileSelectProgName = data;
    },
    setMobileReSearch(state, data) {
      state.mobileReSearch = data;
    },
    setCurrentActiveTab(state, data) {
      state.currentActiveTab = data;
    },
    setmUserNo(state, data) {
      state.mUSER_NO = data;
    },
    clearSession(state) {
      (state.userData = []), // 사용자 데이터를 저장할 상태
        (state.selectedCategoryId = ""),
        (state.mainCategory = []),
        (state.subCategory = []),
        (state.minorCategory = []),
        (state.storeGroup = []),
        (state.storeType = []),
        (state.storeCd = []),
        (state.storeTeamCode = []),
        (state.storeSupervisor = []),
        (state.storeAreaCd = []),
        (state.loading = false),
        (state.favoriteList = []),
        (state.isMobile = false),
        (state.inActiveBackGround = false),
        (state.mobileFunction = []),
        (state.mobileCategory = []),
        (state.currentActiveTab = []),
        (state.StoreToken = "");
    },
  },
  actions: {
    updateUserData({ commit }, data) {
      commit("setUserData", data); // mutations 호출
    },
    selectCategory({ commit }, id) {
      commit("setSelectedCategoryId", id);
    },
    addNewTab({ commit }, tab) {
      commit("addTab", tab); // 새로운 탭 추가
    },
    changeActiveTab({ commit }, tab) {
      commit("setActiveTab", tab); // 활성화된 탭 변경
    },
    closeTab({ commit }, tabId) {
      commit("removeTab", tabId); // 탭 제거
    },
    closeAllTabs({ commit }) {
      commit("removeAllTabs"); // 탭 제거
    },
    mainCategory({ commit }, data) {
      commit("setMainCategory", data);
    },
    subCategory({ commit }, data) {
      commit("setSubCategory", data);
    },
    minorCategory({ commit }, data) {
      commit("setMinorCategory", data);
    },
    saveMobileFunction({ commit }, data) {
      commit("setMobilFunction", data);
    },
    StoreGroup({ commit }, data) {
      commit("setStoreGroup", data);
    },
    StoreType({ commit }, data) {
      commit("setStoreType", data);
    },
    StoreCd({ commit }, data) {
      commit("setStoreCd", data);
    },
    StoreTeamCode({ commit }, data) {
      commit("setstoreTeamCode", data);
    },
    StoreSupervisor({ commit }, data) {
      commit("setstoreSupervisor", data);
    },
    StoreAreaCd({ commit }, data) {
      commit("setstoreAreaCd", data);
    },
    StoreSubLease({ commit }, data) {
      commit("setstoreSubLease", data);
    },
    refreshTab({ commit }, data) {
      commit("refreshTAB", data);
    },
    convertLoading({ commit }, data) {
      commit("setLoading", data);
    },
    convertLoading2({ commit }, data) {
      commit("setLoading2", data);
    },
    convertInActive({ commit }, data) {
      commit("setinActiveBackGround", data);
    },
    setFavoriteList({ commit }, data) {
      commit("addFavoriteList", data);
    },
    setMobileState({ commit }, data) {
      commit("setMobileState", data);
    },
    saveActiveTab({ commit }, data) {
      commit("saveactiveTab", data);
    },
    setToken({ commit }, data) {
      commit("saveToken", data);
    },
    setmobileCategory({ commit }, data) {
      commit("saveMobileCategory", data);
    },
    saveMobileProgName({ commit }, data) {
      commit("setMobileProgName", data);
    },
    logout({ commit }) {
      commit("clearSession");
    },
    moveOthertab({ commit }, data) {
      commit("setOtherTab", data);
    },
    setMobileSearch({ commit }, data) {
      commit("setMobileReSearch", data);
    },
    saveCurrentTab({ commit }, data) {
      commit("setCurrentActiveTab", data);
    },
    saveUserNo({ commit }, data) {
      commit("setmUserNo", data);
    },
  },
  getters: {
    userData: (state) => state.userData, // 상태를 가져오는 getter
    /** 거래처(공급사) 계정 — `lngUserAdminID === 60` */
    isSupplierAccountUser: (state) => {
      const u = state.userData;
      if (!u || typeof u !== "object" || Array.isArray(u)) return false;
      return Number(u.lngUserAdminID) === USER_ADMIN_ID_SUPPLIER_ACCOUNT;
    },
    /** 세션 거래처 PK (`lngSupplierID`). 비거래처·미세팅이면 `null` */
    sessionLngSupplierID: (state) => {
      const u = state.userData;
      if (!u || typeof u !== "object" || Array.isArray(u)) return null;
      const n = Number(u.lngSupplierID);
      return Number.isFinite(n) ? n : null;
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      /* 창(탭)마다 독립: activeTab2·currentTabs 등 네비 상태는 제외 (localStorage 공유 + storage 이벤트 동기화 방지) */
      paths: [
        "userData",
        "StoreToken",
        "favoriteList",
        "storeGroup",
        "storeType",
        "storeCd",
        "storeTeamCode",
        "storeSupervisor",
        "storeAreaCd",
        "storeSubLease",
        "mainCategory",
        "subCategory",
        "minorCategory",
        "selectedCategoryId",
        "mobileCategory",
        "mobileFunction",
        "isMobile",
        "mUSER_NO",
      ],
    }),
  ],
});

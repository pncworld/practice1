// src/store/index.js
import { v4 } from 'uuid';
import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexPersist = new VuexPersistence({
  storage : window.localStorage
})
export default createStore({
  state() {
    return {
      userData: [], // 사용자 데이터를 저장할 상태
      selectedCategoryId : null ,
      currentTabs : [] ,
      activeTab : '',
      mainCategory : [],
      subCategory : [],
      minorCategory : [],
      storeGroup : [],
      storeType : [],
      storeCd : [],
    };
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data; // 상태를 업데이트하는 메소드
    },
    setSelectedCategoryId(state, id) {
      state.selectedCategoryId = id ;
    },
    resetSelectedCategoryId(state) {
      state.selectedCategoryId = null; // 원하는 초기값으로 설정
    },
    addTab(state, tab) {
      const existingTabs = state.currentTabs.filter(existingTab => existingTab.lngProgramID.toString().startsWith(tab.lngProgramID.toString()))

      let newlngProgramID = tab.lngProgramID;
      let newstrTitle = tab.strTitle;
      if(existingTabs.length > 0 ) {
        const count = existingTabs.length + 1;
        newlngProgramID = `${tab.lngProgramID}_${v4()}`;
        newstrTitle = `${tab.strTitle}_${count}`;
      }
    
      state.currentTabs.push({...tab , lngProgramID: newlngProgramID , strTitle : newstrTitle}); // 새로운 탭을 추가
      state.activeTab = newlngProgramID ;
    },
    removeAllTabs(state) {
      state.currentTabs = []; // 새로운 탭을 추가
      state.activeTab = '';
    },
    setActiveTab(state, tab) {
      
        state.activeTab = tab.lngProgramID; // 현재 활성화된 탭으로 변경
      
    },
    removeTab(state, data) {
      state.currentTabs = state.currentTabs.filter(tab => tab.lngProgramID !== data); // 해당 탭 제거
      
    },
    setMainCategory(state,data){
      state.mainCategory = data;
    },
    setSubCategory(state,data){
      state.subCategory = data;
    },
    setMinorCategory(state,data){
      state.minorCategory = data;
    }
    ,
    setStoreGroup(state,data){
      state.storeGroup = data;
    }
    ,
    setStoreType(state,data){
      state.storeType = data;
    }
    ,
    setStoreCd(state,data){
      state.storeCd = data;
    }

  },
  actions: {
    updateUserData({ commit }, data) {
      commit('setUserData', data); // mutations 호출
    },
    selectCategory({commit} ,id) {
      commit('setSelectedCategoryId' , id);
    },
    addNewTab({ commit }, tab) {
      commit('addTab', tab); // 새로운 탭 추가
    },
    changeActiveTab({ commit }, tab) {
      commit('setActiveTab', tab); // 활성화된 탭 변경
    },
    closeTab({ commit }, tabId) {
      commit('removeTab', tabId); // 탭 제거
    },
    closeAllTabs({commit}){
      commit('removeAllTabs'); // 탭 제거
    },
    mainCategory({commit},data){
      commit('setMainCategory',data);
    },
    subCategory({commit},data){
      commit('setSubCategory',data);
    },
    minorCategory({commit},data){
      commit('setMinorCategory',data);
    },
    StoreGroup({commit},data){
      commit('setStoreGroup',data);
    },
    StoreType({commit},data){
      commit('setStoreType',data);
    },
    StoreCd({commit},data){
      commit('setStoreCd',data);
    }
  },
  getters: {
    userData: state => state.userData, // 상태를 가져오는 getter
  },
  plugins: [vuexPersist.plugin]
});

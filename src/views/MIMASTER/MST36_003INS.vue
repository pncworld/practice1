<template>
    <div class="p-4 bg-white rounded-lg shadow-md">
    <!-- 상단 제목과 버튼 -->
    <div class="flex items-center justify-between">
      <h1 class="font-bold text-sm md:text-2xl ml-2">결제 그룹 등록</h1>
      <div class="flex space-x-2">
        <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button @click="newButton" class="button new md:w-auto w-14">삭제</button>
        <button @click="saveButton" class="button save md:w-auto w-14">저장</button>
      </div>
    </div>
    <br/>
    <br/>
    <!-- 검색 필터 섹션 -->
    <div class="flex flex-wrap gap-4 items-center">
      <!-- 매장 -->
      <div class="flex items-center space-x-2 w-60">
        <span class="whitespace-nowrap">매장:</span>
        <select
          class="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-8 text-xs"
          v-model="storeCd" @change="getPosNo">
          <option value="0">전체</option>
          <option v-for="item in stores" :key="item.id" :value="item.lngStoreCode">{{ item.strName }}</option>
        </select>
      </div>
      <!-- 포스번호 -->
      <div class="flex items-center space-x-2 w-36">
        <span class="whitespace-nowrap">포스번호:</span>
        <select
          class="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-8 text-xs"
          v-model="posNo" @change="getAreaCd">
          <option value="0">전체</option>
          <!-- <option v-for="item in posNos" :key="item.id" :value="item.lngCode">{{ item.strName }}</option> -->
          <option v-for="item in posNos" :key="item.id" :value="item.lngCode" :data-lng-area-code="item.lngAreaCode">{{ item.strName }}</option>
        </select>
      </div>
      <!-- 지역 -->
      <!-- <div class="flex items-center space-x-2 w-36">
        <span class="whitespace-nowrap">지역:</span>
        <select
          class="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-8 text-xs"
          v-model="lngAreaCd">
          <option value="0">전체</option>
          <option v-for="item in areaCd" :key="item.id" :value="item.lngCode">{{ item.strName }}</option>
        </select>
      </div> -->
    </div>
  </div>
  <br/>
  <br/>
  <div style="display: flex; width: 96%; height: 800px; margin: 0 auto;">
    <div style="width: 30%; height: 100%; overflow-y: auto;">
      <!-- 마스터 목록 제목에 ml-2 추가 -->
      <h2 class="text-left font-bold mb-2 ml-2" style="font-size: 18px;">마스터 목록</h2>
      <div id="grid1" style="height: calc(100% - 33px);"></div>
    </div>
    <div style="width: 2%;"></div>
    <div style="width: 68%; height: 100%; overflow-y: auto;">
      <h2 class="text-left font-bold mb-2" style="font-size: 18px;">배포예정 목록</h2>
      <div id="grid2" style="height: calc(100% - 33px);"></div>
    </div>
  </div>
  </template>
  
  <script setup>
    // 가져온 날짜의 형식을 고치기 위해서 사용 ( 데이터가 yyyy-mm-dd T ~~~ 이런형태여서 T부터 자름)
    import { format } from 'date-fns';
    // 설치한 라이브러리로 만든 달력을 가져옴 ( 재사용 )
    // 뷰에서 제공 하는 기능, computed 반응형 상태를 기반으로 다른 로직을 실행해 결과값을 생성 , ref 반응형 변수 선언
    import { computed, ref, onMounted } from 'vue';
    // vuex에서 제공하는 중앙 상태관리 
    import { useStore } from 'vuex';
    // api 호출 함수
    import axios from 'axios';
    // 로그인한 사용자에 따라 법인명 매장명 등을 선택할 수 있게  만든 공통 컴포넌트 
    import PickStore from '@/components/pickStore.vue';
    // 각 탭 마다 필요한 그리드 설정 속성 불러오기
    import { getGridInfoList } from '@/api/common';
    // alert 창 자동 꾸미기 위한 라이브러리
    import Swal from 'sweetalert2';
    import DateRangePicker2 from '@/components/DateRangePicker2.vue'
    import * as RealGrid from "realgrid";
    import "realgrid/dist/realgrid-style.css";
    import { get_area, get_ins_list1, get_ins_list2, get_pos, master_delete, master_save } from '@/api/master';
    const store = useStore();
    // 그리드에 다중 선택 혹은 개별 선택 설정 변수
    const selection = ref({ mode: "cell" });
    // vuex에 저장된 로그인된 정보 호출
    const userData = store.state.userData;
    // 로그인한 사람의 groupCd를 초기화하려는 목적(조회용)
    const groupCd = ref(userData.lngStoreGroup);
    // 로그인한 사람의 typeCd를 초기화하려는 목적(조회용)
    const typeCd = ref();
    // 로그인한 사람의 storeCd를 초기화하려는 목적 (조회용)
    const storeCd = ref(0);
    // 상세보기 기능을 위한 변수
    const detailViewtf = ref(true);
    // 조회 후를 감지하기 위한 변수
    const afterSearch = ref(false);
    // 셀병합 기능을 위한 변수
    const cellUnitedtf = ref(false);
    // 그리드 설정 값을 불러오기 위한 하드코딩
    const GridInfo_PROG_ID = "SLS06_004RPT_VUE_TEST";
    const GridInfo_GRID_ID = "1";
    // API 호출 (설정값 호출)
    const tabInitSetArray = ref([]);
      (async () => {
      try {
          const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
          tabInitSetArray.value = result; 
      } catch (error) {
          console.error("Failed to fetch data:", error); // 오류 로그 출력
      } finally {
        
      }
  })();
    const stores = ref([]);
    const lngAreaCd = ref(0);
    stores.value = store.state.storeCd;
    const posNos = ref([]) ;
    const getPosNo = async () => {
      store.dispatch("convertLoading", true);
      const response = await get_pos( groupCd.value, storeCd.value );
      const result = response.data.pos;
  
      posNos.value = result
      posNo.value = '0'
      lngAreaCd.value = '0'
      store.dispatch("convertLoading", false);
    }
    const posNo =ref(0);
    const areaCd =ref(0);
    const getAreaCd = async (event) => {
      // store.dispatch("convertLoading", true);
      // const response = await get_area(groupCd.value, storeCd.value ,posNo.value);
      // const result = response.data.area;
  
      // areaCd.value = result
      // lngAreaCd.value = '0'
      // store.dispatch("convertLoading", false);
  
      const selectedOption = event.target.selectedOptions[0]; // 선택된 옵션
      const selectedLngAreaCode = selectedOption ? selectedOption.getAttribute('data-lng-area-code') : '';
      lngAreaCd.value = selectedLngAreaCode; // lngAreaCode에 값 저장
  
    }
  
  // 데이터 설정
  let dataProvider;
  let gridView;
  let dataProvider2;
  let gridView2;
  
    // 조회 함수.
    const searchButton = () => {
      const readsales = async () => {
        store.dispatch("convertLoading", true);
        const response  = await get_ins_list1('2','94');
        const response2 = await get_ins_list2(groupCd.value, storeCd.value, lngAreaCd.value, posNo.value);
        const result  = response.data.master;
        const result2 = response2.data.master2;
  
        updateColumn(result);
        updateColumn2(result2);
  
        afterSearch.value = true;
        store.dispatch("convertLoading", false);
    }
    readsales(); // 세팅된 함수 실행
  
        //RealGrid 설정
        const updateColumn = (result) => {
  
        if (gridView) {
          gridView.destroy();  // 기존 그리드 인스턴스 파괴
        }
  
        dataProvider = new RealGrid.LocalDataProvider();
        gridView = new RealGrid.GridView("grid1");
        gridView.setDataSource(dataProvider); // 그리드에 데이터 제공자 연결
  
        // 컬럼 설정
        const columns = [
          {
            name: "lngTableID",
            fieldName: "lngTableID",
            header: { text: "테이블ID" },
            width: 100,
            styleName: "right",
            editable: false,
          },
          {
            name: "strTitle",
            fieldName: "strTitle",
            header: { text: "항목" },
            width: 180,
            styleName: "left",
            editable: false,
          },
          // {
          //   name: "lngCheck",
          //   fieldName: "lngCheck",
          //   header: { text: "수신여부" },
          //   width: 100,
          //   styleName: "center",
          //   editable: false,    //*** 반드시 false로 설정 
          //   renderer: {
          //     type: "check",
          //     trueValues: "1",  //true로 사용할 값
          //     falseValues: "0"  //false로 사용할 값
          //   },
          // },
        ];
  
        dataProvider.setFields([
          { fieldName: "lngTableID" },
          { fieldName: "strTitle" },
          // { fieldName: "lngCheck" },
        ]);
  
        // 컬럼 설정
        gridView.setColumns(columns);
  
        // 그리드에 데이터를 연결
        const rowData = result.map((item, index) => ({
            lngTableID : item.lngTableID,
            strTitle   : item.strTitle,
            // lngCheck   : item.lngCheck,
        }));
  
        // gridView.setCheckBar({
        //   visible: false,
        // });
  
        //default에서 false처리 하였지만 true로 변경
        gridView.footer.visible = false;
  
        dataProvider.setRows(rowData); 
  
      };
  
      const updateColumn2 = (result2) => {
  
        if (gridView2) {
          gridView2.destroy();  // 기존 그리드 인스턴스 파괴
        }
  
        // 컬럼 정의
        const columnDefs = [
        // {
        //     name: "lngCheck",
        //     fieldName: "lngCheck",
        //     header: { text: "수신구분" },
        //     width: 100,
        //     styleName: "center",
        //     editable: false,    //*** 반드시 false로 설정 
        //     renderer: {
        //       type: "check",
        //       trueValues: "1",  //true로 사용할 값
        //       falseValues: "0"  //false로 사용할 값
        //     },
        // },
        {
          name: "dtmDate",
          fieldName: "dtmDate",
          header: { text: "수신예정일" },
          width: 120,
          styleName: "center-column",
          renderer: {
            type: "text", // 텍스트 렌더러 사용
          },
        },
        {
          fieldName: 'lngTableID',
          name: 'lngTableID',
          header: { text: "수신코드" },
          width: 70,
          style: { textAlign: 'left' },
        },
        {
          fieldName: 'strTableName',
          name: 'strTableName',
          header: { text: "항목" },
          width: 130,
          style: { textAlign: 'left' },
        },
        {
          fieldName: 'lngStoreCode',
          name: 'lngStoreCode',
          header: { text: "매장코드" },
          width: 90,
          style: { textAlign: 'center' },
        },
        {
          fieldName: 'strStoreName',
          name: 'strStoreName',
          header: { text: "매장명" },
          width: 130,
          style: { textAlign: 'left' },
        },
        {
          fieldName: 'lngAreaCode',
          name: 'lngAreaCode',
          header: { text: "매장구역" },
          width: 100,
          style: { textAlign: 'center' },
        },
        {
          fieldName: 'intPosNO',
          name: 'intPosNO',
          header: { text: "포스번호" },
          width: 100,
          style: { textAlign: 'right' },
        },
        ];
  
        // RealGrid 데이터 제공자와 그리드 뷰 설정
        dataProvider2 = new RealGrid.LocalDataProvider();
        gridView2 = new RealGrid.GridView("grid2");
  
        // 컬럼 정의 설정
        gridView2.setColumns(columnDefs);
  
        // 데이터 필드 정의
        dataProvider2.setFields([
          { fieldName: "lngCheck" },     // 수신구분 (체크박스 컬럼) 
          { fieldName: "dtmDate"},       // 수신예정일
          { fieldName: "lngTableID", dataType: "number" },  // 수신코드
          { fieldName: "strTableName" }, // 항목
          { fieldName: "lngStoreCode" }, // 매장코드
          { fieldName: "strStoreName" }, // 매장명
          { fieldName: "lngAreaCode" },  // 매장구역
          { fieldName: "intPosNO" },     // 포스번호
        ]);
  
        gridView2.setColumnProperty("lngTableID", "numberFormat", "#,###"); // 소숫점 제거
  
        // 데이터 매핑
        const rowData2 = result2.map((item) => ({
          lngCheck: item.check,           // 체크박스 데이터
          dtmDate: item.dtmDate,          // 수신예정일
          lngTableID: item.lngTableID,    // 수신코드
          strTableName: item.strTableName, // 항목
          lngStoreCode: item.lngStoreCode, // 매장코드
          strStoreName: item.strStoreName, // 매장명
          lngAreaCode: item.lngAreaCode, // 매장구역
          intPosNO: item.intPosNO,     // 포스번호
        }));
  
        // 데이터 제공자에 데이터 설정
        dataProvider2.setRows(rowData2);
  
        // 그리드 뷰에 데이터 제공자 연결
        gridView2.setDataSource(dataProvider2);
  
        // 체크박스 컬럼 설정 (전체 체크/해제 기능 포함)
        // gridView2.setCheckBar({
        //   visible: false, // 체크바 표시
        // });
  
        // 푸터 숨기기 설정
        gridView2.footer.visible = false;
        
      };
  
  }
  
  const saveButton = async() => {
      if(!afterSearch.value) {
        Swal.fire("조회부터 시작해주세요")
        return ;
      }
  
      // 데이터 공급자의 전체 행 데이터 가져오기
      const checkedRows = [];
  
      for (let i = 0; i < dataProvider.getRowCount(); i++) {
        const rowData = dataProvider.getJsonRow(i); // 특정 행의 데이터를 JSON 형식으로 가져옴
        if (gridView.isCheckedItem(i)) { // 해당 행이 체크된 경우만
          checkedRows.push(rowData);
        }
      }
  
      if (checkedRows.length === 0) {
        Swal.fire('수신여부 체크박스 선택이 안되었습니다.')
        return ;
      }
  
      //로딩 UI 삽입
      store.dispatch("convertLoading", true);
  
      // lngTableID 값을 추출하고 ','로 구분된 문자열 생성
      let selectedrows = '';
      for (let i = 0; i < checkedRows.length; i++) {
        selectedrows += checkedRows[i].lngTableID + ','; // ',' 추가
      }
      selectedrows = selectedrows.substring(0, selectedrows.length - 1); // 마지막 ',' 제거
      
      const response = await master_save(  groupCd.value,  storeCd.value,  lngAreaCd.value,  posNo.value,  selectedrows);
  
      //로딩 UI 해제
      store.dispatch("convertLoading", false);
      
      if(response.status =='200'){
        Swal.fire('저장 되었습니다.')
      }
      
      //재조회
      searchButton();
  
    }
    const deleteButton = async() => {
      if(!afterSearch.value) {
        Swal.fire("조회부터 시작해주세요")
        return ;
      }
    
      // 데이터 공급자의 전체 행 데이터 가져오기
      const checkedRows = [];
      
      for (let i = 0; i < dataProvider2.getRowCount(); i++) {
        const rowData = dataProvider2.getJsonRow(i); // 특정 행의 데이터를 JSON 형식으로 가져옴
        if (gridView2.isCheckedItem(i)) { // 해당 행이 체크된 경우만
          checkedRows.push(rowData);
        }
      }
  
      if (checkedRows.length === 0) {
        Swal.fire('수신구분 체크박스 선택이 안되었습니다.')
        return ;
      }
  
      //로딩 UI 삽입
      store.dispatch("convertLoading", true);
  
      // lngTableID 값을 추출하고 ','로 구분된 문자열 생성
      let selectedstoreCd = '';
      let selectedAreaCd = '';
      let selectedPosNo = '';
      let selectedrows = '';
  
      for (let i = 0; i < checkedRows.length; i++) {
        selectedstoreCd += checkedRows[i].lngStoreCode + ','; // ',' 추가
        selectedAreaCd  += checkedRows[i].lngAreaCode + ','; // ',' 추가
        selectedPosNo   += checkedRows[i].intPosNO + ','; // ',' 추가
        selectedrows    += checkedRows[i].lngTableID + ','; // ',' 추가
      }
      selectedstoreCd = selectedstoreCd.substring(0, selectedstoreCd.length - 1); // 마지막 ',' 제거
      selectedAreaCd  = selectedAreaCd.substring(0, selectedAreaCd.length - 1); // 마지막 ',' 제거
      selectedPosNo   = selectedPosNo.substring(0, selectedPosNo.length - 1); // 마지막 ',' 제거
      selectedrows    = selectedrows.substring(0, selectedrows.length - 1); // 마지막 ',' 제거
    
      const response = await master_delete(groupCd.value, selectedstoreCd, selectedAreaCd, selectedPosNo, selectedrows);
      
      //로딩 UI 해제
      store.dispatch("convertLoading", false);
  
      if(response.status =='200'){
        Swal.fire('삭제 되었습니다.')
      }
  
      //재조회
      searchButton();
  
    }
  
    </script>
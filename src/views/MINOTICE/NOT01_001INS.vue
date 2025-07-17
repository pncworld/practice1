<template>
  <div class="flex justify-center items-center">
    <div class="grid grid-rows-[1fr,13fr,2fr,2fr] grid-cols-1 w-[70vw]">
      <div class="flex justify-start ml-10 text-2xl mt-2">◎공지사항</div>
      <div>
        <Realgrid
          :progname="'NOT01_001INS_VUE'"
          :progid="9"
          :rowData="rowData"
          :rowStateeditable="false"
          @clickedRowData="clickedRowData"
          :setStateBar="false"></Realgrid>
      </div>
      <div class="flex justify-center mt-5 items-center">
        <div
          class="flex pl-[32vw] w-36 items-center justify-center text-nowrap space-x-5">
          <div><button class="whitebutton" @click="movePrev"><</button></div>
          <div>
            <input
              type="number"
              class="border w-10 h-8"
              v-model="cPage"
              @keydown.enter="moveNow" />
            / {{ maxPage }} 페이지
          </div>
          <div><button class="whitebutton" @click="moveNext">></button></div>
        </div>
        <div class="ml-[25vw]">
          <button class="button primary" @click="WritePopUp">글쓰기</button>
        </div>
      </div>
      <div class="flex justify-center items-center space-x-5">
        <div>
          <select
            name=""
            id=""
            class="border w-20 shadow-lg h-10"
            v-model="selectOption">
            <option :value="i.strDCode" v-for="i in optionList">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div>
          <input
            type="text"
            class="border shadow-lg h-10 pl-1"
            v-model="searchValue"
            @keydown.enter.prevent="moveNow2" />
        </div>
        <div><button class="button search" @click="moveNow2">검색</button></div>
        <div>
          <button class="button primary" @click="reMount">검색 초기화</button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="Writepopup">
    <div
      class="bg-white p-6 rounded-xl shadow-xl w-[85vw] h-[90vh] overflow-y-auto">
      <div class="flex justify-between">
        <div class="text-2xl font-bold">◎공지사항 {{ NoticeDefault }}</div>
        <div class="flex justify-center items-center space-x-3">
          <button class="button primary" @click="openFileEdit">파일첨부</button>
          <input
            type="file"
            v-show="false"
            @change="handleFile"
            ref="fileInput"
            multiple />
          <button class="button save" @click="saveButton">저장</button>
          <button class="button primary" @click="closePopUp">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-10 grid-cols-[1fr,8fr] w-[60vw]">
        <div class="bg-gray-100 border-l border-t">작성자</div>
        <div class="border-l border-t flex justify-start pl-5">
          <input type="text" class="border pl-1" v-model="gridvalue1" />
        </div>
        <div class="bg-gray-100 border-l border-t">브랜드</div>
        <div class="border-l border-t flex justify-start pl-5">
          <select name="" id="" class="border w-72 pl-1" v-model="gridvalue2">
            <option :value="i.lngStoreGroup" v-for="i in brandList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="bg-gray-100 border-l border-t">공지매장</div>
        <div class="flex space-x-3 items-center pl-5 border-l border-t">
          <label for="cond"
            ><input type="checkbox" id="cond" v-model="cond" />전체공지</label
          >
          <button class="button primary !h-6" @click="showAdmin">
            권한별공지
          </button>
          <button class="button primary !h-6" @click="showTeam">
            팀별공지
          </button>
          <button class="button primary !h-6" @click="showSC">SC별공지</button>
          <button class="button primary !h-6" @click="showStore">
            매장별공지
          </button>
          <div>◎점포별 공지 시 공지 이후 신규 매장에는 적용 되지 않습니다.</div>
        </div>
        <div class="bg-gray-100 border-l border-t">중요여부</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue3">
              <option value="1">중요</option>
              <option value="2">일반</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            상단게시
          </div>
          <div class="flex justify-start pl-5 items-center">
            <select name="" id="" class="border w-52" v-model="gridvalue4">
              <option value="1">상단게시</option>
              <option value="2">순차게시</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">POS 공지</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue5">
              <option value="1">사용</option>
              <option value="2">사용안함</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            모바일 앱 알림
          </div>
          <div class="flex justify-start pl-5 items-center">
            <select name="" id="" class="border w-52" v-model="gridvalue6">
              <option value="1">사용</option>
              <option value="2">사용안함</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">팝업공지</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue7">
              <option value="1">사용</option>
              <option value="2">사용안함</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            팝업공지기간
          </div>
          <div class="flex justify-start pl-5 items-center">
            <input type="date" v-model="gridvalue8" class="border" /> ~
            <input type="date" v-model="gridvalue9" class="border" />
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">전체공지</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue10">
              <option value="1">사용</option>
              <option value="2">사용안함</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            전체공지기간
          </div>
          <div class="flex justify-start pl-5 items-center">
            <input type="date" v-model="gridvalue11" class="border" /> ~
            <input type="date" v-model="gridvalue12" class="border" />
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">POS다시알림</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue13">
              <option value="1">사용</option>
              <option value="2">사용안함</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            다시알림기간
          </div>
          <div class="flex justify-start pl-5 items-center">
            <input type="date" v-model="gridvalue14" class="border" /> ~
            <input type="date" v-model="gridvalue15" class="border" />
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">비밀번호</div>
        <div class="border-l border-t items-center flex justify-start pl-5">
          <input type="text" class="border pl-1" v-model="gridvalue16" />
        </div>
        <div class="bg-gray-100 border">제목</div>
        <div class="flex items-center border pl-5 space-x-5">
          <select name="" id="" class="border w-32" v-model="gridvalue17">
            <option value="1"></option>
            <option value="2">물류</option>
            <option value="3">정산</option>
            <option value="4">이벤트</option>
            <option value="5">마케팅</option>
            <option value="6">메뉴</option>
            <option value="7">신제품</option>
            <option value="8">배송</option>
            <option value="9">품목사장</option>
            <option value="10">일시중단</option>
            <option value="99">긴급</option></select
          ><input type="text" class="border pl-1 w-96" v-model="gridvalue18" />
        </div>
      </div>
      <div class="flex justify-start items-center w-[80vw]">
        <CkEditor class="w-full" @editorData="editorData" :content="content">
        </CkEditor>
      </div>
      <div class="grid grid-rows-[1fr,6fr] w-[59vw]">
        <div class="text-xl font-bold flex justify-start">◎첨부파일</div>
        <div>
          <Realgrid
            :progname="'NOT01_001INS_VUE'"
            :progid="8"
            :rowData="rowData10"
            @checkedRowData="checkedRowData6"
            :rowStateeditable="false"></Realgrid>
        </div>
      </div>
    </div>

    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]"
      v-if="showadmin">
      <div class="bg-white p-4 rounded shadow-2xl w-[50vw] h-[60vh]">
        <div class="flex justify-end space-x-5">
          <button class="whitebutton" @click="showUser">공지계정 확인</button>
          <button class="whitebutton" @click="showadmin = false">
            선택완료</button
          ><button @click="initAdmin" class="whitebutton">초기화</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-full h-full">
          <div class="w-full h-full">
            <div>권한그룹 선택</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="1"
                :rowStateeditable="false"
                :initCheckAct="initCheckAct"
                :initCheckValue="initCheckValue"
                :initCheckColumn="initCheckColumn"
                :setStateBar="false"
                :checkAll="checkAll3"
                @checkedRowData="checkedRowData"
                :rowData="rowData2"></Realgrid>
            </div>
          </div>
          <div lass="w-full h-full">
            <div>공지계정 리스트</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="2"
                :rowStateeditable="false"
                :setStateBar="false"
                :rowData="rowData3"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]"
      v-if="showteam">
      <div class="bg-white p-4 rounded shadow-2xl w-[50vw] h-[60vh]">
        <div class="flex justify-end space-x-5">
          <button class="whitebutton" @click="showTeamUser">
            공지계정 확인
          </button>
          <button class="whitebutton" @click="showteam = false">선택완료</button
          ><button @click="initTeam" class="whitebutton">초기화</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-full h-full">
          <div class="w-full h-full">
            <div>팀 선택</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="3"
                :checkAll="checkAll4"
                :initCheckAct="initCheckAct2"
                :initCheckValue="initCheckValue2"
                :initCheckColumn="initCheckColumn2"
                :rowStateeditable="false"
                :setStateBar="false"
                @checkedRowData="checkedRowData2"
                :rowData="rowData4"></Realgrid>
            </div>
          </div>
          <div lass="w-full h-full">
            <div>공지계정 리스트</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="4"
                :rowStateeditable="false"
                :setStateBar="false"
                :rowData="rowData5"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]"
      v-if="showsc">
      <div class="bg-white p-4 rounded shadow-2xl w-[50vw] h-[60vh]">
        <div class="flex justify-end space-x-5">
          <button class="whitebutton" @click="showSCUser">공지계정 확인</button>
          <button class="whitebutton" @click="showsc = false">선택완료</button
          ><button @click="initSC" class="whitebutton">닫기</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-full h-full">
          <div class="w-full h-full">
            <div>SC 선택</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="5"
                :rowStateeditable="false"
                :setStateBar="false"
                :initCheckAct="initCheckAct3"
                :initCheckValue="initCheckValue3"
                :initCheckColumn="initCheckColumn3"
                @checkedRowData="checkedRowData3"
                :rowData="rowData6"></Realgrid>
            </div>
          </div>
          <div lass="w-full h-full">
            <div>공지계정 리스트</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="6"
                :rowStateeditable="false"
                :setStateBar="false"
                :rowData="rowData7"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]"
      v-if="showst">
      <div class="bg-white p-4 rounded shadow-2xl w-[50vw] h-[60vh]">
        <div class="flex justify-end space-x-5">
          <button class="whitebutton" @click="showst = false">선택완료</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[7fr,1fr,7fr] w-full h-full">
          <div class="w-full h-full">
            <div>매장 선택</div>
            <div class="w-[90%] h-[80%] mt-5">
              <div class="flex justify-center items-center">
                <div class="flex justify-center">매장명</div>
                <input type="text" class="border pl-1" v-model="searchWord" />
              </div>
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="7"
                :rowStateeditable="false"
                :setStateBar="false"
                :checkAll="checkAll"
                :searchWord3="searchWord"
                :initCheckAct="initCheckAct4"
                :initCheckValue="initCheckValue4"
                :initCheckColumn="initCheckColumn4"
                :searchColId="'strName'"
                @checkedRowData="checkedRowData4"
                :rowData="rowData8"></Realgrid>
            </div>
          </div>
          <div class="flex flex-col items-start justify-center space-y-10">
            <button class="whitebutton" @click="moveRight">></button>
            <button class="whitebutton" @click="moveLeft"><</button>
          </div>
          <div class="w-[90%] h-full">
            <div>매장 등록</div>
            <div class="w-full h-[80%] mt-10">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="7"
                :rowStateeditable="false"
                :setStateBar="false"
                :checkAll="checkAll2"
                @checkedRowData="checkedRowData5"
                :rowData="rowData9"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
    v-if="showNoticeDetail">
    <div
      class="bg-white p-6 rounded-xl shadow-xl w-[85vw] h-[90vh] overflow-y-auto">
      <div class="flex flex-col">
        <div class="flex justify-between">
          <div class="text-2xl font-semibold">◎공지사항 상세조회</div>
          <div class="flex justify-center items-center space-x-5">
            <button class="button primary" @click="editPopUp">수정</button
            ><button class="button delete" @click="deleteNotice">삭제</button
            ><button class="button primary" @click="showNoticeDetail = false">
              목록보기
            </button>
          </div>
        </div>
        <div class="grid grid-rows-2 grid-cols-[1fr,8fr] h-20 w-[60vw]">
          <div
            class="bg-gray-100 font-semibold text-lg flex justify-center items-center border-l border-t">
            작성자
          </div>
          <div
            class="border-l border-t grid grid-rows-1 grid-cols-[4fr,1fr,3fr]">
            <div class="flex justify-center items-center">
              <input
                type="text"
                class="border h-[85%] w-[60%]"
                v-model="gridvalue21"
                disabled />
            </div>
            <div
              class="bg-gray-100 font-semibold text-lg flex justify-center items-center border-l border-t">
              작성일자
            </div>
            <div class="flex justify-center items-center">
              <input
                type="text"
                class="border h-[85%] w-[60%]"
                v-model="gridvalue22"
                disabled />
            </div>
          </div>
          <div
            class="bg-gray-100 font-semibold text-lg flex justify-center items-center border-l border-t">
            제목
          </div>
          <div class="flex justify-start border pl-20 items-center">
            <input
              type="text"
              class="border h-[85%] w-[80%]"
              v-model="gridvalue23"
              disabled />
          </div>
        </div>
        <div class="w-[80vw] h-[60vh] border">
          <div
            v-html="content"
            disabled
            class="border border-black w-full h-full overflow-auto content-wrapper"></div>
        </div>
        <div class="h-[10vh] w-[97%]">
          <div class="text-lg font-semibold flex justify-start">◎첨부파일</div>
          <div class="w-full h-full">
            <Realgrid
              :progname="'NOT01_001INS_VUE'"
              :progid="8"
              :rowData="rowData11"
              :hideColumnsId="['checkbox']"
              @clickedRowData="clickedRowData2"
              :setStateBar="false"
              :rowStateeditable="false"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { uploadFile } from "@/api/master";
import {
  deleteFiles,
  deleteNoticeDoc,
  deleteNoticeFiles,
  getAdminUserList,
  getInitNoticeInfo,
  getNoticeDocCount,
  getNoticeDocDetail,
  getNoticeList2,
  getSCUserList,
  getTeamUserList,
  saveNoticeDoc,
  saveNoticeFileInsert,
} from "@/api/minotice";
import CkEditor from "@/components/ckEditor.vue";

import Realgrid from "@/components/realgrid.vue";
import store from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import { nextTick, onMounted, ref, watch } from "vue";

const maxPage = ref(1);
const cPage = ref(1);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);
const rowData8 = ref([]);
const rowData9 = ref([]);
const brandList = ref([]);
const optionList = ref([]);
const selectOption = ref("00");
const searchValue = ref("");
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("2");
const gridvalue4 = ref("2");
const gridvalue5 = ref("2");
const gridvalue6 = ref("2");
const gridvalue7 = ref("2");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("2");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("2");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const gridvalue17 = ref("1");
const gridvalue18 = ref("");

const showteam = ref(false);
const showsc = ref(false);

onMounted(async () => {
  //console.log(store.state.userData);

  gridvalue1.value = store.state.userData.strChargerName;

  try {
    const res3 = await getCommonList("273");

    const res4 = await getInitNoticeInfo(store.state.userData.lngStoreGroup);

    rowData2.value = res4.data.List2;
    rowData4.value = res4.data.List3;
    rowData6.value = res4.data.List4;
    rowData8.value = res4.data.List5;
    brandList.value = res4.data.List;
    optionList.value = res3.data.List;
    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      "00",
      ""
    );

    gridvalue2.value = store.state.userData.lngStoreGroup;

    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);
    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      "00",
      "",
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {}
});

const movePrev = async () => {
  if (cPage.value <= 1) {
    return;
  }

  try {
    store.state.loading = true;

    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      selectOption.value,
      searchValue.value
    );
    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);

    cPage.value = cPage.value - 1;
    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      selectOption.value,
      searchValue.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const moveNext = async () => {
  if (cPage.value >= maxPage.value) {
    return;
  }

  try {
    store.state.loading = true;

    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      selectOption.value,
      searchValue.value
    );
    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);

    cPage.value = cPage.value + 1;
    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      selectOption.value,
      searchValue.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const moveNow = async () => {
  if (cPage.value > maxPage.value || cPage.value < 1 || isNaN(cPage.value)) {
    return;
  }

  try {
    store.state.loading = true;

    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      selectOption.value,
      searchValue.value
    );
    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);

    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      selectOption.value,
      searchValue.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
const moveNow2 = async () => {
  if (cPage.value > maxPage.value || cPage.value < 1 || isNaN(cPage.value)) {
    return;
  }

  if (selectOption.value == "00") {
    Swal.fire({
      title: "경고",
      text: "검색 옵션을 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;

    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      selectOption.value,
      searchValue.value
    );
    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);

    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      selectOption.value,
      searchValue.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const AdminCodes = ref([]);
const checkedRowData = (e) => {
  AdminCodes.value = e.map((item) => item.lngUserAdminID);
  initCheckValue.value = e.map((item) => item.lngUserAdminID).join(",");
  //console.log(e);
};
const TeamCodes = ref([]);
const checkedRowData2 = (e) => {
  TeamCodes.value = e.map((item) => item.lngCode);
  initCheckValue2.value = e.map((item) => item.lngCode).join(",");
  //console.log(e);
};
const ScCodes = ref([]);
const checkedRowData3 = (e) => {
  ScCodes.value = e.map((item) => item.lngCode);
  initCheckValue3.value = e.map((item) => item.lngCode).join(",");
  //console.log(e);
};
const showUser = async () => {
  if (AdminCodes.value.length == 0) {
    rowData3.value = [];
    return;
  }

  const admincodes = AdminCodes.value.join("|");
  try {
    store.state.loading = true;
    const res = await getAdminUserList(
      store.state.userData.lngStoreGroup,
      admincodes
    );

    rowData3.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const showTeam = async () => {
  showteam.value = true;

  setTimeout(() => {
    initCheckAct2.value = !initCheckAct2.value;
  }, 300);
};

const showTeamUser = async () => {
  if (TeamCodes.value.length == 0) {
    rowData5.value = [];
    return;
  }

  const teamCodes = TeamCodes.value.join("|");
  try {
    store.state.loading = true;
    const res = await getTeamUserList(
      store.state.userData.lngStoreGroup,
      teamCodes
    );

    rowData5.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
watch(maxPage, () => {
  if (maxPage.value == 0) {
    maxPage.value = 1;
  }
});

const reMount = async () => {
  searchValue.value = "";
  selectOption.value = "00";
  cPage.value = 1;

  try {
    store.state.loading = true;

    const res2 = await getNoticeDocCount(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      selectOption.value,
      searchValue.value
    );
    //console.log(res2);
    maxPage.value = Math.ceil(res2.data.List[0].lngDocCnt / 20);

    const res = await getNoticeList2(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      cPage.value,
      selectOption.value,
      searchValue.value,
      store.state.userData.strLanguage
    );

    rowData.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
const editorInsert = ref(false);
const Writepopup = ref(false);
const closePopUp = () => {
  Writepopup.value = false;
};
const WritePopUp = () => {
  initNoticeEnroll2();
  content.value = "";
  selectedSeqId.value = 0;
  editorInsert.value = false;
  Writepopup.value = true;
};

const NoticeDefault = ref("등록");
watch(editorInsert, () => {
  if (editorInsert.value == false) {
    NoticeDefault.value = "등록";
  } else {
    NoticeDefault.value = "수정";
  }
});
const showadmin = ref(false);
const showAdmin = () => {
  showadmin.value = true;

  setTimeout(() => {
    initCheckAct.value = !initCheckAct.value;
  }, 300);
};

const showSC = () => {
  showsc.value = true;

  setTimeout(() => {
    initCheckAct3.value = !initCheckAct3.value;
  }, 300);
};

const showStore = () => {
  showst.value = true;

  setTimeout(() => {
    initCheckAct4.value = !initCheckAct4.value;
  }, 300);
};

const showSCUser = async () => {
  if (ScCodes.value.length == 0) {
    rowData5.value = [];
    return;
  }

  const scCode = ScCodes.value.join("|");
  try {
    store.state.loading = true;
    const res = await getSCUserList(store.state.userData.lngStoreGroup, scCode);

    rowData7.value = res.data.List;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const showst = ref(false);
const checkRows4 = ref([]);
const checkedRowData4 = (e) => {
  checkRows4.value = e;

  initCheckValue4.value = e.map((item) => item.lngStoreCode).join(",");
};
const checkRows5 = ref([]);
const checkedRowData5 = (e) => {
  // //console.log(e);
  checkRows5.value = e;
};

const moveLeft = async () => {
  if (checkRows5.value.length == 0) {
    return;
  }

  const converted = checkRows5.value.map((item) => item.lngStoreCode);
  rowData9.value = rowData9.value.filter(
    (item) => !converted.includes(item.lngStoreCode)
  );

  await nextTick();
  checkAll2.value = !checkAll2.value;
};
const checkAll = ref(false);
const checkAll2 = ref(false);
const moveRight = () => {
  if (checkRows4.value.length == 0) {
    return;
  }
  checkAll.value = !checkAll.value;
  rowData9.value = [...rowData9.value, ...checkRows4.value];
};

const searchWord = ref("");

const rowData10 = ref([]);
const fileInput = ref(null);
const handleFile = (e) => {
  // //console.log(e);
  let newRow = [];
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    newRow.push({
      lngFILENo: i + 1,
      strFileName: files[i].name,
      lngFileSize: files[i].size,
      strFile: files[i],
    });
  }
  rowData10.value = newRow;
};

const openFileEdit = () => {
  fileInput.value.click();
};

const uploadImages = ref([]);
const selectedSeqId = ref(0);
const saveButton = async () => {
  try {
    store.state.loading = true;

    if (filesEditForDelete.value.length > 0 && editorInsert.value == true) {
      try {
        const res = await deleteNoticeFiles(
          store.state.userData.lngStoreGroup,
          selectedSeqId.value,
          filesEditForDelete.value.join("\u200b")
        );

        const res2 = await deleteFiles(
          filesEditForDelete2.value.join("\u200b")
        );
      } catch (error) {
        store.state.loading = false;
        return;
      } finally {
        store.state.loading = false;
      }
    }
    const res = await saveNoticeDoc(
      gridvalue1.value,
      gridvalue2.value,
      cond.value == true ? 1 : 0,
      AdminCodes.value.join(";"),
      TeamCodes.value.join(";"),
      ScCodes.value.join(";"),
      rowData9.value.map((item) => item.lngStoreCode).join(";"),
      gridvalue3.value,
      gridvalue4.value,
      gridvalue5.value,
      gridvalue6.value,
      gridvalue7.value,
      gridvalue8.value,
      gridvalue9.value,
      gridvalue10.value,
      gridvalue11.value,
      gridvalue12.value,
      gridvalue13.value,
      gridvalue14.value,
      gridvalue15.value,
      gridvalue16.value,
      gridvalue17.value,
      gridvalue18.value,
      body.value,
      store.state.userData.lngSequence,
      rowData10.value.length,
      editorInsert.value == false ? "I" : "U",
      selectedSeqId.value
    );
    //console.log(res);
    const newSeq = res.data.List[0].lngSeqID;
    const tempFileName = ref([]);
    if (rowData10.value.length > 0) {
      const formData = new FormData();

      rowData10.value.forEach((file, index) => {
        if (file.checkbox !== true) {
          const currv4 = v4();
          // //console.log(file.strFileName);
          formData.append(
            `file${index}`,
            file.strFile,
            currv4 + "_" + file.strFileName
          );
          tempFileName.value.push(
            "http://211.238.145.30:8085/Uploads/" + currv4 + "_"
          );
        }
      });

      try {
        const fileNos = rowData10.value.map((item) => item.lngFILENo);
        const fileNms = rowData10.value.map((item) => item.strFileName);
        const fileSizes = rowData10.value.map((item) => item.lngFileSize);
        const res = await saveNoticeFileInsert(
          store.state.userData.lngStoreGroup,
          newSeq,
          fileNos.join("\u200b"),
          tempFileName.value.join("\u200b"),
          fileNms.join("\u200b"),
          fileSizes.join("\u200b")
        );
        //console.log(res);
      } catch (error) {
        //console.log(error);
      }
      const entriesArray = Array.from(formData.entries());
      if (entriesArray.length >= 1) {
        try {
          //comsole.log(formData.entries());
          const res2 = await uploadFile(formData);
          // //console.log(res2);
        } catch (error) {
          store.state.loading = false;
        } finally {
          store.state.loading = false;
        }
      }
    }

    // //console.log(res);
  } catch (error) {
    //console.log(error);
  } finally {
    initNoticeEnroll();
    store.state.loading = false;
    Writepopup.value = false;
    reMount();
  }
};

const checkAll3 = ref(false);
const initAdmin = () => {
  rowData3.value = [];

  checkAll3.value = !checkAll3.value;
};
const checkAll4 = ref(false);
const initTeam = () => {
  rowData5.value = [];

  checkAll4.value = !checkAll4.value;
};
const checkAll5 = ref(false);
const initSC = () => {
  rowData7.value = [];

  checkAll5.value = !checkAll5.value;
};
const cond = ref(false);
const body = ref("");
const editorData = (e) => {
  body.value = e;
};

const initNoticeEnroll = () => {
  gridvalue1.value = "";
  gridvalue2.value = "";
  cond.value = false;
  gridvalue3.value = "2";
  gridvalue4.value = "2";
  gridvalue5.value = "2";
  gridvalue6.value = "2";
  gridvalue7.value = "2";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "2";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "2";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "1";
  gridvalue18.value = "";

  if (rowData9.value.length > 0) {
    rowData9.value = [];
  }

  if (rowData10.value.length > 0) {
    rowData10.value = [];
  }

  AdminCodes.value = [];
  ScCodes.value = [];
  TeamCodes.value = [];
};

const initNoticeEnroll2 = () => {
  cond.value = false;
  gridvalue3.value = "2";
  gridvalue4.value = "2";
  gridvalue5.value = "2";
  gridvalue6.value = "2";
  gridvalue7.value = "2";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "2";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "2";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "1";
  gridvalue18.value = "";

  if (rowData9.value.length > 0) {
    rowData9.value = [];
  }

  if (rowData10.value.length > 0) {
    rowData10.value = [];
  }

  AdminCodes.value = [];
  ScCodes.value = [];
  TeamCodes.value = [];
};

const showNoticeDetail = ref(false);
const gridvalue21 = ref("");
const gridvalue22 = ref("");
const gridvalue23 = ref("");

const currWriterSeq = ref("");
const currNoticeSeq = ref("");
const editInfo = ref("");

const initCheckAct = ref(false);
const initCheckAct2 = ref(false);
const initCheckAct3 = ref(false);
const initCheckAct4 = ref(false);

const initCheckValue = ref("");
const initCheckColumn = ref("lngUserAdminID");
const initCheckValue2 = ref("");
const initCheckColumn2 = ref("lngCode");
const initCheckValue3 = ref("");
const initCheckColumn3 = ref("lngCode");
const initCheckValue4 = ref("");
const initCheckColumn4 = ref("lngStoreCode");
const clickedRowData = async (e) => {
  try {
    store.state.loading = true;
    const res = await getNoticeDocDetail(
      store.state.userData.lngStoreGroup,
      store.state.userData.lngPosition,
      store.state.userData.lngUserAdminID,
      e[7],
      1
    );
    //console.log(res.data);
    editInfo.value = res.data;
    gridvalue21.value = res.data.List[0].strWriter;
    gridvalue22.value = res.data.List[0].dtmWriteDate;
    gridvalue23.value = res.data.List[0].strSubject;
    currWriterSeq.value = res.data.List[0].lngWriteUser;
    currNoticeSeq.value = res.data.List[0].lngSeqID;
    content.value = res.data.List[0].strBody;
    rowData11.value = res.data.List2;
    showNoticeDetail.value = true;

    initCheckValue.value = res.data.List3.filter((item) => item.lngCheck == "1")
      .map((item) => item.lngUserAdminID)
      .join(",");

    initCheckValue2.value = res.data.List4.filter(
      (item) => item.lngCheck == "1"
    )
      .map((item) => item.lngCode)
      .join(",");
    initCheckValue3.value = res.data.List5.filter(
      (item) => item.lngCheck == "1"
    )
      .map((item) => item.lngCode)
      .join(",");
    initCheckValue4.value = res.data.List6.filter(
      (item) => item.lngCheck == "1"
    )
      .map((item) => item.lngStoreCode)
      .join(",");
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const filesEditForDelete = ref([]);
const filesEditForDelete2 = ref([]);
const checkedRowData6 = (e) => {
  filesEditForDelete.value = e.map((item) => item.lngSeqNo);
  filesEditForDelete2.value = e.map(
    (item) => item.strFilePath.split("/Uploads/")[1]
  );
  //console.log(e);
};
const rowData11 = ref([]);
const content = ref("");

const deleteNotice = async () => {
  if (currWriterSeq.value !== store.state.userData.lngSequence) {
    Swal.fire({
      title: "경고",
      text: "자신이 작성한 글만 삭제할 수 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    Swal.fire({
      title: "경고",
      text: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteNoticeDoc(currNoticeSeq.value);
        } catch (error) {
        } finally {
          showNoticeDetail.value = false;
          store.state.loading = false;
          reMount();
        }
      } else {
        store.state.loading = false;
        return;
      }
    });
  } catch (error) {
  } finally {
  }
};

const editPopUp = () => {
  editorInsert.value = true;
  showNoticeDetail.value = false;

  gridvalue1.value = editInfo.value.List[0].strWriter;
  gridvalue2.value = editInfo.value.List[0].lngStoreGroup;
  cond.value = false;

  gridvalue3.value = editInfo.value.List[0].strImportant;
  gridvalue4.value = editInfo.value.List[0].strTopDist;
  gridvalue5.value = editInfo.value.List[0].strPosDown;
  gridvalue6.value = editInfo.value.List[0].lngAppPush;
  gridvalue7.value = editInfo.value.List[0].strPopupNotice;
  gridvalue8.value = editInfo.value.List[0].dtmPopupFromDate;
  gridvalue9.value = editInfo.value.List[0].dtmPopupToDate;
  gridvalue10.value = editInfo.value.List[0].strAllInform;
  gridvalue11.value = editInfo.value.List[0].dtmInformFromDate;
  gridvalue12.value = editInfo.value.List[0].dtmInformToDate;
  gridvalue13.value = editInfo.value.List[0].strReAlarm;
  gridvalue14.value = editInfo.value.List[0].dtmReAlarmFromDate;
  gridvalue15.value = editInfo.value.List[0].dtmReAlarmToDate;
  gridvalue16.value = editInfo.value.List[0].strPassword;
  gridvalue17.value = editInfo.value.List[0].lngNoticeType;
  gridvalue18.value = editInfo.value.List[0].strSubject;
  content.value = editInfo.value.List[0].strBody;
  selectedSeqId.value = editInfo.value.List[0].lngSeqID;
  if (rowData9.value.length > 0) {
    rowData9.value = [];
  }

  rowData10.value = rowData11.value;

  AdminCodes.value = [];
  ScCodes.value = [];
  TeamCodes.value = [];

  Writepopup.value = true;
};

const clickedRowData2 = async (e) => {
  try {
    const response = await axios.get(`${e[4]}`, {
      responseType: "blob", // 응답을 Blob 형태로 받음
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${e[2]}`; // 다운로드 파일명 설정
    downloadLink.click();

    // 다운로드 후 Blob URL 해제
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // //console.log(error);
    Swal.fire({
      title: "오류",
      text: "파일 다운로드 실패",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }
};
</script>

<style scoped></style>

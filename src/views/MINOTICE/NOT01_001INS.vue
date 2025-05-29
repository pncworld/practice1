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
        <div class="text-2xl font-bold">◎공지사항 등록</div>
        <div class="flex justify-center items-center space-x-3">
          <button class="button primary">파일첨부</button>
          <button class="button save">저장</button>
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
            <option :value="i.lngCode" v-for="i in brandList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="bg-gray-100 border-l border-t">공지매장</div>
        <div class="flex space-x-3 items-center pl-5 border-l border-t">
          <label for="cond"><input type="checkbox" id="cond" />전체공지</label>
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
              <option value="0">중요</option>
              <option value="1">일반</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            상단게시
          </div>
          <div class="flex justify-start pl-5 items-center">
            <select name="" id="" class="border w-52" v-model="gridvalue4">
              <option value="">상단게시</option>
              <option value="">순차게시</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">POS 공지</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue5">
              <option value="">사용</option>
              <option value="">사용안함</option>
            </select>
          </div>
          <div class="bg-gray-100 border-l border-t w-32 h-full ml-32">
            모바일 앱 알림
          </div>
          <div class="flex justify-start pl-5 items-center">
            <select name="" id="" class="border w-52" v-model="gridvalue6">
              <option value="">사용</option>
              <option value="">사용안함</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="bg-gray-100 border-l border-t">팝업공지</div>
        <div
          class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,2fr] border-l border-t items-center">
          <div class="pl-5">
            <select name="" id="" class="border w-52" v-model="gridvalue7">
              <option value="">사용</option>
              <option value="">사용안함</option>
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
              <option value="">사용</option>
              <option value="">사용안함</option>
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
              <option value="">사용</option>
              <option value="">사용안함</option>
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
            <option value="">물류</option>
            <option value="">정산</option>
            <option value="">이벤트</option>
            <option value="">마케팅</option>
            <option value="">메뉴</option>
            <option value="">신제품</option>
            <option value="">배송</option>
            <option value="">품목사장</option>
            <option value="">일시중단</option>
            <option value="">긴급</option></select
          ><input type="text" class="border pl-1 w-96" v-model="gridvalue18" />
        </div>
      </div>
      <div class="flex justify-start items-center w-[80vw]">
        <CkEditor class="w-full"> </CkEditor>
      </div>
      <div class="grid grid-rows-[1fr,6fr] w-[59vw]">
        <div class="text-xl font-bold flex justify-start">◎첨부파일</div>
        <div>
          <Realgrid
            :progname="'NOT01_001INS_VUE'"
            :progid="8"
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
          <button class="whitebutton">선택완료</button
          ><button @click="showadmin = false" class="whitebutton">닫기</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-full h-full">
          <div class="w-full h-full">
            <div>권한그룹 선택</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="1"
                :rowStateeditable="false"
                :setStateBar="false"
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
          <button class="whitebutton">선택완료</button
          ><button @click="showteam = false" class="whitebutton">닫기</button>
        </div>
        <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-full h-full">
          <div class="w-full h-full">
            <div>팀 선택</div>
            <div class="w-full h-[80%] mt-5">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="3"
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
          <button class="whitebutton">선택완료</button
          ><button @click="showsc = false" class="whitebutton">닫기</button>
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
                <input type="text" class="border pl-1" />
              </div>
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="7"
                :rowStateeditable="false"
                :setStateBar="false"
                @checkedRowData="checkedRowData4"
                :rowData="rowData8"></Realgrid>
            </div>
          </div>
          <div class="flex flex-col items-start justify-center space-y-10">
            <button class="whitebutton">></button>
            <button class="whitebutton"><</button>
          </div>
          <div class="w-[90%] h-full">
            <div>매장 등록</div>
            <div class="w-full h-[80%] mt-10">
              <Realgrid
                :progname="'NOT01_001INS_VUE'"
                :progid="7"
                :rowStateeditable="false"
                :setStateBar="false"
                :rowData="rowData9"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getAdminUserList,
  getInitNoticeInfo,
  getNoticeDocCount,
  getNoticeList2,
  getSCUserList,
  getTeamUserList,
} from "@/api/minotice";
import CkEditor from "@/components/ckEditor.vue";

import Realgrid from "@/components/realgrid.vue";
import store from "@/store";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";

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
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const gridvalue17 = ref("");
const gridvalue18 = ref("");

const showteam = ref(false);
const showsc = ref(false);

onMounted(async () => {
  console.log(store.state.userData);

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
  //console.log(e);
};
const TeamCodes = ref([]);
const checkedRowData2 = (e) => {
  TeamCodes.value = e.map((item) => item.lngCode);
  //console.log(e);
};
const ScCodes = ref([]);
const checkedRowData3 = (e) => {
  ScCodes.value = e.map((item) => item.lngCode);
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

const Writepopup = ref(false);
const closePopUp = () => {
  Writepopup.value = false;
};
const WritePopUp = () => {
  Writepopup.value = true;
};

const showadmin = ref(false);
const showAdmin = () => {
  showadmin.value = true;
};

const showSC = () => {
  showsc.value = true;
};

const showStore = () => {
  showst.value = true;
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
const checkedRowData4 = (e) => {
  console.log(e);
};
</script>

<style lang="scss" scoped></style>

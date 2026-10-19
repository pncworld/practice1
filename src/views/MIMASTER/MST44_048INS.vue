<!-- /*--############################################################################
# Filename : MST44_048INS.vue
# Description : 마스터관리 > POS 마스터 > 배포등록
# Date :2026-10-06
# Author : 권지안
################################################################################*/ -->
<template>
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
    </div>

    <div class="flex gap-2 items-start">
      <div class="w-1/2 min-w-0">
        <div class="bg-gray-200 rounded-lg z-10 mt-2">
          <div class="flex items-center justify-between gap-2 px-4 py-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-sm font-semibold shrink-0">패치등록</span>
              <span class="text-sm shrink-0">위치</span>
              <select
                class="box-border h-[26px] w-36 border rounded-md px-2 text-sm bg-white"
                v-model="condPrgSection">
                <option
                  v-for="item in prgSectionList"
                  :key="'ps-' + item.strDCode"
                  :value="item.strDCode">
                  {{ item.strDName }}
                </option>
              </select>
            </div>
            <div class="flex justify-end gap-4 shrink-0">
              <button class="whitebutton bg-white" @click="searchMst">조회</button>
              <button class="whitebutton bg-white" @click="openMstNew">신규</button>
              <button class="whitebutton bg-white" @click="openMstEdit()">수정</button>
              <button class="whitebutton bg-white" @click="deleteMst">삭제</button>
            </div>
          </div>
        </div>
        <div class="h-[28vh] min-h-[180px] mt-2">
          <Realgrid
            :progname="progName"
            :progid="1"
            :rowData="rowDataMst"
            :setStateBar="false"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            :moveFocusbyIndex="mstFocus"
            @clickedRowData="clickedMst"
            @dblclickedRowData="dblclickedMst"
            @selectedIndex="selectedMstIndex">
          </Realgrid>
        </div>
        <div class="bg-gray-200 rounded-lg z-10 mt-2">
          <div class="flex items-center justify-between gap-2 px-4 py-2">
            <span class="text-sm font-semibold">패치내역등록</span>
            <div class="flex justify-end gap-4 shrink-0">
              <button class="whitebutton bg-white" @click="searchDtl">조회</button>
              <button class="whitebutton bg-white" @click="openDtlNew">신규</button>
              <button class="whitebutton bg-white" @click="openDtlEdit()">수정</button>
              <button class="whitebutton bg-white" @click="deleteDtl">삭제</button>
            </div>
          </div>
        </div>
        <div class="h-[34vh] min-h-[200px] mt-2">
          <Realgrid
            :progname="progName"
            :progid="2"
            :rowData="rowDataDtl"
            :setStateBar="false"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            @clickedRowData="clickedDtl"
            @dblclickedRowData="dblclickedDtl"
            @selectedIndex="selectedDtlIndex">
          </Realgrid>
        </div>
      </div>

      <div class="w-1/2 min-w-0">
        <div class="bg-gray-200 rounded-lg z-10 mt-2">
          <div class="flex items-center justify-between gap-2 px-4 py-2">
            <span class="text-sm font-semibold">배포등록</span>
            <div class="flex justify-end gap-4 shrink-0">
              <button class="whitebutton bg-white" @click="searchStore">조회</button>
              <button class="whitebutton bg-white" @click="openStoreNew">신규</button>
              <button class="whitebutton bg-white" @click="openStoreEdit()">수정</button>
              <button class="whitebutton bg-white" @click="deleteStore">삭제</button>
            </div>
          </div>
        </div>
        <div class="h-[68vh] min-h-[420px] mt-2">
          <Realgrid
            :progname="progName"
            :progid="3"
            :rowData="rowDataStore"
            :setStateBar="false"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            @clickedRowData="clickedStore"
            @dblclickedRowData="dblclickedStore"
            @selectedIndex="selectedStoreIndex">
          </Realgrid>
        </div>
      </div>
    </div>

    <div
      v-if="showMstPop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[480px] max-w-[92vw] p-5">
        <h2 class="text-base font-bold">패치등록(신규/수정)</h2>
        <div class="mt-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-sm">패치구분</span>
              <select
                class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
                v-model="mstForm.patchType">
                <option
                  v-for="item in patchTypeList"
                  :key="'pt-' + item.strDCode"
                  :value="item.strDCode">
                  {{ item.strDName }}
                </option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm">위치</span>
              <select
                class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
                v-model="mstForm.prgSection">
                <option
                  v-for="item in prgSectionList"
                  :key="'psm-' + item.strDCode"
                  :value="item.strDCode">
                  {{ item.strDName }}
                </option>
              </select>
            </label>
          </div>
          <label class="block">
            <span class="text-sm">패치명</span>
            <input
              type="text"
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="mstForm.name" />
          </label>
          <label class="block">
            <span class="text-sm">패치사유</span>
            <input
              type="text"
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="mstForm.reason" />
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" v-model="mstForm.use" />
            사용
          </label>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button class="whitebutton bg-white" @click="saveMst">저장</button>
          <button class="whitebutton bg-white" @click="closeMstPop">닫기</button>
        </div>
      </div>
    </div>

    <div
      v-if="showDtlPop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[480px] max-w-[92vw] p-5">
        <h2 class="text-base font-bold">패치내역등록(신규/수정)</h2>
        <div class="mt-4 space-y-3">
          <div>
            <span class="text-sm">패치파일명</span>
            <div class="flex items-center gap-2 mt-1">
              <input
                type="text"
                disabled
                class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                v-model="dtlForm.fileName" />
              <button class="whitebutton bg-white shrink-0" @click="openFileMstPop">...</button>
            </div>
          </div>
          <div>
            <span class="text-sm">업로드파일명</span>
            <div class="flex items-center gap-2 mt-1">
              <input
                type="text"
                disabled
                class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                v-model="dtlForm.svrFileName" />
              <button class="whitebutton bg-white shrink-0" @click="openFileDtlPop">...</button>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button class="whitebutton bg-white" @click="saveDtl">저장</button>
          <button class="whitebutton bg-white" @click="closeDtlPop">닫기</button>
        </div>
      </div>
    </div>

    <div
      v-if="showStorePop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[520px] max-w-[94vw] p-5">
        <h2 class="text-base font-bold">배포등록(신규/수정)</h2>
        <div class="mt-4 border border-[#c5c7d6] divide-y divide-[#c5c7d6]">
          <div class="grid grid-cols-[6.5rem_1fr] min-h-[40px]">
            <div class="bg-[#ececf3] text-sm font-semibold flex items-center justify-center">패치명</div>
            <div class="p-1.5">
              <input
                type="text"
                disabled
                class="border rounded-md px-2 py-1 text-sm w-full h-[28px] bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                v-model="storeForm.name" />
            </div>
          </div>
          <div class="grid grid-cols-[6.5rem_1fr] min-h-[40px]">
            <div class="bg-[#ececf3] text-sm font-semibold flex items-center justify-center">배포일시</div>
            <div class="p-1.5">
              <input
                type="date"
                class="border rounded-md px-2 py-1 text-sm w-full h-[28px] bg-white"
                v-model="storeForm.date" />
            </div>
          </div>
          <div class="grid grid-cols-[6.5rem_1fr] min-h-[40px]">
            <div class="bg-[#ececf3] text-sm font-semibold flex items-center justify-center">배포구분</div>
            <div class="p-1.5">
              <select
                class="border rounded-md px-2 py-1 text-sm w-full h-[28px] bg-white"
                v-model="storeForm.patchType"
                @change="onStorePatchTypeChange">
                <option
                  v-for="item in patchType2List"
                  :key="'pt2-' + item.strDCode"
                  :value="item.strDCode">
                  {{ item.strDName }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-[6.5rem_1fr]">
            <div class="bg-[#ececf3] text-sm font-semibold flex items-center justify-center">배포대상</div>
            <div class="p-1.5 flex items-start gap-2">
              <button
                class="whitebutton bg-white shrink-0 h-[28px]"
                :disabled="storePickMode === 'all'"
                :class="storePickMode === 'all' ? 'opacity-40 cursor-not-allowed' : ''"
                @click="openStorePick">
                선택
              </button>
              <div
                class="flex-1 min-h-[28px] max-h-24 overflow-y-auto border rounded-md px-2 py-1 text-sm leading-5 bg-gray-50 text-gray-700">
                {{ targetBoxText }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button class="whitebutton bg-white" @click="saveStore">저장</button>
          <button class="whitebutton bg-white" @click="closeStorePop">닫기</button>
        </div>
      </div>
    </div>

    <div
      v-if="showFileMstPop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div class="bg-white rounded-lg shadow-lg w-[640px] max-w-[94vw] p-5">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-base font-bold">패치파일선택</h2>
          <div class="flex gap-2">
            <button class="whitebutton bg-white" @click="searchFileMst">조회</button>
            <button class="whitebutton bg-white" @click="selectFileMst">선택</button>
            <button class="whitebutton bg-white" @click="closeFileMstPop">닫기</button>
          </div>
        </div>
        <div class="grid grid-cols-[4rem_1fr] items-center gap-2 mt-4">
          <span class="text-sm">구분</span>
          <select
            class="border rounded-md px-2 py-1 text-sm w-48 bg-white"
            v-model="fileMstCond.type">
            <option
              v-for="item in fileTypeList"
              :key="'ft-' + item.strDCode"
              :value="item.strDCode">
              {{ item.strDName }}
            </option>
          </select>
          <span class="text-sm">파일명</span>
          <input
            type="text"
            class="border rounded-md px-2 py-1 text-sm w-full bg-white"
            v-model="fileMstCond.name"
            @keydown.enter="searchFileMst" />
        </div>
        <div class="h-[420px] mt-3">
          <Realgrid
            :progname="progName"
            :progid="4"
            :rowData="rowDataFileMst"
            :setStateBar="false"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            @clickedRowData="clickedFileMst"
            @dblclickedRowData="dblclickedFileMst"
            @selectedIndex="selectedFileMstIndex">
          </Realgrid>
        </div>
      </div>
    </div>

    <div
      v-if="showFileDtlPop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div class="bg-white rounded-lg shadow-lg w-[640px] max-w-[94vw] p-5">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-base font-bold">업로드파일선택</h2>
          <div class="flex gap-2">
            <button class="whitebutton bg-white" @click="searchFileDtl">조회</button>
            <button class="whitebutton bg-white" @click="selectFileDtl">선택</button>
            <button class="whitebutton bg-white" @click="closeFileDtlPop">닫기</button>
          </div>
        </div>
        <div class="grid grid-cols-[4rem_1fr_auto] items-center gap-2 mt-4">
          <span class="text-sm">위치</span>
          <select
            class="border rounded-md px-2 py-1 text-sm w-48 bg-white"
            v-model="fileDtlCond.section">
            <option
              v-for="item in prgSectionList"
              :key="'psd-' + item.strDCode"
              :value="item.strDCode">
              {{ item.strDName }}
            </option>
          </select>
          <label class="inline-flex items-center gap-1 text-sm whitespace-nowrap">
            <input type="checkbox" v-model="fileDtlCond.viewAll" />
            전체보기
          </label>
          <span class="text-sm">파일명</span>
          <input
            type="text"
            class="border rounded-md px-2 py-1 text-sm w-full bg-white col-span-2"
            v-model="fileDtlCond.name"
            @keydown.enter="searchFileDtl" />
        </div>
        <div class="h-[420px] mt-3">
          <Realgrid
            :progname="progName"
            :progid="5"
            :rowData="rowDataFileDtl"
            :setStateBar="false"
            :rowStateeditable="false"
            :selectionStyle="'singleRow'"
            @clickedRowData="clickedFileDtl"
            @dblclickedRowData="dblclickedFileDtl"
            @selectedIndex="selectedFileDtlIndex">
          </Realgrid>
        </div>
      </div>
    </div>

    <div
      v-if="showStorePick"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div class="bg-white rounded-lg shadow-lg w-[860px] max-w-[96vw] p-5">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-base font-bold">배포대상선택</h2>
          <div class="flex gap-2">
            <button class="whitebutton bg-white" @click="searchStoreGroups">조회</button>
            <button class="whitebutton bg-white" @click="selectStoreTarget">선택</button>
            <button class="whitebutton bg-white" @click="closeStorePick">닫기</button>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <div class="min-w-0" :class="storePickMode === 'store' ? 'w-1/2' : 'w-full'">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm shrink-0">매장그룹검색</span>
              <input
                type="text"
                class="border rounded-md px-2 py-1 text-sm w-full bg-white"
                v-model="groupKeyword"
                @keydown.enter="searchStoreGroups" />
            </div>
            <div class="h-[420px]">
              <Realgrid
                :progname="progName"
                :progid="6"
                :rowData="rowDataGroup"
                :setStateBar="false"
                :rowStateeditable="false"
                :editableColId="'lngCheck'"
                :checkRenderEditable="true"
                :headerCheckBar="'lngCheck'"
                :selectionStyle="'singleRow'"
                @clickedRowData="clickedGroup"
                @dblclickedRowData="dblclickedGroup"
                @selectedIndex="selectedGroupIndex"
                @updatedRowData="updatedGroupRows">
              </Realgrid>
            </div>
          </div>
          <div v-if="storePickMode === 'store'" class="w-1/2 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm shrink-0">매장검색</span>
              <input
                type="text"
                class="border rounded-md px-2 py-1 text-sm w-full bg-white"
                v-model="storeKeyword"
                @keydown.enter="searchTargetStores" />
            </div>
            <div class="h-[420px]">
              <Realgrid
                :progname="progName"
                :progid="7"
                :rowData="rowDataTargetStore"
                :setStateBar="false"
                :rowStateeditable="false"
                :editableColId="'lngCheck'"
                :checkRenderEditable="true"
                :headerCheckBar="'lngCheck'"
                :selectionStyle="'singleRow'"
                @clickedRowData="clickedTargetStore"
                @dblclickedRowData="dblclickedTargetStore"
                @selectedIndex="selectedTargetStoreIndex"
                @updatedRowData="updatedTargetStoreRows">
              </Realgrid>
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
  delPatchDtl,
  delPatchMst,
  delPatchStore,
  getPatchDtlList,
  getPatchFileDtlList,
  getPatchFileMstList,
  getPatchMstList,
  getPatchStoreList,
  getPatchTargetGroupList,
  getPatchTargetStoreList,
  setPatchDtl,
  setPatchMst,
  setPatchStore,
} from "@/api/master";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const progName = "MST44_048INS";
const store = useStore();

const rowDataMst = ref([]);
const rowDataDtl = ref([]);
const rowDataStore = ref([]);
const rowDataFileMst = ref([]);
const rowDataFileDtl = ref([]);
const rowDataGroup = ref([]);
const rowDataTargetStore = ref([]);

const condPrgSection = ref("0");
const prgSectionList = ref([{ strDCode: "0", strDName: "선택" }]);
const fileTypeList = ref([{ strDCode: "0", strDName: "전체" }]);
const patchTypeList = ref([]);
const patchType2List = ref([]);

const showMstPop = ref(false);
const showDtlPop = ref(false);
const showStorePop = ref(false);
const showFileMstPop = ref(false);
const showFileDtlPop = ref(false);
const showStorePick = ref(false);

const mstEditMode = ref("I");
const dtlEditMode = ref("I");
const storeEditMode = ref("I");

const selectedMst = ref(null);
const selectedDtl = ref(null);
const selectedStore = ref(null);
const selectedFileMst = ref(null);
const selectedFileDtl = ref(null);
const selectedGroup = ref(null);
const selectedTargetStore = ref(null);

const mstIndex = ref(-1);
const mstFocus = ref("");
const loadedChildCode = ref("");
const dtlIndex = ref(-1);
const storeIndex = ref(-1);
const fileMstIndex = ref(-1);
const fileDtlIndex = ref(-1);
const groupIndex = ref(-1);
const targetStoreIndex = ref(-1);

const groupLive = ref([]);
const targetStoreLive = ref([]);
const selectedTargets = ref([]);
const groupKeyword = ref("");
const storeKeyword = ref("");

const mstForm = reactive({
  code: "0",
  patchType: "1",
  prgSection: "0",
  name: "",
  reason: "",
  use: true,
});

const dtlForm = reactive({
  seq: "0",
  mstCode: "0",
  fileMstCode: "0",
  fileDtlCode: "0",
  fileName: "",
  svrFileName: "",
});

const storeForm = reactive({
  code: "0",
  mstCode: "0",
  name: "",
  date: "",
  patchType: "0",
});

const fileMstCond = reactive({ type: "0", name: "" });
const fileDtlCond = reactive({ section: "0", name: "", viewAll: false });

const storePickMode = computed(() => {
  if (String(storeForm.patchType) === "1") {
    return "group";
  }
  if (String(storeForm.patchType) === "2") {
    return "store";
  }
  return "all";
});

const targetSummary = computed(() =>
  selectedTargets.value
    .map((item) => item.strObjectCode)
    .filter((name) => String(name || "").trim())
    .join(", ")
);

const targetBoxText = computed(() => {
  if (storePickMode.value === "all") {
    return "전체";
  }
  return targetSummary.value || "배포대상을 선택하세요";
});

const mapCommonCode = (list) =>
  (Array.isArray(list) ? list : []).map((item) => ({
    strDCode: item?.strDCode == null ? "" : String(item.strDCode),
    strDName: item?.strDName == null ? "" : String(item.strDName),
  }));

const withHead = (label, list) => [
  { strDCode: "0", strDName: label },
  ...list.filter((item) => item.strDCode !== "0"),
];

const warn = (text) => {
  Swal.fire({
    title: "경고",
    text,
    icon: "warning",
    confirmButtonText: "확인",
  });
};

const done = (text) =>
  Swal.fire({
    title: "성공",
    text,
    icon: "success",
    confirmButtonText: "확인",
  });

const rowValue = (row, key) => {
  if (!row || Array.isArray(row) || typeof row !== "object") {
    return "";
  }
  const value = row[key];
  return value == null ? "" : value;
};

const resolveRow = (emitted, list, index) => {
  if (emitted && typeof emitted === "object" && !Array.isArray(emitted)) {
    return emitted;
  }
  const fromList = list.value[index];
  if (fromList && typeof fromList === "object" && !Array.isArray(fromList)) {
    return fromList;
  }
  return emitted;
};

const readPayload = (data) => {
  let payload = data;
  if (payload && typeof payload === "object" && "d" in payload) {
    payload = payload.d;
  }
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      payload = {};
    }
  }
  return payload && typeof payload === "object" ? payload : {};
};

const isSuccess = (payload) =>
  !payload?.RESULT_CD || String(payload.RESULT_CD) === "00";

const isUse = (value) =>
  value === true || value === 1 || value === "1" || value === "Y" || value === "y";

const isChecked = (row) => isUse(rowValue(row, "lngCheck"));

const toCheckGridRow = (row) => ({
  ...row,
  lngCheck: isUse(row?.lngCheck),
});

const userId = () => String(store.state.userData?.lngSequence ?? "");

const todayInput = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const formatGridDate = (value) => {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const text = String(value).trim();
  const microsoft = text.match(/^\/Date\((-?\d+)\)\/$/);
  const parsed = microsoft ? new Date(Number(microsoft[1])) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${parsed.getFullYear()}-${month}-${day}`;
  }
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
};

const normalizeRowDates = (row) => {
  const next = { ...row };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    const microsoft =
      typeof value === "string" && /^\/Date\((-?\d+)\)\/$/.test(String(value).trim());
    if (!microsoft && !/dtm|date/i.test(key)) {
      return;
    }
    next[key] = formatGridDate(value);
  });
  if (Object.prototype.hasOwnProperty.call(next, "lngUse")) {
    next.lngUse = isUse(next.lngUse);
  }
  return next;
};

const toInputDate = (value) => {
  const text = String(value || "").replace(/\D/g, "");
  if (text.length >= 8) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  }
  return todayInput();
};

const toCompactDate = (value) => String(value || "").replace(/\D/g, "").slice(0, 8);

const currentMstCode = () => {
  const code = rowValue(selectedMst.value, "lngPatchMstCode");
  return code === "" ? "" : String(code);
};

const requireMst = () => {
  if (!currentMstCode()) {
    warn("패치를 선택하세요");
    return false;
  }
  return true;
};

const pullList = async (request, failText) => {
  const res = await request();
  const payload = readPayload(res?.data);
  if (!isSuccess(payload)) {
    warn(payload.RESULT_NM || failText);
    return [];
  }
  return Array.isArray(payload.List) ? payload.List : [];
};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  try {
    const [fileTypeRes, prgSectionRes, patchTypeRes, patchType2Res] =
      await Promise.all([
        getCommonList(276),
        getCommonList(277),
        getCommonList(279),
        getCommonList(280),
      ]);
    fileTypeList.value = withHead(
      "전체",
      mapCommonCode(fileTypeRes?.data?.List)
    );
    prgSectionList.value = withHead(
      "선택",
      mapCommonCode(prgSectionRes?.data?.List)
    );
    patchTypeList.value = mapCommonCode(patchTypeRes?.data?.List);
    patchType2List.value = mapCommonCode(patchType2Res?.data?.List);
  } catch (error) {
    fileTypeList.value = [{ strDCode: "0", strDName: "전체" }];
    prgSectionList.value = [{ strDCode: "0", strDName: "선택" }];
    patchTypeList.value = [];
    patchType2List.value = [];
  }
  await searchMst();
});

const searchMst = async () => {
  store.state.loading = true;
  selectedMst.value = null;
  selectedDtl.value = null;
  selectedStore.value = null;
  mstIndex.value = -1;
  dtlIndex.value = -1;
  storeIndex.value = -1;
  rowDataDtl.value = [];
  rowDataStore.value = [];
  try {
    const list = await pullList(
      () => getPatchMstList("-1", condPrgSection.value),
      "패치 조회에 실패했습니다."
    );
    const rows = list.map((row) =>
      normalizeRowDates({
        ...row,
        lngUse: isUse(row?.lngUse),
      })
    );
    rowDataMst.value = rows;
    loadedChildCode.value = "";
    if (rows.length) {
      selectedMst.value = rows[0];
      mstIndex.value = 0;
      await loadChildren(String(rowValue(rows[0], "lngPatchMstCode")));
      mstFocus.value = "";
      await nextTick();
      mstFocus.value = "0";
      setTimeout(async () => {
        if (!rowDataMst.value.length) {
          return;
        }
        mstFocus.value = "";
        await nextTick();
        mstFocus.value = "0";
      }, 400);
    }
  } catch (error) {
    rowDataMst.value = [];
    warn("패치 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const loadChildren = async (code) => {
  store.state.loading = true;
  selectedDtl.value = null;
  selectedStore.value = null;
  dtlIndex.value = -1;
  storeIndex.value = -1;
  loadedChildCode.value = String(code);
  try {
    const [details, stores] = await Promise.all([
      pullList(() => getPatchDtlList(code), "패치내역 조회에 실패했습니다."),
      pullList(() => getPatchStoreList(code), "배포 조회에 실패했습니다."),
    ]);
    rowDataDtl.value = details.map((row) => normalizeRowDates(row));
    rowDataStore.value = stores.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowDataDtl.value = [];
    rowDataStore.value = [];
    warn("조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const clickedMst = (row) => {
  selectedMst.value = resolveRow(row, rowDataMst, mstIndex.value);
};

const selectedMstIndex = (index) => {
  mstIndex.value = index;
  selectedMst.value = resolveRow(selectedMst.value, rowDataMst, index);
  const code = currentMstCode();
  if (index == null || index < 0 || !code) {
    loadedChildCode.value = "";
    rowDataDtl.value = [];
    rowDataStore.value = [];
    return;
  }
  if (code === loadedChildCode.value) {
    return;
  }
  loadChildren(code);
};

const dblclickedMst = (row) => {
  selectedMst.value = resolveRow(row, rowDataMst, mstIndex.value);
  openMstEdit(selectedMst.value);
};

const clickedDtl = (row) => {
  selectedDtl.value = resolveRow(row, rowDataDtl, dtlIndex.value);
};

const selectedDtlIndex = (index) => {
  dtlIndex.value = index;
  selectedDtl.value = resolveRow(selectedDtl.value, rowDataDtl, index);
};

const dblclickedDtl = (row) => {
  selectedDtl.value = resolveRow(row, rowDataDtl, dtlIndex.value);
  openDtlEdit(selectedDtl.value);
};

const clickedStore = (row) => {
  selectedStore.value = resolveRow(row, rowDataStore, storeIndex.value);
};

const selectedStoreIndex = (index) => {
  storeIndex.value = index;
  selectedStore.value = resolveRow(selectedStore.value, rowDataStore, index);
};

const dblclickedStore = (row) => {
  selectedStore.value = resolveRow(row, rowDataStore, storeIndex.value);
  openStoreEdit(selectedStore.value);
};

const openMstNew = () => {
  mstEditMode.value = "I";
  mstForm.code = "0";
  mstForm.patchType = "1";
  mstForm.prgSection = "0";
  mstForm.name = "";
  mstForm.reason = "";
  mstForm.use = true;
  showMstPop.value = true;
};

const patchTypeCode = (row) => {
  const code = rowValue(row, "lngPatchType");
  if (code !== "") {
    return String(code);
  }
  const name = String(rowValue(row, "strPatchType") || "").trim();
  const found = patchTypeList.value.find((item) => item.strDName === name);
  return found ? found.strDCode : "1";
};

const openMstEdit = (row = selectedMst.value) => {
  if (!row) {
    warn("수정할 내용을 선택하세요");
    return;
  }
  const code = rowValue(row, "lngPatchMstCode");
  const listed = rowDataMst.value.find(
    (item) => String(rowValue(item, "lngPatchMstCode")) === String(code)
  );
  const current =
    listed && typeof listed === "object" && !Array.isArray(listed) ? listed : row;
  mstEditMode.value = "U";
  mstForm.code = String(rowValue(current, "lngPatchMstCode") || "0");
  mstForm.patchType = patchTypeCode(current);
  mstForm.prgSection = String(rowValue(current, "lngPrgSection") ?? "0");
  mstForm.name = rowValue(current, "strPatchMstName");
  mstForm.reason = rowValue(current, "strPatchMstReason");
  mstForm.use = isUse(rowValue(current, "lngUse"));
  showMstPop.value = true;
};

const closeMstPop = () => {
  showMstPop.value = false;
};

const saveMst = async () => {
  if (String(mstForm.prgSection) === "0" || !String(mstForm.prgSection || "").trim()) {
    warn("배포위치를 선택하세요");
    return;
  }
  store.state.loading = true;
  try {
    const res = await setPatchMst(
      mstEditMode.value === "I" ? "0" : String(mstForm.code || "0"),
      String(mstForm.patchType || ""),
      String(mstForm.name || ""),
      String(mstForm.reason || ""),
      mstForm.use ? "1" : "0",
      userId(),
      String(mstForm.prgSection || "")
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "저장에 실패했습니다.");
      return;
    }
    closeMstPop();
    await searchMst();
    await done("저장되었습니다.");
  } catch (error) {
    warn("저장에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const confirmDelete = async () => {
  const result = await Swal.fire({
    title: "삭제",
    text: "삭제된 자료는 복구되지 않습니다. 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  return result.isConfirmed;
};

const deleteMst = async () => {
  if (!selectedMst.value) {
    warn("삭제할 내용을 선택하세요");
    return;
  }
  if (!(await confirmDelete())) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await delPatchMst(String(rowValue(selectedMst.value, "lngPatchMstCode")));
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "삭제에 실패했습니다.");
      return;
    }
    await searchMst();
    await done("삭제 완료되었습니다");
  } catch (error) {
    warn("삭제에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const searchDtl = async () => {
  if (!requireMst()) {
    return;
  }
  store.state.loading = true;
  selectedDtl.value = null;
  dtlIndex.value = -1;
  try {
    const details = await pullList(
      () => getPatchDtlList(currentMstCode()),
      "패치내역 조회에 실패했습니다."
    );
    rowDataDtl.value = details.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowDataDtl.value = [];
    warn("패치내역 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const openDtlNew = () => {
  if (!requireMst()) {
    return;
  }
  dtlEditMode.value = "I";
  dtlForm.seq = "0";
  dtlForm.mstCode = currentMstCode();
  dtlForm.fileMstCode = "0";
  dtlForm.fileDtlCode = "0";
  dtlForm.fileName = "";
  dtlForm.svrFileName = "";
  showDtlPop.value = true;
};

const openDtlEdit = (row = selectedDtl.value) => {
  if (!row) {
    warn("수정할 내용을 선택하세요");
    return;
  }
  dtlEditMode.value = "U";
  dtlForm.seq = String(rowValue(row, "lngPatchDtlSeq") || "0");
  dtlForm.mstCode = String(rowValue(row, "lngPatchMstCode") || currentMstCode());
  dtlForm.fileMstCode = String(rowValue(row, "lngPatchFileMstCode") || "0");
  dtlForm.fileDtlCode = String(rowValue(row, "lngPatchFileDtlCode") || "0");
  dtlForm.fileName = rowValue(row, "strFileName");
  dtlForm.svrFileName = rowValue(row, "strSvrFileName");
  showDtlPop.value = true;
};

const closeDtlPop = () => {
  showDtlPop.value = false;
};

const saveDtl = async () => {
  if (!String(dtlForm.fileMstCode || "").trim() || String(dtlForm.fileMstCode) === "0") {
    warn("패치파일을 선택하세요");
    return;
  }
  if (!String(dtlForm.fileDtlCode || "").trim() || String(dtlForm.fileDtlCode) === "0") {
    warn("업로드파일을 선택하세요");
    return;
  }
  store.state.loading = true;
  try {
    const res = await setPatchDtl(
      dtlEditMode.value === "I" ? "0" : String(dtlForm.seq || "0"),
      String(dtlForm.mstCode || ""),
      String(dtlForm.fileMstCode || ""),
      String(dtlForm.fileDtlCode || ""),
      userId()
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "저장에 실패했습니다.");
      return;
    }
    closeDtlPop();
    await searchDtl();
    await done("저장되었습니다.");
  } catch (error) {
    warn("저장에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const deleteDtl = async () => {
  if (!selectedDtl.value) {
    warn("삭제할 내용을 선택하세요");
    return;
  }
  if (!(await confirmDelete())) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await delPatchDtl(
      String(rowValue(selectedDtl.value, "lngPatchDtlSeq")),
      currentMstCode()
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "삭제에 실패했습니다.");
      return;
    }
    await searchDtl();
    await done("삭제 완료되었습니다");
  } catch (error) {
    warn("삭제에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const searchStore = async () => {
  if (!requireMst()) {
    return;
  }
  store.state.loading = true;
  selectedStore.value = null;
  storeIndex.value = -1;
  try {
    const stores = await pullList(
      () => getPatchStoreList(currentMstCode()),
      "배포 조회에 실패했습니다."
    );
    rowDataStore.value = stores.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowDataStore.value = [];
    warn("배포 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const openStoreNew = () => {
  if (!requireMst()) {
    return;
  }
  storeEditMode.value = "I";
  storeForm.code = "0";
  storeForm.mstCode = currentMstCode();
  storeForm.name = rowValue(selectedMst.value, "strPatchMstName");
  storeForm.date = todayInput();
  storeForm.patchType = "0";
  selectedTargets.value = [];
  showStorePop.value = true;
};

const openStoreEdit = (row = selectedStore.value) => {
  if (!row) {
    warn("수정할 내용을 선택하세요");
    return;
  }
  storeEditMode.value = "U";
  storeForm.code = String(rowValue(row, "lngPatchStoreCode") || "0");
  storeForm.mstCode = String(rowValue(row, "lngPatchMstCode") || currentMstCode());
  storeForm.name = rowValue(row, "strPatchMstName");
  storeForm.date = toInputDate(rowValue(row, "dtmPatch"));
  storeForm.patchType = String(rowValue(row, "lngPatchType") || "0");
  selectedTargets.value = [
    {
      lngObjectCode: String(rowValue(row, "lngObjectCode") || ""),
      strObjectCode: String(rowValue(row, "strObjectCode") || ""),
      lngStoreGroup: String(rowValue(row, "lngStoreGroup") || ""),
    },
  ];
  showStorePop.value = true;
};

const closeStorePop = () => {
  showStorePop.value = false;
};

const onStorePatchTypeChange = () => {
  selectedTargets.value = [];
};

const joinTargets = (rows, key) => rows.map((row) => String(row[key] ?? "")).join("\u200b");

const saveStore = async () => {
  const patchType = String(storeForm.patchType || "");
  let targets = selectedTargets.value;
  if (patchType === "0") {
    targets = [
      { lngObjectCode: "0", strObjectCode: "", lngStoreGroup: "" },
    ];
  } else if (!targets.length) {
    warn("배포대상을 선택하세요");
    return;
  } else if (storeEditMode.value === "U" && targets.length > 1) {
    warn(
      patchType === "1"
        ? "수정시에는 한 매장그룹만 선택 가능합니다"
        : "수정시에는 한 매장만 선택 가능합니다"
    );
    return;
  }
  if (toCompactDate(storeForm.date).length < 8) {
    warn("배포일시를 입력하세요");
    return;
  }
  store.state.loading = true;
  try {
    const res = await setPatchStore(
      storeEditMode.value === "I" ? "0" : String(storeForm.code || "0"),
      String(storeForm.mstCode || ""),
      toCompactDate(storeForm.date),
      patchType,
      String(targets.length),
      joinTargets(targets, "lngObjectCode"),
      joinTargets(targets, "strObjectCode"),
      joinTargets(targets, "lngStoreGroup")
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "저장에 실패했습니다.");
      return;
    }
    closeStorePop();
    await searchStore();
    await done("저장되었습니다.");
  } catch (error) {
    warn("저장에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const deleteStore = async () => {
  if (!selectedStore.value) {
    warn("삭제할 내용을 선택하세요");
    return;
  }
  if (!(await confirmDelete())) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await delPatchStore(
      String(rowValue(selectedStore.value, "lngPatchStoreCode")),
      currentMstCode(),
      String(rowValue(selectedStore.value, "lngPatchType") || "")
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "삭제에 실패했습니다.");
      return;
    }
    await searchStore();
    await done("삭제 완료되었습니다");
  } catch (error) {
    warn("삭제에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const openFileMstPop = async () => {
  fileMstCond.type = "0";
  fileMstCond.name = "";
  selectedFileMst.value = null;
  fileMstIndex.value = -1;
  showFileMstPop.value = true;
  await searchFileMst();
};

const closeFileMstPop = () => {
  showFileMstPop.value = false;
};

const searchFileMst = async () => {
  store.state.loading = true;
  selectedFileMst.value = null;
  fileMstIndex.value = -1;
  try {
    const files = await pullList(
      () => getPatchFileMstList(fileMstCond.type, fileMstCond.name),
      "패치파일 조회에 실패했습니다."
    );
    rowDataFileMst.value = files.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowDataFileMst.value = [];
    warn("패치파일 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const clickedFileMst = (row) => {
  selectedFileMst.value = resolveRow(row, rowDataFileMst, fileMstIndex.value);
};

const selectedFileMstIndex = (index) => {
  fileMstIndex.value = index;
  selectedFileMst.value = resolveRow(selectedFileMst.value, rowDataFileMst, index);
};

const applyFileMst = (row) => {
  if (!row) {
    warn("내용을 선택하세요");
    return;
  }
  dtlForm.fileMstCode = String(rowValue(row, "lngPatchFileMstCode") || "0");
  dtlForm.fileName = rowValue(row, "strFileName");
  closeFileMstPop();
};

const selectFileMst = () => {
  applyFileMst(selectedFileMst.value);
};

const dblclickedFileMst = (row) => {
  selectedFileMst.value = resolveRow(row, rowDataFileMst, fileMstIndex.value);
  applyFileMst(selectedFileMst.value);
};

const openFileDtlPop = async () => {
  fileDtlCond.section = "0";
  fileDtlCond.name = "";
  fileDtlCond.viewAll = false;
  selectedFileDtl.value = null;
  fileDtlIndex.value = -1;
  rowDataFileDtl.value = [];
  showFileDtlPop.value = true;
  if (String(dtlForm.fileName || "").length) {
    await searchFileDtl();
  }
};

const closeFileDtlPop = () => {
  showFileDtlPop.value = false;
};

const searchFileDtl = async () => {
  store.state.loading = true;
  selectedFileDtl.value = null;
  fileDtlIndex.value = -1;
  try {
    const files = await pullList(
      () =>
        getPatchFileDtlList(
          String(dtlForm.fileMstCode || "0"),
          fileDtlCond.section,
          "",
          fileDtlCond.name,
          fileDtlCond.viewAll ? "1" : "0"
        ),
      "업로드파일 조회에 실패했습니다."
    );
    rowDataFileDtl.value = files.map((row) => normalizeRowDates(row));
  } catch (error) {
    rowDataFileDtl.value = [];
    warn("업로드파일 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const clickedFileDtl = (row) => {
  selectedFileDtl.value = resolveRow(row, rowDataFileDtl, fileDtlIndex.value);
};

const selectedFileDtlIndex = (index) => {
  fileDtlIndex.value = index;
  selectedFileDtl.value = resolveRow(selectedFileDtl.value, rowDataFileDtl, index);
};

const applyFileDtl = (row) => {
  if (!row) {
    warn("내용을 선택하세요");
    return;
  }
  if (!String(dtlForm.fileName || "").length) {
    dtlForm.fileMstCode = String(rowValue(row, "lngPatchFileMstCode") || "0");
    dtlForm.fileName = rowValue(row, "strFileName");
  }
  dtlForm.fileDtlCode = String(rowValue(row, "lngPatchFileDtlCode") || "0");
  dtlForm.svrFileName = rowValue(row, "strSvrFileName");
  closeFileDtlPop();
};

const selectFileDtl = () => {
  applyFileDtl(selectedFileDtl.value);
};

const dblclickedFileDtl = (row) => {
  selectedFileDtl.value = resolveRow(row, rowDataFileDtl, fileDtlIndex.value);
  applyFileDtl(selectedFileDtl.value);
};

const openStorePick = async () => {
  if (storePickMode.value === "all") {
    warn("전체배포시에는 매장선택을 할 수 없습니다");
    return;
  }
  groupKeyword.value = "";
  storeKeyword.value = "";
  selectedGroup.value = null;
  selectedTargetStore.value = null;
  groupIndex.value = -1;
  targetStoreIndex.value = -1;
  rowDataGroup.value = [];
  rowDataTargetStore.value = [];
  groupLive.value = [];
  targetStoreLive.value = [];
  showStorePick.value = true;
  await searchStoreGroups();
};

const closeStorePick = () => {
  showStorePick.value = false;
};

const searchStoreGroups = async () => {
  store.state.loading = true;
  selectedGroup.value = null;
  groupIndex.value = -1;
  rowDataTargetStore.value = [];
  targetStoreLive.value = [];
  try {
    const list = await pullList(
      () => getPatchTargetGroupList(groupKeyword.value),
      "매장그룹 조회에 실패했습니다."
    );
    const rows = list.map((row) => toCheckGridRow(row));
    rowDataGroup.value = rows;
    groupLive.value = rows;
    if (storePickMode.value === "store" && rows[0]) {
      selectedGroup.value = rows[0];
      await loadTargetStores(rows[0]);
    }
  } catch (error) {
    rowDataGroup.value = [];
    groupLive.value = [];
    warn("매장그룹 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const loadTargetStores = async (groupRow) => {
  const groupCode = rowValue(groupRow, "lngStoreGroup");
  if (groupCode === "") {
    rowDataTargetStore.value = [];
    targetStoreLive.value = [];
    return;
  }
  const list = await pullList(
    () => getPatchTargetStoreList(String(groupCode), storeKeyword.value),
    "매장 조회에 실패했습니다."
  );
  const rows = list.map((row) => toCheckGridRow(row));
  rowDataTargetStore.value = rows;
  targetStoreLive.value = rows;
};

const searchTargetStores = async () => {
  if (!selectedGroup.value) {
    warn("매장그룹을 선택하세요");
    return;
  }
  store.state.loading = true;
  selectedTargetStore.value = null;
  targetStoreIndex.value = -1;
  try {
    await loadTargetStores(selectedGroup.value);
  } catch (error) {
    rowDataTargetStore.value = [];
    targetStoreLive.value = [];
    warn("매장 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const clickedGroup = (row) => {
  selectedGroup.value = resolveRow(row, rowDataGroup, groupIndex.value);
};

const selectedGroupIndex = async (index) => {
  groupIndex.value = index;
  selectedGroup.value = resolveRow(selectedGroup.value, rowDataGroup, index);
  if (storePickMode.value !== "store" || !selectedGroup.value) {
    return;
  }
  store.state.loading = true;
  try {
    await loadTargetStores(selectedGroup.value);
  } catch (error) {
    rowDataTargetStore.value = [];
    targetStoreLive.value = [];
    warn("매장 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const updatedGroupRows = (rows) => {
  if (Array.isArray(rows)) {
    groupLive.value = rows;
  }
};

const clickedTargetStore = (row) => {
  selectedTargetStore.value = resolveRow(row, rowDataTargetStore, targetStoreIndex.value);
};

const selectedTargetStoreIndex = (index) => {
  targetStoreIndex.value = index;
  selectedTargetStore.value = resolveRow(
    selectedTargetStore.value,
    rowDataTargetStore,
    index
  );
};

const updatedTargetStoreRows = (rows) => {
  if (Array.isArray(rows)) {
    targetStoreLive.value = rows;
  }
};

const checkedRows = (live, source) => {
  const rows = live.value.length ? live.value : source.value;
  return rows.filter((row) => isChecked(row));
};

const selectStoreTarget = () => {
  const patchType = String(storeForm.patchType);
  const rows =
    patchType === "1"
      ? checkedRows(groupLive, rowDataGroup)
      : checkedRows(targetStoreLive, rowDataTargetStore);
  if (!rows.length) {
    warn("내용을 선택하세요");
    return;
  }
  if (storeEditMode.value === "U" && rows.length > 1) {
    warn(
      patchType === "1"
        ? "수정시에는 한 매장그룹만 선택 가능합니다"
        : "수정시에는 한 매장만 선택 가능합니다"
    );
    return;
  }
  selectedTargets.value = rows.map((row) =>
    patchType === "1"
      ? {
          lngObjectCode: String(rowValue(row, "lngStoreGroup") || ""),
          strObjectCode: String(rowValue(row, "strStoreGroup") || ""),
          lngStoreGroup: String(rowValue(row, "lngStoreGroup") || ""),
        }
      : {
          lngObjectCode: String(rowValue(row, "lngStoreCode") || ""),
          strObjectCode: String(rowValue(row, "strStoreName") || ""),
          lngStoreGroup: String(rowValue(row, "lngStoreGroup") || ""),
        }
  );
  closeStorePick();
};

const markChecked = (live, source, key, code) => {
  const rows = (live.value.length ? live.value : source.value).map((row) => ({
    ...row,
    lngCheck:
      String(rowValue(row, key)) === String(code)
        ? true
        : isUse(rowValue(row, "lngCheck")),
  }));
  live.value = rows;
  source.value = rows;
};

const dblclickedGroup = (row) => {
  if (storeEditMode.value !== "U") {
    return;
  }
  const resolved = resolveRow(row, rowDataGroup, groupIndex.value);
  selectedGroup.value = resolved;
  markChecked(
    groupLive,
    rowDataGroup,
    "lngStoreGroup",
    rowValue(resolved, "lngStoreGroup")
  );
  if (String(storeForm.patchType) === "1") {
    selectStoreTarget();
  }
};

const dblclickedTargetStore = (row) => {
  if (storeEditMode.value !== "U") {
    return;
  }
  const resolved = resolveRow(row, rowDataTargetStore, targetStoreIndex.value);
  selectedTargetStore.value = resolved;
  markChecked(
    targetStoreLive,
    rowDataTargetStore,
    "lngStoreCode",
    rowValue(resolved, "lngStoreCode")
  );
  selectStoreTarget();
};
</script>

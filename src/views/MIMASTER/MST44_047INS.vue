<!-- /*--############################################################################
# Filename : MST44_047INS.vue
# Description : 마스터관리 > POS 마스터 > 배포파일등록
# Date :2026-09-30
# Author : 권지안
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
    </div>
    <!-- 조회 조건 -->
    <div class="flex gap-2">
      <div class="bg-gray-200 rounded-lg w-[50%] min-w-0 z-10 mt-2">
        <div class="flex flex-col gap-2 px-4 py-2">
          <div
            class="grid items-center gap-x-2 min-h-[26px]"
            style="grid-template-columns: 3rem 9rem minmax(1rem, 1fr) 3rem 9rem 5rem">
            <span class="text-sm">구분</span>
            <select
              class="box-border h-[26px] w-full border rounded-md px-2 text-sm bg-white"
              v-model="condFileType">
              <option
                v-for="item in fileTypeList"
                :key="'ft-' + item.strDCode"
                :value="item.strDCode">
                {{ item.strDName }}
              </option>
            </select>
            <span></span>
            <span class="text-sm">파일명</span>
            <input
              type="text"
              class="box-border h-[26px] w-full border rounded-md px-2 text-sm bg-white"
              v-model="condFileName"
              @keydown.enter="searchMst" />
            <span></span>
          </div>
          <div class="flex justify-end gap-6 min-h-[26px]">
            <button class="whitebutton bg-white shrink-0" @click="searchMst">조회</button>
            <button class="whitebutton bg-white shrink-0" @click="openMstNew">신규</button>
            <button class="whitebutton bg-white shrink-0" @click="openMstEdit()">수정</button>
            <button class="whitebutton bg-white shrink-0" @click="deleteMst">삭제</button>
          </div>
        </div>
      </div>
      <div class="bg-gray-200 rounded-lg w-[50%] min-w-0 z-10 mt-2">
        <div class="flex flex-col gap-2 px-4 py-2">
          <div
            class="grid items-center gap-x-2 min-h-[26px]"
            style="grid-template-columns: 3rem 9rem minmax(1rem, 1fr) 3rem 9rem 5rem">
            <span class="text-sm">위치</span>
            <select
              class="box-border h-[26px] w-full border rounded-md px-2 text-sm bg-white"
              v-model="condPrgSection">
              <option
                v-for="item in prgSectionList"
                :key="'ps-' + item.strDCode"
                :value="item.strDCode">
                {{ item.strDName }}
              </option>
            </select>
            <span></span>
            <span class="text-sm">경로</span>
            <input
              type="text"
              class="box-border h-[26px] w-full border rounded-md px-2 text-sm bg-white"
              v-model="condSvrFilePath"
              @keydown.enter="searchDtl" />
            <button class="whitebutton bg-white justify-self-end shrink-0" @click="downloadFile">
              파일다운
            </button>
          </div>
          <div
            class="grid items-center gap-x-2 min-h-[26px]"
            style="grid-template-columns: 3rem 9rem auto minmax(1rem, 1fr) auto">
            <span class="text-sm">파일명</span>
            <input
              type="text"
              class="box-border h-[26px] w-full border rounded-md px-2 text-sm bg-white"
              v-model="condSvrFileName"
              @keydown.enter="searchDtl" />
            <label class="inline-flex items-center gap-1 whitespace-nowrap text-sm">
              <input type="checkbox" class="h-3.5 w-3.5" v-model="condViewAll" />
              전체보기
            </label>
            <span></span>
            <div class="flex justify-end gap-6">
              <button class="whitebutton bg-white shrink-0" @click="searchDtl">조회</button>
              <button class="whitebutton bg-white shrink-0" @click="openDtlNew">신규</button>
              <button class="whitebutton bg-white shrink-0" @click="openDtlEdit()">수정</button>
              <button class="whitebutton bg-white shrink-0" @click="deleteDtl">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 그리드 영역 -->
    <div class="flex gap-2">
      <div class="h-[65vh] w-[50%] justify-center mt-2">
        <Realgrid
          :progname="'MST44_047INS_VUE'"
          :progid="1"
          :rowData="rowData1"
          :setStateBar="false"
          :rowStateeditable="false"
          :selectionStyle="'singleRow'"
          @clickedRowData="clickedMst"
          @dblclickedRowData="dblclickedMst"
          @selectedIndex="selectedMstIndex">
        </Realgrid>
      </div>
      <div class="h-[65vh] w-[50%] justify-center mt-2">
        <Realgrid
          :progname="'MST44_047INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :setStateBar="false"
          :rowStateeditable="false"
          :selectionStyle="'singleRow'"
          @clickedRowData="clickedDtl"
          @dblclickedRowData="dblclickedDtl"
          @selectedIndex="selectedDtlIndex">
        </Realgrid>
      </div>
    </div>

    <div
      v-if="showMstPop"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[400px] max-w-[92vw] p-5">
        <h2 class="text-base font-bold">파일등록</h2>
        <div class="mt-4 space-y-3">
          <label class="block">
            <span class="text-sm">코드</span>
            <input
              type="text"
              disabled
              class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500 mt-1"
              v-model="mstForm.code" />
          </label>
          <label class="block">
            <span class="text-sm">구분</span>
            <select
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="mstForm.fileType">
              <option
                v-for="item in fileTypeList2"
                :key="'ft2-' + item.strDCode"
                :value="item.strDCode">
                {{ item.strDName }}
              </option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm">경로</span>
            <select
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="mstForm.filePath">
              <option value="">선택</option>
              <option
                v-for="item in filePathList"
                :key="'fp-' + item.strDCode"
                :value="item.strDName">
                {{ item.strDName }}
              </option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm">파일명</span>
            <input
              type="text"
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="mstForm.fileName" />
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
      <div class="bg-white rounded-lg shadow-lg w-[420px] max-w-[92vw] p-5">
        <h2 class="text-base font-bold">세부파일등록</h2>
        <div class="mt-4 space-y-3">
          <label class="block">
            <span class="text-sm">파일명</span>
            <input
              type="text"
              disabled
              class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500 mt-1"
              v-model="dtlForm.fileName" />
          </label>
          <label class="block">
            <span class="text-sm">위치</span>
            <select
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="dtlForm.prgSection"
              @change="onPrgSectionChange">
              <option
                v-for="item in prgSectionList2"
                :key="'ps2-' + item.strDCode"
                :value="item.strDCode">
                {{ item.strDName }}
              </option>
            </select>
          </label>
          <div>
            <span class="text-sm">버전구분</span>
            <div class="flex items-center gap-4 mt-1">
              <label
                v-for="item in versionTypeList"
                :key="'vt-' + item.strDCode"
                class="flex items-center gap-1 text-sm text-gray-600">
                <input
                  type="radio"
                  name="versionType"
                  :value="item.strDCode"
                  v-model="dtlForm.versionType"
                  @change="onVersionTypeChange" />
                {{ item.strDName }}
              </label>
            </div>
          </div>
          <label class="block">
            <span class="text-sm">버전값</span>
            <input
              type="text"
              class="border rounded-md px-2 py-1 text-sm w-full bg-white mt-1"
              v-model="dtlForm.versionValue"
              @change="onVersionValueChange" />
          </label>
          <label class="block">
            <span class="text-sm">경로</span>
            <input
              type="text"
              disabled
              class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500 mt-1"
              v-model="dtlForm.svrPath" />
          </label>
          <label class="block">
            <span class="text-sm">세부파일명</span>
            <input
              type="text"
              disabled
              class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500 mt-1"
              v-model="dtlForm.svrFileName" />
          </label>
          <div>
            <span class="text-sm">파일첨부</span>
            <div class="flex items-center gap-2 mt-1">
              <input
                type="text"
                disabled
                class="border rounded-md px-2 py-1 text-sm w-full bg-gray-200 text-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                v-model="dtlForm.attachName" />
              <button class="whitebutton bg-white shrink-0" @click="pickAttachFile">
                파일첨부
              </button>
            </div>
            <input
              ref="attachInput"
              type="file"
              hidden
              accept=".zip,.apk"
              @change="onAttachChange" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-5">
          <button class="whitebutton bg-white" @click="saveDtl">저장</button>
          <button class="whitebutton bg-white" @click="closeDtlPop">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  delFileDtl,
  delFileMst,
  getFileDtlList,
  getFileMstList,
  setFileDtl,
  setFileMst,
  uploadPatchFile,
} from "@/api/master";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const rowData1 = ref([]);
const rowData2 = ref([]);

const condFileType = ref("0");
const condFileName = ref("");
const condPrgSection = ref("0");
const condSvrFilePath = ref("");
const condSvrFileName = ref("");
const condViewAll = ref(false);

/** 조회조건은 공통코드 앞에 전체를 붙인다. 팝업은 코드 그대로 쓴다. */
const fileTypeList = ref([{ strDCode: "0", strDName: "전체" }]);
const fileTypeList2 = ref([]);
const prgSectionList = ref([{ strDCode: "0", strDName: "전체" }]);
const prgSectionList2 = ref([]);
const filePathList = ref([]);
/** 공통코드 278. 원본 검증이 1=버전, 2=날짜로 고정되어 있다. */
const versionTypeList = ref([
  { strDCode: "1", strDName: "버전" },
  { strDCode: "2", strDName: "날짜" },
]);

const showMstPop = ref(false);
const showDtlPop = ref(false);
const mstEditMode = ref("I");
const dtlEditMode = ref("I");

const selectedMst = ref(null);
const selectedDtl = ref(null);
const mstIndex = ref(-1);
const dtlIndex = ref(-1);
const dtlFileType = ref("");
const dtlPatchFileMstCode = ref("");
const dtlPatchFileDtlCode = ref("");
const attachFile = ref(null);
const attachInput = ref(null);

const mstForm = reactive({
  code: "",
  fileType: "1",
  filePath: "",
  fileName: "",
  use: true,
});

const dtlForm = reactive({
  fileName: "",
  prgSection: "1",
  versionType: "1",
  versionValue: "",
  svrPath: "",
  svrFileName: "",
  attachName: "",
});

const mapCommonCode = (list) =>
  (Array.isArray(list) ? list : []).map((item) => ({
    strDCode: item?.strDCode == null ? "" : String(item.strDCode),
    strDName: item?.strDName == null ? "" : String(item.strDName),
  }));

const withAll = (list) => [
  { strDCode: "0", strDName: "전체" },
  ...list.filter((item) => item.strDCode !== "0"),
];

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
  try {
    const [fileTypeRes, prgSectionRes, filePathRes] = await Promise.all([
      getCommonList(276),
      getCommonList(277),
      getCommonList(281),
    ]);
    const fileTypes = mapCommonCode(fileTypeRes?.data?.List);
    const prgSections = mapCommonCode(prgSectionRes?.data?.List);
    fileTypeList2.value = fileTypes;
    prgSectionList2.value = prgSections;
    filePathList.value = mapCommonCode(filePathRes?.data?.List);
    fileTypeList.value = withAll(fileTypes);
    prgSectionList.value = withAll(prgSections);
  } catch (error) {
    fileTypeList.value = [{ strDCode: "0", strDName: "전체" }];
    prgSectionList.value = [{ strDCode: "0", strDName: "전체" }];
  }
  await searchMst();
  await searchDtl();
});

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

const searchMst = async () => {
  store.state.loading = true;
  selectedMst.value = null;
  selectedDtl.value = null;
  mstIndex.value = -1;
  dtlIndex.value = -1;
  rowData2.value = [];
  try {
    const res = await getFileMstList(condFileType.value, condFileName.value);
    const payload = readPayload(res?.data);
    if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
      warn(payload.RESULT_NM || "배포파일 조회에 실패했습니다.");
      rowData1.value = [];
      return;
    }
    const list = Array.isArray(payload.List) ? payload.List : [];
    rowData1.value = list.map((row) => ({
      ...row,
      lngUse:
        row?.lngUse === true ||
        row?.lngUse === 1 ||
        row?.lngUse === "1" ||
        row?.lngUse === "Y" ||
        row?.lngUse === "y",
    }));
  } catch (error) {
    rowData1.value = [];
    warn("배포파일 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const searchDtl = async () => {
  store.state.loading = true;
  selectedDtl.value = null;
  dtlIndex.value = -1;
  try {
    const masterCode = rowValue(selectedMst.value, "lngPatchFileMstCode");
    const res = await getFileDtlList(
      masterCode === "" ? "0" : String(masterCode),
      condPrgSection.value,
      condSvrFilePath.value,
      condSvrFileName.value,
      condViewAll.value ? "1" : "0"
    );
    const payload = readPayload(res?.data);
    if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
      warn(payload.RESULT_NM || "세부파일 조회에 실패했습니다.");
      rowData2.value = [];
      return;
    }
    rowData2.value = Array.isArray(payload.List) ? payload.List : [];
  } catch (error) {
    rowData2.value = [];
    warn("세부파일 조회에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const clickedMst = (row) => {
  selectedMst.value = resolveRow(row, rowData1, mstIndex.value);
};

const selectedMstIndex = (index) => {
  mstIndex.value = index;
  selectedMst.value = resolveRow(selectedMst.value, rowData1, index);
  selectedDtl.value = null;
  dtlIndex.value = -1;
  if (index == null || index < 0 || !selectedMst.value) {
    rowData2.value = [];
    return;
  }
  searchDtl();
};

const dblclickedMst = (row) => {
  selectedMst.value = resolveRow(row, rowData1, mstIndex.value);
  openMstEdit(selectedMst.value);
};

const clickedDtl = (row) => {
  selectedDtl.value = resolveRow(row, rowData2, dtlIndex.value);
};

const selectedDtlIndex = (index) => {
  dtlIndex.value = index;
  selectedDtl.value = resolveRow(selectedDtl.value, rowData2, index);
};

const dblclickedDtl = (row) => {
  selectedDtl.value = resolveRow(row, rowData2, dtlIndex.value);
  openDtlEdit(selectedDtl.value);
};

const openMstNew = () => {
  mstEditMode.value = "I";
  mstForm.code = "";
  mstForm.fileType = "1";
  mstForm.filePath = "";
  mstForm.fileName = "";
  mstForm.use = true;
  showMstPop.value = true;
};

const openMstEdit = (row = selectedMst.value) => {
  if (!row) {
    warn("수정할 내용을 선택하세요");
    return;
  }
  mstEditMode.value = "U";
  mstForm.code = rowValue(row, "lngPatchFileMstCode");
  mstForm.fileType = String(rowValue(row, "lngFileType") || "1");
  mstForm.filePath = rowValue(row, "strFilePath");
  mstForm.fileName = rowValue(row, "strFileName");
  mstForm.use = String(rowValue(row, "lngUse")) === "1" || rowValue(row, "lngUse") === 1 || rowValue(row, "lngUse") === true;
  showMstPop.value = true;
};

const closeMstPop = () => {
  showMstPop.value = false;
};

const isSuccess = (payload) =>
  !payload?.RESULT_CD || String(payload.RESULT_CD) === "00";

const saveMst = async () => {
  if (!String(mstForm.filePath || "").trim()) {
    warn("경로를 선택하세요");
    return;
  }
  if (!String(mstForm.fileName || "").trim()) {
    warn("파일명을 입력하세요");
    return;
  }
  store.state.loading = true;
  try {
    const res = await setFileMst(
      mstEditMode.value === "I" ? "0" : String(mstForm.code || "0"),
      String(mstForm.fileType || ""),
      String(mstForm.filePath || ""),
      String(mstForm.fileName || "").trim(),
      mstForm.use ? "1" : "0"
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "저장에 실패했습니다.");
      return;
    }
    closeMstPop();
    await searchMst();
    await searchDtl();
    await done("저장되었습니다.");
  } catch (error) {
    warn("저장에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const deleteMst = async () => {
  if (!selectedMst.value) {
    warn("삭제할 내용을 선택하세요");
    return;
  }
  const result = await Swal.fire({
    title: "삭제",
    text: "선택한 배포파일을 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  if (!result.isConfirmed) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await delFileMst(
      String(rowValue(selectedMst.value, "lngPatchFileMstCode"))
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "삭제에 실패했습니다.");
      return;
    }
    await searchMst();
    await searchDtl();
    await done("삭제되었습니다.");
  } catch (error) {
    warn("삭제에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const buildSvrPath = () => {
  const section = prgSectionList2.value.find(
    (item) => String(item.strDCode) === String(dtlForm.prgSection)
  );
  const sectionName = section ? section.strDName : "";
  let path = `${sectionName}/`;
  if (String(dtlFileType.value) === "1") {
    path += "Files/";
  } else if (String(dtlFileType.value) === "2") {
    path += "Image/";
  } else {
    path = "";
  }
  return path;
};

const onPrgSectionChange = () => {
  dtlForm.svrPath = buildSvrPath();
};

const onVersionTypeChange = () => {
  if (String(dtlForm.versionType) === "2" && !String(dtlForm.versionValue || "").trim()) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    dtlForm.versionValue = `${now.getFullYear()}-${month}-${day} 01:00`;
  }
};

const onVersionValueChange = () => {
  if (String(dtlForm.versionType) !== "2") {
    return;
  }
  const text = String(dtlForm.versionValue || "").trim();
  if (!text) {
    return;
  }
  const parsed = new Date(text.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return;
  }
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");
  dtlForm.versionValue = `${parsed.getFullYear()}-${month}-${day} ${hour}:${minute}`;
};

const openDtlNew = () => {
  if (!selectedMst.value) {
    warn("배포파일을 선택하세요");
    return;
  }
  dtlEditMode.value = "I";
  dtlFileType.value = rowValue(selectedMst.value, "lngFileType");
  dtlPatchFileDtlCode.value = "0";
  dtlPatchFileMstCode.value = rowValue(selectedMst.value, "lngPatchFileMstCode");
  dtlForm.fileName = rowValue(selectedMst.value, "strFileName");
  dtlForm.prgSection = "1";
  dtlForm.versionType = "1";
  dtlForm.versionValue = "";
  dtlForm.svrPath = buildSvrPath();
  dtlForm.svrFileName = "";
  dtlForm.attachName = "";
  attachFile.value = null;
  showDtlPop.value = true;
};

const openDtlEdit = (row = selectedDtl.value) => {
  if (!row) {
    warn("수정할 내용을 선택하세요");
    return;
  }
  dtlEditMode.value = "U";
  dtlFileType.value = rowValue(row, "lngFileType");
  dtlPatchFileDtlCode.value = rowValue(row, "lngPatchFileDtlCode");
  dtlPatchFileMstCode.value = rowValue(row, "lngPatchFileMstCode");
  dtlForm.fileName = rowValue(row, "strFileName");
  dtlForm.prgSection = String(rowValue(row, "lngPrgSection") || "1");
  dtlForm.versionType = String(rowValue(row, "lngVersionType") || "1");
  dtlForm.versionValue = rowValue(row, "strVersionValue");
  dtlForm.svrPath = rowValue(row, "strSvrFilePath");
  dtlForm.svrFileName = rowValue(row, "strSvrFileName");
  dtlForm.attachName = rowValue(row, "strAttachFile");
  attachFile.value = null;
  showDtlPop.value = true;
};

const closeDtlPop = () => {
  showDtlPop.value = false;
};

const isVersionFormat = (type, value) => {
  const text = String(value ?? "");
  if (String(type) === "1") {
    return text.length - 2 === text.replace(/\./g, "").length;
  }
  if (String(type) === "2") {
    const compact =
      text.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "") + "00";
    if (compact.length < 14) {
      return false;
    }
    const year = Number(compact.slice(0, 4));
    const month = Number(compact.slice(4, 6));
    const day = Number(compact.slice(6, 8));
    const hour = Number(compact.slice(8, 10));
    const minute = Number(compact.slice(10, 12));
    const date = new Date(year, month - 1, day, hour, minute, 0);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute
    );
  }
  return null;
};

const fetchDetailRows = async () => {
  const masterCode = rowValue(selectedMst.value, "lngPatchFileMstCode");
  const res = await getFileDtlList(
    masterCode === "" ? "0" : String(masterCode),
    "0",
    "",
    "",
    "1"
  );
  const payload = readPayload(res?.data);
  if (payload.RESULT_CD && String(payload.RESULT_CD) !== "00") {
    throw new Error(payload.RESULT_NM || "세부파일 조회에 실패했습니다.");
  }
  return Array.isArray(payload.List) ? payload.List : [];
};

const findSavedDetailRow = (rows, previousIds, isNew) => {
  if (!isNew) {
    return rows.find(
      (row) =>
        String(rowValue(row, "lngPatchFileDtlCode")) ===
        String(dtlPatchFileDtlCode.value)
    );
  }
  const created = rows.filter(
    (row) => !previousIds.has(String(rowValue(row, "lngPatchFileDtlCode")))
  );
  return created.sort(
    (a, b) =>
      Number(rowValue(b, "lngPatchFileDtlCode")) -
      Number(rowValue(a, "lngPatchFileDtlCode"))
  )[0];
};

const sendPatchFile = async (serverFileName) => {
  const formData = new FormData();
  formData.append("filePath", String(dtlForm.svrPath || ""));
  const named = new File([attachFile.value], serverFileName, {
    type: attachFile.value.type || "application/octet-stream",
  });
  formData.append("file0", named);
  const res = await uploadPatchFile(formData);
  const text = typeof res?.data === "string" ? res.data.trim() : "";
  if (text !== "OK") {
    throw new Error(text || "파일 업로드에 실패했습니다.");
  }
};

const saveDtl = async () => {
  const valid = isVersionFormat(dtlForm.versionType, dtlForm.versionValue);
  if (valid == null) {
    warn("유형추가");
    return;
  }
  if (!valid) {
    warn("버전형식이 맞지 않습니다.\n버전(#.##.###), 날짜(yyyy-MM-dd hh:mm)");
    return;
  }
  if (attachFile.value && !String(dtlForm.svrPath || "").trim()) {
    warn("경로가 없습니다.");
    return;
  }
  const isNew = dtlEditMode.value === "I";
  const registeredName = isNew ? "" : String(dtlForm.svrFileName || "").trim();
  const previousIds = new Set(
    (rowData2.value || []).map((row) => String(rowValue(row, "lngPatchFileDtlCode")))
  );
  store.state.loading = true;
  try {
    const res = await setFileDtl(
      isNew ? "0" : String(dtlPatchFileDtlCode.value || ""),
      String(dtlPatchFileMstCode.value || ""),
      String(dtlForm.prgSection || ""),
      String(dtlForm.versionType || ""),
      String(dtlForm.versionValue || ""),
      String(dtlForm.svrPath || ""),
      registeredName
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "저장에 실패했습니다.");
      return;
    }
    if (attachFile.value) {
      try {
        const rows = await fetchDetailRows();
        const savedRow = findSavedDetailRow(rows, previousIds, isNew);
        let uploadName = String(rowValue(savedRow, "strSvrFileName") || "").trim();
        if (!uploadName && savedRow) {
          const rawExt = attachFile.value.name.includes(".")
            ? attachFile.value.name.split(".").pop().toLowerCase()
            : "zip";
          const ext = rawExt === "apk" ? "apk" : "zip";
          const mst = String(
            rowValue(savedRow, "lngPatchFileMstCode") || dtlPatchFileMstCode.value
          ).padStart(4, "0");
          const dtl = String(rowValue(savedRow, "lngPatchFileDtlCode") || "0").padStart(6, "0");
          uploadName = `${mst}${dtl}.${ext}`;
          const fixRes = await setFileDtl(
            String(rowValue(savedRow, "lngPatchFileDtlCode")),
            String(rowValue(savedRow, "lngPatchFileMstCode") || dtlPatchFileMstCode.value),
            String(rowValue(savedRow, "lngPrgSection") || dtlForm.prgSection),
            String(rowValue(savedRow, "lngVersionType") || dtlForm.versionType),
            String(rowValue(savedRow, "strVersionValue") || dtlForm.versionValue),
            String(rowValue(savedRow, "strSvrFilePath") || dtlForm.svrPath),
            uploadName
          );
          const fixPayload = readPayload(fixRes?.data);
          if (!isSuccess(fixPayload)) {
            warn(fixPayload.RESULT_NM || "세부파일명 저장에 실패했습니다.");
            await searchDtl();
            return;
          }
        }
        if (!uploadName) {
          warn("세부파일명이 없습니다.");
          await searchDtl();
          return;
        }
        await sendPatchFile(uploadName);
      } catch (error) {
        warn(error?.message || "파일 업로드에 실패했습니다.");
        await searchDtl();
        return;
      }
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

const pickAttachFile = () => {
  attachInput.value?.click();
};

const onAttachChange = (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) {
    return;
  }
  const ext = file.name.includes(".")
    ? file.name.split(".").pop().toLowerCase()
    : "";
  if (ext !== "zip" && ext !== "apk") {
    warn("zip/apk 확장명만 지원됩니다. 파일을 압축하셔서 첨부하세요.");
    return;
  }
  if (file.size >= 100000000) {
    warn("파일용량이 너무 큽니다. (최대 100MB)");
    return;
  }
  attachFile.value = file;
  dtlForm.attachName = file.name;
};

const deleteDtl = async () => {
  if (!selectedDtl.value) {
    warn("삭제할 내용을 선택하세요");
    return;
  }
  const result = await Swal.fire({
    title: "삭제",
    text: "선택한 세부파일을 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  if (!result.isConfirmed) {
    return;
  }
  store.state.loading = true;
  try {
    const res = await delFileDtl(
      String(rowValue(selectedDtl.value, "lngPatchFileMstCode")),
      String(rowValue(selectedDtl.value, "lngPatchFileDtlCode"))
    );
    const payload = readPayload(res?.data);
    if (!isSuccess(payload)) {
      warn(payload.RESULT_NM || "삭제에 실패했습니다.");
      return;
    }
    await searchDtl();
    await done("삭제되었습니다.");
  } catch (error) {
    warn("삭제에 실패했습니다.");
  } finally {
    store.state.loading = false;
  }
};

const downloadFile = () => {
  if (!selectedDtl.value) {
    warn("다운로드할 파일을 선택하세요");
    return;
  }
  const path = rowValue(selectedDtl.value, "strSvrFilePath");
  const name = rowValue(selectedDtl.value, "strSvrFileName");
  if (!path && !name) {
    warn("다운로드할 파일 정보가 없습니다.");
    return;
  }
  window.open(`http://www.pncoffice.net/Download/${path}${name}`);
};
</script>

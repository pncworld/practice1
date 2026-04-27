<template>
  <div
    :class="[
      'flex text-base',
      compactSearchBar
        ? 'mt-0 ml-0 min-w-0 w-full items-center justify-start gap-4'
        : 'justify-center md:justify-end mt-2 ml-12',
      dynamicStoreClass2,
    ]">
    <div
      :class="
        compactSearchBar
          ? 'flex items-center text-base font-semibold text-nowrap shrink-0'
          : 'items-center font-bold hidden md:flex text-nowrap'
      ">
      {{ MainName }}
    </div>
    <div v-show="hideit2">
      <select
        id="storeGroup"
        v-model="selectedGroupCd"
        :disabled="isDisabled"
        :class="[
          'hidden md:inline-block shrink-0 rounded-md border border-gray-800 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          compactSearchBar
            ? 'ml-0 h-8 min-h-8 w-[5.75rem] px-2 py-0 text-sm'
            : 'ml-5 w-32 p-2',
          dynamicStoreClass3,
        ]"
        @change="emitStoreGroup($event.target.value)">
        <option
          :value="item.lngStoreGroup"
          v-for="item in storeGroup"
          :key="item.lngStoreGroup">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div v-show="hideit3">
      <select
        v-model="selectedStoreType"
        :disabled="isDisabled"
        :class="[
          'hidden md:inline-block shrink-0 rounded-md border border-gray-800 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          compactSearchBar
            ? 'ml-0 h-8 w-[4.5rem] px-1.5 py-0 text-sm'
            : 'ml-2 w-20 p-2',
          dynamicStoreClass3,
        ]"
        @change="
          setStore($event.target.value);
          emitStoreType($event.target.value);
        ">
        <option value="0">전체</option>
        <option
          :value="item.lngStoreAttr"
          v-for="item in storeType"
          :key="item.lngStoreAttr">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div
      :class="
        compactSearchBar
          ? 'relative min-w-0 flex-1 basis-auto'
          : 'w-64 relative ml-5'
      "
      :style="
        compactSearchBar
          ? { maxWidth: `${compactStoreComboMaxRem}rem` }
          : undefined
      "
      v-show="hideit">
      <!-- <select
        :disabled="isDisabled"
        :class="dynamicStoreClass"
        class="w-60 border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedStoreCode"
        @change="
          emitStoreCode($event.target.value);
          ischanged();
          setStoreAreaCd($event.target.value);
          setPosNo($event.target.value);
          setKioskNo($event.target.value);
          setTablePosNo($event.target.value);
          setScreenNo2($event.target.value);
        ">
        <option value="0" class="text-left">{{ defaultStoreNm }}</option>
        <option
          class="text-left"
          :value="item.lngStoreCode"
          v-for="item in storeCd"
          :key="item.lngStoreCode">
          {{ item.strName }}
        </option>
      </select> -->

      <!-- <v-autocomplete
        v-model="selectedStoreCode"
        :items="storeCd"
        dense
        flat
        item-title="strName"
        item-value="lngStoreCode"
        @change="
          emitStoreCode($event);
          ischanged();
          setStoreAreaCd($event);
          setPosNo($event);
          setKioskNo($event);
          setTablePosNo($event);
          setScreenNo2($event);
        "
        class="w-60 h-[40%] mx-3"
        label="매장을 선택하세요" /> -->
      <div
        :class="[
          compactSearchBar
            ? 'pickstore-vs-shell h-8 min-h-8 w-full max-w-full min-w-0 text-nowrap rounded-md border border-gray-800 bg-white text-sm'
            : 'h-[40px] w-[85%] bg-white border border-black rounded-lg text-xs text-nowrap',
          dynamicStoreClass,
        ]"
        :disabled="isDisabled">
        <v-select
          :reduce="(option) => option.lngStoreCode"
          class="style-chooser h-full !disabled:text-black text-sm"
          v-model="selectedStoreCode"
          :disabled="isDisabled"
          :clearable="!isDisabled"
          label="strName"
          :placeholder="defaultStoreNm"
          @click="resetStoreCode"
          append-to-body
          :options="storeCd">
          <template #no-options>
            <div>검색된 항목이 없습니다.</div>
          </template>

          <template #no-results>
            <div>검색된 항목이 없습니다.</div>
          </template>
        </v-select>
      </div>
    </div>
    <div class="ml-5" v-if="showAreaCd">
      <span class="font-bold text-sm">지역코드 </span>
      <select
        :disabled="isDisabled4"
        class="w-32 border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedStoreAreaCd"
        @change="emitStoreAreaCd($event.target.value)">
        <option value="0">선택</option>
        <option
          :value="item.lngAreaCode"
          v-for="item in storeAreaCd"
          :key="item.lngAreaCode">
          {{ item.lngAreaCode }}
        </option>
      </select>
    </div>
    <div class="ml-5" v-if="showPosNo">
      <span class="font-bold text-sm">포스번호 </span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedPosNo"
        @change="
          setScreenNo();
          posChanged();
          setScreenNo2();
        ">
        <option value="0">선택</option>
        <option
          :value="{ lngCode: item.lngCode, lngAreaCode: item.lngAreaCode }"
          v-for="item in storePosNo"
          :key="item.lngAreaCode">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div class="ml-5" v-if="showScreenNo">
      <span class="font-bold text-sm">화면번호</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedScreenNo">
        <option value="0">선택</option>
        <option :value="item.strDCode" v-for="item in ScreenList">
          {{ item.strDName }}
        </option>
      </select>
      <button
        v-if="showMakeScreen"
        class="whitebutton bg-white border border-black ml-5"
        @click="makeNewScreen">
        새화면
      </button>
    </div>
    <div class="ml-5" v-if="showKioskNo">
      <span class="font-bold text-sm">KIOSK번호</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedKioskNo"
        @change="ischanged()">
        <option value="0">선택</option>
        <option
          :value="{ lngCode: item.lngCode, lngAreaCode: item.lngAreaCode }"
          v-for="item in storeKioskNo"
          :key="item.lngAreaCode">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div class="ml-5" v-if="showTablePosNo">
      <span class="font-bold text-sm">테이블POS번호</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedTablePosNo"
        @change="ischanged()">
        <option value="0">선택</option>
        <option
          :value="{ lngCode: item.lngCode, lngAreaCode: item.lngAreaCode }"
          v-for="item in storeTablePosNo"
          :key="item.lngAreaCode">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div class="flex justify-center items-center ml-5" v-if="showPayType">
      <span class="font-bold text-sm">결제키구분</span>

      <label for="discount" class="flex justify-center items-center ml-5"
        ><input
          type="radio"
          id="discount"
          v-model="paymentType"
          :value="3" /><span class="font-bold">[1]할인</span>
      </label>
      <label for="payment" class="flex justify-center items-center ml-5"
        ><input
          type="radio"
          v-model="paymentType"
          id="payment"
          :value="4" /><span class="font-bold">[2]지불</span>
      </label>
    </div>
    <div class="flex justify-center items-center ml-5" v-if="showFuncType">
      <span class="font-bold text-sm">화면키 구분 </span>

      <label for="discount" class="flex justify-center items-center ml-5"
        ><input
          type="radio"
          id="discount"
          v-model="paymentType"
          :value="3" /><span class="font-bold">[1]주문화면</span>
      </label>
      <label for="payment" class="flex justify-center items-center ml-5"
        ><input
          type="radio"
          v-model="paymentType"
          id="payment"
          :value="4" /><span class="font-bold">[2]결제화면</span>
      </label>
    </div>

    <div
      v-if="showFuncScreen"
      class="flex text-nowrap justify-center items-center ml-5">
      <div class="text-sm font-semibold">화면번호</div>
      <select
        name=""
        id=""
        class="w-52 border border-black rounded-lg h-10 ml-5"
        v-model="selectedFuncScreen"
        @change="changeFunc">
        <option value="0">선택</option>
        <option value="1">테이블 화면</option>
        <option value="2">선불에서 작업자 등록 화면</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">객층,객수 화면</option>
        <option value="6">메뉴 등록 화면</option>
        <option value="7">개별 계산 화면</option>
        <option value="8">계산 화면</option>
        <option value="9">주문 재발행 화면</option>
        <option value="10">주문 취소 화면</option>
        <option value="11">계량 화면</option>
        <option value="12">Order Stop</option>
      </select>
    </div>

    <div
      v-if="showTime"
      class="flex text-nowrap justify-center items-center ml-2">
      <select
        name=""
        id=""
        class="w-20 border border-black rounded-lg h-10"
        v-model="selectedTime"
        @change="changeTime">
        <option value="0">선택</option>
        <option value="1">런치</option>
        <option value="2">디너</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { getKioskList, getPosList, getTablePosList } from "@/api/common";
import { getScreenList2 } from "@/api/master";
import { defineProps, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const selectedStoreCode = ref(null);

const resetStoreCode = () => {
  if (isDisabled.value == true) {
    return;
  }
  selectedStoreCode.value = null;
};
//////////////////////////////////////////////////////////////////////////////////
watch(selectedStoreCode, () => {
  let converted =
    selectedStoreCode.value == null ? "0" : selectedStoreCode.value;

  emitStoreCode(converted);
  ischanged();
  setStoreAreaCd(converted);
  setPosNo(converted);
  setKioskNo(converted);
  setTablePosNo(converted);
  setScreenNo2(converted);
});

const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);

const storeAreaCd2 = ref([]);
const storeAreaCd = ref([]);
const storePosNo = ref([]);
const storeKioskNo = ref([]);
const storeTablePosNo = ref([]);
const ScreenList = ref([]);
const selectedStoreAreaCd = ref();
const selectedPosNo = ref("0");
const selectedScreenNo = ref("0");
const selectedKioskNo = ref("0");
const selectedTablePosNo = ref("0");
const selectedGroupCd = ref(store.state.userData.lngStoreGroup);
const paymentType = ref(3);
const selectedStoreType = ref(store.state.userData.lngJoinType);

const isDisabled1 = ref(false);
const isDisabled = ref(false);
const selectedFuncScreen = ref(0);
const changeFunc = (e) => {
  selectedFuncScreen.value = e.target.value;
  emit("updateFuncScreenType", selectedFuncScreen.value);
};
const changeTime = (e) => {
  selectedTime.value = e.target.value;
  emit("updateTime", selectedTime.value);
};
const userData = store.state.userData;

const props = defineProps({
  groupCdDisabled: Boolean,
  hidesub: {
    type: Boolean,
    default: true,
  },
  hideAttr: {
    type: Boolean,
    default: true,
  },
  showAreaCd: {
    type: Boolean,
    default: false,
  },
  showPosNo: {
    type: Boolean,
    default: false,
  },
  showScreenNo: {
    type: Boolean,
    default: false,
  },
  showKioskNo: {
    type: Boolean,
    default: false,
  },
  showTablePosNo: {
    type: Boolean,
    default: false,
  },
  showPayType: {
    type: Boolean,
    default: false,
  },
  defaultStoreNm: {
    type: String,
    default: "선택",
  },
  showMakeScreen: {
    type: Boolean,
    default: false,
  },
  renew: {
    type: Boolean,
    default: false,
  },
  hideGroup: {
    type: Boolean,
    default: true,
  },
  showFuncType: {
    type: Boolean,
    default: false,
  },
  showFuncScreen: {
    type: Boolean,
    default: false,
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  mainName: {
    type: String,
    default: "매장명",
  },
  defaultStore: {
    type: Boolean,
    default: false,
  },
  defaultStoreType2: {
    type: Boolean,
    default: false,
  },
  hidebyLngCommonMenu: {
    type: Boolean,
    default: false,
  },
  defaultStoreType: {
    type: String,
    default: "전체",
  },
  disabledAll: {
    type: Boolean,
    default: false,
  },
  disabledAll2: {
    type: Boolean,
    default: false,
  },
  setDynamicStoreClass: {
    type: String,
    default: "",
  },
  setDynamicStoreClass2: {
    type: String,
    default: "",
  },
  setDefaultStoreCd: {
    type: [String, Number],
    default: "",
  },
  /** Vuex 목록에 없을 때 v-select 표시용(상세 행 등) */
  extraStoreOption: {
    type: Object,
    default: null,
  },
  dynamicStoreClass3: {
    type: String,
    default: "",
  },
  /** true: 상단 조회 바 — 높이·여백을 옆 컨트롤과 맞춤 */
  compactSearchBar: {
    type: Boolean,
    default: false,
  },
  /** compactSearchBar일 때 매장(v-select) 최대 너비(rem). 기본 12 */
  compactStoreComboMaxRem: {
    type: Number,
    default: 12,
  },
});

const optionMatchesCode = (item, code) => {
  if (item == null || code === "" || code === null || code === undefined)
    return false;
  return item.lngStoreCode == code;
};

/** extraStoreOption을 storeCd2/storeCd에 합쳐 vue-select가 라벨을 찾게 함 */
const mergeExtraStoreIntoOptions = () => {
  const ex = props.extraStoreOption;
  if (!ex || ex.lngStoreCode == null || ex.lngStoreCode === "") return;
  const code = ex.lngStoreCode;
  const base2 = storeCd2.value;
  if (!Array.isArray(base2)) return;
  if (base2.some((item) => optionMatchesCode(item, code))) return;
  const row = {
    lngStoreCode: code,
    strName: ex.strName || String(code),
    lngStoreAttr: ex.lngStoreAttr ?? 0,
  };
  storeCd2.value = [...base2, row];
  if (selectedStoreType.value == 0 || selectedStoreType.value === "0") {
    storeCd.value = [...storeCd2.value];
  } else {
    const filtered = storeCd2.value.filter(
      (item) => item.lngStoreAttr == selectedStoreType.value
    );
    storeCd.value = filtered.some((item) => optionMatchesCode(item, code))
      ? filtered
      : [...filtered, row];
  }
};

const resolveDefaultStoreCode = (raw) => {
  if (raw === "" || raw === null || raw === undefined) return raw;
  mergeExtraStoreIntoOptions();
  const list = storeCd.value;
  const found = list.find((item) => optionMatchesCode(item, raw));
  return found ? found.lngStoreCode : raw;
};

const emitStoreNameForCode = (code) => {
  const c = code == null ? "0" : code;
  if (c === "0" || c === 0) {
    emit("storeNm", "전체");
    return;
  }
  mergeExtraStoreIntoOptions();
  const found = storeCd.value.find((item) => optionMatchesCode(item, c));
  if (found) {
    emit("storeNm", found.strName);
    return;
  }
  const ex = props.extraStoreOption;
  if (ex && optionMatchesCode(ex, c)) {
    emit("storeNm", ex.strName || String(c));
  }
};

const MainName = ref("");
const hideit = ref(props.hidesub);
const hideit2 = ref(props.hideGroup);
const hideit3 = ref(props.hideAttr);
const showAreaCd = ref(props.showAreaCd);
const showPosNo = ref(props.showPosNo);
const showScreenNo = ref(props.showScreenNo);
const showKioskNo = ref(props.showKioskNo);
const showTablePosNo = ref(props.showTablePosNo);
const showPayType = ref(props.showPayType);
const showMakeScreen = ref(props.showMakeScreen);
const showFuncType = ref(props.showFuncType);
const showFuncScreen = ref(props.showFuncScreen);
const defaultStoreNm = ref("선택");
const showTime = ref(props.showTime);
const selectedTime = ref(0);

watch(
  () => props.hidesub,
  () => {
    hideit.value = props.hidesub;
  }
);
watch(
  () => props.hideAttr,
  () => {
    hideit3.value = props.hideAttr;
  }
);
const { groupCdDisabled } = props;
isDisabled1.value = groupCdDisabled;
const changed = ref(false);
const ischanged = () => {
  changed.value = !changed.value;
  selectedPosNo.value = "0";
  selectedScreenNo.value = "0";
  //comsole.log(changed.value);
  emit("update:ischanged", changed.value);
  emit("update:ischanged2", changed.value);
};
const emit = defineEmits([
  "update:storeGroup",
  "update:storeType",
  "update:storeCd",
  "update:ischanged",
  "update:ischanged2",
  "GroupNm",
  "storeNm",
  "update:storeAreaCd",
  "posNo",
  "screenNo",
  "kioskNo",
  "tablePosNo",
  "updatePaymentType",
  "makeNewScreen",
  "updateFuncScreenType",
  "updateTime",
]);
const emitStoreGroup = (value) => {
  emit("update:storeGroup", value);
  emit("GroupNm", store.state.userData.strStoreGroupName);
};
const emitStoreAreaCd = (value) => {
  emit("update:storeAreaCd", value);
};

const newscreen = ref(false);
const useMakeScreen = ref(false);
const makeNewScreen = () => {
  if (useMakeScreen.value == false) {
    const maxStrDCode = Math.max(
      ...ScreenList.value.map((item) => Number(item.strDCode))
    );
    const newScreen = {
      strMCode: 86,
      strLanguage: "01",
      strDCode: maxStrDCode + 1,
      strDName: "화면" + (maxStrDCode + 1),
    };

    // ////console.log(ScreenList.value);
    ScreenList.value.push(newScreen);
    selectedScreenNo.value = maxStrDCode + 1;
    //newscreen.value = !newscreen.value;
    emit("screenNo", selectedScreenNo.value);
    useMakeScreen.value = true;
  }
};

watch(
  () => props.renew,
  () => {
    useMakeScreen.value = false;
  }
);
watch(
  () => store.state.storeCd,
  () => {
    storeGroup.value = store.state.storeGroup;
    storeType.value = store.state.storeType;
    storeCd.value = store.state.storeCd;
    storeCd2.value = store.state.storeCd;
    mergeExtraStoreIntoOptions();
    storeAreaCd2.value = store.state.storeAreaCd;
    selectedStoreAreaCd.value = 0;

    emit("update:storeGroup", selectedGroupCd.value);
    emit("update:storeType", selectedStoreType.value);
    emit("update:storeCd", selectedStoreCode.value);
    emit("storeNm", defaultStoreNm.value);
    emit("posNo", 0);
    //emit("update:storeAreaCd", 0);
    emit("GroupNm", store.state.userData.strStoreGroupName);
    setPosNo(store.state.userData.lngPosition);
    setStoreAreaCd(store.state.userData.lngPosition);
    setKioskNo(store.state.userData.lngPosition);
    setTablePosNo(store.state.userData.lngPosition);

    defaultStoreNm.value = props.defaultStoreNm;
  }
);

const dynamicStoreClass = ref("");
const dynamicStoreClass2 = ref("");
const dynamicStoreClass3 = ref("");
onMounted(async () => {
  dynamicStoreClass.value = props.setDynamicStoreClass;
  dynamicStoreClass2.value = props.setDynamicStoreClass2;
  dynamicStoreClass3.value = props.dynamicStoreClass3;
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;

  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
  mergeExtraStoreIntoOptions();
  storeAreaCd2.value = store.state.storeAreaCd;
  selectedStoreAreaCd.value = 0;
  MainName.value = props.mainName;
  let storenm = store.state.userData.strStoreName;

  await nextTick();
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    selectedStoreCode.value = null;
    selectedStoreType.value = 0;
    // hideit.value = false;
    // hideit3.value = false;
  } else {
    selectedStoreCode.value = parseInt(store.state.userData.lngPosition);
    selectedStoreType.value = store.state.userData.lngJoinType;
    // hideit.value = true;
    // hideit3.value = true;
  }

  emit("update:storeGroup", store.state.userData.lngStoreGroup);
  emit("update:storeType", selectedStoreType.value);
  if (props.setDefaultStoreCd !== "" && props.setDefaultStoreCd != null) {
    const resolved = resolveDefaultStoreCode(props.setDefaultStoreCd);
    selectedStoreCode.value = resolved;
    emitStoreNameForCode(resolved);
  } else {
    if (props.defaultStoreNm == "") {
      emit("storeNm", storenm);
    } else {
      emit("storeNm", props.defaultStoreNm);
    }
  }
  emit(
    "update:storeCd",
    selectedStoreCode.value == null ? "0" : selectedStoreCode.value
  );

  emit("posNo", 0);
  emit("updateFuncScreenType", 0);
  //emit("update:storeAreaCd", 0);
  emit("GroupNm", store.state.userData.strStoreGroupName);
  setPosNo(store.state.userData.lngPosition);
  setStoreAreaCd(store.state.userData.lngPosition);
  setKioskNo(store.state.userData.lngPosition);
  setTablePosNo(store.state.userData.lngPosition);

  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    isDisabled.value = false;
  } else {
    isDisabled.value = true;
  }

  if (props.disabledAll == true) {
    isDisabled.value = true;
  }
  // if (props.hidebyLngCommonMenu == true) {
  //   if (store.state.userData.lngCommonMenu == "1") {
  //     hideit.value = false;
  //     hideit3.value = false;
  //     emit("update:storeCd", 0);
  //   } else {
  //     hideit.value = true;
  //     hideit3.value = true;
  //     emit("update:storeCd", selectedStoreCode.value);
  //   }
  // } else {
  //   emit("update:storeCd", selectedStoreCode.value);
  // }

  if (props.disabledAll2 == true) {
    isDisabled.value = false;
  }
  defaultStoreNm.value = props.defaultStoreNm;
});

const emitStoreType = (value) => {
  emit("update:storeType", value);
};

const emitStoreCode = (value) => {
  if (value != "0" && value != 0) {
    mergeExtraStoreIntoOptions();
    const hit = storeCd.value.find((item) => item.lngStoreCode == value);
    if (hit) emit("storeNm", hit.strName);
    else emitStoreNameForCode(value);
    emit("update:storeCd", value);
  } else {
    emit("storeNm", "전체");
    emit("update:storeCd", value);
  }
};

const setStore = (value) => {
  if (value == 0) {
    storeCd.value = storeCd2.value;
    return storeCd.value;
  }
  storeCd.value = storeCd2.value.filter((item) => {
    return item.lngStoreAttr == value;
  });
};

const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (storeGroup.value.length > 0) {
      emit("update:storeGroup", storeGroup.value[0].lngStoreGroup);
      //comsole.log(storeGroup.value[0].lngStoreGroup);
    }
  }
);

const setStoreAreaCd = (value) => {
  if (value == 0) {
    selectedStoreAreaCd.value = "0";
    storeAreaCd.value = "0";
    return;
  }

  storeAreaCd.value = storeAreaCd2.value.filter((item) => {
    return item.lngStoreCode == value;
  });

  // console.log(storeAreaCd.value)

  //comsole.log(storeAreaCd.value);
  selectedStoreAreaCd.value = storeAreaCd.value[0]
    ? storeAreaCd.value[0].lngAreaCode
    : "0";
  // selectedStoreAreaCd.value = "0";
  //emit("update:storeAreaCd", selectedStoreAreaCd.value);
  emitStoreAreaCd(selectedStoreAreaCd.value);
};

const setPosNo = async (value) => {
  //comsole.log(value);
  ////comsole.log(storeGroup.value[0].lngStoreGroup);
  if (value == undefined || storeGroup.value.length == 0) return;
  selectedPosNo.value = "0";
  storePosNo.value = "0";
  let response;
  try {
    response = await getPosList(storeGroup.value[0].lngStoreGroup, value);

    //comsole.log(storePosNo.value);
  } catch (error) {
  } finally {
    storePosNo.value = response.data.pos;
  }
};
const setKioskNo = async (value) => {
  selectedKioskNo.value = "0";
  storeKioskNo.value = [];
  let response;
  if (value == undefined || storeGroup.value.length == 0) return;
  try {
    response = await getKioskList(storeGroup.value[0].lngStoreGroup, value);

    // console.log(response);
  } catch (error) {
  } finally {
    storeKioskNo.value = response.data.pos;
  }
};
const setTablePosNo = async (value) => {
  selectedTablePosNo.value = "0";
  storeTablePosNo.value = [];
  let response;
  if (value == undefined || storeGroup.value.length == 0) return;
  try {
    response = await getTablePosList(storeGroup.value[0].lngStoreGroup, value);
  } catch (error) {
  } finally {
    storeTablePosNo.value = response.data.tablePos;
  }
};

const setScreenNo2 = (e) => {
  selectedFuncScreen.value = 0;
};
const emitPosInfo = (value1, value2) => {
  emit("areaCd", value1);
  emit("posNo", value2);
};
const emitKioskInfo = (value1, value2) => {
  emit("areaCd", value1);
  emit("kioskNo", value2);
};
const emitTablePosInfo = (value1, value2) => {
  emit("areaCd", value1);
  emit("tablePosNo", value2);
};

watch(selectedPosNo, (newValue) => {
  emitPosInfo(newValue.lngAreaCode, newValue.lngCode);
});
watch(selectedScreenNo, (newValue) => {
  emit("screenNo", selectedScreenNo.value);
});

const setScreenNo = async (value) => {
  if (selectedPosNo.value != "0" && props.showScreenNo == true) {
    const res2 = await getScreenList2(
      storeGroup.value[0].lngStoreGroup,
      selectedStoreCode.value,
      selectedPosNo.value.lngAreaCode,
      selectedPosNo.value.lngCode
    );
    ScreenList.value = res2.data.ScreenList;
  }
  //comsole.log(ScreenList.value);
  selectedScreenNo.value = "0";
};

const changed2 = ref(false);
const posChanged = () => {
  changed2.value = !changed2.value;
  emit("changed2", changed2.value);
};

watch(selectedKioskNo, (newValue) => {
  //comsole.log(newValue);
  emitKioskInfo(newValue.lngAreaCode, newValue.lngCode);
});

watch(selectedTablePosNo, (newValue) => {
  //comsole.log(newValue);
  emitTablePosInfo(newValue.lngAreaCode, newValue.lngCode);
});

watch(paymentType, (newvalue) => {
  emit("updatePaymentType", newvalue);
});

watch(selectedGroupCd, (newValue) => {
  const GroupNm =
    store.state.storeGroup.filter(
      (item) => item.lngStoreGroup == selectedGroupCd.value
    )[0]?.strName || "선택";
  emit("update:storeGroup", selectedGroupCd.value);
  emit("GroupNm", GroupNm);
});

watch(
  () => props.disabledAll,
  () => {
    if (props.disabledAll == true) {
      isDisabled.value = true;
    } else {
      isDisabled.value = false;
    }
  }
);

watch(
  () => props.setDefaultStoreCd,
  (cd) => {
    if (cd !== "" && cd != null) {
      const resolved = resolveDefaultStoreCode(cd);
      selectedStoreCode.value = resolved;
      emitStoreNameForCode(resolved);
    }
  }
);

watch(
  () => props.extraStoreOption,
  () => {
    mergeExtraStoreIntoOptions();
    if (props.setDefaultStoreCd !== "" && props.setDefaultStoreCd != null) {
      const resolved = resolveDefaultStoreCode(props.setDefaultStoreCd);
      selectedStoreCode.value = resolved;
      emitStoreNameForCode(resolved);
    }
  },
  { deep: true }
);
watch(
  () => props.defaultStore,
  () => {
    if (props.defaultStore == true) {
      selectedStoreCode.value = "0";
      emit("update:storeCd", "0");
      emit("storeNm", "전체");
    } else {
      selectedStoreCode.value = store.state.userData.lngPosition;
      emit("update:storeCd", selectedStoreCode.value);

      const hit = storeCd.value.find(
        (item) => item.lngStoreCode == selectedStoreCode.value
      );
      emit("storeNm", hit?.strName ?? "");
    }
  }
);

watch(
  () => props.showPosNo,
  () => {
    showPosNo.value = props.showPosNo;
  }
);
</script>
<style>
.style-chooser .vs__search::placeholder {
  height: 100% !important;
  max-height: 100% !important;
  overflow: hidden !important;
  font-size: 14px;
}
.style-chooser .vs__dropdown-toggle {
  height: 100% !important;
  min-height: 0 !important; /* vue-select 기본값 제거 */
  max-height: 100% !important;
  display: flex; /* 내부 텍스트 가운데 배치 */
  align-items: center;
  overflow: hidden !important;
  position: relative;
  z-index: 40 !important;
}

/* 조회바(compact): 바깥 셸에만 테두리 — vue-select 토글 기본 테두리와 이중선 방지 */
.pickstore-vs-shell .style-chooser .vs__dropdown-toggle {
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
.style-chooser .vs__dropdown-menu {
  background: white;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
  height: max-content;
  position: absolute;
  z-index: 40 !important;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
.style-chooser .vs__selected {
  background-color: white !important;
  justify-content: left;
  align-items: left;
  text-align: left;
  overflow: hidden !important;
  width: 100% !important;
  position: absolute;
  white-space: nowrap; /* 한 줄로 만들기 */
  text-overflow: ellipsis;
}

/* disabled 시 vue-select 기본 변수(--vs-state-disabled-color = 반투명 회색) 무력화 */
.style-chooser.vs--disabled {
  --vs-state-disabled-color: #000000;
  --vs-disabled-color: #000000;
  --vs-selected-color: #000000;
  --vs-search-input-color: #000000;
  --vs-colors--light: #000000;
}
.style-chooser.vs--disabled .vs__selected {
  font-size: 14px !important;
  font-weight: 500;
  background: rgb(230, 230, 230);
  color: #000 !important;
  -webkit-text-fill-color: #000 !important;
  display: flex;
  justify-content: left !important;
  align-items: center;
  height: 100% !important;
  min-width: 110% !important;
  z-index: 45;
  overflow: hidden !important;
  opacity: 1 !important;
}
.style-chooser.vs--disabled .vs__dropdown-toggle,
.style-chooser.vs--disabled .vs__selected-options {
  color: #000 !important;
  -webkit-text-fill-color: #000 !important;
  opacity: 1 !important;
}
</style>

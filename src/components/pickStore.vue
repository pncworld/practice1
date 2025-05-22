<template>
  <div class="flex justify-center md:justify-end space-x-4 text-sm mr-5">
    <div class="items-center font-bold hidden md:flex pl-12 text-nowrap">
      매장명 :
    </div>
    <div v-show="hideit2">
      <select
        :disabled="isDisabled"
        v-model="selectedGroupCd"
        id="storeGroup"
        class="hidden md:inline-block border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        :disabled="isDisabled"
        class="hidden md:inline-block border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @change="
          setStore($event.target.value);
          emitStoreType($event.target.value);
        "
        v-model="selectedStoreType">
        <option value="0">전체</option>
        <option
          :value="item.lngStoreAttr"
          v-for="item in storeType"
          :key="item.lngStoreAttr">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div class="w-full md:w-auto" v-show="hideit">
      <select
        :disabled="isDisabled"
        class="w-full md:w-auto border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedStoreCode"
        @change="
          emitStoreCode($event.target.value);
          ischanged();
          setStoreAreaCd($event.target.value);
          setPosNo($event.target.value);
          setKioskNo($event.target.value);
        ">
        <option value="0">{{ defaultStoreNm }}</option>
        <option
          :value="item.lngStoreCode"
          v-for="item in storeCd"
          :key="item.lngStoreCode">
          {{ item.strName }}
        </option>
      </select>
    </div>
    <div class="inline-block" v-if="showAreaCd">
      <span class="font-bold text-sm">지역코드 : &nbsp;</span>
      <select
        :disabled="isDisabled4"
        class="w-32 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div class="" v-if="showPosNo">
      <span class="font-bold text-sm">포스번호 : &nbsp;</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        v-model="selectedPosNo"
        @change="
          setScreenNo();
          posChanged();
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
    <div class="" v-if="showScreenNo">
      <span class="font-bold text-sm"> &nbsp; &nbsp;화면번호 : &nbsp;</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div class="" v-if="showKioskNo">
      <span class="font-bold text-sm"> KIOSK번호 : &nbsp;</span>
      <select
        :disabled="isDisabled4"
        class="w-32 text-sm border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div class="flex justify-center items-center space-x-2" v-if="showPayType">
      <span class="font-bold text-sm">결제키구분 : &nbsp;</span>

      <label for="discount" class="flex justify-center items-center"
        ><input
          type="radio"
          id="discount"
          v-model="paymentType"
          :value="3" /><span class="font-bold">[1]할인</span>
      </label>
      <label for="payment" class="flex justify-center items-center"
        ><input
          type="radio"
          v-model="paymentType"
          id="payment"
          :value="4" /><span class="font-bold">[2]지불</span>
      </label>
    </div>
    <div class="flex justify-center items-center space-x-2" v-if="showFuncType">
      <span class="font-bold text-sm">화면키 구분 : &nbsp;</span>

      <label for="discount" class="flex justify-center items-center"
        ><input
          type="radio"
          id="discount"
          v-model="paymentType"
          :value="3" /><span class="font-bold">[1]주문화면</span>
      </label>
      <label for="payment" class="flex justify-center items-center"
        ><input
          type="radio"
          v-model="paymentType"
          id="payment"
          :value="4" /><span class="font-bold">[2]결제화면</span>
      </label>
    </div>

    <div
      v-if="showFuncScreen"
      class="flex text-nowrap justify-center items-center space-x-2">
      <div class="text-sm font-semibold">화면번호 :</div>
      <select
        name=""
        id=""
        class="w-40 border border-black rounded-lg h-8"
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
      class="flex text-nowrap justify-center items-center space-x-2">
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
import { getKioskList, getPosList } from "@/api/common";
import { getScreenList2 } from "@/api/master";
import { defineProps, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const storeGroup = ref([]);
const storeType = ref([]);
const storeCd = ref([]);
const storeCd2 = ref([]);
const store = useStore();
const storeAreaCd2 = ref([]);
const storeAreaCd = ref([]);
const storePosNo = ref([]);
const storeKioskNo = ref([]);
const ScreenList = ref([]);
const selectedStoreAreaCd = ref();
const selectedPosNo = ref("0");
const selectedScreenNo = ref("0");
const selectedKioskNo = ref("0");
const selectedGroupCd = ref(store.state.userData.lngStoreGroup);
const paymentType = ref(3);
const selectedStoreType = ref(store.state.userData.lngJoinType);
const selectedStoreCode = ref(store.state.userData.lngPosition);
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
});

const hideit = ref(props.hidesub);
const hideit2 = ref(props.hideGroup);
const hideit3 = ref(props.hideAttr);
const showAreaCd = ref(props.showAreaCd);
const showPosNo = ref(props.showPosNo);
const showScreenNo = ref(props.showScreenNo);
const showKioskNo = ref(props.showKioskNo);
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

    // console.log(ScreenList.value);
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
    if (
      store.state.userData.blnBrandAdmin == "True" ||
      store.state.userData.lngPositionType == "1"
    ) {
      isDisabled.value = false;
    } else {
      isDisabled.value = true;
    }

    defaultStoreNm.value = props.defaultStoreNm;
  }
);
onMounted(() => {
  storeGroup.value = store.state.storeGroup;
  storeType.value = store.state.storeType;
  storeCd.value = store.state.storeCd;
  storeCd2.value = store.state.storeCd;
  storeAreaCd2.value = store.state.storeAreaCd;
  selectedStoreAreaCd.value = 0;

  emit("update:storeGroup", store.state.userData.lngStoreGroup);
  emit("update:storeType", store.state.userData.lngJoinType);
  emit("update:storeCd", store.state.userData.lngPosition);
  emit("storeNm", store.state.userData.strStoreName);
  emit("posNo", 0);
  emit("updateFuncScreenType", 0);
  //emit("update:storeAreaCd", 0);
  emit("GroupNm", store.state.userData.strStoreGroupName);
  setPosNo(store.state.userData.lngPosition);
  setStoreAreaCd(store.state.userData.lngPosition);
  setKioskNo(store.state.userData.lngPosition);
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    isDisabled.value = false;
  } else {
    isDisabled.value = true;
  }

  defaultStoreNm.value = props.defaultStoreNm;
});
const emitStoreType = (value) => {
  emit("update:storeType", value);
};

const emitStoreCode = (value) => {
  if (value != "0") {
    const selectedNm = storeCd.value.filter(
      (item) => item.lngStoreCode == value
    )[0].strName;

    emit("storeNm", selectedNm);
    emit("update:storeCd", value);
  } else {
    emit("storeNm", "전체");
    emit("update:storeCd", value);
  }
};

const deActivate = () => {
  let storeIndex = storeGroup.value.filter((item) => {
    return item.lngStoreGroup == userData.lngStoreGroup;
  });
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

    //comsole.log(storePosNo.value);
  } catch (error) {
  } finally {
    storeKioskNo.value = response.data.pos;
  }
};
const emitPosInfo = (value1, value2) => {
  emit("areaCd", value1);
  emit("posNo", value2);
};
const emitKioskInfo = (value1, value2) => {
  emit("areaCd", value1);
  emit("kioskNo", value2);
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

watch(paymentType, (newvalue) => {
  emit("updatePaymentType", newvalue);
});

watch(selectedGroupCd, (newValue) => {
  const GroupNm = store.state.storeGroup.filter(
    (item) => item.lngStoreGroup == selectedGroupCd.value
  )[0].strName;
  emit("update:storeGroup", selectedGroupCd.value);
  emit("GroupNm", GroupNm);
});
</script>

<template>
  <div class="flex flex-col  w-full overflow-y-auto">
    <div class="flex justify-between w-full pl-10 pt-5 ">
      <div class="flex justify-between">
        <h1 class="font-bold text-sm md:text-2xl w-full">
          메뉴키 설정
        </h1>
      </div>
      <div class="flex space-x-6 pr-12"><button class="button search" @click="searchMenu">조회</button><button
          class="button save" @click="saveMenuKey">저장</button><button class="button copy"
          @click="showPopupf"><font-awesome-icon icon="copy" />&nbsp;&nbsp;메뉴키&nbsp;복사</button> <button
          class="button primary" @click="SpecificMenuDupli"><font-awesome-icon
            icon="copy" />&nbsp;&nbsp;메뉴키화면키&nbsp;복사</button></div>
    </div>

    <div class="flex  bg-gray-200 rounded-lg h-16 w-full items-center mt-5">
      <PickStore6 @areaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" @posNo="handlePosNo"
        @storeNm="handlestoreNm" @update:ischanged="handleinitAll" @screenNo="handleScreenNo" @changed2="changed2">
      </PickStore6>
    </div>

  </div>
  <br>
  <div class="z-50">
    <DupliPopUp :isVisible="showPopup2" @close="showPopup2 = false" :storeCd="nowStoreCd" :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST01_004INS_VUE'" :dupliapiname="'dupliPos'" :progid="2"
      :poskiosk="'getStoreAndPosList'" :naming="'POS번호'">
    </DupliPopUp>
    <DupliPopUp2 :isVisible="showSpecificMenukey" @close="showSpecificMenukey = false" :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm" :areaCd="nowStoreAreaCd" :posNo="posNo" :progname="'MST01_004INS_VUE'" :progid="2"
      :dupliapiname="'dupliPos2'" :nowscreenNo="nowscreenNo"></DupliPopUp2>
  </div>

  <div v-if="changeScreenKey" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center  z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%] ">
      <h2 class="text-lg font-bold">화면키 수정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full"><input type="text" class="border border-gray-400 pl-1 h-full w-full"
            v-model="currentscreenKeyNm"></div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16">
        <button @click="confirmScreenKey()" class="mt-4 p-2 bg-blue-500 text-white rounded">확인</button>
        <button @click="exitScreenKey" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
      </div>
    </div>

  </div>

  <div v-if="showScreenNm == true"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center  z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%] ">
      <h2 class="text-lg font-bold">화면명을 입력하세요</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-sm"><input type="text"
            class="border border-gray-400 pl-1 h-14 w-full rounded-sm" v-model="currentSelectedMenuNm"></div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-28">
        <button @click="addScreenKeyf()" class="mt-4 p-2 bg-blue-500 text-white rounded">확인</button>
        <button @click="showScreenNm = false" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
      </div>
    </div>

  </div>

  <div v-show="showChangeScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
      <div class="border-gray-500 text-2xl">화면키 순서 변경</div>
      <div class="border-gray-500 text-xl">화면키를 끌어서 이동하면 순서가 변경됩니다.</div>
      <!-- VueDraggableNext 사용 -->
      <VueDraggableNext v-model="ScreenKeyOrigin" :group="{ name: 'subCategory', pull: 'clone', put: true }"
        class="space-y-2" :move="onMove2" @end="onEnd2">
        <div v-for="(item, index) in ScreenKeyOrigin" class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-14"
          v-show="item && item.strScreenName !== ''">
          <p>{{ item.strScreenName }}</p>
        </div>
      </VueDraggableNext>

      <div class="flex justify-center space-x-3">
        <button @click="showScreenKeysOrder" class="mt-4 p-2 bg-blue-500 text-white rounded">닫기</button>
      </div>
    </div>
  </div>
  <span class="h-5 -mt-1 flex justify-between items-center w-[930px] ml-[680px]  z-40">
    <h1 class="font-bold text-xl z-40">메뉴키 설정</h1><span class="flex space-x-3 ml-32 pl-56 items-center">순서변경 &nbsp;
      &nbsp;<label class="z-40"><input type="radio" name="changingMode" @click.stop="changingMode(1)" checked>교체하기
      </label><label class="z-40"><input type="radio" name="changingMode"
          @click.stop="changingMode(2)">밀어내기</label><button class="whitebutton z-40"
        @click.stop="deletekey">삭제</button></span>
  </span>
  <div class="flex h-5/6 w-full -mt-5 ">
    <div class="flex flex-col w-3/5 h-4/6 ">
      <div class="flex justify-between mt-0 ml-10 w-full border-b  border-b-gray-300">

        <div>
          <button class="contents_tab-button " :class="{ 'text-blue-600': currentMenu == 1 }"
            @click="showMenus(1)">메뉴관리</button>
          <button class="contents_tab-button" :class="{ 'text-blue-600': currentMenu == 2 }"
            @click="showMenus(2)">TLU관리</button>
          <button class="contents_tab-button" :class="{ 'text-blue-600': currentMenu == 3 }"
            @click="showMenus(3)">화면관리</button>
        </div>
        <div class="mt-3">
          <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
          <button class="whitebutton" v-if="currentMenu != 3">추가</button>
        </div>
      </div>
      <div class="h-4/6" v-show="currentMenu == 1">
        <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
          <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex ">
            <select name="" id="" class="flex-1" @change="setSubCd" v-model="forsearchMain">
              <option value="0">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup"> [{{ i.GroupCd }}]{{ i.majorGroupNm }}</option>
            </select>
            <select name="" id="" class="flex-1" v-model="forsearchSub">
              <option value="0">전체</option>
              <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup"> [{{ i.GroupCd }}]{{ i.subGroupNm }}</option>
            </select>
          </div>
          <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
          <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList"></div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">

          <div id="realgrid" style="width: 100%; height: 180%;"></div>
        </div>
      </div>

      <div class="h-4/6" v-show="currentMenu == 2">
        <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">TLU명/코드</div>
          <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList2"></div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">

          <div id="realgrid2" style="width: 100%; height: 90%;"></div>
          <div id="realgrid3" style="width: 100%; height: 90%;" class="mt-5"></div>
        </div>
      </div>
      <div class="h-full" v-show="currentMenu == 3">
        <div class="mt-7 ml-10 w-full h-full">
          <Realgrid :progname="'MST01_004INS_VUE'" :progid="3" :rowData="rowData" :showGrid="showGrid"
            :showCheckBar="false" @selcetedrowData="selcetedrowData"></Realgrid>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-1 ml-10 w-full h-full z-20">
      <div class="flex h-[760px] w-[950px] mt-10 ml-8" v-show="afterSearch">
        <VueDraggableNext v-model="showMenuKeyList" :move="onMove" @end="onEnd" animation="200"
          class="grid grid-cols-5 grid-rows-9 gap-1 w-[950px] h-[760px]">
          <div v-for="(item, index) in showMenuKeyList"
            class="flex items-center justify-center h-20 w-44 rounded-2xl shadow-sm border border-gray-500"
            :class="{ '!bg-orange-500': clickedMenuKey == index }"
            @click="saveMenuKeyposition(index); clickedMenuKey = index; clickedMenukeys()">
            <span class="flex flex-col">
              <span v-if="item.intKeyNo == 1">(Screen. {{ item.lngKeyscrNo }} )</span>
              <span>{{ item ? formatStrKeyName(item.strKeyName).part1 : '' }}</span>
              <span>{{ item ? formatStrKeyName(item.strKeyName).part2 : '' }}</span>
              <span class="ml-16">{{ item ? (formatStrKeyName(item.strKeyName).part3 != null ?
                formatStrKeyName(item.strKeyName).part3 +'원' : '') : ''}}</span>
            </span>
          </div>
        </VueDraggableNext>
      </div>
    </div>




  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { deletetablePosMenuKey, get_category_info, getCategoryInfo, getMenuKeyList, getMenuKeyList2, getMenuList, getMultiLingual, getScreenList, getScreenList2, getTablePosMenuKey, getTLUList, saveAllMenuKey, saveMenuKey2, saveScreenKeys, savetablePosMenuKey, tablePosMenuKey, tablePosMenuKey_v2 } from '@/api/master';
import { VueDraggableNext } from 'vue-draggable-next';
import Swal from 'sweetalert2';
import PickStore5 from '@/components/pickStore5.vue';
import { GridView, LocalDataProvider } from 'realgrid';
import DupliPopUp from '@/components/dupliPopUp.vue';
import PickStore6 from '@/components/pickStore6.vue';
import DupliPopUp2 from '@/components/dupliPopUp2.vue';
import Realgrid from '@/components/realgrid.vue';


// 더미 데이터
const items = ref([]);
const clickedScreenKeyIndex = ref()
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref()
const ScreenKeys = ref();
const currentMenuorTLU = ref(false)
const forsearchMain = ref('0')
const forsearchSub = ref('0')
const addscreenKey = ref(false)
const searchWord = ref('')
const searchWord2 = ref('')
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = (data) => {
  if (data == 1) {
    changeMode.value = false
  } else {
    changeMode.value = true
  }

}
const clickedStoreNm = ref()
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData
}
const showPopup2 = ref(false)
const showChangeScreenKey = ref(false)
const changePopup = ref(false);
const deleteAllitems = ref([]);
const popupData = ref([]);
const confirmitem = ref([]);
const languageName0 = ref('');
const languageName1 = ref('');
const languageName2 = ref('');
const languageName3 = ref('');
const languageName4 = ref('');
const currentscreenKeyNm = ref('');
const clickedSubCode = ref()
const maxSubCode = ref();
const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1)
const AllscreenKeyPage = ref(1)
const currentSelectedMenuNm = ref("")
const showSpecificMenukey = ref(false)
const rowData = ref([
  { screenName: '화면1', add: '추가', screenNo: 1 },
  { screenName: '화면2', add: '추가', screenNo: 2 },
  { screenName: '화면3', add: '추가', screenNo: 3 },
  { screenName: '화면4', add: '추가', screenNo: 4 },
  { screenName: '화면5', add: '추가', screenNo: 5 },
  { screenName: '화면6', add: '추가', screenNo: 6 },
  { screenName: '화면7', add: '추가', screenNo: 7 },
  { screenName: '화면8', add: '추가', screenNo: 8 },
  { screenName: '화면9', add: '추가', screenNo: 9 },
  { screenName: '화면10', add: '추가', screenNo: 10 },
  { screenName: '화면11', add: '추가', screenNo: 11 },
  { screenName: '화면12', add: '추가', screenNo: 12 },
  { screenName: '화면13', add: '추가', screenNo: 13 },
  { screenName: '화면14', add: '추가', screenNo: 14 },
  { screenName: '화면15', add: '추가', screenNo: 15 },
  { screenName: '화면16', add: '추가', screenNo: 16 },
  { screenName: '화면17', add: '추가', screenNo: 17 },
  { screenName: '화면18', add: '추가', screenNo: 18 },
  { screenName: '화면19', add: '추가', screenNo: 19 },
  { screenName: '화면20', add: '추가', screenNo: 20 }
]);


const isNew = ref(false);
const currentMenu = ref('1')
const SpecificMenuDupli = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  showSpecificMenukey.value = true
}
const showScreenNm = ref(false)
const selcetedrowData = (newvalue) => {
  console.log(newvalue[2])
  showScreenNm.value = true
  currentSelectedMenuNm.value = newvalue[0]
  currentSelectedMenuCode.value = newvalue[2]
  // addScreenKeyf()

}

const showPopupf = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  showPopup2.value = true;
}
function formatStrKeyName(strKeyName) {
  // 첫 번째 파싱: '/' 기준으로 분리
  const firstSplit = strKeyName.split('/');

  // 두 번째 파싱: '(' 기준으로 분리
  const secondSplit = firstSplit[1] ? firstSplit[1].split('(') : [null];

  // 결과 반환
  return {
    part1: firstSplit[0], // 첫 번째 부분 ("/" 기준)
    part2: secondSplit[0], // 두 번째 부분 ("(" 기준)
    part3: secondSplit[1] ? secondSplit[1].replace(')', '') : null, // 괄호 안 내용
  };
}
const changed2 = (newvalue) => {

  MenuKeyList.value = []
  showMenuKeyList.value = []
}



const updateMenuKey = ref(false)
let dupliitems = []

const saveMenuKey = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고.',
      text: '조회를 먼저 해주세요.',
      icon: 'warning',
      confirmButtonText: '확인',
    })
    return;
  }
  if (JSON.stringify(confirmitem.value) === JSON.stringify(MenuKeyList.value) && JSON.stringify(confirmitem2.value) === JSON.stringify(ScreenKeyOrigin.value)) {
    Swal.fire({
      title: '경고',
      text: '변경된 사항이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }
  const keyseq = MenuKeyList.value.map(item => item.intKeySeq)
  const keyname = MenuKeyList.value.map(item => item.strKeyName)
  const keyscrno = MenuKeyList.value.map(item => item.lngKeyscrNo)
  const keycolor = MenuKeyList.value.map(item => item.lngKeyColor)
  const keyno = MenuKeyList.value.map(item => item.intKeyNo)
  Swal.fire({
    title: '저장',
    text: '저장 하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '저장',
    cancelButtonText: '취소'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await saveMenuKey2(groupCd.value, nowStoreCd.value, nowStoreAreaCd.value, posNo.value,
          keyseq.join(","),
          keyname.join(","),
          keyscrno.join(","),
          keycolor.join(","),
          keyno.join(",")
        )
        console.log(res)
        if (res.data.RESULT_CD == '00') {
          Swal.fire({
            title: '저장 되었습니다.',
            confirmButtonText: '확인',
          })
        }
      } catch (error) {

      } finally {
        searchMenu()
      }

    }
  })




}
const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {

  nowStoreAreaCd.value = newValue;
  console.log(nowStoreAreaCd.value)
}

const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreCd = async (newValue) => {
  if (newValue == '0') {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
  const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
  MenuList.value = res2.data.menuList
  MenuGroup.value = res2.data.menuGroup
  SubMenuGroup.value = res2.data.submenuGroup

  MenuList.value = MenuList.value.map(item => {
    return {
      ...item,
      add: '추가'
    }
  })
  const res5 = await getTLUList(groupCd.value, nowStoreCd.value)
  TLUList.value = res5.data.TLUList
  TLUList.value = TLUList.value.map(item => {
    return {
      ...item,
      add: '추가'
    }
  })
}
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([])
const screenNoList = ref([])
const MenuGroup = ref([])
const SubMenuGroup = ref([])

const store = useStore();

const showMenuKeyList = ref([])
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([])
const MenuKeyList = ref([])
const clickedScreenOrMenu = ref(false)
const TLUList = ref([])
const confirmitem2 = ref([])
const clickedScreenNo = ref()
const changePage = ref(false)
const searchMenu = async () => {
  changeMode.value = false
  Category.value = [];
  items.value = []

  if (nowStoreCd.value == '0' || nowStoreCd.value == undefined) {
    Swal.fire({
      title: '경고',
      text: '매장을 선택하세요.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    })
    return;
  }
  if (posNo.value == '0' || posNo.value == undefined) {
    Swal.fire({
      title: '경고',
      text: '포스번호를 선택하세요.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    })
    return;
  }
  if (nowscreenNo.value == '0' || nowscreenNo.value == undefined) {
    Swal.fire({
      title: '경고',
      text: '화면번호를 선택하세요.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    })
    return;
  }
  store.state.loading = true;
  try {
    MenuKeyList.value = []
    showMenuKeyList.value = []


    const res3 = await getScreenList2(groupCd.value, nowStoreCd.value, nowStoreAreaCd.value, posNo.value)
    const res4 = await getMenuKeyList2(groupCd.value, nowStoreCd.value, nowStoreAreaCd.value, posNo.value)

    MenuKeyList.value = res4.data.MenukeyList
    screenNoList.value = res3.data.ScreenList;

    confirmitem.value = JSON.parse(JSON.stringify(MenuKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 10)


    const filteredList = MenuKeyList.value.filter(item => item.intKeySeq >= (nowscreenNo.value - 1) * 45 && item.intKeySeq <= (nowscreenNo.value) * 45)

    const startIndex = (nowscreenNo.value - 1) * 45;
    const endIndex = nowscreenNo.value * 45;
    // 중간에 비어 있는 번호 확인 및 채우기
    for (let i = startIndex; i < endIndex; i++) {
      // 해당 번호가 없는 경우 기본값 추가
      const existingItem = filteredList.find((item) => item.intKeySeq === i + 1);
      if (existingItem) {
        showMenuKeyList.value.push(existingItem);
      } else {
        showMenuKeyList.value.push({
          intKeySeq: i,
          strKeyName: ``, // 기본값 또는 placeholder
        });
      }
    }
    console.log(MenuKeyList.value)

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {

    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;

  }


  calculateMaxSubCode();

};
const filteredSubMenuGroup = ref([]);
const setSubCd = () => {
  console.log(forsearchMain.value)
  console.log(SubMenuGroup.value)
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.sublngMajor == forsearchMain.value)
  console.log(filteredSubMenuGroup.value)
  forsearchSub.value = '0'
  searchMenuList3()
}
const clickedintScreenNo = ref()
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter(item => item.SubCategory && item.SubCategory.length > 0)
      .flatMap(item => item.SubCategory.map(sub => Number(sub.SubCode))));
}
const showMenuKey = (value) => {
  showMenuKeyList.value = []
  const filteredList = MenuKeyList.value.filter(item => item.intKeySeq >= (nowscreenNo.value - 1) * 45 && item.intKeySeq <= (nowscreenNo.value) * 45)

  const startIndex = (nowscreenNo.value - 1) * 45;
  const endIndex = nowscreenNo.value * 45;
  // 중간에 비어 있는 번호 확인 및 채우기
  for (let i = startIndex; i < endIndex; i++) {
    // 해당 번호가 없는 경우 기본값 추가
    const existingItem = filteredList.find((item) => item.intKeySeq === i + 1);
    if (existingItem) {
      showMenuKeyList.value.push(existingItem);
    } else {
      showMenuKeyList.value.push({
        intKeySeq: i + 1,
        strKeyName: ``, // 기본값 또는 placeholder
      });
    }
  }

}
watch(ScreenKeys, (newvalue) => {
  if (ScreenKeys.value.length > 10) {
    AllscreenKeyPage.value = Math.ceil(ScreenKeys.value.length / 10)
  }
})
const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value
}

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    return false;
  } else {
    return true;
  }

};
let targetItemIndex3;
let dupliScreenKeyOrigin;
const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related)

  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value]
  return true;

};

const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (changeMode.value === false) {
    console.log(MenuKeyList.value)
    const oldIndex = evt.oldIndex;  // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...showMenuKeyList.value];  // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;


    showMenuKeyList.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: (index + (nowscreenNo.value - 1) * 45) + 1 // 배열 순서대로 intKeySeq 재정렬
    }));
  } else {
    updateMenuKey.value = true
    showMenuKeyList.value = showMenuKeyList.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: (index + (nowscreenNo.value - 1) * 45) + 1 // 배열 순서대로 intKeySeq 재정렬
    }))
  }

  console.log(showMenuKeyList.value)

};
function formatNumber(value) {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const onEnd2 = (evt) => {
  console.log(ScreenKeyOrigin.value)
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo
  ScreenKeyOrigin.value.forEach((item, index) => {
    item.intScreenNo = (index + 1)
  })
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value).forEach((item, index) => {
    if (item.intScreenNo == originScreenNo) {
      item.intScreenNo = targetItemIndex3 + 1
    } else if (item.intScreenNo == targetScreenNo) {
      item.intScreenNo = evt.oldIndex + 1
    }
  })
  addfor10ScreenKey()

  showMenuKey(clickedintScreenNo.value)
}
watch(items, (newvalue) => {
  console.log(newvalue)
  newvalue.forEach((item, index) => {
    if (item == null || item.lngKeyscrNo == null || item.lngKeyscrNo == '') {
      newvalue[index] = { intKeySeq: index + (currmenuKeyPage.value - 1) * 30 + 1 }
    } else {
      item.intKeySeq = index + (currmenuKeyPage.value - 1) * 30 + 1;
    }


  })
  console.log(items.value)
  console.log(MenuKeyList.value)

})
watch(showMenuKeyList, (newvalue) => {

  const firstfiltered = showMenuKeyList.value.filter(item => (item.lngKeyscrNo != undefined))

  console.log(firstfiltered);
  console.log(MenuKeyList.value);

  let secondfiltered = MenuKeyList.value.filter(item => item.intKeySeq < (nowscreenNo.value - 1) * 45 || item.intKeySeq > (nowscreenNo.value) * 45)
  console.log(secondfiltered)
  firstfiltered.forEach((updatedItem) => {
    secondfiltered.push(updatedItem)
  });
  MenuKeyList.value = secondfiltered
  console.log(MenuKeyList.value)
})
const savePosMenu = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고',
      text: '조회를 먼저 진행해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  if (JSON.stringify(confirmitem.value) === JSON.stringify(MenuList.value)) {
    Swal.fire({
      title: '경고',
      text: '변경된 항목이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }
  Swal.fire({
    title: '저장하시겠습니까?',
    text: '변경사항을 저장하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '저장',
    cancelButtonText: '취소',
    allowOutsideClick: false
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        const screenKeyNoarr = ScreenKeyOrigin.value.map(item => item.intScreenNo)
        const screenKeyNamearr = ScreenKeyOrigin.value.map(item => item.strScreenName)
        console.log(screenKeyNoarr.join(','))
        console.log(screenKeyNamearr.join(','))
        const res = await saveScreenKeys(groupCd.value, nowStoreCd.value, nowStoreAreaCd.value, posNo.value, screenKeyNoarr.join(','), screenKeyNamearr.join(','))


        const intKeySeqs = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intKeySeq)
        const screenNumarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.intScreenNo)
        const lngScrarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.lngKeyscrNo)
        const menuKeyNmarr = MenuKeyList.value.filter(item => item.intPosNo == posNo.value).map(item => item.strKeyName)
        console.log(posNo.value)
        console.log(intKeySeqs.join(','))
        console.log(screenNumarr.join(','))
        console.log(lngScrarr.join(','))
        console.log(menuKeyNmarr.join(','))
        const res2 = await saveAllMenuKey(groupCd.value, nowStoreCd.value, nowStoreAreaCd.value, posNo.value, intKeySeqs.join(','), screenNumarr.join(','), lngScrarr.join(','), menuKeyNmarr.join(','))

        console.log(res)
        console.log(res2)
      } catch (error) {

      } finally {
        store.state.loading = false;
        Swal.fire({
          title: '저장 성공',
          text: '변경 사항이 저장되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

        searchMenu()
      }
    }
  }
  )

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.

}
let gridView;
let dataProvider;
const currentSelectedMenuCode = ref('')
onMounted(() => {
  showMenuKeys()
})

const showMenuKeys = () => {

  if (gridView) {
    gridView.destroy();  // 기존 그리드 인스턴스 파괴
  }

  dataProvider = new LocalDataProvider();

  // 2. GridView 설정
  gridView = new GridView('realgrid');
  gridView.setDataSource(dataProvider);

  // 3. 필드 정의
  const fields = [
    { fieldName: 'menuCd', dataType: 'text' },
    { fieldName: 'menuNm', dataType: 'text' },
    { fieldName: 'lngPrice', dataType: 'number' },
    { fieldName: 'add', dataType: 'text' },
  ];
  dataProvider.setFields(fields);


  // 4. 컬럼 정의
  const columns = [
    {
      name: '메뉴코드', fieldName: 'menuCd', header: {
        text: '메뉴코드',
        styleName: 'header-style-0'
      }
    },
    {
      name: '메뉴명', fieldName: 'menuNm', header: {
        text: '메뉴명',
        styleName: 'header-style-1'
      }
    },
    {
      name: '판매가', fieldName: 'lngPrice', header: {
        text: '판매가',
        styleName: 'header-style-2'
      }, numberFormat: '#,##0'
    },
    {
      name: '선택', fieldName: 'add'
      , header: { text: '선택', styleName: 'header-style-3' }, editable: false, renderer: {
        type: "button"
      }

    },

  ];
  gridView.setColumns(columns);
  // 5. 샘플 데이터 추가
  dataProvider.setRows(MenuList.value);
  gridView.sortMode = 'explicit';
  gridView.filterMode = 'explicit';
  gridView.setFooters({ visible: false })
  gridView.setRowIndicator({
    visible: true
  });
  gridView.setCheckBar({
    visible: false,
  });
  gridView.displayOptions.fitStyle = "even";
  gridView.sortingOptions.enabled = true;

  gridView.commit();
  gridView.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView.commit();

    // 이후 데이터 갱신 (필요시 rows를 업데이트)

  };

  gridView.onCellItemClicked = function (grid, index, clickData) {
    currentSelectedMenuCode.value = dataProvider.getRows()[clickData.itemIndex][0]
    currentSelectedMenuNm.value = dataProvider.getRows()[clickData.itemIndex][1]
    addMenuKey()
    return true;
  }
}

let gridView2;
let dataProvider2;
const clickedTLUCD = ref();
const clickedTLUNM = ref();
const showMenuKeys2 = () => {

  if (gridView2) {
    gridView2.destroy();  // 기존 그리드 인스턴스 파괴
  }

  dataProvider2 = new LocalDataProvider();

  // 2. GridView 설정
  gridView2 = new GridView('realgrid2');
  gridView2.setDataSource(dataProvider2);

  // 3. 필드 정의
  const fields = [
    { fieldName: 'lngCode', dataType: 'text' },
    { fieldName: 'strName', dataType: 'text' },
    { fieldName: 'add', dataType: 'text' },
  ];
  dataProvider2.setFields(fields);


  // 4. 컬럼 정의
  const columns = [
    {
      name: 'TLU코드', fieldName: 'lngCode', header: {
        text: 'TLU코드',
        styleName: 'header-style-0'
      }
    },
    {
      name: 'TLU명', fieldName: 'strName', header: {
        text: 'TLU명',
        styleName: 'header-style-1'
      }
    },
    {
      name: '선택', fieldName: 'add'
      , header: { text: '선택', styleName: 'header-style-3' }, editable: false, renderer: {
        type: "button"
      }

    },

  ];
  gridView2.setColumns(columns);
  // 5. 샘플 데이터 추가
  dataProvider2.setRows(TLUList.value);
  gridView2.sortMode = 'explicit';
  gridView2.filterMode = 'explicit';
  gridView2.setFooters({ visible: false })
  gridView2.setRowIndicator({
    visible: true
  });
  gridView2.setCheckBar({
    visible: false,
  });
  gridView2.displayOptions.fitStyle = "even";
  gridView2.sortingOptions.enabled = true;

  gridView2.commit();
  gridView2.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView2.commit();

    // 이후 데이터 갱신 (필요시 rows를 업데이트)

  };
  gridView2.onCellClicked = function (grid, clickData) {
    if (clickData == undefined) {
      return;
    }
    clickedTLUCD.value = dataProvider2.getRows()[clickData.itemIndex][0];
  }
  gridView2.onCellItemClicked = function (grid, clickData) {
    console.log(clickData.itemIndex)
    if (clickData.itemIndex == undefined) {
      return;
    }
    clickedTLUCD.value = dataProvider2.getRows()[clickData.itemIndex][0];
    clickedTLUNM.value = dataProvider2.getRows()[clickData.itemIndex][1];
    addTLUKey()
  }



}

let gridView3;
let dataProvider3;
const showMenuKeys3 = () => {

  if (gridView3) {
    gridView3.destroy();  // 기존 그리드 인스턴스 파괴
  }

  dataProvider3 = new LocalDataProvider();

  // 2. GridView 설정
  gridView3 = new GridView('realgrid3');
  gridView3.setDataSource(dataProvider3);

  // 3. 필드 정의
  const fields = [

    { fieldName: 'menuCd', dataType: 'text' },
    { fieldName: 'menuNm', dataType: 'text' },

  ];
  dataProvider3.setFields(fields);


  // 4. 컬럼 정의
  const columns = [
    {
      name: '메뉴코드', fieldName: 'menuCd', header: {
        text: '메뉴코드',
        styleName: 'header-style-0'
      }
    },
    {
      name: '메뉴명', fieldName: 'menuNm', header: {
        text: '메뉴명',
        styleName: 'header-style-1'
      }
    },

  ];
  gridView3.setColumns(columns);
  // 5. 샘플 데이터 추가
  dataProvider3.setRows();
  gridView3.sortMode = 'explicit';
  gridView3.filterMode = 'explicit';
  gridView3.setFooters({ visible: false })
  gridView3.setRowIndicator({
    visible: true
  });
  gridView3.setCheckBar({
    visible: false,
  });
  gridView3.displayOptions.fitStyle = "even";
  gridView3.sortingOptions.enabled = true;

  gridView3.commit();
  gridView3.onCellEdited = function (grid, itemIndex, row, field) {
    // 데이터가 수정될 때 rows를 갱
    gridView3.commit();

    // 이후 데이터 갱신 (필요시 rows를 업데이트)

  };

  gridView3.onCellItemClicked = function (grid, index, clickData) {

    return true;
  }

  watch(clickedTLUCD, (newValue) => {
    const TLUMenuCd = TLUList.value
      .filter(item => item.lngCode == newValue)  // lngCode가 newValue와 일치하는 항목 필터링
      .map(item => {
        // 객체의 모든 키를 가져오고 'lngMenu'로 시작하는 키들만 필터링
        const filteredMenus = Object.keys(item)
          .filter(key => key.startsWith('lngMenu') && item[key] !== 0)   // 'lngMenu'로 시작하는 키들만 필터링
          .reduce((result, key) => {
            result[key] = item[key];  // 필터링된 속성만 포함
            return result;
          }, {});
        return filteredMenus;  // 필터링된 항목 반환
      });

    console.log(TLUMenuCd[0])
    const newTLUMenus = [];

    Object.keys(TLUMenuCd[0]).forEach(key => {

      const menuValue = TLUMenuCd[0][key]; // menu1, menu2, ..., menu29 값 가져오기

      const filteredMenus = MenuList.value.filter(menuItem => menuItem.menuCd === menuValue.toString());
      newTLUMenus.push(...filteredMenus); // 결과 배열에 필터링된 메뉴들을 추가
    });

    console.log(newTLUMenus);



    dataProvider3.setRows(newTLUMenus);
  })
}
const searchMenuList = (e) => {
  const searchWord1 = e.target.value
  searchWord.value = e.target.value
  const filteredList = MenuList.value.filter(item =>
    (forsearchMain.value === '0' || item.majorGroupCd === forsearchMain.value) &&
    (forsearchSub.value === '0' || item.subGroupCd === forsearchSub.value) &&
    (item.menuCd.includes(searchWord1) || item.menuNm.includes(searchWord1))
  );
  dataProvider.setRows(filteredList);

}
const searchMenuList3 = (e) => {
  if (currentMenuorTLU.value == false) {

    const filteredList = MenuList.value.filter(item =>
      (forsearchMain.value === '0' || item.majorGroupCd === forsearchMain.value) &&
      (forsearchSub.value === '0' || item.subGroupCd === forsearchSub.value) &&
      (item.menuCd.includes(searchWord.value) || item.menuNm.includes(searchWord.value))
    );
    dataProvider.setRows(filteredList);
  } else {
    const filteredList = TLUList.value.filter(item =>

      (item.lngCode.toString().includes(searchWord2.value) || item.strName.includes(searchWord2.value))
    );
    dataProvider2.setRows(filteredList);
  }

}

const searchMenuList2 = (e) => {
  const searchword2 = e.target.value
  searchWord2.value = e.target.value
  const filteredList = TLUList.value.filter(item =>

    (item.lngCode.toString().includes(searchword2) || item.strName.includes(searchword2))
  );

  dataProvider2.setRows(filteredList);

}


const handlePosNo = (newValue) => {
  posNo.value = newValue
  console.log(posNo.value)

}
const nowscreenNo = ref()
const handleScreenNo = (newValue) => {
  nowscreenNo.value = newValue
  console.log(nowscreenNo.value)

}
watch(nowscreenNo, (newvalue) => {
  changePage.value = true
  if (afterSearch.value) {
    console.log(MenuKeyList.value)
    console.log(showMenuKeyList.value)

    console.log(nowscreenNo.value)
    showMenuKeyList.value = []
    const filteredList = MenuKeyList.value.filter(item => item.intKeySeq > (nowscreenNo.value - 1) * 45 && item.intKeySeq <= (nowscreenNo.value) * 45)
    console.log(filteredList)
    const startIndex = (nowscreenNo.value - 1) * 45;
    const endIndex = nowscreenNo.value * 45;
    // 중간에 비어 있는 번호 확인 및 채우기
    for (let i = startIndex; i < endIndex; i++) {
      // 해당 번호가 없는 경우 기본값 추가
      const existingItem = filteredList.find((item) => item.intKeySeq === i + 1);
      if (existingItem) {
        showMenuKeyList.value.push(existingItem);
      } else {
        showMenuKeyList.value.push({
          intKeySeq: i,
          strKeyName: ``, // 기본값 또는 placeholder
        });
      }

    }
    console.log(showMenuKeyList.value)
    console.log(MenuKeyList.value)
  }
  changePage.value = false
})
watch(() => MenuList.value, () => {
  showMenuKeys();  // MenuKeyList 값이 변경될 때마다 그리드 업데이트
});

const editScreenKey = (value) => {
  clickedScreenNo.value = value
  changeScreenKey.value = true;
}

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false
}
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(item => item.intScreenNo == clickedScreenNo.value)
  ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value
  changeScreenKey.value = false;
  console.log(ScreenKeyOrigin.value)
  addfor10ScreenKey()
  currentscreenKeyNm.value = ''
  clickedScreenNo.value = ''
}

const addfor10ScreenKey = () => {
  ScreenKeys.value = [...ScreenKeyOrigin.value.slice(10 * (currentsubPage.value - 1), 10 * (currentsubPage.value - 1) + 10)];
  const length = ScreenKeys.value.length
  if (length < 10) {
    ScreenKeys.value.push({ strScreenName: '', intScreenNo: '', new: true })
    for (var i = 0; i < 9 - length; i++) {
      ScreenKeys.value.push({ strScreenName: '', intScreenNo: '' })
    }
  }
}

const addfor30MenuKeys = () => {

  const length = items.value.length
  if (length < 30) {
    for (var i = 0; i < 30 - length; i++) {
      items.value.push({ strScreenName: '', intScreenNo: '' })
    }
  }
}

const addScreenKey = (value) => {
  addscreenKey.value = true
  console.log(value)
  clickedScreenNo.value = value + 1
}

const confirmaddScreenKey = () => {
  if (currentscreenKeyNm.value == '' || currentscreenKeyNm.value == null) {
    Swal.fire({
      title: '오류',
      text: '화면키 이름을 입력하세요.',
      icon: 'error',
      confirmButtonText: '확인'
    })
    return;
  }
  const newScreenNo = ScreenKeyOrigin.value[ScreenKeyOrigin.value.length - 1].intScreenNo + 1;
  ScreenKeyOrigin.value.push({ strScreenName: currentscreenKeyNm.value, intScreenNo: newScreenNo })
  addscreenKey.value = false
  addfor10ScreenKey()
  console.log(ScreenKeyOrigin.value)
  currentscreenKeyNm.value = ''
  console.log(clickedScreenNo.value)
  showMenuKey(clickedScreenNo.value + (currentsubPage.value - 1) * 10)
}



const prevMenuKey = () => {
  if (currmenuKeyPage.value == 1) {
    return;
  }
  currmenuKeyPage.value--
  items.value = [...Array(30).fill(null)]
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item => {
    console.log(item)

    const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1
    if (position >= 0 && position < 30) {
      items.value[position] = item
    }
  })
}
const nextMenuKey = () => {
  if (currmenuKeyPage.value == 33) {
    return;
  }
  currmenuKeyPage.value++

  items.value = [...Array(30).fill(null)]
  MenuKeyList.value.filter(item => item.intPosNo == posNo.value && item.intScreenNo == clickedintScreenNo.value).forEach(item => {
    console.log(item)
    const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1
    if (position >= 0 && position < 30) {
      items.value[position] = item
    }
  })

}
const existMenuKey = ref(false)
const clickedRealIndex = ref()
const saveMenuKeyposition = (index) => {
  console.log(clickedintScreenNo.value)
  console.log(index)
  console.log(items.value)
  clickedScreenOrMenu.value = true;
  clickedRealIndex.value = (nowscreenNo.value - 1) * 45 + index
  console.log(clickedRealIndex.value)
}

const addMenuKey = () => {
  console.log(MenuKeyList.value)
  console.log(clickedRealIndex.value)
  const foraddIndex = MenuKeyList.value.findIndex(item => item.intKeySeq == (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1)
  console.log(foraddIndex)
  if (foraddIndex == -1) {
    MenuKeyList.value.push({ intKeyNo: 6, intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1, intPosNo: posNo.value, lngKeyscrNo: Number(currentSelectedMenuCode.value), strKeyName: currentSelectedMenuNm.value, lngKeyColor: "16769216" })
  } else {
    MenuKeyList.value[foraddIndex] = { intKeyNo: 6, intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1, intPosNo: posNo.value, lngKeyscrNo: Number(currentSelectedMenuCode.value), strKeyName: currentSelectedMenuNm.value, lngKeyColor: "16769216" }
  }
  console.log(MenuKeyList.value)
  showMenuKey()

}

const addScreenKeyf = () => {
  console.log(MenuKeyList.value)
  console.log(clickedRealIndex.value)
  const foraddIndex = MenuKeyList.value.findIndex(item => item.intKeySeq == (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1)
  console.log(foraddIndex)
  if (foraddIndex == -1) {
    MenuKeyList.value.push({ intKeyNo: 1, intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1, intPosNo: posNo.value, lngKeyscrNo: Number(currentSelectedMenuCode.value), strKeyName: currentSelectedMenuNm.value, lngKeyColor: "16769216" })
  } else {
    MenuKeyList.value[foraddIndex] = { intKeyNo: 1, intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1, intPosNo: posNo.value, lngKeyscrNo: Number(currentSelectedMenuCode.value), strKeyName: currentSelectedMenuNm.value, lngKeyColor: "16769216" }
  }
  console.log(MenuKeyList.value)
  showScreenNm.value = false
  showMenuKey()

}

const addTLUKey = () => {
  console.log(MenuKeyList.value)
  const foraddIndex = MenuKeyList.value.findIndex(item => item.intKeySeq == clickedRealIndex.value)
  console.log(foraddIndex)
  if (foraddIndex == -1) {
    MenuKeyList.value.push({ intKeyNo: 6, intKeySeq: clickedRealIndex.value + 1, intPosNo: posNo.value, intScreenNo: clickedintScreenNo.value, lngKeyscrNo: Number(clickedTLUCD.value), strKeyName: clickedTLUNM.value })
  } else {
    MenuKeyList.value[foraddIndex] = { intKeyNo: 6, intKeySeq: clickedRealIndex.value + 1, intPosNo: posNo.value, intScreenNo: clickedintScreenNo.value, lngKeyscrNo: Number(clickedTLUCD.value), strKeyName: clickedTLUNM.value }
  }
  showMenuKey(clickedintScreenNo.value)
}

const showMenus = (value) => {
  if (value == 1) {
    currentMenuorTLU.value = false
    currentMenu.value = value
  } else if (value == 2) {
    currentMenuorTLU.value = true
    currentMenu.value = value
    showMenuKeys2()
    showMenuKeys3()
  } else {
    currentMenu.value = value
  }
}
const deletekey = () => {
  if (clickedScreenOrMenu.value == true) {
    const filteredMenuKeyList = MenuKeyList.value.filter(item => item.intKeySeq != clickedRealIndex.value + 1)
    MenuKeyList.value = filteredMenuKeyList
    showMenuKey()


  }
}

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true
}
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false
}
const handleinitAll = (newvalue) => {
  afterSearch.value = false
  MenuList.value = []
  MenuGroup.value = []
  SubMenuGroup.value = []
  MenuKeyList.value = []
  ScreenKeyOrigin.value = []
  TLUList.value = []
  AllscreenKeyPage.value = '1'
  MenuList.value = []
  ScreenKeys.value = []
  items.value = []
  showMenuKeyList.value = []
  nowStoreAreaCd.value = '0'
  posNo.value = '0'
}
watch(forsearchSub, (newvalue) => {
  searchMenuList3()
})
</script>


<style scoped></style>

<!-- /*--############################################################################
  # Filename : MST37_073INS.vue
  # Description : 마스터관리 > 메뉴 마스터 > 메뉴 등록 관리
  # Date :2026-09-03
  # Author : 권지안
################################################################################*/ -->
<template>
  <div
    class="mst73-page box-border flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1">
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
      <PageName></PageName>
      <div class="flex flex-wrap items-center justify-end gap-2 pr-5 mr-9">
        <button type="button" class="button search md:w-auto w-14">조회</button>
        <button type="button" class="button save w-auto">저장</button>
        <button type="button" class="button copy w-auto">메뉴 복사</button>
      </div>
    </div>

    <div
      class="z-10 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-12 py-4">
      <div class="mst73-search-grid min-w-0">
        <div class="mst73-cell">
          <span class="mst73-sg-label">매장명</span>
          <div class="mst73-cell-field mst73-pick-slot min-w-0">
            <PickStore
              compactSearchBar
              main-name="매장명"
              :hidesub="hidesub"
              :hideAttr="hideAttr"
              @update:storeGroup="lngStoreGroup"
              @update:storeCd="handleStoreCd"
              @storeNm="handlestoreNm"
              @update:ischanged="handleinitAll"
              @update:ischanged2="searchinit">
            </PickStore>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 px-4 pb-2 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:gap-6 lg:px-6">
      <div class="flex min-h-0 min-w-0 flex-col">
        <div
          class="mb-2 flex min-h-[2.75rem] flex-none items-center justify-between border-b border-gray-300 pb-2">
          <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">
            메뉴 목록
          </h2>
          <div class="flex gap-2">
            <button type="button" class="whitebutton mst73-sub-btn" @click="addRow">
              추가
            </button>
            <button type="button" class="whitebutton mst73-sub-btn" @click="deleteRow">
              삭제
            </button>
          </div>
        </div>

        <div class="mst73-filter-stack mb-2 w-full min-w-0">
          <div class="mst73-cell">
            <span class="mst73-sg-label">메뉴명/코드</span>
            <div class="mst73-cell-field min-w-0">
              <input
                type="text"
                class="mst73-control w-full"
                v-model="listSearch"
                placeholder="" />
            </div>
          </div>
        </div>

        <div class="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white">
          <div class="mst73-list-head">
            <span>상품코드</span>
            <span>상품명</span>
          </div>
          <div class="mst73-list-body">
            <button
              v-for="item in filteredMenuList"
              :key="item.productCode"
              type="button"
              class="mst73-list-row"
              :class="{ 'is-active': selectedCode === item.productCode }"
              @click="selectMenu(item)">
              <span>{{ item.productCode }}</span>
              <span>{{ item.productNameKo }}</span>
            </button>
            <div v-if="!filteredMenuList.length" class="mst73-list-empty">
              조회된 메뉴가 없습니다.
            </div>
          </div>
        </div>
      </div>

      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="flex flex-none gap-1 border-b border-gray-300">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="contents_tab-button"
            :class="{ 'text-blue-600': activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

        <div class="mst73-detail-panel min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 pt-3">
          <div v-show="activeTab === 'basic'" class="min-w-0">
            <div class="mst73-section-title">기본정보</div>
            <div class="mst73-form-grid mt-3 w-full">
              <div class="mst73-form-label mst73-form-label--required">*메뉴 코드</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full disabled:bg-gray-100" type="text" v-model="form.productCode" disabled />
              </div>
              <div class="mst73-form-label mst73-form-label--required">*메뉴명 (국)</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full" type="text" v-model="form.productNameKo" />
              </div>

              <div class="mst73-form-label">메뉴 주방 출력명</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full" type="text" v-model="form.kitchenName" />
              </div>
              <div class="mst73-form-label">메뉴명 (영)</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full" type="text" v-model="form.productNameEn" />
              </div>

              <div class="mst73-form-label">상품 정가</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full" type="text" v-model="form.listPrice" />
              </div>
              <div class="mst73-form-label">판매가</div>
              <div class="mst73-form-value">
                <input class="mst73-control w-full" type="text" v-model="form.salePrice" />
              </div>
            </div>

            <div class="mst73-section-title mt-5">판매설정</div>
            <div class="mst73-form-grid mt-3 w-full">
              <div class="mst73-form-label mst73-form-label--required">*카테고리 선택</div>
              <div class="mst73-field-span3 mst73-form-value flex min-w-0 gap-2">
                <select class="mst73-control min-w-0 flex-1" v-model="form.category">
                  <option value="hidden2">히든메뉴2(세트)</option>
                  <option value="hidden1">히든메뉴1</option>
                  <option value="main">메인메뉴</option>
                  <option value="drink">주류</option>
                </select>
                <button type="button" class="whitebutton mst73-sub-btn shrink-0">
                  세트메뉴옵션추가
                </button>
              </div>

              <div class="mst73-form-label mst73-form-label--required">*상품 유형</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-type-single"
                  ><input type="radio" id="mst73-type-single" name="productType" value="single" v-model="form.productType" />단품</label
                >
                <label for="mst73-type-set"
                  ><input type="radio" id="mst73-type-set" name="productType" value="set" v-model="form.productType" />세트</label
                >
                <label for="mst73-type-option"
                  ><input type="radio" id="mst73-type-option" name="productType" value="option" v-model="form.productType" />옵션</label
                >
              </div>

              <div class="mst73-form-label">상품 특성</div>
              <div class="mst73-field-span3 mst73-form-value mst73-form-value--inline">
                <label for="mst73-trait-voucher"
                  ><input type="checkbox" id="mst73-trait-voucher" v-model="form.traits.mobileVoucher" />모바일 상품권</label
                >
                <label for="mst73-trait-member"
                  ><input type="checkbox" id="mst73-trait-member" v-model="form.traits.membership" />멤버십</label
                >
                <label for="mst73-trait-main"
                  ><input type="checkbox" id="mst73-trait-main" v-model="form.traits.mainMenu" />메인 메뉴</label
                >
                <label for="mst73-trait-adult"
                  ><input type="checkbox" id="mst73-trait-adult" v-model="form.traits.adultOnly" />19세 미만 판매금지</label
                >
                <label for="mst73-trait-spicy"
                  ><input type="checkbox" id="mst73-trait-spicy" v-model="form.traits.spicy" />맵기</label
                >
                <select class="mst73-control ml-2 min-w-0 flex-1" v-model="form.spicyLevel">
                  <option value="">-선택-</option>
                  <option value="1">1단계</option>
                  <option value="2">2단계</option>
                  <option value="3">3단계</option>
                </select>
              </div>

              <div class="mst73-form-label mst73-form-label--with-info">
                <span>구매 조건</span>
                <span class="mst73-info-tooltip-host">
                  <button
                    type="button"
                    class="mst73-info-btn"
                    @click.stop="toggleInfo('purchase')"
                    aria-label="구매 조건 안내">
                    <img src="@/assets/images/ic-info.svg" alt="" class="mst73-info-btn__icon" aria-hidden="true" />
                  </button>
                  <span v-show="infoTip === 'purchase'" class="mst73-info-tooltip" role="tooltip">
                    메뉴 주문 시 적용할 구매 조건을 선택합니다.
                  </span>
                </span>
              </div>
              <div class="mst73-field-span3 mst73-form-value mst73-form-value--inline">
                <label for="mst73-buy-main"
                  ><input type="checkbox" id="mst73-buy-main" v-model="form.purchase.mainRequired" />메인 메뉴 필수</label
                >
                <label for="mst73-buy-four"
                  ><input type="checkbox" id="mst73-buy-four" v-model="form.purchase.onePerFour" />4인 기준 1개 선택</label
                >
                <label for="mst73-buy-one"
                  ><input type="checkbox" id="mst73-buy-one" v-model="form.purchase.onlyOne" />1개만 주문가능</label
                >
                <label for="mst73-buy-event"
                  ><input type="checkbox" id="mst73-buy-event" v-model="form.purchase.noEventDup" />이벤트 중복 참여 불가</label
                >
                <label for="mst73-buy-n"
                  ><input type="checkbox" id="mst73-buy-n" v-model="form.purchase.minServings" />N인분이상 주문</label
                >
              </div>

              <div class="mst73-form-label">판매 상태</div>
              <div class="mst73-field-span3 mst73-form-value mst73-form-value--inline">
                <label for="mst73-sale-selling"
                  ><input type="radio" id="mst73-sale-selling" name="saleStatus" value="selling" v-model="form.saleStatus" />판매중</label
                >
                <label for="mst73-sale-stopped"
                  ><input type="radio" id="mst73-sale-stopped" name="saleStatus" value="stopped" v-model="form.saleStatus" />판매중단</label
                >
                <label for="mst73-sale-soldout"
                  ><input type="radio" id="mst73-sale-soldout" name="saleStatus" value="soldout" v-model="form.saleStatus" />품절</label
                >
                <label for="mst73-sale-today"
                  ><input type="radio" id="mst73-sale-today" name="saleStatus" value="soldoutToday" v-model="form.saleStatus" />품절 (오늘 하루)</label
                >
                <label for="mst73-sale-month"
                  ><input type="radio" id="mst73-sale-month" name="saleStatus" value="soldoutMonth" v-model="form.saleStatus" />품절 (한 달)</label
                >
              </div>

              <div class="mst73-form-label mst73-form-label--with-info">
                <span>필요주문금액설정</span>
                <span class="mst73-info-tooltip-host">
                  <button
                    type="button"
                    class="mst73-info-btn"
                    @click.stop="toggleInfo('minOrder')"
                    aria-label="필요주문금액설정 안내">
                    <img src="@/assets/images/ic-info.svg" alt="" class="mst73-info-btn__icon" aria-hidden="true" />
                  </button>
                  <span v-show="infoTip === 'minOrder'" class="mst73-info-tooltip" role="tooltip">
                    이 메뉴를 주문하려면 필요한 최소 주문금액을 설정합니다.
                  </span>
                </span>
              </div>
              <div class="mst73-field-span3 mst73-form-value mst73-form-value--inline">
                <label for="mst73-min-y"
                  ><input type="radio" id="mst73-min-y" name="minOrder" value="Y" v-model="form.minOrderAmount" />사용함</label
                >
                <label for="mst73-min-n"
                  ><input type="radio" id="mst73-min-n" name="minOrder" value="N" v-model="form.minOrderAmount" />사용 안함</label
                >
              </div>

              <div class="mst73-form-label">노출 여부</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-vis-y"
                  ><input type="radio" id="mst73-vis-y" name="visible" value="Y" v-model="form.visible" />노출</label
                >
                <label for="mst73-vis-n"
                  ><input type="radio" id="mst73-vis-n" name="visible" value="N" v-model="form.visible" />미노출</label
                >
              </div>
              <div class="mst73-form-label">노출기간</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-period-none"
                  ><input type="radio" id="mst73-period-none" name="visiblePeriod" value="none" v-model="form.visiblePeriod" />설정 안함</label
                >
                <label for="mst73-period-set"
                  ><input type="radio" id="mst73-period-set" name="visiblePeriod" value="period" v-model="form.visiblePeriod" />기간 설정</label
                >
                <label for="mst73-period-week"
                  ><input type="radio" id="mst73-period-week" name="visiblePeriod" value="weekday" v-model="form.visiblePeriod" />요일/시간대 설정</label
                >
              </div>

              <div class="mst73-form-label">뱃지</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-badge-sig"
                  ><input type="checkbox" id="mst73-badge-sig" v-model="form.badges.signature" />시그니처</label
                >
                <label for="mst73-badge-chef"
                  ><input type="checkbox" id="mst73-badge-chef" v-model="form.badges.chef" />셰프 추천</label
                >
                <label for="mst73-badge-veg"
                  ><input type="checkbox" id="mst73-badge-veg" v-model="form.badges.veg" />베지테리안</label
                >
                <label for="mst73-badge-season"
                  ><input type="checkbox" id="mst73-badge-season" v-model="form.badges.season" />시즌메뉴</label
                >
                <label for="mst73-badge-trad"
                  ><input type="checkbox" id="mst73-badge-trad" v-model="form.badges.traditional" />전통주</label
                >
              </div>
              <div class="mst73-form-label">수량 증감 여부</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-qty-y"
                  ><input type="radio" id="mst73-qty-y" name="qtyControl" value="Y" v-model="form.qtyControl" />제공</label
                >
                <input
                  class="mst73-control mst73-control--qty"
                  type="number"
                  min="0"
                  v-model="form.qtyStep"
                  :disabled="form.qtyControl !== 'Y'" />
                <label for="mst73-qty-n"
                  ><input type="radio" id="mst73-qty-n" name="qtyControl" value="N" v-model="form.qtyControl" />제공 안함</label
                >
              </div>

              <div class="mst73-form-label">옵션 사용</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <label for="mst73-opt-y"
                  ><input type="radio" id="mst73-opt-y" name="useOption" value="Y" v-model="form.useOption" />사용함</label
                >
                <label for="mst73-opt-n"
                  ><input type="radio" id="mst73-opt-n" name="useOption" value="N" v-model="form.useOption" />사용 안함</label
                >
              </div>
              <div class="mst73-form-label">옵션 선택 조건 SKIP</div>
              <div class="mst73-form-value mst73-form-value--inline">
                <span class="mst73-hint">관리자모드에서 옵션을 제약없이 주문/수정 할 수 있습니다.</span>
                <label for="mst73-skip-y"
                  ><input type="radio" id="mst73-skip-y" name="skipOption" value="Y" v-model="form.skipOption" />Y</label
                >
                <label for="mst73-skip-n"
                  ><input type="radio" id="mst73-skip-n" name="skipOption" value="N" v-model="form.skipOption" />N</label
                >
              </div>
            </div>
          </div>

          <div v-show="activeTab !== 'basic'" class="mst73-empty">
            {{ emptyTabLabel }} 화면은 추후 구성 예정입니다.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { insertPageLog } from "@/customFunc/customFunc";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";

const store = useStore();

const hidesub = ref(true);
const hideAttr = ref(true);
const listSearch = ref("");
const selectedCode = ref("21250200");
const infoTip = ref("");

const tabs = [
  { id: "basic", label: "상품 기본정보" },
  { id: "detail", label: "상품 상세정보" },
  { id: "notice", label: "상품 고시정보" },
  { id: "recommend", label: "추천상품" },
  { id: "popup", label: "팝업정보" },
];

const activeTab = ref("basic");

const emptyTabLabel = computed(() => {
  const tab = tabs.find((item) => item.id === activeTab.value);
  return tab ? tab.label : "";
});

const makeForm = (partial = {}) => ({
  brandName: "와일드플라워",
  storeName: "와일드플라워",
  productCode: "",
  productNameKo: "",
  kitchenName: "",
  productNameEn: "",
  listPrice: "",
  salePrice: "",
  category: "main",
  productType: "single",
  traits: {
    mobileVoucher: false,
    membership: false,
    mainMenu: false,
    adultOnly: false,
    spicy: false,
  },
  spicyLevel: "",
  purchase: {
    mainRequired: false,
    onePerFour: false,
    onlyOne: false,
    noEventDup: false,
    minServings: false,
  },
  saleStatus: "selling",
  minOrderAmount: "N",
  visible: "Y",
  visiblePeriod: "none",
  badges: {
    signature: false,
    chef: false,
    veg: false,
    season: false,
    traditional: false,
  },
  qtyControl: "Y",
  qtyStep: 10,
  useOption: "N",
  skipOption: "N",
  ...partial,
  traits: { ...{
    mobileVoucher: false,
    membership: false,
    mainMenu: false,
    adultOnly: false,
    spicy: false,
  }, ...(partial.traits || {}) },
  purchase: { ...{
    mainRequired: false,
    onePerFour: false,
    onlyOne: false,
    noEventDup: false,
    minServings: false,
  }, ...(partial.purchase || {}) },
  badges: { ...{
    signature: false,
    chef: false,
    veg: false,
    season: false,
    traditional: false,
  }, ...(partial.badges || {}) },
});

const menuList = ref([
  makeForm({
    productCode: "21250200",
    productNameKo: "아홉쌀 막걸리 500ml",
    productNameEn: "Mackguli (Korea Traditional Sool) 500ml",
    listPrice: "32,000 원",
    salePrice: "27,000 원",
    category: "hidden2",
    traits: { mainMenu: true },
  }),
  makeForm({
    productCode: "21250101",
    productNameKo: "시그니처 안주 세트",
    productNameEn: "Signature Side Set",
    listPrice: "48,000 원",
    salePrice: "42,000 원",
    productType: "set",
    traits: { mainMenu: true },
    badges: { signature: true, chef: true },
  }),
  makeForm({
    productCode: "21250102",
    productNameKo: "생맥주 500ml",
    productNameEn: "Draft Beer 500ml",
    listPrice: "8,000 원",
    salePrice: "7,000 원",
    category: "drink",
    traits: { adultOnly: true },
  }),
]);

const form = reactive(makeForm(menuList.value[0]));

const filteredMenuList = computed(() => {
  const word = listSearch.value.trim();
  if (!word) return menuList.value;
  return menuList.value.filter(
    (item) =>
      String(item.productCode).includes(word) ||
      String(item.productNameKo).includes(word)
  );
});

const assignForm = (item) => {
  Object.assign(form, makeForm(item));
};

const selectMenu = (item) => {
  selectedCode.value = item.productCode;
  assignForm(item);
  activeTab.value = "basic";
};

const addRow = () => {
  const next = makeForm({
    productCode: String(21000000 + menuList.value.length + 1),
    productNameKo: "신규 메뉴",
  });
  menuList.value = [...menuList.value, next];
  selectMenu(next);
};

const deleteRow = () => {
  if (!selectedCode.value) return;
  menuList.value = menuList.value.filter((item) => item.productCode !== selectedCode.value);
  if (menuList.value[0]) selectMenu(menuList.value[0]);
};

const toggleInfo = (key) => {
  infoTip.value = infoTip.value === key ? "" : key;
};

const lngStoreGroup = () => {};
const handleStoreCd = () => {};
const handlestoreNm = () => {};
const handleinitAll = () => {};
const searchinit = () => {};

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});
</script>

<style scoped>
.mst73-page {
  --mst73-label-col: 7rem;
  --mst73-item-gap: 0.75rem;
  --mst73-control-border: #cbd5e1;
  --mst73-control-focus-border: #3b82f6;
  --mst73-control-h: 1.75rem;
  --mst73-control-radius: 0.375rem;
  --mst73-cell-py: 0.125rem;
}

.mst73-search-grid {
  width: 100%;
  min-width: 0;
  --mst73-control-h: 2rem;
}

.mst73-search-grid .mst73-cell {
  max-width: 52rem;
}

.mst73-filter-stack {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mst73-item-gap);
}

.mst73-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--mst73-item-gap);
}

.mst73-sg-label {
  flex: 0 0 var(--mst73-label-col);
  width: var(--mst73-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.mst73-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst73-control {
  box-sizing: border-box;
  height: var(--mst73-control-h);
  min-height: var(--mst73-control-h);
  max-height: var(--mst73-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--mst73-control-radius);
  border: 1px solid var(--mst73-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
}

.mst73-page select.mst73-control,
.mst73-page input.mst73-control {
  border: 1px solid var(--mst73-control-border) !important;
  border-radius: var(--mst73-control-radius) !important;
}

.mst73-control:focus,
.mst73-control:focus-visible {
  border-color: var(--mst73-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst73-control:disabled {
  background: #f3f4f6;
}

.mst73-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem !important;
}

.mst73-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

.mst73-pick-slot :deep(select),
.mst73-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst73-control-h) !important;
  min-height: var(--mst73-control-h) !important;
  max-height: var(--mst73-control-h) !important;
  border: 1px solid var(--mst73-control-border) !important;
  border-radius: var(--mst73-control-radius) !important;
}

.mst73-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.mst73-detail-panel {
  --mst73-detail-control-h: 1.625rem;
  --mst73-detail-font: 0.8125rem;
  --mst73-detail-row-h: 2.5rem;
  --mst73-detail-cell-py: 0.4375rem;
  --mst73-detail-scrollbar-thumb: #1e40af;
  --mst73-detail-scrollbar-thumb-hover: #1e3a8a;
  --mst73-detail-scrollbar-track: #e8eef7;
  scrollbar-width: auto;
  scrollbar-color: var(--mst73-detail-scrollbar-thumb) var(--mst73-detail-scrollbar-track);
}

.mst73-detail-panel::-webkit-scrollbar {
  width: 0.75rem;
}

.mst73-detail-panel::-webkit-scrollbar-track {
  background: var(--mst73-detail-scrollbar-track);
  border-radius: 0.375rem;
}

.mst73-detail-panel::-webkit-scrollbar-thumb {
  background: var(--mst73-detail-scrollbar-thumb);
  border-radius: 0.375rem;
  border: 2px solid var(--mst73-detail-scrollbar-track);
}

.mst73-form-grid {
  display: grid;
  grid-template-columns: var(--mst73-label-col) minmax(0, 1fr) var(--mst73-label-col) minmax(0, 1fr);
  grid-auto-rows: var(--mst73-detail-row-h, 2.5rem);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst73-detail-panel .mst73-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst73-detail-row-h);
  align-self: stretch;
}

.mst73-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst73-detail-row-h, 2rem);
  padding: var(--mst73-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst73-detail-font, 0.8125rem);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.mst73-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst73-form-label--with-info {
  gap: 0.375rem;
}

.mst73-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst73-detail-row-h, 2rem);
  min-width: 0;
  padding: var(--mst73-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst73-form-value--inline {
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.875rem;
}

.mst73-detail-panel .mst73-form-value--inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst73-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.mst73-detail-panel .mst73-form-value--inline input[type="radio"],
.mst73-detail-panel .mst73-form-value--inline input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  min-height: 0;
  margin: 0;
  flex-shrink: 0;
  accent-color: #5782ff;
}

.mst73-field-span3 {
  grid-column: 2 / -1;
  min-width: 0;
}

.mst73-detail-panel .mst73-form-grid .mst73-control {
  height: var(--mst73-detail-control-h);
  min-height: var(--mst73-detail-control-h);
  max-height: var(--mst73-detail-control-h);
  font-size: var(--mst73-detail-font);
  line-height: 1.2;
}

.mst73-control--qty {
  width: 4.5rem;
  max-width: 4.5rem;
  text-align: center;
}

.mst73-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  padding: 0 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: #374151;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  background: #fff;
}

.mst73-sub-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst73-detail-panel .mst73-form-grid .mst73-sub-btn {
  font-size: var(--mst73-detail-font);
}

.mst73-info-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.75rem;
  height: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.mst73-info-btn__icon {
  display: block;
  width: 100%;
  height: 100%;
}

.mst73-info-tooltip-host {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.mst73-info-tooltip {
  position: absolute;
  left: 50%;
  top: calc(100% + 0.375rem);
  z-index: 30;
  width: max-content;
  max-width: 14rem;
  transform: translateX(-50%);
  border-radius: 0.375rem;
  background-color: #1e293b;
  padding: 0.375rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1.35;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.18);
  pointer-events: none;
  white-space: nowrap;
}

.mst73-hint {
  color: #6b7280;
  font-size: var(--mst73-detail-font, 0.8125rem);
}

.mst73-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.9375rem;
}

.mst73-list-head,
.mst73-list-row {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
  padding: 0 0.75rem;
  min-height: 2.25rem;
}

.mst73-list-head {
  background: #edf2f7;
  color: #5c5c5c;
  font-size: 0.8125rem;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
}

.mst73-list-body {
  height: 100%;
  overflow: auto;
}

.mst73-list-row {
  width: 100%;
  border: 0;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
  color: #111827;
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
}

.mst73-list-row:hover {
  background: #eff6ff;
}

.mst73-list-row.is-active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.mst73-list-empty {
  padding: 2rem 0.75rem;
  color: #9ca3af;
  font-size: 0.8125rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .mst73-form-grid {
    grid-template-columns: 7rem minmax(0, 1fr);
  }

  .mst73-field-span3 {
    grid-column: 2;
  }
}
</style>

<!-- /*--############################################################################
# Filename : PUR03_006INS.vue                                                  
# Description : 마스터관리 > 발주 관리 > 발주 등록Ⅱ(발주일기준)                     
# Date :2025-08-25                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="br12 po-page">
    <button
      ref="pur306FocusSinkRef"
      type="button"
      class="pur306-focus-sink"
      tabindex="-1"
      aria-hidden="true" />
    <div class="pd24 flex-between sub-header">
      <PageName></PageName>
      <div class="flex justify-center space-x-2 pr-5">
        <!-- <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="saveButton" class="button save w-auto">저장</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
      </div>
    </div>

    <div class="page-scroll pd24 pt0 flex min-h-0 flex-1 flex-col">
      <div
        class="pur306-search-panel shrink-0"
        :style="{
          '--pur306-control-border': pur306ControlBorder,
          '--pur306-label-col': pur306LabelCol,
          '--pur306-item-gap': pur306ItemGap,
          '--pur306-col-gap': pur306ColGap,
          '--pur306-row-gap': pur306RowGap,
          '--pur306-pair-gap': pur306PairGap,
        }">
        <div class="pur306-search-grid min-w-0">
          <div class="pur306-block pur306-block--order min-w-0">
            <div class="pur306-row pur306-row--order1 min-w-0">
              <div class="pur306-sg-label pur306-req">매장</div>
              <div
                class="pur306-cell-field pur306-pick-slot pur306-pick-slot--store-grid min-w-0">
                <PickStore
                  ref="pickStoreRef"
                  compact-search-bar
                  :compact-store-combo-max-rem="pur306PickStoreComboMaxRem"
                  main-name=""
                  @update:storeGroup="handleStoreGroup"
                  @update:storeCd="handleStoreCd"
                  @storeNm="handlestoreNm"
                  :defaultStoreNm="'선택'"
                  :defaultStoreType2="true"
                  :defaultStore="true" />
              </div>
              <div class="pur306-sg-label pur306-req pur306-sg-label--danger">
                발주일자
              </div>
              <div class="pur306-cell-field pur306-inline-field pur306-date-field min-w-0">
                <input
                  ref="pur306OrderDateRef"
                  type="date"
                  class="pur306-sg-input pur306-sg-input--date"
                  v-model="cond"
                  @change="onOrderDateChange"
                  @keydown.enter.prevent="onOrderDateEnter" />
                <button type="button" class="pur306-sub-btn" @click="searchButton">
                  발주조회
                </button>
              </div>
            </div>

            <div class="pur306-row pur306-row--order2 min-w-0">
              <div class="pur306-sg-label pur306-sg-label--danger">발주마감일시</div>
              <div class="pur306-cell-field pur306-deadline-field min-w-0">
                <input
                  type="text"
                  class="pur306-sg-input pur306-sg-input--danger pur306-sg-input--deadline"
                  v-model="cond2"
                  disabled />
              </div>
              <div class="pur306-order2-gap" aria-hidden="true"></div>
              <div class="pur306-sg-label">코멘트(발주)</div>
              <div class="pur306-cell-field pur306-order2-comment-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond3" />
              </div>
            </div>

            <div class="pur306-row pur306-row--order3 min-w-0">
              <div class="pur306-sg-label">공급가</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond4" disabled />
              </div>
              <div class="pur306-sg-label">부가세</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond5" disabled />
              </div>
              <div class="pur306-sg-label">합계</div>
              <div class="pur306-cell-field min-w-0">
                <input type="text" class="pur306-sg-input" v-model="cond6" disabled />
              </div>
            </div>
          </div>

          <div class="pur306-block pur306-block--mat min-w-0">
            <div class="pur306-row pur306-row--mat1 min-w-0">
              <div class="pur306-sg-label pur306-req">자재목록</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond7">
                  <option value="0">전체</option>
                  <option :value="i.strDCode" v-for="i in optionList" :key="i.strDCode">
                    {{ i.strDName }}
                  </option>
                </select>
              </div>
              <div class="pur306-sg-label">거래처</div>
              <div class="pur306-cell-field pur306-bc-slot min-w-0">
                <BusinessClient2
                  compact-search-bar
                  :default-nm="'전체'"
                  @SupplierId="SupplierId" />
              </div>
              <div class="pur306-sg-label">자재분류</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond9">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngCategoryID"
                    v-for="i in optionList3"
                    :key="i.lngCategoryID">
                    {{ i.strCategoryName }}
                  </option>
                </select>
              </div>
              <div class="pur306-sg-label">자재그룹</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond10">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngStockGroupID"
                    v-for="i in optionList4"
                    :key="i.lngStockGroupID">
                    {{ i.strStockGroupName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="pur306-row pur306-row--mat2 min-w-0">
              <div class="pur306-sg-label">자재특성</div>
              <div class="pur306-cell-field min-w-0">
                <select class="pur306-sg-select" v-model="cond11">
                  <option value="0">전체</option>
                  <option
                    :value="i.lngGenericID"
                    v-for="i in optionList5"
                    :key="i.lngGenericID">
                    {{ i.strGenericName }}
                  </option>
                </select>
              </div>
              <div class="pur306-mat2-code-pair min-w-0">
                <div class="pur306-sg-label">자재코드/명</div>
                <div class="pur306-cell-field pur306-mat-code-field min-w-0">
                  <input
                    type="text"
                    class="pur306-sg-input pur306-sg-input--code"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    v-model="cond12"
                    @input="onMatCodeInput"
                    @keydown.enter.prevent="onPur306MaterialSearchEnter" />
                  <input
                    type="text"
                    class="pur306-sg-input pur306-sg-input--name"
                    :value="pur306NameComposing ? pur306NameKeyword : cond13"
                    @compositionstart="onMatNameCompositionStart"
                    @compositionupdate="onMatNameLiveInput"
                    @compositionend="onMatNameCompositionEnd"
                    @input="onMatNameLiveInput"
                    @keydown.enter.prevent="onPur306MaterialSearchEnter" />
                </div>
                <button
                  type="button"
                  class="pur306-sub-btn pur306-mat-code-search-btn"
                  :class="{ 'pur306-mat-code-search-btn--pending': pur306MaterialSearchPending }"
                  @click="searchButton2">
                  조회
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 그리드 영역 -->
      <div
        class="pur306-grid-layout mt-1 grid min-h-0 min-w-0 flex-1 grid-cols-[12fr,1fr,12fr] grid-rows-1 justify-center">
      <div class="mt-0 flex min-h-0 min-w-0 flex-col">
        <div class="pur306-grid-bar flex shrink-0 justify-between bg-yellow-100">
          <div class="pur306-grid-title-row">
            <div class="pur306-grid-title shrink-0">검색 자재</div>
            <span class="pur306-dblclick-hint">자재코드나 자재명을 더블클릭하면 상세 정보를 확인할 수 있습니다.</span>
          </div>
          <div class="pur306-grid-actions">
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="addButton">추가</button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="excelButton">
              엑셀
            </button>
          </div>
        </div>
        <Realgrid
          class="pur306-grid-body min-h-0 w-full flex-1"
          :progname="'PUR03_006INS_VUE'"
          :progid="1"
          :rowData="rowData"
          @updatedRowData="updatedRowData"
          @sendRowState="sendRowState"
          @clickedRowData="clickedRowData"
          @dblclickedRowData="onSearchStockDblClick"
          @allStateRows="allStateRows"
          @clickedButtonCol="clickedButtonCol"
          @checkAllorNot="checkAllorNot"
          :cell-edit-qty-check-pair="pur306SearchQtyCheckPair"
          :exporttoExcel="exporttoExcel"
          :documentTitle="'PUR03_006INS'"
          :documentSubTitle="documentSubTitle"
          :editableColId="'dblOrderQty,strOrderComments'"
          :rowStateeditable="false"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :checkRenderEditable="true"
          :selectionStyle="'block'"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :inputUnsignedDecimalColumn="'dblOrderQty'"
          :changeNow="searchChangeNow"
          :changeRow="searchChangeRow"
          :changeColid="searchChangeColid"
          :changeValue2="searchChangeValue2"
          :searchWord3="pur306NameKeyword"
          searchColId="strStockName"
          hover-tooltip-fields="strStockName"
          :hover-tooltip-max-length="40"
          row-hover-pastel-tone="red" />
      </div>
      <div class="pur306-grid-transfer">
        <button
          type="button"
          class="pur306-transfer-btn"
          title="발주 자재로 추가"
          aria-label="발주 자재로 추가"
          @click="addButton">
          <svg class="pur306-transfer-icon" viewBox="0 0 640 640" aria-hidden="true">
            <path
              fill="currentColor"
              d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
          </svg>
        </button>
        <button
          type="button"
          class="pur306-transfer-btn"
          title="검색 자재로 되돌리기"
          aria-label="검색 자재로 되돌리기"
          @click="deleteButton">
          <svg class="pur306-transfer-icon" viewBox="0 0 640 640" aria-hidden="true">
            <path
              fill="currentColor"
              d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
          </svg>
        </button>
      </div>
      <div class="mt-0 flex min-h-0 min-w-0 flex-col">
        <div class="pur306-grid-bar flex shrink-0 justify-between bg-yellow-100">
          <div class="pur306-grid-title-row pur306-grid-title-row--center">
            <div class="pur306-grid-title shrink-0">발주 자재</div>
            <button
              type="button"
              class="pur306-expand-btn"
              data-pur306-order-expand
              :disabled="!pur306OrderExpandEnabled"
              :aria-label="pur306OrderExpandEnabled ? '발주 자재 크게 보기' : '발주 자재 없음'"
              :title="pur306OrderExpandEnabled ? undefined : '조회된 발주 자재가 없습니다'"
              @click="openOrderGridPopup($event)">
              <svg class="pur306-expand-icon" viewBox="0 0 40 40" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="10" y="10" width="20" height="20" />
                  <path d="M19.13 26.01h-5.26v-5.09" />
                  <path d="M13.87 26.01l5.26-5.26" />
                  <path d="M20.87 13.99h5.26v5.09" />
                  <path d="M26.13 13.99l-5.26 5.26" />
                </g>
              </svg>
              <span v-if="pur306OrderExpandEnabled" class="pur306-expand-tip" role="tooltip">크게 보기</span>
            </button>
          </div>
          <div class="pur306-grid-actions">
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="deleteButton">
              삭제
            </button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="saveButton">저장</button>
            <button type="button" class="pur306-sub-btn pur306-sub-btn--grid" @click="excelButton2">
              엑셀
            </button>
          </div>
        </div>
        <Realgrid
          class="pur306-grid-body min-h-0 w-full flex-1"
          :progname="'PUR03_006INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          @updatedRowData="updatedRowData2"
          @clickedRowData="clickedRowData2"
          @allStateRows="allStateRows2"
          :exporttoExcel="exporttoExcel2"
          :documentTitle="'PUR03_006INS'"
          :documentSubTitle="documentSubTitle"
          :editableColId="'dblOrderQty,strOrderComments'"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          :selectionStyle="'block'"
          :setFooter="true"
          highlight-new-rows
          :merge-column-width-scale2="pur306OrderColWidthScale"
          :notsoftDelete="true"
          :checkRowAuto="false"
          :checkRowAuto2="true"
          :CalculateTaxColId="'curTax'"
          :CalculateTaxColId2="'curSupply'"
          :CalculateTaxColId3="'curTotal'"
          :deleteRow7="deleteRow7"
          delete-checked-field="lngCheck"
          :addRow4="addRow4"
          :add-row4-insert-index="addRow4InsertIndex"
          :addrowProp="'lngStockID,strStockName,strStandardName,strUnitName,curUnitPrice,dblOrderQty,curSupply,curTax,curTotal,strOrderComments,strGenericName,strSupplierName,dtmExpectedDate,lngStoreGroup,lngStoreCode,strOrderNo,lngOrderSeq,lngSupplierID,dblCheckQty,strStatus,strDemandNo,strCheckComments,lngGenericID,lngOrderAble,lngTaxType,dtmOrderDate'"
          :addrowValues="addrowValues"
          :addrowDefault="addrowDefault"
          :inputUnsignedDecimalColumn="'dblOrderQty'"
          :changeNow="orderChangeNow"
          :changeRow="orderChangeRow"
          :changeColid="orderChangeColid"
          :changeValue2="orderChangeValue2"
          hover-tooltip-fields="strStockName"
          :hover-tooltip-max-length="40"
          row-hover-pastel-tone="red" />
      </div>
    </div>
    </div>
    <Teleport to="body">
      <div
        v-if="stockDetailOpen"
        class="pur306-detail-backdrop">
        <div
          class="pur306-detail-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pur306-detail-title"
          :style="stockDetailDialogStyle()"
          @keydown.esc="closeStockDetail">
          <div
            class="pur306-detail-head"
            @pointerdown="onStockDetailDragStart"
            @pointermove="onStockDetailDragMove"
            @pointerup="onStockDetailDragEnd"
            @pointercancel="onStockDetailDragEnd">
            <h2 id="pur306-detail-title" class="pur306-detail-title">자재 상세</h2>
          </div>
          <div class="pur306-detail-body">
            <section class="pur306-detail-basis" aria-label="발주일자, 발주마감일시, 매장명">
              <dl class="pur306-detail-basis-grid">
                <div>
                  <dt>발주일자</dt>
                  <dd>{{ cond }}</dd>
                </div>
                <div>
                  <dt>발주마감일시</dt>
                  <dd>{{ cond2 }}</dd>
                </div>
                <div>
                  <dt>매장명</dt>
                  <dd>{{ clickedStoreNm }}</dd>
                </div>
              </dl>
            </section>
            <dl class="pur306-detail-grid">
              <div>
                <dt>자재코드</dt>
                <dd>{{ stockDetail.lngStockID }}</dd>
              </div>
              <div>
                <dt>자재명</dt>
                <dd>{{ stockDetail.strStockName }}</dd>
              </div>
              <div>
                <dt>규격</dt>
                <dd>{{ stockDetail.strStandardName }}</dd>
              </div>
              <div>
                <dt>단위</dt>
                <dd>{{ stockDetail.strUnitName }}</dd>
              </div>
              <div>
                <dt>단가</dt>
                <dd>{{ formatPur306DetailPrice(stockDetail.curUnitPrice) }}</dd>
              </div>
              <div>
                <dt>거래처</dt>
                <dd>{{ stockDetail.strSupplierName }}</dd>
              </div>
              <div>
                <dt>자재분류</dt>
                <dd>{{ stockDetail.strGenericName }}</dd>
              </div>
              <div>
                <dt>납기예정일</dt>
                <dd>{{ formatPur306DetailDate(stockDetail.dtmExpectedDate) }}</dd>
              </div>
            </dl>
            <label class="pur306-detail-field">
              <span class="pur306-detail-field-title">발주수량</span>
              <input
                ref="stockDetailQtyRef"
                :value="stockDetailQty"
                type="text"
                inputmode="decimal"
                lang="en"
                autocomplete="off"
                class="pur306-detail-input"
                @keydown="onStockDetailQtyKeydown"
                @beforeinput="onStockDetailQtyBeforeInput"
                @paste="onStockDetailQtyPaste"
                @compositionstart="onStockDetailQtyCompositionStart"
                @compositionupdate="onStockDetailQtyCompositionUpdate"
                @compositionend="onStockDetailQtyCompositionEnd"
                @input="onStockDetailQtyInput" />
            </label>
            <label class="pur306-detail-field">
              <span class="pur306-detail-field-title">메모</span>
              <input
                v-model="stockDetailMemo"
                type="text"
                class="pur306-detail-input"
                maxlength="200"
                autocomplete="off" />
            </label>
            <p class="pur306-detail-note">확인하면 검색 자재의 발주수량과 메모에 반영됩니다. 수량이 있으면 해당 행이 체크됩니다.</p>
          </div>
          <div class="pur306-detail-actions">
            <button type="button" class="pur306-detail-btn" @click="closeStockDetail">취소</button>
            <button type="button" class="pur306-detail-btn pur306-detail-btn--ok" @click="applyStockDetail">확인</button>
          </div>
          <div
            class="pur306-detail-resize"
            title="크기 조절"
            @pointerdown.stop="onStockDetailResizeStart"
            @pointermove="onStockDetailResizeMove"
            @pointerup="onStockDetailResizeEnd"
            @pointercancel="onStockDetailResizeEnd"></div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div
        v-if="orderGridOpen"
        class="pur306-detail-backdrop pur306-order-pop-backdrop"
        :class="{ 'pur306-order-pop-backdrop--in': orderPopDim }">
        <div
          ref="orderGridDialogEl"
          class="pur306-detail-dialog pur306-order-pop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pur306-order-pop-title"
          :style="orderGridDialogStyle()"
          @keydown.esc="closeOrderGridPopup">
          <div
            class="pur306-detail-head"
            @pointerdown="onOrderGridDragStart"
            @pointermove="onOrderGridDragMove"
            @pointerup="onOrderGridDragEnd"
            @pointercancel="onOrderGridDragEnd">
            <h2 id="pur306-order-pop-title" class="pur306-detail-title">발주 자재</h2>
          </div>
          <div class="pur306-order-pop-body">
            <section class="pur306-detail-basis" aria-label="발주일자, 발주마감일시, 매장명">
              <dl class="pur306-detail-basis-grid">
                <div>
                  <dt>발주일자</dt>
                  <dd>{{ cond }}</dd>
                </div>
                <div>
                  <dt>발주마감일시</dt>
                  <dd>{{ cond2 }}</dd>
                </div>
                <div>
                  <dt>매장명</dt>
                  <dd>{{ clickedStoreNm }}</dd>
                </div>
              </dl>
            </section>
            <div class="pur306-order-pop-legend">
              <span class="pur306-order-pop-legend-item">
                <i class="pur306-order-pop-swatch pur306-order-pop-swatch--new"></i>
                신규 발주품목
              </span>
              <span class="pur306-order-pop-legend-item">
                <i class="pur306-order-pop-swatch"></i>
                기 발주품목
              </span>
            </div>
            <p class="pur306-order-pop-note">발주수량과 메모만 수정할 수 있습니다. 적용하면 발주 화면에 반영되고, 삭제와 저장은 발주 화면에서 합니다.</p>
            <div
              class="pur306-order-pop-grid"
              :class="{ 'pur306-order-pop-grid--pending': !orderPopGridVisible }">
            <Realgrid
              v-if="orderPopGridReady"
              class="h-full w-full"
              :progname="'PUR03_006INS_VUE'"
              :progid="2"
              :rowData="orderGridRows"
              :editableColId="'dblOrderQty,strOrderComments'"
              :inputUnsignedDecimalColumn="'dblOrderQty'"
              :CalculateTaxColId="'curTax'"
              :CalculateTaxColId2="'curSupply'"
              :CalculateTaxColId3="'curTotal'"
              :rowStateeditable="false"
              :checkRenderEditable="false"
              :hideColumnsId="pur306OrderPopupHideColumns"
              :fixedColumn="true"
              :selectionStyle="'singleRow'"
              :setFooter="true"
              highlight-new-rows
              :merge-column-width-scale2="pur306OrderColWidthScale"
              hover-tooltip-fields="strStockName"
              :hover-tooltip-max-length="40"
              @gridReady="onOrderPopGridReady"
              @updatedRowData="onOrderPopupRowsEdited" />
            </div>
          </div>
          <div class="pur306-detail-actions">
            <button type="button" class="pur306-detail-btn" @click="closeOrderGridPopup">취소</button>
            <button type="button" class="pur306-detail-btn pur306-detail-btn--ok" @click="applyOrderGridPopup">적용</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  saveStockCycle2,
} from "@/api/master";
import {
  deleteStockOrderItem,
  getOrderDataByDate,
  getOrderDate,
  getStockItemList3,
  getSubSequence,
  saveFavoriteStockItem,
  saveNewOrderTmp,
  saveNewOrderTmp2,
  updateOrderTmp,
} from "@/api/mipur";
import BusinessClient2 from "@/components/businessClient2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import {
  formatLocalDate,
  formatNumberWithCommas,
  insertPageLog,
} from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import { rgGetInstance } from "@/components/realgridInstanceRegistry";

/** 조회 AREA — wire 그리드 (PUR02/STKN06 패턴) */
const pur306ControlBorder = "#cbd5e1";
const pur306SearchQtyCheckPair = {
  qtyField: "dblOrderQty",
  checkField: "lngCheck",
  rowKeyField: "lngStockID",
  uncheckOnZero: true,
};
const pur306LabelCol = "5.5rem";
const pur306ItemGap = "0.375rem";
const pur306ColGap = "1.25rem";
const pur306RowGap = "0.375rem";
const pur306PairGap = "0.25rem";
const pur306PickStoreComboMaxRem = 14;

/**
 * 	화면 Load시 실행 스크립트
 */

const hidesub = ref(true);
const hideAttr = ref(true);
const cond = ref("");
const cond2 = ref("");

const optionList = ref([]);
const cond7 = ref("0");
const cond9 = ref("0");
const cond10 = ref("0");
const cond11 = ref("0");
const cond12 = ref("");
const cond13 = ref("");
const pur306NameKeyword = ref("");
const pur306NameComposing = ref(false);

const setPur306NameKeyword = (value) => {
  pur306NameKeyword.value = String(value ?? "").replace(/'/g, "");
};

const onMatNameCompositionStart = () => {
  pur306NameComposing.value = true;
};

const onMatNameLiveInput = (event) => {
  const value = event.target?.value ?? "";
  setPur306NameKeyword(value);
  if (!event.isComposing && !pur306NameComposing.value) {
    cond13.value = value;
  }
};

const onMatNameCompositionEnd = (event) => {
  pur306NameComposing.value = false;
  const value = event.target?.value ?? "";
  cond13.value = value;
  setPur306NameKeyword(value);
};
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const applyOrderDateRow = (row) => {
  if (!row?.dtmOrderDate) return false;
  const ymd = String(row.dtmOrderDate);
  if (ymd.length < 8) return false;
  cond.value = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
  const closeTime = String(row.dtmOrderCloseTime ?? "");
  cond2.value =
    closeTime === ""
      ? cond.value + " 12:00"
      : closeTime.slice(0, 4) +
        "-" +
        closeTime.slice(4, 6) +
        "-" +
        closeTime.slice(6, 8) +
        " " +
        closeTime.slice(8, 10) +
        ":" +
        closeTime.slice(10, 12);
  lastAppliedCond.value = cond.value;
  return true;
};

/**
 * 발주일자 초기값.
 * getOrderDate 4번째 값 0 = usp_VUE_GetOrderDateCheck 의 발주일자 결정.
 * 기준일은 오늘이다. 내일을 넣으면 마감 전에도 다음 날로 넘어간다.
 * 화면 일자는 프로시저가 돌려준 dtmOrderDate 만 쓴다.
 */
const loadInitialOrderDate = async () => {
  if (groupCd.value == null || groupCd.value === "") return;
  const storeCd = isPur306StoreSelected()
    ? nowStoreCd.value
    : store.state.userData?.lngPosition;
  const today = formatLocalDate(new Date()).replaceAll("-", "");
  const res = await getOrderDate(groupCd.value, storeCd, today, 0);
  const applied = applyOrderDateRow(res?.data?.List?.[0]);
  if (!applied) return;
  orderDateReady = true;
  if (isPur306StoreSelected()) {
    await searchButton({ forceLoad: true, skipUnsavedCheck: true });
  }
};

onMounted(async () => {
  try {
    await insertPageLog(store.state.activeTab2);

    const res2 = await getCommonList(242);
    optionList.value = res2?.data?.List ?? [];

    const storeGroup = store.state.userData?.lngStoreGroup;
    if (storeGroup != null && storeGroup !== "") {
      const res3 = await getStockCategory(storeGroup);
      optionList3.value = res3?.data?.List ?? [];

      const res4 = await getStockGroup(storeGroup);
      optionList4.value = res4?.data?.List ?? [];

      const res5 = await getStockGeneric(storeGroup);
      optionList5.value = res5?.data?.List ?? [];
    }
  } catch (error) {
    console.error("[PUR03_006INS] 화면 초기 조회", error);
  }
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

/**
 *  그리드 검색어 세팅
 */

const clickedStoreNm = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");

/**
 * 페이지 매장 코드 세팅
 */
const selectedSupplier = ref("");
const SupplierId = (e) => {
  selectedSupplier.value = e;
  // ///console.log(e);
};
let orderDateLoadStarted = false;
let orderDateReady = false;

const isPur306StoreSelected = () => {
  const code = Number(nowStoreCd.value);
  return Number.isFinite(code) && code !== 0;
};

const pur306MaterialSearchedKey = ref("");
const pur306MaterialSearchDirty = ref(false);
/** 자재목록·거래처·분류·그룹·특성·코드/명·매장·발주일자 */
const pur306MaterialSearchKey = computed(() =>
  [
    groupCd.value,
    nowStoreCd.value,
    cond.value,
    cond7.value,
    selectedSupplier.value,
    cond9.value,
    cond10.value,
    cond11.value,
    cond12.value,
    cond13.value,
  ]
    .map((value) => String(value ?? ""))
    .join("\u0001")
);
/** 매장이 선택되고 발주일자가 있어야 검색자재 조회가 가능 */
const pur306MaterialSearchReady = computed(() => {
  if (groupCd.value == null || groupCd.value === "") return false;
  if (!isPur306StoreSelected()) return false;
  return String(cond.value ?? "").length >= 8;
});
watch(pur306MaterialSearchKey, (next) => {
  if (!pur306MaterialSearchReady.value) {
    pur306MaterialSearchDirty.value = false;
    return;
  }
  pur306MaterialSearchDirty.value = next !== pur306MaterialSearchedKey.value;
});
/** 조회 가능 상태에서 조건을 바꿨는데 그 조건으로 아직 조회하지 않음 */
const pur306MaterialSearchPending = computed(
  () => pur306MaterialSearchReady.value && pur306MaterialSearchDirty.value
);

const alertSelectStore = () =>
  Swal.fire({
    title: "경고",
    text: "매장을 선택해주세요.",
    icon: "warning",
    confirmButtonText: "확인",
  });

const applyOrderCloseTime = (row) => {
  if (!row) return;
  const closeTime = String(row.dtmOrderCloseTime ?? "");
  cond2.value =
    closeTime === ""
      ? cond.value + " 12:00"
      : closeTime.slice(0, 4) +
        "-" +
        closeTime.slice(4, 6) +
        "-" +
        closeTime.slice(6, 8) +
        " " +
        closeTime.slice(8, 10) +
        ":" +
        closeTime.slice(10, 12);
};

const handleStoreGroup = (e) => {
  groupCd.value = e;
  if (orderDateLoadStarted || lastAppliedCond.value) return;
  if (e == null || e === "") return;
  orderDateLoadStarted = true;
  loadInitialOrderDate()
    .catch((error) => {
      orderDateLoadStarted = false;
      console.error("[PUR03_006INS] 발주일자 조회", error);
    });
};
const first = ref(false);
const pickStoreRef = ref(null);
const pur306OrderDateRef = ref(null);
const pur306FocusSinkRef = ref(null);
const pur306SkipStoreCdHandler = ref(false);
const lastAppliedCond = ref("");

const getRowStateCount = (state) => {
  if (state == null) return 0;
  if (typeof state === "number") return state;
  if (Array.isArray(state)) return state.length;
  return 0;
};

const pur306FieldChanged = (current, base) =>
  String(current ?? "") !== String(base ?? "");

const hasPur306SearchGridDataChanges = () => {
  const baseRows = rowData.value ?? [];
  const currentRows = updatedrowdata.value ?? [];

  const baseMap = new Map(baseRows.map((row) => [row.lngStockID, row]));

  for (const current of currentRows) {
    const base = baseMap.get(current.lngStockID);
    if (!base) continue;
    if (pur306FieldChanged(current.dblOrderQty, base.dblOrderQty)) return true;
    if (pur306FieldChanged(current.strOrderComments, base.strOrderComments)) {
      return true;
    }
  }

  return false;
};

const hasPur306OrderGridDataChanges = () => {
  const baseRows = rowData2.value ?? [];
  const currentRows = updatedrowdata2.value ?? [];
  const baseMap = new Map(baseRows.map((row) => [row.lngStockID, row]));

  for (const current of currentRows) {
    const base = baseMap.get(current.lngStockID);
    if (!base) return true;
    if (pur306FieldChanged(current.dblOrderQty, base.dblOrderQty)) return true;
    if (pur306FieldChanged(current.strOrderComments, base.strOrderComments)) {
      return true;
    }
  }

  return false;
};

const hasUnsavedSearchGridChanges = () => {
  const search = allstaterows.value;

  if (Array.isArray(search) && search.length > 0) return true;

  if (
    getRowStateCount(search?.created) > 0 ||
    getRowStateCount(search?.updated) > 0 ||
    getRowStateCount(search?.deleted) > 0
  ) {
    return true;
  }

  return hasPur306SearchGridDataChanges();
};

const hasUnsavedOrderGridChanges = () => {
  const order = allstaterows2.value;

  if (Array.isArray(order) && order.length > 0) return true;

  if (
    getRowStateCount(order?.created) > 0 ||
    getRowStateCount(order?.updated) > 0 ||
    getRowStateCount(order?.deleted) > 0
  ) {
    return true;
  }

  return hasPur306OrderGridDataChanges();
};

const hasUnsavedPur306Changes = () => {
  return hasUnsavedSearchGridChanges() || hasUnsavedOrderGridChanges();
};

const resetPur306UnsavedGridState = () => {
  allstaterows.value = { created: [], updated: [], deleted: [] };
  allstaterows2.value = { created: [], updated: [], deleted: [] };
};

const getPur306OrderStockIds = () =>
  new Set(
    (updatedrowdata2.value ?? [])
      .map((item) => item?.lngStockID)
      .filter((id) => id != null && id !== "")
  );

const filterPur306SearchStockList = (list) => {
  const orderIds = getPur306OrderStockIds();
  return (list ?? []).filter((item) => !orderIds.has(item.lngStockID));
};

const formatPur306DuplicateStockLines = (items) =>
  items
    .map((item) => {
      const code = item?.lngStockID ?? "";
      const name = item?.strStockName ?? "";
      return name ? `${code} · ${name}` : String(code);
    })
    .join("<br>");

/** 검색→발주 이동 시 원본 행 보관 (발주→검색 복원용) */
const pur306SearchStockCache = new Map();
/** 마지막 검색자재 조회 결과 품목 ID (복원 대상 판단) */
const pur306LastSearchStockIds = ref(null);

const isPur306SearchRestorableStock = (stockId) => {
  if (stockId == null || stockId === "") return false;
  if (pur306LastSearchStockIds.value == null) return false;
  return pur306LastSearchStockIds.value.has(stockId);
};

const cachePur306SearchStockRows = (items) => {
  (items ?? []).forEach((item) => {
    if (item?.lngStockID == null || item.lngStockID === "") return;
    pur306SearchStockCache.set(item.lngStockID, { ...item });
  });
};

/** 검색자재 — 그리드 편집값(updatedrowdata) 우선 스냅샷 */
const getPur306SearchGridSnapshot = () => {
  const source =
    updatedrowdata.value?.length > 0
      ? updatedrowdata.value
      : (rowData.value ?? []);

  return source.map((row) => ({ ...row }));
};

const applyPur306SearchGridRows = (rows) => {
  const next = rows.map((row) => ({ ...row }));
  rowData.value = next;
  updatedrowdata.value = next;
};

const PUR306_DETAIL_FIELDS = new Set(["lngStockID", "strStockName"]);
const stockDetailOpen = ref(false);
const stockDetailRowIndex = ref(-1);
const stockDetail = ref({});
const stockDetailQty = ref("");
const stockDetailMemo = ref("");
const stockDetailQtyRef = ref(null);
const stockDetailFrame = ref({ left: 0, top: 0, width: 576, height: 520 });
let stockDetailDrag = null;
let stockDetailResize = null;

const stockDetailDialogStyle = () => ({
  left: `${stockDetailFrame.value.left}px`,
  top: `${stockDetailFrame.value.top}px`,
  width: `${stockDetailFrame.value.width}px`,
  height: `${stockDetailFrame.value.height}px`,
});

const formatPur306DetailDate = (value) => {
  const raw = String(value ?? "").replace(/\D/g, "");
  if (raw.length >= 8) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  return String(value ?? "").trim();
};

const formatPur306DetailPrice = (value) => {
  if (value == null || value === "") return "";
  const n = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(n)) return String(value);
  return formatNumberWithCommas(n);
};

const onSearchStockDblClick = async (row) => {
  const field = String(row?.dblclickField ?? "");
  if (!PUR306_DETAIL_FIELDS.has(field)) return;
  const dataRow = Number(row?.dataRow);
  if (!Number.isFinite(dataRow) || dataRow < 0) return;

  const live = updatedrowdata.value?.[dataRow];
  const source =
    live && typeof live === "object" && !Array.isArray(live) ? live : row;

  stockDetailRowIndex.value = dataRow;
  stockDetail.value = source && typeof source === "object" ? { ...source } : {};
  const qty = source?.dblOrderQty;
  const qtyNum = Number(qty);
  stockDetailQty.value =
    qty == null || qty === "" || Number.isNaN(qtyNum) || qtyNum === 0
      ? ""
      : formatPur306QtyMask(qty);
  stockDetailMemo.value =
    source?.strOrderComments == null ? "" : String(source.strOrderComments);
  placeStockDetailDialog();
  stockDetailOpen.value = true;
  await nextTick();
  stockDetailQtyRef.value?.focus();
};

const placeStockDetailDialog = () => {
  const width = Math.min(576, Math.max(320, window.innerWidth - 32));
  const height = Math.min(520, Math.max(280, window.innerHeight - 32));
  stockDetailFrame.value = {
    width,
    height,
    left: Math.max(8, Math.round((window.innerWidth - width) / 2)),
    top: Math.max(8, Math.round((window.innerHeight - height) / 2)),
  };
};

const clampStockDetailFrame = (frame) => {
  const left = Math.min(Math.max(8, frame.left), Math.max(8, window.innerWidth - 120));
  const top = Math.min(Math.max(8, frame.top), Math.max(8, window.innerHeight - 48));
  const width = Math.min(
    Math.max(320, frame.width),
    Math.max(320, window.innerWidth - left - 8)
  );
  const height = Math.min(
    Math.max(280, frame.height),
    Math.max(280, window.innerHeight - top - 8)
  );
  return { left, top, width, height };
};

const onStockDetailDragStart = (event) => {
  if (event.button !== 0) return;
  if (event.target?.closest?.("button")) return;
  stockDetailDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    left: stockDetailFrame.value.left,
    top: stockDetailFrame.value.top,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
};

const onStockDetailDragMove = (event) => {
  if (!stockDetailDrag || event.pointerId !== stockDetailDrag.pointerId) return;
  stockDetailFrame.value = clampStockDetailFrame({
    ...stockDetailFrame.value,
    left: stockDetailDrag.left + (event.clientX - stockDetailDrag.startX),
    top: stockDetailDrag.top + (event.clientY - stockDetailDrag.startY),
  });
};

const onStockDetailDragEnd = (event) => {
  if (!stockDetailDrag || event.pointerId !== stockDetailDrag.pointerId) return;
  stockDetailDrag = null;
};

const onStockDetailResizeStart = (event) => {
  if (event.button !== 0) return;
  stockDetailResize = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    width: stockDetailFrame.value.width,
    height: stockDetailFrame.value.height,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
};

const onStockDetailResizeMove = (event) => {
  if (!stockDetailResize || event.pointerId !== stockDetailResize.pointerId) return;
  stockDetailFrame.value = clampStockDetailFrame({
    ...stockDetailFrame.value,
    width: stockDetailResize.width + (event.clientX - stockDetailResize.startX),
    height: stockDetailResize.height + (event.clientY - stockDetailResize.startY),
  });
};

const onStockDetailResizeEnd = (event) => {
  if (!stockDetailResize || event.pointerId !== stockDetailResize.pointerId) return;
  stockDetailResize = null;
};

const closeStockDetail = () => {
  stockDetailOpen.value = false;
};

const pur306OrderPopupHideColumns = ["lngCheck"];

const pur306OrderColWidthScale = {
  strStockName: 1.5,
  strOrderNo: 1.25,
};

const orderGridOpen = ref(false);
const orderGridRows = ref([]);
const orderPopupDraft = ref([]);
const orderGridFrame = ref({ left: 0, top: 0, width: 960, height: 640 });
const orderGridDialogEl = ref(null);
const orderPopDim = ref(false);
const orderPopGridReady = ref(false);
const orderPopGridVisible = ref(false);
const orderPopGridId = ref("");
let orderGridDrag = null;
let orderPopOrigin = null;
let orderPopLeaving = false;
const ORDER_POP_MS_IN = 820;
const ORDER_POP_MS_OUT = 640;

const clampOrderGridFrame = (frame) => {
  const maxW = Math.max(320, window.innerWidth - 16);
  const maxH = Math.max(280, window.innerHeight - 36);
  const minW = Math.min(640, maxW);
  const minH = Math.min(294, maxH);
  const width = Math.min(Math.max(frame.width, minW), maxW);
  const height = Math.min(Math.max(frame.height, minH), maxH);
  const left = Math.min(Math.max(8, frame.left), Math.max(8, window.innerWidth - width - 8));
  const topLimit = Math.max(12, window.innerHeight - height - 16);
  const top = Math.min(Math.max(12, frame.top), topLimit);
  return { left, top, width, height };
};

const placeOrderGridDialog = () => {
  const top = 12;
  const width = Math.min(Math.round(window.innerWidth * 0.86), window.innerWidth - 24);
  const maxFit = Math.max(280, window.innerHeight - top - 16);
  const height = Math.min(Math.round(window.innerHeight * 0.82), maxFit);
  orderGridFrame.value = clampOrderGridFrame({
    left: Math.round((window.innerWidth - width) / 2),
    top,
    width,
    height,
  });
};

const orderGridDialogStyle = () => ({
  left: `${orderGridFrame.value.left}px`,
  top: `${orderGridFrame.value.top}px`,
  width: `${orderGridFrame.value.width}px`,
  height: `${orderGridFrame.value.height}px`,
});

const prefersOrderPopReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const readOrderPopRect = (el) => {
  if (!el || typeof el.getBoundingClientRect !== "function") return null;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};

const readOrderPopOrigin = (event) => readOrderPopRect(event?.currentTarget);

const readOrderPopOriginButton = () => {
  if (typeof document === "undefined") return orderPopOrigin;
  return readOrderPopRect(document.querySelector("[data-pur306-order-expand]")) || orderPopOrigin;
};

const clearOrderPopMotion = (dialog) => {
  if (!dialog) return;
  dialog.style.transition = "";
  dialog.style.transform = "";
  dialog.style.transformOrigin = "";
  dialog.style.opacity = "";
  dialog.style.willChange = "";
};

const refreshOrderPopGridSize = async (gridId = orderPopGridId.value) => {
  await nextTick();
  await nextOrderPopFrames(2);
  try {
    const gridView = rgGetInstance(gridId)?.gridView;
    gridView?.resetSize?.();
  } catch (_) {
    void 0;
  }
};

const onOrderPopGridReady = async (gridId) => {
  orderPopGridId.value = gridId || "";
  await refreshOrderPopGridSize(gridId);
  if (orderGridOpen.value && !orderPopLeaving) {
    orderPopGridVisible.value = true;
  }
};

const waitOrderPopFlip = (el, ms) =>
  new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const onEnd = (ev) => {
      if (ev.target !== el) return;
      if (ev.propertyName === "transform" || ev.propertyName === "opacity") finish();
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, ms + 40);
  });

const nextOrderPopFrames = (count = 2) =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      resolve();
      return;
    }
    let left = Math.max(1, count);
    const step = () => {
      left -= 1;
      if (left <= 0) resolve();
      else window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  });

const computeOrderPopFlip = (dialog, origin, dir) => {
  if (!dialog || !origin) return null;
  const last = dialog.getBoundingClientRect();
  if (!last.width || !last.height) return null;
  const ox = origin.left + origin.width / 2 - last.left;
  const oy = origin.top + origin.height / 2 - last.top;
  const sW = origin.width / last.width;
  const sH = origin.height / last.height;
  const sFit = Math.max(0.05, Math.min(sW, sH));
  const s =
    dir === "in"
      ? Math.min(0.03, Math.max(0.012, sFit * 0.2))
      : Math.max(0.06, Math.sqrt(Math.max(0.0001, sW * sH)));
  return { ox, oy, s };
};

const runOrderPopFlip = async (dir) => {
  const dialog = orderGridDialogEl.value;
  if (!dialog) return false;
  if (prefersOrderPopReducedMotion()) return false;
  const origin = dir === "out" ? readOrderPopOriginButton() : orderPopOrigin;
  const flip = computeOrderPopFlip(dialog, origin, dir);
  if (!flip) return false;

  const ms = dir === "in" ? ORDER_POP_MS_IN : ORDER_POP_MS_OUT;
  const ease =
    dir === "in" ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.4, 0, 0.2, 1)";
  dialog.style.transformOrigin = `${flip.ox}px ${flip.oy}px`;

  dialog.style.willChange = "transform, opacity";
  if (dir === "in") {
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
    dialog.style.transform = `scale(${flip.s})`;
    orderPopDim.value = false;
    void dialog.offsetWidth;
    await nextOrderPopFrames(2);
    dialog.style.opacity = "0.92";
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.75)}ms ease-out`;
    void dialog.offsetWidth;
    dialog.style.transform = "scale(1)";
    dialog.style.opacity = "1";
    orderPopDim.value = true;
    await waitOrderPopFlip(dialog, ms);
    clearOrderPopMotion(dialog);
  } else {
    dialog.style.transition = "none";
    dialog.style.transform = "scale(1)";
    dialog.style.opacity = "1";
    void dialog.offsetWidth;
    await nextOrderPopFrames(1);
    dialog.style.transition = `transform ${ms}ms ${ease}, opacity ${Math.round(ms * 0.85)}ms ease-in`;
    dialog.style.transform = `scale(${flip.s})`;
    dialog.style.opacity = "0.72";
    orderPopDim.value = false;
    await waitOrderPopFlip(dialog, ms);
    clearOrderPopMotion(dialog);
  }
  return true;
};

const getPur306OrderRows = () =>
  updatedrowdata2.value?.length > 0 ? updatedrowdata2.value : (rowData2.value ?? []);

const pur306OrderExpandEnabled = computed(() => getPur306OrderRows().length > 0);

const openOrderGridPopup = async (event) => {
  if (orderPopLeaving || !pur306OrderExpandEnabled.value) return;
  orderPopOrigin = readOrderPopOrigin(event);
  const snapshot = getPur306OrderRows().map((row) => ({ ...row }));
  orderGridRows.value = snapshot;
  orderPopupDraft.value = snapshot.map((row) => ({ ...row }));
  placeOrderGridDialog();
  orderPopGridVisible.value = false;
  orderPopGridId.value = "";
  // 애니메이션과 동시에 그리드를 준비해, 끝난 뒤 바로 보이게 한다.
  orderPopGridReady.value = true;
  orderPopDim.value = !orderPopOrigin || prefersOrderPopReducedMotion();
  orderGridOpen.value = true;
  await nextTick();
  const dialog = orderGridDialogEl.value;
  if (dialog && orderPopOrigin && !prefersOrderPopReducedMotion()) {
    dialog.style.transition = "none";
    dialog.style.opacity = "0";
  }
  try {
    const flipped = await runOrderPopFlip("in");
    if (!flipped) orderPopDim.value = true;
  } catch (_) {
    orderPopDim.value = true;
    clearOrderPopMotion(dialog);
  }
  await refreshOrderPopGridSize();
  orderPopGridVisible.value = true;
};

const closeOrderGridPopup = async () => {
  if (!orderGridOpen.value || orderPopLeaving) return;
  orderPopLeaving = true;
  orderGridDrag = null;
  orderPopGridVisible.value = false;
  orderPopGridReady.value = false;
  orderPopGridId.value = "";
  try {
    await runOrderPopFlip("out");
  } catch (_) {
    clearOrderPopMotion(orderGridDialogEl.value);
  }
  orderGridOpen.value = false;
  orderPopupDraft.value = [];
  orderPopDim.value = false;
  orderPopOrigin = null;
  orderPopLeaving = false;
};

const onOrderGridDragStart = (event) => {
  if (event.button !== 0) return;
  if (event.target?.closest?.("button")) return;
  orderGridDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    left: orderGridFrame.value.left,
    top: orderGridFrame.value.top,
  };
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.preventDefault();
};

const onOrderGridDragMove = (event) => {
  if (!orderGridDrag || event.pointerId !== orderGridDrag.pointerId) return;
  orderGridFrame.value = clampOrderGridFrame({
    ...orderGridFrame.value,
    left: orderGridDrag.left + (event.clientX - orderGridDrag.startX),
    top: orderGridDrag.top + (event.clientY - orderGridDrag.startY),
  });
};

const onOrderGridDragEnd = (event) => {
  if (!orderGridDrag || event.pointerId !== orderGridDrag.pointerId) return;
  orderGridDrag = null;
};

const normalizePur306QtyInput = (value) => {
  let text = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");
  const dot = text.indexOf(".");
  if (dot >= 0) {
    text = text.slice(0, dot + 1) + text.slice(dot + 1).replace(/\./g, "");
  }
  const hasDot = text.includes(".");
  const [intRaw = "", fracRaw = ""] = text.split(".");
  let intPart = intRaw.replace(/^0+(?=\d)/, "");
  const frac = fracRaw.slice(0, 2);
  if (!intPart && !hasDot) return "";
  if (!intPart) intPart = "0";
  return hasDot ? `${intPart}.${frac}` : intPart;
};

const formatPur306QtyMask = (value) => {
  const normalized = normalizePur306QtyInput(value);
  if (!normalized) return "";
  const dot = normalized.indexOf(".");
  if (dot < 0) return formatNumberWithCommas(normalized);
  const intPart = normalized.slice(0, dot) || "0";
  return `${formatNumberWithCommas(intPart)}.${normalized.slice(dot + 1)}`;
};

const countPur306QtyTokensBefore = (text, index) =>
  String(text ?? "")
    .slice(0, index)
    .replace(/[^\d.]/g, "").length;

const placeStockDetailQtyCaret = (masked, tokenPos) => {
  nextTick(() => {
    const input = stockDetailQtyRef.value;
    if (!input) return;
    if (tokenPos <= 0) {
      input.setSelectionRange(0, 0);
      return;
    }
    let seen = 0;
    let pos = masked.length;
    for (let i = 0; i < masked.length; i += 1) {
      if (/\d/.test(masked[i]) || masked[i] === ".") seen += 1;
      if (seen >= tokenPos) {
        pos = i + 1;
        break;
      }
    }
    input.setSelectionRange(pos, pos);
  });
};

const applyStockDetailQtyMask = (raw, tokenPos) => {
  const masked = formatPur306QtyMask(raw);
  stockDetailQty.value = masked;
  const input = stockDetailQtyRef.value;
  if (input && input.value !== masked) input.value = masked;
  placeStockDetailQtyCaret(masked, tokenPos);
};

const stockDetailQtyNavKeys = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

const isPur306QtyDraft = (text) =>
  /^\d*(\.\d{0,2})?$/.test(String(text ?? "").replace(/,/g, ""));

const onStockDetailQtyKeydown = (event) => {
  if (event.isComposing || event.key === "Process" || event.keyCode === 229) {
    event.preventDefault();
    return;
  }
  const el = event.target;
  if (
    el &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    (event.key === "Backspace" || event.key === "Delete") &&
    el.selectionStart === el.selectionEnd
  ) {
    const value = String(el.value ?? "");
    const start = el.selectionStart ?? 0;
    const markIndex = event.key === "Backspace" ? start - 1 : start;
    if (value[markIndex] === ",") {
      event.preventDefault();
      const logical = value.replace(/,/g, "");
      const tokensBefore = countPur306QtyTokensBefore(value, markIndex);
      const removeAt = event.key === "Backspace" ? tokensBefore - 1 : tokensBefore;
      if (removeAt < 0 || removeAt >= logical.length) return;
      const next = logical.slice(0, removeAt) + logical.slice(removeAt + 1);
      applyStockDetailQtyMask(next, removeAt);
      return;
    }
  }
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (stockDetailQtyNavKeys.has(event.key)) return;
  if (/^\d$/.test(event.key) || event.key === ".") return;
  event.preventDefault();
};

const onStockDetailQtyBeforeInput = (event) => {
  const type = event.inputType || "";
  if (type === "insertCompositionText" || type === "deleteCompositionText") {
    event.preventDefault();
    return;
  }
  if (type.startsWith("delete")) return;
  if (type !== "insertText" || event.data == null) return;
  const el = event.target;
  const start = el.selectionStart ?? 0;
  const end = el.selectionEnd ?? 0;
  const next =
    String(el.value ?? "").slice(0, start) + event.data + String(el.value ?? "").slice(end);
  if (!isPur306QtyDraft(next)) event.preventDefault();
};

const onStockDetailQtyPaste = (event) => {
  event.preventDefault();
  const el = event.target;
  const pasted = String(event.clipboardData?.getData("text") ?? "").replace(/[^\d.]/g, "");
  if (!pasted) return;
  const value = String(el?.value ?? "");
  const start = el?.selectionStart ?? value.length;
  const end = el?.selectionEnd ?? value.length;
  const logical = value.replace(/,/g, "");
  const tokenStart = countPur306QtyTokensBefore(value, start);
  const tokenEnd = countPur306QtyTokensBefore(value, end);
  const next = logical.slice(0, tokenStart) + pasted + logical.slice(tokenEnd);
  applyStockDetailQtyMask(next, tokenStart + normalizePur306QtyInput(pasted).length);
};

const snapStockDetailQty = (el) => {
  if (!el) return;
  const tokenPos = countPur306QtyTokensBefore(el.value, el.selectionStart ?? 0);
  applyStockDetailQtyMask(el.value, tokenPos);
};

const onStockDetailQtyCompositionStart = (event) => {
  event.preventDefault();
  const el = event.target;
  snapStockDetailQty(el);
  el.blur();
  requestAnimationFrame(() => {
    el.focus();
  });
};

const onStockDetailQtyCompositionUpdate = (event) => {
  event.preventDefault();
  snapStockDetailQty(event.target);
};

const onStockDetailQtyCompositionEnd = (event) => {
  snapStockDetailQty(event.target);
};

const onStockDetailQtyInput = (event) => {
  if (event.isComposing) {
    snapStockDetailQty(event.target);
    return;
  }
  const el = event.target;
  const tokenPos = countPur306QtyTokensBefore(el.value, el.selectionStart ?? 0);
  applyStockDetailQtyMask(el.value, tokenPos);
};

const searchChangeNow = ref(false);
const searchChangeRow = ref(-1);
const searchChangeColid = ref("");
const searchChangeValue2 = ref("");
const orderChangeNow = ref(false);
const orderChangeRow = ref(-1);
const orderChangeColid = ref("");
const orderChangeValue2 = ref("");

const setSearchGridCell = async (row, col, value) => {
  searchChangeRow.value = row;
  searchChangeColid.value = col;
  searchChangeValue2.value = value;
  searchChangeNow.value = !searchChangeNow.value;
  await nextTick();
};

const setOrderGridCell = async (row, col, value) => {
  orderChangeRow.value = row;
  orderChangeColid.value = col;
  orderChangeValue2.value = value;
  orderChangeNow.value = !orderChangeNow.value;
  await nextTick();
};

const pur306QtyNumber = (value) => {
  if (value == null || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
};

const pur306MemoText = (value) => (value == null ? "" : String(value));

const applyOrderPopupRows = async (rows) => {
  if (!orderGridOpen.value || !Array.isArray(rows)) return;

  const base =
    updatedrowdata2.value?.length > 0 ? updatedrowdata2.value : (rowData2.value ?? []);

  for (let i = 0; i < rows.length; i += 1) {
    const next = rows[i];
    const prev = base[i];
    if (!next || !prev) continue;

    const qtyChanged = pur306QtyNumber(prev.dblOrderQty) !== pur306QtyNumber(next.dblOrderQty);
    const memoChanged = pur306MemoText(prev.strOrderComments) !== pur306MemoText(next.strOrderComments);
    if (!qtyChanged && !memoChanged) continue;

    if (qtyChanged) {
      const qtyNum = pur306QtyNumber(next.dblOrderQty);
      const unit = Number(next.curUnitPrice ?? prev.curUnitPrice ?? 0) || 0;
      const supply = Math.floor(unit * qtyNum);
      let taxType = next.lngTaxType ?? prev.lngTaxType;
      if (taxType == null || taxType === "") taxType = "01";
      const tax = taxType == "01" ? Math.floor(supply * 0.1) : 0;
      await setOrderGridCell(i, "dblOrderQty", qtyNum);
      await setOrderGridCell(i, "curSupply", supply);
      await setOrderGridCell(i, "curTax", tax);
      await setOrderGridCell(i, "curTotal", Math.floor(supply + tax));
    }
    if (memoChanged) {
      await setOrderGridCell(i, "strOrderComments", pur306MemoText(next.strOrderComments));
    }
  }
};

const onOrderPopupRowsEdited = (rows) => {
  if (!orderGridOpen.value || !Array.isArray(rows)) return;
  orderPopupDraft.value = rows.map((row) => ({ ...row }));
};

const applyOrderGridPopup = async () => {
  await commitPur306ActiveEditor();
  const rows = orderPopupDraft.value.length > 0 ? orderPopupDraft.value : orderGridRows.value;
  await applyOrderPopupRows(rows);
  closeOrderGridPopup();
};

const applyStockDetail = async () => {
  const index = stockDetailRowIndex.value;
  const rows = getPur306SearchGridSnapshot();
  if (index < 0 || index >= rows.length) {
    closeStockDetail();
    return;
  }

  const qtyText = normalizePur306QtyInput(stockDetailQty.value);
  const parsedQty = qtyText === "" ? 0 : Number(qtyText);
  const qtyNum = Number.isNaN(parsedQty) ? 0 : parsedQty;

  const memo = stockDetailMemo.value ?? "";
  const checked = qtyNum > 0;
  await setSearchGridCell(index, "dblOrderQty", qtyNum);
  await setSearchGridCell(index, "strOrderComments", memo);
  await setSearchGridCell(index, "lngCheck", checked);

  const source = Array.isArray(rowData.value) ? rowData.value[index] : null;
  if (source && typeof source === "object") {
    source.dblOrderQty = qtyNum;
    source.strOrderComments = memo;
    source.lngCheck = checked;
  }
  closeStockDetail();
};

const toPur306SearchStockRow = (orderItem) => {
  const stockId = orderItem?.lngStockID;
  const cached =
    stockId != null && stockId !== ""
      ? pur306SearchStockCache.get(stockId)
      : undefined;

  if (stockId != null && stockId !== "") {
    pur306SearchStockCache.delete(stockId);
  }

  const base = cached ? { ...cached } : { ...orderItem };

  return {
    ...base,
    lngCheck: false,
    dblOrderQty: 0,
    curSupply: 0,
    curTax: 0,
    curTotal: 0,
  };
};

const restorePur306SearchStockFromOrder = (orderItems) => {
  if (!orderItems?.length) return;

  const currentRows = getPur306SearchGridSnapshot();
  const existingIds = new Set(currentRows.map((item) => item.lngStockID));
  const toRestore = orderItems
    .filter((item) => item?.lngStockID != null && item.lngStockID !== "")
    .filter((item) => isPur306SearchRestorableStock(item.lngStockID))
    .filter((item) => !existingIds.has(item.lngStockID))
    .map(toPur306SearchStockRow);

  if (toRestore.length === 0) return;

  applyPur306SearchGridRows([...currentRows, ...toRestore]);
};

const splitPur306CheckedOrderRows = () => {
  const createdIndices = new Set(allstaterows2.value?.created ?? []);
  const unsaved = [];
  const saved = [];

  updatedrowdata2.value.forEach((item, index) => {
    if (item.lngCheck != true) return;

    if (createdIndices.has(index)) {
      unsaved.push(item);
    } else {
      saved.push(item);
    }
  });

  return { unsaved, saved, all: [...unsaved, ...saved] };
};

const removePur306OrderRowsFromGrid = async () => {
  deleteRow7.value = !deleteRow7.value;
  await nextTick();
};

const recalcPur306OrderTotals = () => {
  cond4.value = formatNumberWithCommas(
    updatedrowdata2.value.reduce(
      (sum, item) => sum + parseInt(item.curSupply || 0, 10),
      0
    )
  );
  cond5.value = formatNumberWithCommas(
    updatedrowdata2.value.reduce(
      (sum, item) => sum + parseInt(item.curTax || 0, 10),
      0
    )
  );
  cond6.value = formatNumberWithCommas(
    updatedrowdata2.value.reduce(
      (sum, item) => sum + parseInt(item.curTotal || 0, 10),
      0
    )
  );
};

const confirmDiscardPur306Changes = async () => {
  const result = await Swal.fire({
    title: "확인",
    html: "변경된 내용이 있습니다.<br>저장 없이 진행 하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "예",
    cancelButtonText: "아니오",
    returnFocus: false,
  });
  return result.isConfirmed;
};

const focusPur306Neutral = async () => {
  await nextTick();
  await nextTick();
  pickStoreRef.value?.blurPickStore?.();
  pur306OrderDateRef.value?.blur();
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  await new Promise((resolve) => requestAnimationFrame(resolve));
  pur306FocusSinkRef.value?.focus({ preventScroll: true });
};

const applyStoreChange = async (newValue) => {
  initAll();
  nowStoreCd.value = newValue;

  if (!isPur306StoreSelected()) {
    return;
  }
  if (!orderDateReady) {
    return;
  }
  await searchButton({ forceLoad: true, skipUnsavedCheck: true });
};

const handleStoreCd = async (newValue) => {
  if (pur306SkipStoreCdHandler.value) {
    pur306SkipStoreCdHandler.value = false;
    return;
  }

  const prevStoreCd = nowStoreCd.value;
  const normalizedNew =
    newValue == null || newValue === "" ? 0 : Number(newValue);
  const normalizedPrev = prevStoreCd == null ? 0 : Number(prevStoreCd);

  if (normalizedNew === normalizedPrev) {
    return;
  }

  if (hasUnsavedPur306Changes()) {
    const confirmed = await confirmDiscardPur306Changes();
    if (!confirmed) {
      pur306SkipStoreCdHandler.value = true;
      pickStoreRef.value?.selectStoreByCode(normalizedPrev);
      await focusPur306Neutral();
      return;
    }
  }

  await applyStoreChange(normalizedNew);
};

const onOrderDateChange = async (event) => {
  await commitPur306ActiveEditor();

  const newDate = event.target.value;
  const prevDate = lastAppliedCond.value;

  if (newDate === prevDate) {
    return;
  }

  if (!isPur306StoreSelected()) {
    lastAppliedCond.value = newDate;
    cond.value = newDate;
    await alertSelectStore();
    return;
  }

  if (hasUnsavedOrderGridChanges()) {
    const confirmed = await confirmDiscardPur306Changes();
    if (!confirmed) {
      cond.value = prevDate;
      if (event.target instanceof HTMLInputElement) {
        event.target.value = prevDate;
        event.target.blur();
      }
      await focusPur306Neutral();
      return;
    }
  }

  initAll();
  lastAppliedCond.value = newDate;
  cond.value = newDate;
  first.value = true;
  await searchButton({ forceLoad: true, skipUnsavedCheck: true });
};

/** Enter — 편집 중인 그리드 셀 commit 후 조회 */
const commitPur306ActiveEditor = async () => {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
  await nextTick();
  await nextTick();
};

const onOrderDateEnter = (event) => {
  if (event.target instanceof HTMLInputElement) {
    event.target.blur();
  }
};

const onPur306MaterialSearchEnter = async () => {
  await commitPur306ActiveEditor();
  await searchButton2();
};

const checkAllorNot = async (e, e2) => {
  // //console.log(e);
  // //console.log(e2);
  const stockids = updatedrowdata.value
    .map((item) => item.lngStockID)
    .join("\u200b");
  if (e2 == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        stockids,
        e == true ? 1 : 0
      );

      // //console.log(res);
    } catch (error) {}
  }
};
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const allstaterows2 = ref([]);
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  allstaterows.value = e;
};
const allStateRows2 = (e) => {
  //console.log(e);
  allstaterows2.value = e;
};
/**
 *  조회 함수
 */

const searchButton = async (options = {}) => {
  const { skipUnsavedCheck = false } = options;

  await commitPur306ActiveEditor();

  if (!isPur306StoreSelected()) {
    await alertSelectStore();
    return;
  }

  if (!skipUnsavedCheck && hasUnsavedOrderGridChanges()) {
    const confirmed = await confirmDiscardPur306Changes();
    if (!confirmed) {
      return;
    }
    allstaterows2.value = { created: [], updated: [], deleted: [] };
    updatedrowdata2.value = [];
  }

  try {
    const closeRes = await getOrderDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", ""),
      1
    );
    const orderDateRow = closeRes?.data?.List?.[0];
    applyOrderCloseTime(orderDateRow);

    if (String(orderDateRow?.strMsg ?? "") === "9") {
      Swal.fire({
        title: "경고",
        text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const res = await getOrderDataByDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", "")
    );
    const orderRows = sortPur306OrderRowsByName(
      Array.isArray(res?.data?.List) ? res.data.List : []
    );
    rowData2.value = orderRows;
    updatedrowdata2.value = orderRows;
    cond3.value = res?.data?.List2?.[0]?.strMComments ?? "";

    cond4.value = formatNumberWithCommas(
      orderRows.reduce((sum, item) => sum + parseInt(item.curSupply || 0, 10), 0)
    );
    cond5.value = formatNumberWithCommas(
      orderRows.reduce((sum, item) => sum + parseInt(item.curTax || 0, 10), 0)
    );
    cond6.value = formatNumberWithCommas(
      orderRows.reduce((sum, item) => sum + parseInt(item.curTotal || 0, 10), 0)
    );
  } catch (error) {
    console.error("[PUR03_006INS] 발주조회", error);
  }
};

const onMatCodeInput = (e) => {
  const digits = e.target.value.replace(/\D/g, "");
  cond12.value = digits;
  e.target.value = digits;
};

const searchButton2 = async () => {
  if (nowStoreCd.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  await commitPur306ActiveEditor();

  if (hasUnsavedSearchGridChanges()) {
    const confirmed = await confirmDiscardPur306Changes();
    if (!confirmed) {
      return;
    }
    allstaterows.value = { created: [], updated: [], deleted: [] };
    updatedrowdata.value = [];
  }

  // const res = await getOrderDate(
  //   groupCd.value,
  //   nowStoreCd.value,
  //   cond.value.replaceAll("-", ""),
  //   1
  // );

  // if (res.data.List[0].strMsg == 9) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "본사에 발주마감 시간 설정을 확인 해 주십시오.",
  //     icon: "warning",

  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    const res = await getStockItemList3(
      groupCd.value,
      nowStoreCd.value,
      store.state.userData.lngPosition,
      cond.value.replaceAll("-", ""),
      cond7.value,
      selectedSupplier.value,
      cond9.value,
      cond10.value,
      cond11.value,
      cond12.value,
      cond13.value
    );
    store.state.loading = false;
    pur306LastSearchStockIds.value = new Set(
      (res.data.List ?? []).map((item) => item.lngStockID)
    );
    rowData.value = filterPur306SearchStockList(res.data.List);
    pur306MaterialSearchedKey.value = pur306MaterialSearchKey.value;
    pur306MaterialSearchDirty.value = false;
  } catch (error) {
    //console.log(error);
  }
};

/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const clickedButtonCol = async (e) => {
  if (e == "lngCheckFovorites") {
    try {
      const res = await saveFavoriteStockItem(
        store.state.userData.lngStoreGroup,
        store.state.userData.lngPosition,
        saveFavoriteId.value,
        saveFavoriteValue.value == true ? 1 : 0
      );

      //console.log(res);
    } catch (error) {}
  }
};
const saveFavoriteGroup = ref("");
const saveFavoriteStore = ref("");
const saveFavoriteId = ref("");
const saveFavoriteValue = ref("");
const clickedRowData = async (newValue) => {
  console.log(newValue);

  saveFavoriteGroup.value = newValue[15];
  saveFavoriteStore.value = newValue[16];
  saveFavoriteId.value = newValue[2];
  saveFavoriteValue.value = newValue[1];
  // try {
  //   const res =await saveFavoriteStockItem(newValue[15] , newValue[16] , )
  // } catch (error) {

  // }
};
/**
 * 데이터셋 상세정보 셋팅
 */

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
/**

/**
 * 입력창 수정 데이터 갱신
 */
const rowstate = ref("");
const updatedRowData = (newValue) => {
  updatedrowdata.value = newValue;
};

const sendRowState = (e) => {
  rowstate.value = e;
};
const updatedRowData2 = (newValue) => {
  //console.log(newValue);
  updatedrowdata2.value = newValue;
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  const filteredLen = updatedrowdata2.value.filter(
    (item) => item.dblOrderQty == 0
  ).length;

  ////console.log(updatedrowdata2.value);
  if (filteredLen > 0) {
    Swal.fire({
      title: "경고",
      text: "발주수량은 0보다 커야합니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  if (
    getRowStateCount(allstaterows2.value?.created) === 0 &&
    getRowStateCount(allstaterows2.value?.updated) === 0
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 존재하지 않습니다. 확인해주세요.",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'

      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await getOrderDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", ""),
      2
    );
    //console.log(res);
    if (res.data.List[0].strMsg == "1") {
      Swal.fire({
        title: "실패",
        text: "해당 발주일자는 마감 되었습니다. 다른 발주일자로 변경해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else if (res.data.List[0].strMsg !== "0") {
      Swal.fire({
        title: "실패",
        text: "발주등록 오류. 피앤시월드에 문의해 주십시오.",
        icon: "error", // 'success', 'error', 'warning', 'info', 'question'

        confirmButtonText: "확인",
      });
      return;
    } else {
      // return;
    }

    // if(res.data)
  } catch (error) {
    //console.log(error);
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "question", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;
        let result = 0;
        const res2 = await getSubSequence(
          store.state.userData.lngSequence,
          groupCd.value,
          nowStoreCd.value,
          cond.value.replaceAll("-", "")
        );

        const subsequence = res2.data.List[0].lngSubSequence;
        //console.log(subsequence);

        if (allstaterows2.value.created.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const expecteddates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmExpectedDate)
            .join("\u200b");
          const orderdates = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dtmOrderDate)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");
          const orderqtys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const curunitprices = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curUnitPrice)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const comments = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.created.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await saveNewOrderTmp(
            groupcds,
            storecds,
            store.state.userData.lngSequence,
            subsequence,
            stockids,
            expecteddates,
            orderdates,
            supplierids,
            orderqtys,
            curunitprices,
            cursupplys,
            curtaxs,
            comments
          );
          //console.log(res); // 애매 ?
          const res2 = await saveNewOrderTmp2(
            groupCd.value,
            nowStoreCd.value,
            store.state.userData.lngSequence,
            subsequence,
            cond.value.replaceAll("-", ""),
            cond3.value
          );
          //console.log(res2);

          if (res2.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        if (allstaterows2.value.updated.length > 0) {
          const groupcds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200b");
          const storecds = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200b");
          const orderNos = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderNo)
            .join("\u200b");
          const orderseqs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngOrderSeq)
            .join("\u200b");
          const supplierids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngSupplierID)
            .join("\u200b");

          const stockids = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.lngStockID)
            .join("\u200b");
          const dblorderqty = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.dblOrderQty)
            .join("\u200b");
          const cursupplys = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curSupply)
            .join("\u200b");

          const curtaxs = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTax)
            .join("\u200b");

          const curtotals = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.curTotal)
            .join("\u200b");

          const comments1 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strCheckComments)
            .join("\u200b");

          const comments2 = updatedrowdata2.value
            .filter((_, index) => allstaterows2.value.updated.includes(index))
            .map((item) => item.strOrderComments)
            .join("\u200b");

          const res = await updateOrderTmp(
            groupcds,
            storecds,
            orderNos,
            orderseqs,
            supplierids,
            stockids,
            dblorderqty,
            cursupplys,
            curtaxs,
            comments1,
            comments2,
            store.state.userData.lngSequence
          );
          //console.log(res); // 애매 ?
          if (res.data.RESULT_CD == "00") {
            result += 1;
          }
        }

        // //console.log(result);
        // //console.log(allstaterows2.value);
        if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 2
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length > 0 &&
          allstaterows2.value.created.length == 0 &&
          result == 1
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else if (
          allstaterows2.value.updated.length == 0 &&
          allstaterows2.value.created.length > 0 &&
          result == 1
        ) {
          Swal.fire({
            title: "성공",
            text: "저장을 완료하였습니다.",
            icon: "success",

            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error",

            confirmButtonText: "확인",
          });
        }
        store.state.loading = false;

        const saveSucceeded =
          (allstaterows2.value.updated.length > 0 &&
            allstaterows2.value.created.length > 0 &&
            result == 2) ||
          (allstaterows2.value.updated.length > 0 &&
            allstaterows2.value.created.length == 0 &&
            result == 1) ||
          (allstaterows2.value.updated.length == 0 &&
            allstaterows2.value.created.length > 0 &&
            result == 1);

        if (saveSucceeded) {
          resetPur306UnsavedGridState();
          await searchButton({ skipUnsavedCheck: true });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 취소 눌렀을 때 실행할 코드
        ////console.log("취소 버튼 클릭됨");
      }
    });
  } catch (error) {
    //console.log(error);
  } finally {
  }
};
const exporttoExcel = ref(false);
const exporttoExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */
const documentSubTitle = ref("");
const excelButton = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel.value = !exporttoExcel.value;
};

const excelButton2 = () => {
  documentSubTitle.value =
    "매장명 :" + clickedStoreNm.value + "\n" + "발주일자 : " + cond.value;

  exporttoExcel2.value = !exporttoExcel2.value;
};

const addrowDefault = ref("");
const addrowValues = ref(null);
const addRow4 = ref(false);
const addRow4InsertIndex = ref(-1);

const pur306IsNewOrderRow = (row) =>
  row?.new === true || row?.new === "true" || row?.new === 1;

const pur306CompareStockName = (left, right) =>
  String(left ?? "").localeCompare(String(right ?? ""), "ko");

const sortPur306OrderRowsByName = (rows) =>
  [...rows].sort((a, b) => {
    const byName = pur306CompareStockName(a?.strStockName, b?.strStockName);
    if (byName !== 0) return byName;
    return String(a?.lngStockID ?? "").localeCompare(String(b?.lngStockID ?? ""), "ko", {
      numeric: true,
    });
  });

const pur306NewRowInsertIndex = (name, stockId) => {
  const rows = updatedrowdata2.value ?? [];
  for (let i = 0; i < rows.length; i += 1) {
    if (!pur306IsNewOrderRow(rows[i])) return i;
    const byName = pur306CompareStockName(name, rows[i]?.strStockName);
    if (byName < 0) return i;
    if (
      byName === 0 &&
      String(stockId ?? "").localeCompare(String(rows[i]?.lngStockID ?? ""), "ko", {
        numeric: true,
      }) < 0
    ) {
      return i;
    }
  }
  return rows.length;
};
const addButton = async () => {
  const orderIds = getPur306OrderStockIds();
  const selected = updatedrowdata.value.filter((item) => item.lngCheck == true);
  if (selected.length > 0 && !(await isPur306OrderDateOpen())) {
    return;
  }
  const duplicates = selected.filter((item) => orderIds.has(item.lngStockID));
  const toAdd = selected.filter((item) => !orderIds.has(item.lngStockID));

  if (toAdd.length === 0) {
    if (duplicates.length > 0) {
      Swal.fire({
        title: "경고",
        html: `이미 발주자재에 등록된 품목입니다.<br><br>${formatPur306DuplicateStockLines(duplicates)}`,
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
    return;
  }

  const addedIds = new Set(toAdd.map((item) => item.lngStockID));
  const searchSnapshot = getPur306SearchGridSnapshot();

  const rowsForOrderAdd = toAdd.map((item) => ({
    ...item,
    lngCheck: false,
    dtmOrderDate: cond.value.replaceAll("-", ""),
  }));

  const rowsToInsert = sortPur306OrderRowsByName(rowsForOrderAdd);
  for (let i = 0; i < rowsToInsert.length; i++) {
    const source = rowsToInsert[i];
    addRow4InsertIndex.value = pur306NewRowInsertIndex(
      source.strStockName,
      source.lngStockID
    );
    addrowValues.value = {
      ...source,
      dtmExpectedDate: formatLocalDate(source.dtmExpectedDate).replaceAll("-", ""),
      dtmOrderDate: source.dtmOrderDate,
    };
    addRow4.value = !addRow4.value;

    await nextTick();
  }

  // rowData2.value = rowData2.value.concat(updatedrowdata.value);

  // updatedrowdata2.value = JSON.parse(JSON.stringify(rowData2.value));
  cachePur306SearchStockRows(
    searchSnapshot.filter((item) => addedIds.has(item.lngStockID))
  );
  applyPur306SearchGridRows(
    searchSnapshot
      .filter((item) => !addedIds.has(item.lngStockID))
      .map((item) => ({
        ...item,
        lngCheck: false,
      }))
  );
};

const deleteRow7 = ref(false);
const finalizePur306OrderDelete = async (rowsToRestore) => {
  await removePur306OrderRowsFromGrid();
  restorePur306SearchStockFromOrder(rowsToRestore);
  recalcPur306OrderTotals();
};

const isPur306OrderDateOpen = async () => {
  try {
    const res = await getOrderDate(
      groupCd.value,
      nowStoreCd.value,
      cond.value.replaceAll("-", ""),
      2
    );
    const msg = res?.data?.List?.[0]?.strMsg;
    if (msg == "1") {
      Swal.fire({
        title: "실패",
        text: "해당 발주일자는 마감 되었습니다. 다른 발주일자로 변경해 주십시오.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return false;
    }
    if (msg !== "0") {
      Swal.fire({
        title: "실패",
        text: "발주등록 오류. 피앤시월드에 문의해 주십시오.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return false;
    }
    return true;
  } catch (error) {
    Swal.fire({
      title: "실패",
      text: "발주등록 오류. 피앤시월드에 문의해 주십시오.",
      icon: "error",
      confirmButtonText: "확인",
    });
    return false;
  }
};

const deleteButton = async () => {
  const { unsaved, saved, all: checkedRows } = splitPur306CheckedOrderRows();

  if (checkedRows.length === 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 품목이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (saved.length > 0 && !(await isPur306OrderDateOpen())) {
    return;
  }

  const result = await Swal.fire({
    title: "경고",
    text: "정말 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  });

  if (!result.isConfirmed) {
    return;
  }

  if (saved.length === 0) {
    await finalizePur306OrderDelete(checkedRows);
    return;
  }

  try {
    store.state.loading = true;

    const groupcds = saved.map((item) => item.lngStoreGroup).join("\u200b");
    const storecds = saved.map((item) => item.lngStoreCode).join("\u200b");
    const ordernos = saved.map((item) => item.strOrderNo).join("\u200b");
    const orderseqs = saved.map((item) => item.lngOrderSeq).join("\u200b");
    const stockids = saved.map((item) => item.lngStockID).join("\u200b");
    const supplierids = saved.map((item) => item.lngSupplierID).join("\u200b");

    const res = await deleteStockOrderItem(
      groupcds,
      storecds,
      ordernos,
      orderseqs,
      stockids,
      supplierids,
      store.state.userData.lngSequence
    );

    store.state.loading = false;

    if (res.data.RESULT_CD == "00") {
      await finalizePur306OrderDelete(checkedRows);
      Swal.fire({
        title: "삭제 성공",
        text: "선택 하신 사항이 삭제되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "삭제 실패",
        text: "선택 사항 삭제가 실패되었습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    store.state.loading = false;
    console.log(error);
  }
};

const initAll = () => {
  pur306SearchStockCache.clear();
  pur306LastSearchStockIds.value = null;
  rowData.value = [];
  rowData2.value = [];
  updatedrowdata2.value = [];
  updatedrowdata.value = [];
  allstaterows.value = { created: [], updated: [], deleted: [] };
  allstaterows2.value = { created: [], updated: [], deleted: [] };
  cond3.value = "";
  cond4.value = "";
  cond5.value = "";
  cond6.value = "";
};
</script>

<style scoped>
/* ── 조회 AREA wire (PUR02/STKN06 패턴) ── */
.pur306-search-panel {
  --pur306-panel-pad-x: 2rem;
  --pur306-row-min-h: 2rem;
  --pur306-control-h: 2rem;
  /* 2번 콤보(11.5rem) 기준 — 1번을 2번과 동일 폭으로 */
  --pur306-store-combo-2: 11.5rem;
  --pur306-store-combo-w: var(--pur306-store-combo-2);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin-top: 0;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(229 231 235);
  overflow: hidden;
}

@media (min-width: 640px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 768px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 3rem;
  }
}

@media (min-width: 1024px) {
  .pur306-search-panel {
    --pur306-panel-pad-x: 3.5rem;
  }
}

.pur306-search-grid {
  display: flex;
  flex-direction: column;
  gap: var(--pur306-row-gap);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding-left: var(--pur306-panel-pad-x);
  padding-right: var(--pur306-panel-pad-x);
}

.pur306-block {
  display: flex;
  flex-direction: column;
  gap: var(--pur306-row-gap);
  width: 100%;
  min-width: 0;
}

.pur306-block--mat {
  margin-top: 0;
  padding-top: var(--pur306-row-gap);
  border-top: 2px solid #94a3b8;
  --pur306-mat-control-scale: 0.7;
  --pur306-mat-pair-gap: 1.75rem;
  --pur306-mat-input-gap: 0.75rem;
}

/* mat — 콤보·거래처 70% + 항목 간 공백 */
.pur306-block--mat .pur306-row > .pur306-cell-field:not(.pur306-mat-code-field) {
  width: calc(100% * var(--pur306-mat-control-scale));
  max-width: calc(100% * var(--pur306-mat-control-scale));
  justify-self: start;
}

.pur306-block--mat .pur306-row > .pur306-cell-field:not(:last-child):not(.pur306-mat-code-field) {
  margin-right: calc(var(--pur306-mat-pair-gap) - var(--pur306-pair-gap));
}

.pur306-block--mat .pur306-mat2-code-pair {
  margin-right: 0;
}

.pur306-row {
  display: grid;
  width: 100%;
  min-width: 0;
  column-gap: var(--pur306-pair-gap);
  align-items: center;
  min-height: var(--pur306-row-min-h);
}

/* 1행 — 매장 | 발주일자(우측 정렬) */
.pur306-row--order1 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, max-content);
}

.pur306-row--order1 > .pur306-pick-slot {
  justify-self: start;
}

.pur306-row--order1 > .pur306-date-field {
  justify-content: flex-end;
  justify-self: end;
  width: max-content;
  max-width: 100%;
}

/* 2행 — 1~5열 3행과 동일, 6열은 우측(발주조회)까지 확장 */
.pur306-row--order2 {
  grid-template-columns:
    var(--pur306-label-col) var(--pur306-store-combo-w)
    var(--pur306-label-col) var(--pur306-store-combo-w)
    var(--pur306-label-col) minmax(var(--pur306-store-combo-w), 1fr);
}

/* 3행 — 공급가 | 부가세 | 합계 (6열 고정) */
.pur306-row--order3 {
  grid-template-columns:
    var(--pur306-label-col) var(--pur306-store-combo-w)
    var(--pur306-label-col) var(--pur306-store-combo-w)
    var(--pur306-label-col) var(--pur306-store-combo-w);
}

.pur306-row--order2 > .pur306-order2-gap {
  grid-column: 3 / 5;
  min-width: 0;
}

.pur306-row--order2 > .pur306-deadline-field,
.pur306-row--order3 > .pur306-cell-field {
  width: var(--pur306-store-combo-w);
  max-width: var(--pur306-store-combo-w);
  flex: 0 0 auto;
}

.pur306-row--order3 .pur306-sg-input {
  text-align: right;
}

.pur306-row--order2 > .pur306-order2-comment-field {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  justify-self: stretch;
}

.pur306-row--order2 > .pur306-order2-comment-field .pur306-sg-input {
  width: 100%;
  max-width: 100%;
}

.pur306-row--order2 > .pur306-deadline-field {
  flex: 0 0 auto;
}

.pur306-deadline-field {
  justify-self: start;
}

.pur306-sg-input--deadline {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  text-align: center;
}

.pur306-sg-input--deadline:disabled {
  color: rgb(220 38 38) !important;
  -webkit-text-fill-color: rgb(220 38 38);
  font-weight: 600;
  text-align: center;
}

.pur306-row--mat1 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr);
}

.pur306-row--mat2 {
  grid-template-columns:
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr)
    var(--pur306-label-col) minmax(0, 1fr);
}

/* mat2 — 자재특성 | 자재코드/명(거래처~자재분류 label 정렬) */
.pur306-row--mat2 > .pur306-sg-label:nth-child(1) {
  grid-column: 1;
}

.pur306-row--mat2 > .pur306-cell-field:nth-child(2) {
  grid-column: 2;
}

/* 자재코드/명 — 거래처 label(3열) ~ 자재분류 label(5열) 정렬, 입력 1:1.5 */
.pur306-mat2-code-pair {
  grid-column: 3 / 7;
  display: grid;
  grid-template-columns:
    var(--pur306-label-col)
    minmax(0, 1fr)
    var(--pur306-label-col)
    max-content;
  column-gap: var(--pur306-pair-gap);
  align-items: center;
  min-width: 0;
  min-height: var(--pur306-row-min-h);
}

.pur306-mat2-code-pair > .pur306-sg-label {
  grid-column: 1;
  margin-left: 0;
  justify-content: center;
  text-align: center;
}

.pur306-mat2-code-pair > .pur306-mat-code-field {
  grid-column: 2 / 4;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  column-gap: var(--pur306-mat-input-gap);
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.pur306-mat2-code-pair > .pur306-mat-code-search-btn {
  grid-column: 4;
  justify-self: start;
}

.pur306-mat-code-field .pur306-sg-input--code,
.pur306-mat-code-field .pur306-sg-input--name {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: none;
}

/* 항목 사이 간격 — 필드 쪽 margin (라벨 가운데 정렬 유지) */
.pur306-row > .pur306-cell-field:not(:last-child) {
  margin-right: calc(var(--pur306-col-gap) - var(--pur306-pair-gap));
}

.pur306-row > .pur306-sg-label,
.pur306-row > .pur306-cell-field {
  min-height: var(--pur306-row-min-h);
}

.pur306-row > .pur306-sg-label {
  justify-self: center;
}

.pur306-sg-label {
  box-sizing: border-box;
  width: var(--pur306-label-col);
  min-width: var(--pur306-label-col);
  max-width: var(--pur306-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pur306-sg-label--danger {
  color: rgb(220 38 38);
}

.pur306-req::before {
  content: "*";
  color: rgb(220 38 38);
  margin-right: 0.15rem;
  font-weight: 700;
}

.pur306-cell-field {
  min-width: 0;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.pur306-inline-field {
  flex-wrap: nowrap;
  gap: 0.375rem;
}

.pur306-sg-input,
.pur306-sg-select {
  box-sizing: border-box;
  height: var(--pur306-control-h);
  min-height: var(--pur306-control-h);
  max-height: var(--pur306-control-h);
  width: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(55 65 81);
  background: #fff;
  border: 1px solid var(--pur306-control-border);
  border-radius: 0.375rem;
}

.pur306-sg-input:focus,
.pur306-sg-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.pur306-sg-input:disabled {
  background: rgb(241 245 249);
  color: rgb(71 85 105);
}

.pur306-sg-input--danger {
  color: rgb(220 38 38);
  font-weight: 600;
}

.pur306-sg-input--date {
  flex: 0 1 9rem;
  width: 9rem;
  max-width: 100%;
  min-width: 0;
}

.pur306-sg-input--code {
  flex: 0 0 5.5rem;
  width: 5.5rem;
  max-width: 5.5rem;
}

.pur306-sg-input--name {
  flex: 1 1 auto;
  min-width: 0;
}

.pur306-sub-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: var(--pur306-control-h);
  min-height: var(--pur306-control-h);
  min-width: 4.5rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: rgb(30 64 175);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.375rem;
  background-color: rgb(239 246 255);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.08);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.pur306-sub-btn:hover {
  background-color: rgb(219 234 254);
  border-color: rgb(96 165 250);
}

.pur306-sub-btn.pur306-mat-code-search-btn--pending {
  color: #9f1239;
  background-color: #fde8ea;
  border-color: #e7a3a8;
  font-weight: 700;
  animation: pur306-search-pending 2.4s ease-in-out infinite;
}

.pur306-sub-btn.pur306-mat-code-search-btn--pending:hover {
  animation: none;
  color: #9f1239;
  background-color: #f8d0d4;
  border-color: #d4787e;
  box-shadow: 0 0 0 2px rgb(190 18 60 / 0.12);
}

@keyframes pur306-search-pending {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(190 18 60 / 0);
  }
  50% {
    box-shadow: 0 0 0 3px rgb(190 18 60 / 0.16);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pur306-sub-btn.pur306-mat-code-search-btn--pending {
    animation: none;
    box-shadow: 0 0 0 2px rgb(190 18 60 / 0.14);
  }
}

/* 그리드 헤더 — whitebutton(26px) 높이 + 서브버튼 톤 */
.pur306-sub-btn--grid {
  height: 1.625rem;
  min-height: 1.625rem;
  max-height: 1.625rem;
  min-width: auto;
  padding: 0 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}

/* 그리드 헤더 — 서브버튼 + 컴팩트 바 */
.pur306-grid-bar {
  position: relative;
  z-index: 5;
  align-items: center;
  min-height: 1.875rem;
  padding: 0.125rem 0.5rem;
}

.pur306-grid-title-row {
  display: flex;
  align-items: flex-end;
  min-width: 0;
  gap: 1.25rem;
}

.pur306-grid-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: #111827;
}

.pur306-grid-title::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.pur306-dblclick-hint {
  min-width: 0;
  padding-bottom: 0.05rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: #b85a5a;
}

.pur306-grid-title-row--center {
  align-items: center;
  gap: 0.125rem;
}

.pur306-expand-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: #1d4ed8;
  cursor: pointer;
}

.pur306-expand-icon {
  width: 1.875rem;
  height: 1.875rem;
}

.pur306-expand-btn:hover:not(:disabled),
.pur306-expand-btn:focus-visible:not(:disabled) {
  background: rgb(37 99 235 / 0.12);
}

.pur306-expand-btn:disabled {
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.55;
}

.pur306-expand-tip {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  z-index: 30;
  padding: 6px 10px;
  border: 1px solid #6b7280;
  background-color: #4b5563;
  color: #f9fafb;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  transform: translateX(-50%);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.pur306-expand-btn:hover .pur306-expand-tip,
.pur306-expand-btn:focus-visible .pur306-expand-tip {
  opacity: 1;
  visibility: visible;
}

.pur306-order-pop-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  padding: 0.75rem 1rem 1rem;
  overflow: hidden;
}

.pur306-order-pop-grid {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.pur306-order-pop-grid--pending {
  opacity: 0;
  pointer-events: none;
}

.pur306-order-pop-legend {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 1.25rem;
}

.pur306-order-pop-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}

.pur306-order-pop-swatch {
  width: 0.875rem;
  height: 0.875rem;
  border: 1px solid #9ca3af;
  border-radius: 0.125rem;
  background: #d1d5db;
}

.pur306-order-pop-swatch--new {
  border-color: #e4c8c2;
  background: #f8e2de;
}

.pur306-order-pop-grid :deep(.rg-row-unsaved) {
  background: #f8e2de;
}

.pur306-order-pop-note {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
  color: #64748b;
}

.pur306-grid-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.pur306-grid-body {
  margin-top: 0.25rem;
}

.pur306-grid-layout {
  min-height: 0;
}

.pur306-grid-transfer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0 0.125rem;
}

.pur306-transfer-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: rgb(37 99 235);
  border: 1px solid rgb(147 197 253);
  border-radius: 0.5rem;
  background: linear-gradient(180deg, rgb(239 246 255) 0%, rgb(219 234 254) 100%);
  box-shadow: 0 1px 3px 0 rgb(59 130 246 / 0.18);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.pur306-transfer-btn:hover {
  color: rgb(29 78 216);
  border-color: rgb(96 165 250);
  background: rgb(219 234 254);
  box-shadow: 0 2px 6px 0 rgb(59 130 246 / 0.22);
  transform: translateY(-1px);
}

.pur306-transfer-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(59 130 246 / 0.15);
}

.pur306-transfer-icon {
  display: block;
  width: 1.125rem;
  height: 1.125rem;
  pointer-events: none;
}

/* PickStore — STKN06_012 store-grid (3콤보 한 세트) */
.pur306-pick-slot {
  min-width: 0;
  overflow: hidden;
}

.pur306-pick-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

.pur306-pick-slot :deep(> div.flex > div:first-child) {
  display: none;
}

/* 매장 3콤보 — 1행 전용 내부 그리드 */
.pur306-pick-slot--store-grid :deep(> div.flex) {
  display: grid !important;
  grid-template-columns:
    var(--pur306-store-combo-w)
    var(--pur306-store-combo-w)
    minmax(0, 1fr) !important;
  width: max-content !important;
  max-width: 100% !important;
  min-width: 0 !important;
  flex-wrap: unset !important;
  align-items: stretch !important;
  gap: var(--pur306-item-gap) !important;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div) {
  min-width: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div:last-child) {
  flex: unset !important;
  width: 50% !important;
  min-width: 0 !important;
  max-width: 50% !important;
  justify-self: start;
}

.pur306-pick-slot--store-grid :deep(> div.flex > div:last-child > div) {
  max-width: 100% !important;
  width: 100% !important;
}

.pur306-search-panel .pur306-pick-slot :deep(select) {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  max-height: var(--pur306-control-h) !important;
  margin-left: 0 !important;
  padding: 0 0.375rem !important;
  font-size: 0.875rem !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
}

.pur306-search-panel .pur306-pick-slot :deep(select:focus) {
  border-color: #3b82f6 !important;
}

.pur306-search-panel .pur306-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  max-height: var(--pur306-control-h) !important;
  width: 100% !important;
  max-width: 100% !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
}

.pur306-pick-slot :deep(.vs__dropdown-toggle) {
  height: 100% !important;
  min-height: 0 !important;
  border: none !important;
}

/* BusinessClient2 — PUR02 패턴 */
.pur306-bc-slot :deep(> div.flex.text-base) {
  margin: 0 !important;
  width: 100% !important;
  min-width: 0 !important;
  gap: 0 !important;
}

.pur306-search-panel .pur306-bc-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--pur306-control-h) !important;
  min-height: var(--pur306-control-h) !important;
  border: 1px solid var(--pur306-control-border) !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
  background: #fff !important;
  max-width: 100%;
  min-width: 0;
}

@media (max-width: 1279px) {
  .pur306-row--mat1 {
    grid-template-columns:
      var(--pur306-label-col) minmax(0, 1fr)
      var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--mat1 > .pur306-sg-label:nth-child(5),
  .pur306-row--mat1 > .pur306-cell-field:nth-child(6),
  .pur306-row--mat1 > .pur306-sg-label:nth-child(7),
  .pur306-row--mat1 > .pur306-cell-field:nth-child(8) {
    margin-top: var(--pur306-row-gap);
  }

  .pur306-row--mat1 > .pur306-sg-label:nth-child(5) {
    margin-left: 0;
  }

  .pur306-row--mat2 {
    grid-template-columns:
      var(--pur306-label-col) minmax(0, 1fr)
      var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--mat2 > .pur306-mat2-code-pair {
    grid-column: auto;
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr) max-content;
  }

  .pur306-mat2-code-pair > .pur306-mat-code-field {
    grid-column: 2;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }

  .pur306-mat2-code-pair > .pur306-mat-code-search-btn {
    grid-column: 3;
  }
}

@media (max-width: 1023px) {
  .pur306-row--order1,
  .pur306-row--order2,
  .pur306-row--order3,
  .pur306-row--mat1,
  .pur306-row--mat2 {
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-row--order1 > .pur306-date-field,
  .pur306-row--order2 > .pur306-deadline-field,
  .pur306-row--order2 > .pur306-order2-comment-field,
  .pur306-row--order3 > .pur306-cell-field {
    justify-self: stretch;
    width: 100%;
    max-width: 100%;
  }

  .pur306-order2-gap {
    display: none;
  }

  .pur306-row--mat2 > .pur306-mat2-code-pair {
    grid-column: auto;
    grid-template-columns: var(--pur306-label-col) minmax(0, 1fr);
  }

  .pur306-mat2-code-pair > .pur306-mat-code-field {
    grid-column: 2;
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--pur306-row-gap);
  }

  .pur306-mat2-code-pair > .pur306-mat-code-search-btn {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: var(--pur306-row-gap);
  }

  .pur306-block--mat .pur306-row > .pur306-cell-field:not(.pur306-mat-code-field) {
    width: 100%;
    max-width: 100%;
  }

  .pur306-block--mat .pur306-row > .pur306-cell-field:not(:last-child):not(.pur306-mat-code-field) {
    margin-right: 0;
  }

  .pur306-row > .pur306-sg-label:not(:first-child) {
    margin-left: 0;
    margin-top: var(--pur306-row-gap);
  }

  .pur306-row > .pur306-cell-field:not(:last-child) {
    margin-right: 0;
  }

  .pur306-row > .pur306-cell-field:not(:first-of-type) {
    margin-top: 0;
  }
}

.pur306-focus-sink {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}

.pur306-detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgba(15, 23, 42, 0.45);
}

.pur306-order-pop-backdrop {
  opacity: 0;
  transition: opacity 0.65s ease;
}

.pur306-order-pop-backdrop--in {
  opacity: 1;
}

.pur306-order-pop {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .pur306-order-pop-backdrop {
    transition: none;
  }
}

.pur306-detail-dialog {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 20rem;
  min-height: 17.5rem;
  overflow: hidden;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.2);
}

.pur306-detail-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef9c3;
  border-bottom: 1px solid #e5e7eb;
  cursor: move;
  user-select: none;
  touch-action: none;
}

.pur306-detail-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.pur306-detail-btn {
  cursor: pointer;
  height: 2rem;
  padding: 0 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.pur306-detail-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  padding: 1rem;
  overflow: auto;
}

.pur306-detail-basis {
  padding: 0.625rem 0.75rem;
  background: #e8eef4;
  border: 1px solid #d5dee8;
  border-radius: 0.375rem;
}

.pur306-detail-basis-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem 0.75rem;
  margin: 0;
}

.pur306-detail-basis-grid > div {
  min-width: 0;
}

.pur306-detail-basis-grid dt {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.pur306-detail-basis-grid dd {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e3a8a;
  word-break: break-all;
}

.pur306-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem 1rem;
  margin: 0;
}

.pur306-detail-grid > div {
  min-width: 0;
}

.pur306-detail-grid dt {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.pur306-detail-grid dd {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  word-break: break-all;
}

.pur306-detail-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

.pur306-detail-field-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #2563eb;
}

.pur306-detail-field-title::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.pur306-detail-input {
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.pur306-detail-note {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1d4ed8;
}

.pur306-detail-actions {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
}

.pur306-detail-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1rem;
  height: 1rem;
  cursor: nwse-resize;
  touch-action: none;
}

.pur306-detail-resize::before {
  content: "";
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  width: 0.55rem;
  height: 0.55rem;
  border-right: 2px solid #64748b;
  border-bottom: 2px solid #64748b;
}

.pur306-detail-btn--ok {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
</style>

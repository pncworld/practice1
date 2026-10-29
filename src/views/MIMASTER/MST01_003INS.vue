/*--############################################################################
# Filename : MST01_003INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="mst003-page box-border flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1">
  <!-- 조회조건  START-->
  <div
    class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
    <PageName></PageName>
    <div class="flex flex-wrap items-center justify-end gap-2 pr-5 mr-9">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <div
    class="absolute z-50 inset-0 bg-black bg-opacity-50 w-full h-full"
    v-if="showPopUp">
    <div
      class="fixed top-[25%] left-[25%] h-[55vh] w-[55vw] bg-white rounded-lg">
      <div
        class="grid grid-rows-[1fr,11fr,1fr] grid-cols-1 text-xl p-5 font-semibold">
        <div class="flex justify-between">
          <div>할인설정 복사</div>
          <div>
            <button class="button primary" @click="copyButton">복사</button>
          </div>
        </div>
        <div class="grid grid-rows-1 grid-cols-2 space-x-3">
          <div class="grid grid-rows-[1fr,3fr,7fr]">
            <div class="flex justify-start text-base">기준 메뉴코드</div>
            <div class="grid grid-rows-2 grid-cols-[1fr,3fr] text-sm h-20">
              <div
                class="bg-gray-100 flex justify-center items-center rounded-tl-lg border border-gray-600">
                메뉴코드
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-tr-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue3"
                  disabled
                  class="h-full w-full p-1" />
              </div>
              <div
                class="bg-gray-100 flex justify-center items-center rounded-bl-lg border border-gray-600">
                메뉴명
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-br-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue6"
                  disabled
                  class="h-full w-full p-1" />
              </div>
            </div>
            <div>
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="5"
                :rowData="rowData4"
                :setStateBar="false"
                :rowStateeditable="false">
              </Realgrid>
            </div>
          </div>
          <div class="grid grid-rows-[1fr,1fr,7fr]">
            <div class="text-base flex justify-start">대상 메뉴코드 선택</div>
            <div class="grid grid-rows-1 grid-cols-[2fr,3fr] text-sm h-8">
              <div class="text-sm flex justify-center items-center">
                메뉴코드/메뉴명
              </div>
              <div class="rounded-lg border">
                <input
                  type="text"
                  v-model="searchWord5"
                  class="h-full w-full pl-1" />
              </div>
            </div>
            <div>
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="4"
                :showCheckBar="true"
                :setStateBar="false"
                :rowStateeditable="false"
                :rowData="rowData5"
                :searchColId="'menuCd,menuNm'"
                :searchWord3="searchWord5"
                @checkedRowData="checkedRowData5">
              </Realgrid>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-2">
          <button type="button" @click="closePopUp" class="whitebutton mst003-sub-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="absolute z-50 inset-0 bg-black bg-opacity-50 w-full h-full"
    v-if="showDeliveryCopyPopUp">
    <div class="fixed top-[28%] left-[30%] w-[40vw] min-w-[32rem] bg-white rounded-lg">
      <div class="grid grid-cols-1 text-base p-5 font-semibold gap-3">
        <div class="flex items-center justify-between">
          <div class="text-xl">배달메뉴 설정 복사</div>
          <button class="button primary" @click="copyDeliveryMenuToStore">복사</button>
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 메뉴코드
          </div>
          <input
            type="text"
            :value="selectedMenuCodeForDelivery || gridvalue3"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 메뉴명
          </div>
          <input
            type="text"
            :value="gridvalue6"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 매장
          </div>
          <input
            type="text"
            :value="deliveryCopyBaseStoreLabel"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            대상 매장
          </div>
          <div class="mst003-vselect-slot min-w-0">
            <v-select
              v-model="deliveryCopyTargetStoreCd"
              :options="imageStoreOptions"
              label="strName"
              placeholder="매장 선택"
              class="custom-select2"
              append-to-body
              :clearable="true"
              :reduce="(item) => String(item.lngStoreCode)" />
          </div>
        </div>
        <div class="flex justify-end mt-1">
          <button type="button" @click="closeDeliveryCopyPopUp" class="whitebutton mst003-sub-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="z-10 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-12 py-4">
    <div class="mst003-search-grid min-w-0">
      <div class="mst003-cell">
        <span class="mst003-sg-label">매장명</span>
        <div class="mst003-cell-field mst003-pick-slot min-w-0">
          <PickStore
            compactSearchBar
            main-name="매장명"
            @update:storeGroup="lngStoreGroup"
            @update:storeCd="handleStoreCd"
            @storeNm="handlestoreNm"
            :hidesub="hidesub"
            :hideAttr="hideAttr"
            @update:ischanged="handleinitAll"
            @update:ischanged2="searchinit"></PickStore>
        </div>
      </div>
    </div>
  </div>
  <!-- AI 대화 팝업: 대화로 등록할 메뉴를 만들고, 적용은 기존 addRow 경로 -->
  <Teleport to="body">
    <div v-if="aiChatOpen" class="mst003-chat-mask">
      <!-- 제목줄을 끌어 이동, 오른쪽 아래 모서리를 끌어 크기 조정 -->
      <div
        ref="aiChatPopupRef"
        class="mst003-chat-popup"
        :style="aiChatPopupStyle"
        role="dialog"
        aria-modal="true">
        <div class="mst003-chat-head" @pointerdown="startAiChatDrag">
          <h2 class="mst003-chat-title">
            AI 메뉴관리 도우미
            <span v-if="!isStoreImageFeatureEnabled && clickedStoreNm" class="mst003-chat-store"
              >· {{ clickedStoreNm }}</span
            >
          </h2>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--rose"
              :disabled="aiChatLoading"
              @click="resetAiChat">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              새 대화
            </button>
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="closeAiChat">
              <svg
                class="pnc-sub-btn__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>
        <div v-if="aiChatTestMode" class="mst003-ai-test">
          테스트 모드: AI를 호출하지 않은 고정 예시 응답입니다. 저장하지 마세요.
        </div>
        <div ref="aiChatLogRef" class="mst003-chat-log">
          <div
            v-for="(msg, idx) in aiChatDisplayMessages"
            :key="idx"
            class="mst003-chat-row"
            :class="msg.role === 'user' ? 'mst003-chat-row--user' : 'mst003-chat-row--ai'">
            <span
              v-if="msg.role !== 'user'"
              class="mst003-chat-avatar"
              :class="{ 'mst003-chat-avatar--typing': msg.typing }">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 2.8v2.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round" />
                <circle cx="12" cy="2.6" r="1.2" fill="currentColor" />
                <circle
                  cx="12"
                  cy="13.6"
                  r="8.2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8" />
                <g class="mst003-robot-eyes">
                  <circle cx="9" cy="12.6" r="1.4" fill="currentColor" />
                  <circle cx="15" cy="12.6" r="1.4" fill="currentColor" />
                </g>
                <path
                  d="M9.3 16.3c1.6 1.3 3.8 1.3 5.4 0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round" />
              </svg>
            </span>
            <div class="mst003-chat-bubble">
              <!-- 대분류·소분류 단계: 말풍선 안 라디오로 고르면 그 선택을 바로 보낸다 (입력창에 직접 써도 됨) -->
              <template v-if="msg.choices">
                <label
                  v-for="g in aiChatGroupChoices"
                  :key="g.code"
                  class="mst003-chat-choice">
                  <input
                    type="radio"
                    name="aiChatGroupChoice"
                    :value="g.code"
                    :disabled="aiChatLoading"
                    @change="chooseAiChatGroup(g)" />
                  <span>{{ g.label || `[${g.code}] ${g.name}` }}</span>
                </label>
              </template>
              <!-- 시작 안내: 입력 예시만 보여 준다 (버튼 없음, 문장을 입력하면 AI가 작업 종류를 판단) -->
              <template v-else-if="msg.startMenu">
                <div>{{ msg.content }}</div>
                <div class="mst003-chat-examples-title">예시</div>
                <ul class="mst003-chat-examples">
                  <li v-for="ex in AI_START_EXAMPLES" :key="ex.label">
                    <span class="mst003-chat-examples-label">{{ ex.label }}</span>
                    {{ ex.text }}
                  </li>
                </ul>
              </template>
              <!-- 메뉴 조회 결과: 행을 누르면 메뉴 목록 그리드에서 그 메뉴로 이동 -->
              <template v-else-if="msg.searchRows">
                <div>{{ msg.content }}</div>
                <div v-if="msg.searchRows.length > 0" class="mst003-chat-result-wrap">
                  <table class="mst003-chat-lang mst003-chat-result">
                    <thead>
                      <tr>
                        <th>메뉴코드</th>
                        <th>메뉴명</th>
                        <th class="text-right">판매가</th>
                        <th>분류</th>
                        <th>사용여부</th>
                        <th v-if="msg.searchDateLabel">{{ msg.searchDateLabel }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="r in msg.searchRows"
                        :key="r.code"
                        class="mst003-chat-result-row"
                        title="누르면 메뉴 목록에서 이 메뉴로 이동합니다"
                        @click="focusAiMenuRowFromChat(r.code)">
                        <td>{{ r.code }}</td>
                        <td>{{ r.name }}</td>
                        <td class="text-right">{{ r.price }}</td>
                        <td>{{ r.group || "-" }}</td>
                        <td :class="{ 'text-red-600': r.use === '미사용' }">{{ r.use }}</td>
                        <td v-if="msg.searchDateLabel" class="whitespace-nowrap">{{ r.date }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <!-- 메뉴명 오타 확인: 고친 이름으로 변경 / 그대로 사용 (한 번만 누를 수 있음) -->
              <template v-else-if="msg.typoFix">
                <div>{{ msg.content }}</div>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="msg.typoDone || aiChatLoading || !AI_TYPO_FIX_STEPS.includes(aiChatStep)"
                    @click="answerAiChatTypo(msg, true)">
                    '{{ msg.typoFix.to }}'(으)로 변경
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="msg.typoDone || aiChatLoading || !AI_TYPO_FIX_STEPS.includes(aiChatStep)"
                    @click="answerAiChatTypo(msg, false)">
                    그대로 사용
                  </button>
                </div>
              </template>
              <!-- 메뉴 이미지 안내: 말풍선 안 「이미지 선택」·「이미지 없음」 (가장 최근 안내에서, 이미지 단계일 때만 누를 수 있음) -->
              <template v-else-if="msg.imageAsk">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'image' || aiChatLoading || msg.imageAskSeq !== aiChatImageAskSeqNow"
                    @click="chooseAiChatImageFile">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <rect
                        x="3.5"
                        y="5"
                        width="17"
                        height="14"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2" />
                      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
                      <path
                        d="M4.5 17l5-4.5 3.5 3 2.5-2 4 3.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round" />
                    </svg>
                    이미지 선택
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'image' || aiChatLoading || msg.imageAskSeq !== aiChatImageAskSeqNow"
                    @click="skipAiChatImage">
                    이미지 없음
                  </button>
                </div>
              </template>
              <!-- 메뉴 매출 (안 팔린 메뉴는 판매가·분류): 행을 누르면 메뉴 목록 그리드에서 그 메뉴로 이동 -->
              <template v-else-if="msg.salesRows">
                <div>{{ msg.content }}</div>
                <div v-if="msg.salesRows.length > 0" class="mst003-chat-result-wrap">
                  <table class="mst003-chat-lang mst003-chat-result">
                    <thead>
                      <tr v-if="msg.salesUnsold">
                        <th>메뉴코드</th>
                        <th>메뉴명</th>
                        <th class="text-right">판매가</th>
                        <th>분류</th>
                      </tr>
                      <tr v-else>
                        <th class="text-right">순위</th>
                        <th>메뉴코드</th>
                        <th>메뉴명</th>
                        <th class="text-right">수량</th>
                        <th class="text-right">실매출</th>
                        <th class="text-right">구성비</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="r in msg.salesRows"
                        :key="r.code"
                        class="mst003-chat-result-row"
                        title="누르면 메뉴 목록에서 이 메뉴로 이동합니다"
                        @click="focusAiMenuRowFromChat(r.code)">
                        <template v-if="msg.salesUnsold">
                          <td>{{ r.code }}</td>
                          <td>{{ r.name }}</td>
                          <td class="text-right">{{ r.price }}</td>
                          <td>{{ r.group || "-" }}</td>
                        </template>
                        <template v-else>
                          <td class="text-right">{{ r.rank }}</td>
                          <td>{{ r.code }}</td>
                          <td>{{ r.name }}</td>
                          <td class="text-right">{{ r.cnt }}</td>
                          <td class="text-right">{{ r.amt }}</td>
                          <td class="text-right">{{ r.rate }}</td>
                        </template>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <!-- 분류 목록: 대분류별 소분류와 메뉴 수 -->
              <template v-else-if="msg.groupRows">
                <div>{{ msg.content }}</div>
                <div v-if="msg.groupRows.length > 0" class="mst003-chat-result-wrap">
                  <table class="mst003-chat-lang mst003-chat-result">
                    <thead>
                      <tr>
                        <th>대분류</th>
                        <th>소분류</th>
                        <th class="text-right">메뉴 수</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="r in msg.groupRows" :key="r.key">
                        <td v-if="r.span" :rowspan="r.span" class="font-semibold">{{ r.main }}</td>
                        <td :class="{ 'text-gray-400': r.cnt === '-' }">{{ r.sub }}</td>
                        <td class="text-right">{{ r.cnt }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <!-- 메뉴 수정: 대상 메뉴가 여러 개일 때 선택 -->
              <template v-else-if="msg.editPick">
                <div>{{ msg.content }}</div>
                <div class="mst003-chat-check-list">
                  <label
                    v-for="r in msg.editPick"
                    :key="r.lngCode"
                    class="mst003-chat-choice">
                    <input
                      type="radio"
                      name="aiEditPick"
                      :disabled="aiChatStep !== 'editPick' || aiChatLoading"
                      @change="pickAiEditTarget(r)" />
                    <span>[{{ r.lngCode }}] {{ r.strName }} ({{ formatAiPrice(r.lngPrice) }}원)</span>
                  </label>
                </div>
              </template>
              <!-- 메뉴 수정 확인: 변경 전/후 + 수정 저장 / 취소 -->
              <template v-else-if="msg.editRows">
                <div>{{ msg.content }}</div>
                <table class="mst003-chat-lang mst003-chat-summary">
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>변경 전</th>
                      <th>변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in msg.editRows" :key="row.label">
                      <th>{{ row.label }}</th>
                      <td>{{ row.before }}</td>
                      <td class="font-semibold text-blue-700">{{ row.after }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'editConfirm' || aiChatLoading || aiEditPending?.seq !== msg.editSeq"
                    @click="saveAiEdit">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    수정 저장
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'editConfirm' || aiChatLoading || aiEditPending?.seq !== msg.editSeq"
                    @click="cancelAiEdit">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2" />
                      <path
                        d="M9 9l6 6M15 9l-6 6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round" />
                    </svg>
                    취소
                  </button>
                </div>
              </template>
              <!-- 조정한 이미지 미리보기 -->
              <template v-else-if="msg.image">
                <div>{{ msg.content }}</div>
                <div class="mst003-chat-img-wrap">
                  <img
                    :src="msg.image"
                    alt="조정한 메뉴 이미지"
                    class="mst003-chat-img"
                    @click="aiChatZoomImage = msg.image" />
                  <!-- 미리보기 확대 -->
                  <button
                    type="button"
                    class="mst003-chat-img-zoom"
                    title="확대"
                    @click="aiChatZoomImage = msg.image">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle
                        cx="10.5"
                        cy="10.5"
                        r="6.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2" />
                      <path
                        d="M10.5 7.5v6M7.5 10.5h6M15.5 15.5l4.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round" />
                    </svg>
                    확대
                  </button>
                </div>
              </template>
              <!-- 이미지 등록 확인: 등록 / 다시 선택 (확인 단계일 때만 누를 수 있음) -->
              <template v-else-if="msg.imageConfirm">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'imageConfirm'"
                    @click="confirmAiChatImage(true)">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    등록
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'imageConfirm'"
                    @click="confirmAiChatImage(false)">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    다시 선택
                  </button>
                </div>
              </template>
              <!-- 다국어 제안: 한국어(입력한 메뉴명)·영어·일본어·중국어 + 등록/취소 (가장 최근 제안에서만 누를 수 있음) -->
              <template v-else-if="msg.multiLang">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <table class="mst003-chat-lang">
                  <tbody>
                    <tr v-for="l in AI_LANG_ROWS" :key="l.key">
                      <th>{{ l.label }}</th>
                      <td>{{ msg.multiLang[l.key] || "-" }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'multiLang' || aiChatPendingLang?.seq !== msg.langSeq"
                    @click="confirmAiChatMultiLang(true)">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    등록
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'multiLang' || aiChatPendingLang?.seq !== msg.langSeq"
                    @click="confirmAiChatMultiLang(false)">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <circle
                        cx="12"
                        cy="12"
                        r="8.25"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2" />
                      <path
                        d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round" />
                    </svg>
                    취소
                  </button>
                </div>
              </template>
              <!-- 메뉴코드 예시: '이 코드 사용' 버튼으로 확정 (메뉴코드 단계일 때만 누를 수 있음) -->
              <template v-else-if="msg.codeConfirm">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'code'"
                    @click="useSuggestedAiChatCode">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    자동생성 코드 사용
                  </button>
                </div>
              </template>
              <!-- 추가 설정 안내: 항목 이름 강조 + 바로 고를 수 있는 버튼 (추가 설정 단계일 때만 누를 수 있음) -->
              <template v-else-if="msg.optionsMenu">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <div class="mst003-chat-confirm-btns">
                  <button
                    v-for="chip in AI_CHAT_OPTION_CHIPS"
                    :key="chip"
                    type="button"
                    class="pnc-sub-btn"
                    :class="{ 'pnc-sub-btn--gray': chip === '완료' }"
                    :disabled="aiChatStep !== 'options'"
                    @click="chooseAiChatOption(chip)">
                    {{ chip }}
                  </button>
                </div>
              </template>
              <!-- 메뉴키: 매장 체크박스 (포스는 표시하지 않음) -->
              <template v-else-if="msg.menuKeyStores">
                <div>
                  <span
                    v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                    :key="pIdx"
                    :class="{ 'mst003-chat-key': part.key }"
                    >{{ part.text }}</span
                  >
                </div>
                <div class="mst003-chat-check-list">
                  <label
                    v-for="s in aiChatKeyStores"
                    :key="s.code"
                    class="mst003-chat-choice">
                    <input
                      type="checkbox"
                      :value="s.code"
                      v-model="aiChatKeyChecked"
                      :disabled="aiChatStep !== 'menuKeyStore'" />
                    <span>{{ s.name }}</span>
                  </label>
                </div>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'menuKeyStore' || aiChatLoading"
                    @click="confirmAiChatKeyStores">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    다음
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'menuKeyStore'"
                    @click="cancelAiChatMenuKey">
                    취소
                  </button>
                </div>
              </template>
              <!-- 메뉴키: 매장별 배치 화면 라디오 (선택한 화면의 마지막 위치에 추가) -->
              <template v-else-if="msg.menuKeyScreens">
                <div>
                  <span
                    v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                    :key="pIdx"
                    :class="{ 'mst003-chat-key': part.key }"
                    >{{ part.text }}</span
                  >
                </div>
                <div
                  v-for="r in aiChatKeyScreens"
                  :key="r.code"
                  class="mst003-chat-key-store">
                  <div class="mst003-chat-key-store-name">{{ r.name }}</div>
                  <div v-if="r.message" class="mst003-ai-test">{{ r.message }}</div>
                  <label
                    v-for="sc in r.screens"
                    :key="sc.no"
                    class="mst003-chat-choice">
                    <input
                      type="radio"
                      :name="`aiChatKeyScreen_${r.code}`"
                      :value="sc.no"
                      v-model="r.selected"
                      :disabled="aiChatStep !== 'menuKeyScreen'" />
                    <span>{{ sc.name }}</span>
                  </label>
                </div>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'menuKeyScreen'"
                    @click="confirmAiChatKeyScreens">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    확인
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'menuKeyScreen'"
                    @click="cancelAiChatMenuKey">
                    취소
                  </button>
                </div>
              </template>
              <!-- 메뉴 상세 설정 필요 여부: 예 / 아니오 -->
              <template v-else-if="msg.detailAsk">
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn"
                    :disabled="aiChatStep !== 'detailAsk'"
                    @click="answerAiChatDetailAsk(true)">
                    예
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'detailAsk'"
                    @click="answerAiChatDetailAsk(false)">
                    아니오
                  </button>
                </div>
              </template>
              <!-- 최종 확인: 설정된 정보 + 최종 등록 / 다시 설정 -->
              <template v-else-if="msg.summary">
                <div>{{ msg.content }}</div>
                <table class="mst003-chat-lang mst003-chat-summary">
                  <tbody>
                    <tr v-for="row in msg.summary" :key="row.label">
                      <th>{{ row.label }}</th>
                      <td>{{ row.value }}</td>
                      <!-- 저장 전 항목별 수정 (가장 최근 최종 확인 표에서만) -->
                      <td class="mst003-summary-edit">
                        <button
                          v-if="AI_SUMMARY_EDIT[row.label]"
                          type="button"
                          class="mst003-summary-edit-btn"
                          :disabled="aiChatStep !== 'final' || aiChatLoading || msg.summarySeq !== aiChatSummarySeq"
                          @click="editAiChatSummaryRow(row.label)">
                          수정
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="msg.summaryWarn" class="mst003-ai-test mt-1">{{ msg.summaryWarn }}</div>
                <div class="mst003-ai-caution">
                  AI는 실수할 수 있습니다.<br />
                  반드시 등록된 메뉴정보를 확인하시고 포스에서 환경수신 후 테스트 부탁드립니다.
                </div>
                <div class="mst003-chat-confirm-btns">
                  <button
                    type="button"
                    class="pnc-sub-btn mst003-final-btn"
                    :disabled="aiChatStep !== 'final' || aiChatLoading"
                    @click="finalRegisterAiChat">
                    <svg
                      class="pnc-sub-btn__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M5 13l4 4L19 7"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    최종 등록
                  </button>
                  <button
                    type="button"
                    class="pnc-sub-btn pnc-sub-btn--gray"
                    :disabled="aiChatStep !== 'final' || aiChatLoading"
                    @click="reopenAiChatOptions">
                    다시 설정
                  </button>
                </div>
              </template>
              <template v-else-if="msg.role === 'user' || msg.plain">{{ msg.content }}</template>
              <!-- AI 말풍선: 입력받을 항목 이름은 빨간색으로 강조 (HTML 이 아니라 글자 조각으로 나눠 표시) -->
              <template v-else>
                <span
                  v-for="(part, pIdx) in splitAiChatKeywords(msg.content)"
                  :key="pIdx"
                  :class="{ 'mst003-chat-key': part.key }"
                  >{{ part.text }}</span
                >
              </template>
              <!-- 질문과 같은 말풍선 안의 라디오 선택지 (대분류·소분류·옵션그룹·주방출력/할인 기준) -->
              <div v-if="msg.choicesInline" class="mst003-chat-choices-inline">
                <label
                  v-for="g in aiChatGroupChoices"
                  :key="g.code"
                  class="mst003-chat-choice">
                  <input
                    type="radio"
                    name="aiChatGroupChoice"
                    :value="g.code"
                    :disabled="aiChatLoading"
                    @change="chooseAiChatGroup(g)" />
                  <span>{{ g.label || `[${g.code}] ${g.name}` }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- 이번 대화에서 만든 메뉴 (아직 저장 전). 적용하면 메뉴코드 목록에 신규 행으로 들어가고, 저장은 기존 저장 버튼 -->
        <div class="mst003-chat-items">
          <div class="mst003-chat-items-title">
            등록할 메뉴 ({{ aiChatItems.length }})
            <span class="mst003-chat-items-hint">저장 전 · 적용하면 메뉴코드 목록에 추가됩니다</span>
          </div>
          <div class="mst003-chat-table">
            <table class="mst003-chat-tbl">
              <colgroup>
                <col class="mst003-col-name" />
                <col class="mst003-col-price" />
                <col class="mst003-col-group" />
                <col class="mst003-col-group" />
                <col class="mst003-col-code" />
                <col class="mst003-col-state" />
              </colgroup>
              <thead>
                <tr>
                  <th>메뉴명</th>
                  <th class="text-right">판매가</th>
                  <th>대분류</th>
                  <th>소분류</th>
                  <th class="text-center">메뉴코드</th>
                  <th class="text-center">상태</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="aiChatItems.length === 0">
                  <td colspan="6" class="mst003-chat-empty">아직 등록할 메뉴가 없습니다.</td>
                </tr>
                <tr v-for="item in aiChatItems" :key="item.key">
                  <td class="font-semibold" :title="item.strName">{{ item.strName || "-" }}</td>
                  <td class="text-right">
                    {{ item.lngPrice !== "0" ? `${formatAiPrice(item.lngPrice)}원` : "-" }}
                  </td>
                  <td :title="item.mainName">{{ item.mainName || "-" }}</td>
                  <td :title="item.subName">{{ item.subName || "-" }}</td>
                  <td class="text-center">{{ item.lngCode || "-" }}</td>
                  <td
                    class="text-center"
                    :class="item.complete ? 'text-blue-700' : 'text-red-600'"
                    :title="item.note">
                    {{ item.complete ? "등록 준비" : "작성 중" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="mst003-chat-input">
          <!-- 메뉴 이미지 파일 선택 (보이지 않음): 이미지 안내 말풍선의 「이미지 선택」 버튼으로 연다. PNG·JPG → 220×160·2MB 이하로 자동 조정 -->
          <input
            ref="aiChatImageInputRef"
            type="file"
            class="hidden"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            @change="onAiChatImageSelected" />
          <textarea
            ref="aiChatTextareaRef"
            v-model="aiChatText"
            class="mst003-chat-textarea"
            rows="2"
            maxlength="2000"
            :placeholder="`${AI_CHAT_STEP_TEXT[aiChatStep]} 입력 (Enter 보내기, Shift+Enter 줄바꿈)`"
            :disabled="aiChatLoading"
            @keydown.enter="onAiChatEnter"></textarea>
          <button
            type="button"
            class="pnc-sub-btn mst003-chat-send shrink-0"
            :disabled="aiChatLoading"
            @click="sendAiChat">
            <svg
              class="pnc-sub-btn__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            보내기
          </button>
        </div>
        <!-- AI 이용 안내 (항상 표시) -->
        <div class="mst003-chat-notice">
          AI는 정보 제공 시 실수를 할 수 있습니다.<br />
          성능 향상을 위해 일부 내용은 수집될 수 있습니다.<br />
          개인 정보나 민감한 정보는 입력하지 마십시오.
        </div>
      </div>
    </div>
  </Teleport>
  <!-- AI 대화 이미지 미리보기 확대 (클릭하면 닫힘) -->
  <Teleport to="body">
    <div
      v-if="aiChatZoomImage"
      class="mst003-zoom-mask"
      @click="aiChatZoomImage = null">
      <div class="mst003-zoom-box">
        <img :src="aiChatZoomImage" alt="조정한 메뉴 이미지 확대" class="mst003-zoom-img" />
        <div class="mst003-zoom-caption">
          실제 등록 크기 {{ AI_IMAGE_WIDTH }}×{{ AI_IMAGE_HEIGHT }} · 화면에서 3배 확대 · 클릭하면 닫힙니다
        </div>
      </div>
    </div>
  </Teleport>
  <!-- 조회조건  END-->
  <!-- 그리드영역 -->
  <div
    class="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 px-4 pb-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6 lg:px-6">
    <div class="flex min-h-0 min-w-0 flex-col">
      <div
        class="mb-2 flex min-h-[2.75rem] flex-none items-center justify-between border-b border-gray-300 pb-2">
        <h2 class="mst003-title-bar text-lg font-bold leading-none tracking-tight text-gray-900">
          메뉴코드 목록
        </h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="whitebutton mst003-sub-btn mst003-ai-add-btn"
            @click="openAiChat"
            :disabled="aiDisabledGroup || (!afterSearch && !aiNeedsStorePick)">
            <!-- AI 로봇 얼굴 아이콘 (동그란 얼굴 + 안테나) -->
            <svg
              class="mst003-ai-add-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false">
              <path
                d="M12 2.8v2.6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round" />
              <circle cx="12" cy="2.6" r="1.2" fill="currentColor" />
              <circle
                cx="12"
                cy="13.6"
                r="8.2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8" />
              <circle cx="9" cy="12.6" r="1.4" fill="currentColor" />
              <circle cx="15" cy="12.6" r="1.4" fill="currentColor" />
              <path
                d="M9.3 16.3c1.6 1.3 3.8 1.3 5.4 0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round" />
            </svg>
            AI 메뉴 관리
          </button>
          <button
            type="button"
            class="whitebutton mst003-sub-btn"
            @click="addRow"
            :disabled="!afterSearch">
            추가
          </button>
          <button
            type="button"
            class="whitebutton mst003-sub-btn"
            @click="deleteRow"
            :disabled="afterClick">
            삭제
          </button>
        </div>
      </div>

      <div class="mst003-filter-stack mb-2 w-full min-w-0">
        <div class="mst003-cell">
          <span class="mst003-sg-label">메뉴분류</span>
          <div class="mst003-cell-field mst003-dual-control flex min-w-0 gap-2">
            <select
              name="lngMainGroup"
              id="mst003-search-main-group"
              class="mst003-control min-w-0 flex-1"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup">
                [{{ i.GroupCd }}]{{ i.majorGroupNm }}
              </option>
            </select>
            <select
              name="lngSubGroup"
              id="mst003-search-sub-group"
              class="mst003-control min-w-0 flex-1"
              v-model="forsearchSub"
              @change="setSubCd">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
                [{{ i.GroupCd }}]{{ i.subGroupNm }}
              </option>
            </select>
          </div>
        </div>
        <div class="mst003-cell">
          <span class="mst003-sg-label">메뉴명/코드</span>
          <div class="mst003-cell-field min-w-0">
            <input
              type="text"
              id="mst003-search-menu"
              class="mst003-control w-full"
              @input="searchMenuList"
              v-model="searchWord" />
          </div>
        </div>
      </div>
      <div class="relative min-h-0 min-w-0 flex-1">
        <Realgrid
          class="h-full w-full"
          :progname="'MST01_033INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :showGrid="showGrid"
          :showCheckBar="false"
          @clickedRowData="clickedRowData"
          :selectionStyle="'singleRow'"
          @selcetedrowData="selcetedrowData"
          @allStateRows="allStateRows"
          @sendRowState="sendRowState"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="labelingColumns"
          :changeNow2="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          @selectedIndex="selectedIndex"
          @selectedIndex2="selectedIndex2"
          :moveFocusbyIndex="aiMoveFocusIndex"
          :setReFocus="aiSetReFocus"
          :addRow4="addRow4"
          :deleteRow6="deleteRow3"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          @updatedRowData2="updatedRowData"
          :rowStateeditable="false"
          :addField="'new'"
          :hideRow="hideRow"
          :hideNow="hideNow"
          :searchColId="'lngCode,strName'"
          :searchColId3="['lngMainGroup', 'lngSubGroup']"
          :searchValue="searchValue"
          :searchWord3="searchWord"
          :suffixColumnwon="'lngPrice'"
          :initFocus="initFocus"
          :exporttoExcel="exporttoExcel"
          :exportExcelShowColumns="exportExcelShowColumnsMain"
          :exportExcelColumnHeaders="exportExcelColumnHeadersMain"
          @exportDone="onMainGridExportDone"
          :documentTitle="'MST01_003INS'"></Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>
    </div>
    <!-- 그리드영역 -->
    <!-- 탭영역 -->
    <div class="flex min-h-0 min-w-0 flex-col">
      <div class="flex flex-none gap-1 border-b border-gray-300">
        <button
          class="contents_tab-button"
          @click="selectMenu(1)"
          :class="{ 'text-blue-600': selectedMenu == 1 }">
          상세정보
        </button>
        <button
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(2)"
          :class="{ 'text-blue-600': selectedMenu == 2 }"
          :disabled="discountDisabled || disableWithMenuDisc">
          할인선택
        </button>
        <button
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(3)"
          :class="{ 'text-blue-600': selectedMenu == 3 }"
          :disabled="selectedMultiple">
          이미지 설정
        </button>
        <button
          v-if="canUseDeliveryMenuTab"
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(4)"
          :class="{ 'text-blue-600': selectedMenu == 4 }"
          :disabled="selectedMultiple">
          배달메뉴 설정
        </button>
      </div>
      <div
        class="mst003-detail-panel min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1"
        :class="selectedMenu == 4 ? 'mst003-detail-panel--delivery' : 'pt-3'">
        <div v-show="selectedMenu == 1" class="min-w-0">
          <div class="mst003-section-title mst003-title-bar">기본정보</div>
          <div class="mst003-form-grid mt-3 w-full">
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴분류
            </div>
            <div class="mst003-field-span3 mst003-form-value flex min-w-0 gap-2">
              <select
                name="lngMainGroup"
                id=""
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                @change="
                  (e) => {
                    setSubCd4();
                    changeInfo(e);
                  }
                "
                v-model="gridvalue1"
                :disabled="afterClick">
                <option value="0">선택</option>
                <option :value="i.GroupCd" v-for="i in MenuGroup">
                  [{{ i.GroupCd }}]{{ i.majorGroupNm }}
                </option>
              </select>
              <select
                name="lngSubGroup"
                id=""
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue2"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="0">선택</option>
                <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup2">
                  [{{ i.GroupCd }}]{{ i.subGroupNm }}
                </option>
              </select>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴코드
            </div>
            <div class="mst003-form-value mst003-form-value--inline gap-2">
              <input
                type="number"
                name="lngCode"
                class="mst003-control mst003-control--menu-code disabled:bg-gray-100"
                :disabled="!isNew || isNewAutoMenuCode"
                v-model="gridvalue3"
                @input="changeInfo" />
              <label class="mst003-auto-check shrink-0" for="autoMenuCode"
                ><input
                  type="checkbox"
                  id="autoMenuCode"
                  :checked="isNewAutoMenuCode"
                  :disabled="disableMenuAuto"
                  @change="setAuto" />자동</label
              >
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *유효기간
            </div>
            <div class="mst003-form-value mst003-dual-control flex min-w-0 gap-2">
              <input
                type="date"
                :disabled="afterClick"
                name="dtmFromDate"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue4"
                @input="changeInfo" />
              <input
                type="date"
                :disabled="afterClick"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                name="dtmToDate"
                v-model="gridvalue5"
                @input="changeInfo" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴명
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue6"
                name="strName"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              메뉴명(영문)
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue7"
                name="strNameE"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              정상단가
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="lngDCPrice"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue8"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              옵션그룹선택
            </div>
            <div class="mst003-form-value mst003-form-value--inline gap-2">
              <select
                name="lngChain"
                id=""
                :disabled="afterClick"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue9"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in optionGroup">
                  [{{ i.lngCode }}]{{ i.strName }}
                </option>
              </select>
              <button
                type="button"
                class="whitebutton mst003-sub-btn shrink-0"
                @click="moveOptionGroupPage">
                옵션그룹 추가
              </button>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *판매가
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                name="lngPrice"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue10"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              정상단가할인표기
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="disY"
                ><input
                  type="radio"
                  name="blnDCPriceYN"
                  id="disY"
                  :disabled="afterClick"
                  v-model="gridvalue11"
                  value="1"
                  @input="changeInfo" />예</label
              >
              <label for="disN"
                ><input
                  type="radio"
                  name="blnDCPriceYN"
                  id="disN"
                  :disabled="afterClick"
                  v-model="gridvalue11"
                  value="0"
                  @input="changeInfo" />아니오</label
              >
              <select
                name=""
                id=""
                :disabled="true"
                class="mst003-control ml-2 min-w-0 flex-1 disabled:bg-gray-200">
                <option value="">선택</option>
              </select>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *과세구분
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="chargeY"
                ><input
                  type="radio"
                  name="lngTax"
                  id="chargeY"
                  :disabled="afterClick"
                  value="0"
                  v-model="gridvalue12"
                  @input="changeInfo" />과세</label
              >
              <label for="chargeN"
                ><input
                  type="radio"
                  name="lngTax"
                  id="chargeN"
                  :disabled="afterClick"
                  value="2"
                  v-model="gridvalue12"
                  @input="changeInfo" />면세</label
              >
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *사용여부
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="useY"
                ><input
                  type="radio"
                  name="blnInactive"
                  id="useY"
                  :disabled="afterClick"
                  value="0"
                  v-model="gridvalue13"
                  @input="changeInfo" />사용</label
              >
              <label for="useN"
                ><input
                  type="radio"
                  name="blnInactive"
                  id="useN"
                  :disabled="afterClick"
                  value="1"
                  v-model="gridvalue13"
                  @input="changeInfo" />미사용</label
              >
            </div>

            <div class="mst003-form-label">
              주방출력설정
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <button type="button" class="whitebutton mst003-sub-btn" @click="movePage">
                주방출력설정
              </button>
            </div>
          </div>
          <div class="mst003-section-title mst003-title-bar mt-5">부가정보</div>
          <div class="mst003-form-grid mt-3 w-full">
            <div
              class="mst003-form-label">
              {{ disableWithMenuDisc ? "할인허용" : "할인여부" }}
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline"
              v-if="!disableWithMenuDisc">
              <label for="discount1"
                ><input
                  type="radio"
                  id="discount1"
                  name="discountYN"
                  v-model="gridvalue14"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="discount2"
                ><input
                  type="radio"
                  id="discount2"
                  name="discountYN"
                  v-model="gridvalue14"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>

            <div
              class="mst003-form-value"
              v-if="disableWithMenuDisc">
              <input
                type="text"
                id="discount1"
                name="lngDiscount"
                v-model="gridvalue40"
                @input="changeInfo"
                :disabled="afterClick"
                class="mst003-control w-full disabled:bg-gray-200" />
            </div>
            <div class="mst003-form-label">
              메뉴당객수
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="intCustCount"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue15"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *주메뉴종속
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="autopay1"
                ><input
                  type="radio"
                  id="autopay1"
                  name="blnCondimentprice"
                  v-model="gridvalue100"
                  value="1"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200"
                  @click="disableKPG"
                  @input="changeInfo" />예</label
              ><label for="autopay2"
                ><input
                  type="radio"
                  id="autopay2"
                  name="blnCondimentprice"
                  v-model="gridvalue100"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200"
                  @click="disableKPG" />아니오</label
              >
              <select
                name="lngKPG"
                id=""
                class="mst003-control ml-2 min-w-0 flex-1 disabled:bg-gray-200"
                :disabled="afterClick || gridvalue100 == 0"
                v-model="gridvalue18"
                @change="
                  changeInfo($event);
                  resetKPG($event);
                ">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in MENUDEPEND">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst003-form-label">
              주문정렬순위
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="lngOrder"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue17"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              주방출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="openmoney1"
                ><input
                  type="radio"
                  id="openmoney1"
                  name="lngKPG"
                  v-model="gridvalue18"
                  value="99"
                  @input="changeInfo"
                  :disabled="afterClick || disabledKPG"
                  class="disabled:bg-gray-200" />예</label
              ><label for="openmoney2" v-if="showKPG"
                ><input
                  type="radio"
                  id="openmoney2"
                  name="lngKPG"
                  v-model="gridvalue18"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick || disabledKPG"
                  class="disabled:bg-gray-200" />아니오</label
              ><label for="openmoney3" v-if="!showKPG"
                ><input
                  type="radio"
                  id="openmoney3"
                  checked
                  disabled />아니오</label
              >
            </div>
            <div class="mst003-form-label">
              바코드
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                name="strBarCode"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue19"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              영수증출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="receipt1"
                ><input
                  type="radio"
                  id="receipt1"
                  name="blnReceipt"
                  v-model="gridvalue20"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="receipt2"
                ><input
                  type="radio"
                  id="receipt2"
                  name="blnReceipt"
                  v-model="gridvalue20"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="mst003-form-label">
              메뉴주문옵션
            </div>
            <div class="mst003-form-value">
              <select
                name="lngMenuOption"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue21"
                @change="changeInfo"
                :disabled="afterClick">
                <option :value="i.strDCode" v-for="i in menuOrderOption">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst003-form-label">
              주문서출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="discountfor1">
                <input
                  type="radio"
                  id="discountfor1"
                  name="blnFloat"
                  v-model="gridvalue22"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예
              </label>
              <label for="discountfor2">
                <input
                  type="radio"
                  id="discountfor2"
                  name="blnFloat"
                  v-model="gridvalue22"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오
              </label>
            </div>
            <div class="mst003-form-label">
              메뉴옵션코드
            </div>
            <div class="mst003-form-value">
              <select
                name="strIcon"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue23"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in menuOptionCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst003-form-label">
              주방단품출력
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="allow1"
                ><input
                  type="radio"
                  id="allow1"
                  name="blnKitSingle"
                  v-model="gridvalue24"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />허용</label
              ><label for="allow2"
                ><input
                  type="radio"
                  id="allow2"
                  name="blnKitSingle"
                  v-model="gridvalue24"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />비허용</label
              >
            </div>
            <div class="mst003-form-label">
              서브타이틀
            </div>
            <div class="mst003-form-value">
              <select
                name="lngSubTitle"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                :disabled="afterClick"
                v-model="gridvalue25"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in subTitle">
                  {{ i.strName }}
                </option>
              </select>
            </div>

            <div class="mst003-form-label">
              메뉴제공완료여부
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="allow3"
                ><input
                  type="radio"
                  id="allow3"
                  name="blnServing"
                  v-model="gridvalue26"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow4"
                ><input
                  type="radio"
                  id="allow4"
                  name="blnServing"
                  v-model="gridvalue26"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="mst003-form-label">
              KDS출력
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline">
              <input
                type="text"
                v-model="gridvalue38"
                :disabled="afterClick"
                name="lngKDS"
                class="mst003-control w-full"
                @input="onlyNumber" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--with-info">
              <span>시세가적용</span>
              <span class="mst003-info-tooltip-host">
                <button
                  type="button"
                  class="mst003-info-btn"
                  @click.stop="toggleFieldInfoTooltip('marketPrice')"
                  aria-label="시세가적용 안내"
                  aria-describedby="marketPriceInfoTooltip">
                  <img
                    src="@/assets/images/ic-info.svg"
                    alt=""
                    class="mst003-info-btn__icon"
                    aria-hidden="true" />
                </button>
                <span
                  v-show="isFieldInfoTooltipVisible('marketPrice')"
                  id="marketPriceInfoTooltip"
                  class="mst003-info-tooltip"
                  role="tooltip">
                  포스 입력 판매가 사용
                </span>
              </span>
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="allow5"
                ><input
                  type="radio"
                  id="allow5"
                  name="blnOpen"
                  v-model="gridvalue27"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow6"
                ><input
                  type="radio"
                  id="allow6"
                  name="blnOpen"
                  v-model="gridvalue27"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="mst003-form-label">
              주방출력명
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline">
              <input
                type="text"
                v-model="gridvalue39"
                :disabled="afterClick"
                name="strNameK"
                class="mst003-control w-full"
                @input="changeInfo" />
            </div>
            <div
              class="mst003-form-label">
              배달메뉴
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="allow7"
                ><input
                  type="radio"
                  id="allow7"
                  name="blnDeliveryYN"
                  v-model="gridvalue28"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow8"
                ><input
                  type="radio"
                  id="allow8"
                  name="blnDeliveryYN"
                  v-model="gridvalue28"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div
              class="mst003-form-label mst003-form-label--with-info">
              <span>메뉴재고 품절</span>
              <span class="mst003-info-tooltip-host">
                <button
                  type="button"
                  class="mst003-info-btn"
                  @click.stop="toggleFieldInfoTooltip('soldOut')"
                  aria-label="메뉴재고 품절 안내"
                  aria-describedby="soldOutInfoTooltip">
                  <img
                    src="@/assets/images/ic-info.svg"
                    alt=""
                    class="mst003-info-btn__icon"
                    aria-hidden="true" />
                </button>
                <span
                  v-show="isFieldInfoTooltipVisible('soldOut')"
                  id="soldOutInfoTooltip"
                  class="mst003-info-tooltip"
                  role="tooltip">
                  메뉴재고 품절 사용시에만 해당
                </span>
              </span>
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="soldOutY"
                ><input
                  type="radio"
                  id="soldOutY"
                  name="blnSoldOutYN"
                  v-model="gridvalue42"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />적용</label
              ><label for="soldOutN"
                ><input
                  type="radio"
                  id="soldOutN"
                  name="blnSoldOutYN"
                  v-model="gridvalue42"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />미적용</label
              >
            </div>
            <div class="mst003-form-label">
              영양소 정보
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strNutrInfo"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue29"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              원산지 정보
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strCntryOrg"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue30"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              메뉴설명
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strMenuComment"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue31"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label">
              판매 시간대
            </div>
            <div class="mst003-form-value mst003-dual-control flex min-w-0 items-center gap-2">
              <input
                type="time"
                class="mst003-control min-w-0 flex-1"
                v-model="gridvalue32"
                name="dtmStart"
                @change="changeInfo"
                :disabled="afterClick" />
              <span class="shrink-0 text-sm text-gray-600">~</span>
              <input
                type="time"
                class="mst003-control min-w-0 flex-1"
                v-model="gridvalue33"
                name="dtmEnd"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--with-info">
              <span>판매일 설정</span>
              <span class="mst003-info-tooltip-host">
                <button
                  type="button"
                  class="mst003-info-btn"
                  @click.stop="toggleFieldInfoTooltip('saleDaySetting')"
                  aria-label="판매일 설정 안내"
                  aria-describedby="saleDaySettingInfoTooltip">
                  <img
                    src="@/assets/images/ic-info.svg"
                    alt=""
                    class="mst003-info-btn__icon"
                    aria-hidden="true" />
                </button>
                <span
                  v-show="isFieldInfoTooltipVisible('saleDaySetting')"
                  id="saleDaySettingInfoTooltip"
                  class="mst003-info-tooltip"
                  role="tooltip">
                  휴일과 중복될 경우 휴일 우선적용
                </span>
              </span>
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="lngType1"
                ><input
                  type="checkbox"
                  name="lngType1"
                  id="lngType1"
                  v-model="gridvalue34"
                  @change="changeInfo"
                  :disabled="afterClick" />평일</label
              >
              <label for="lngType2"
                ><input
                  type="checkbox"
                  name="lngType2"
                  id="lngType2"
                  v-model="gridvalue35"
                  @change="changeInfo"
                  :disabled="afterClick" />토요일</label
              >
              <label for="lngType3"
                ><input
                  type="checkbox"
                  name="lngType3"
                  id="lngType3"
                  @change="changeInfo"
                  v-model="gridvalue36"
                  :disabled="afterClick" />일요일</label
              >
              <label for="lngType4"
                ><input
                  type="checkbox"
                  name="lngType4"
                  id="lngType4"
                  @change="changeInfo"
                  v-model="gridvalue37"
                  :disabled="afterClick" />휴일</label
              >
            </div>

            <div
              class="mst003-form-label">
              비고
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue41"
                name="strBigo"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
          </div>
        </div>
        <div v-show="selectedMenu == 2" class="flex min-w-0 flex-col h-full overflow-hidden">
          <div class="flex w-full items-center justify-between">
            <div class="mst003-section-title mst003-title-bar mb-0">할인설정</div>
            <div>
              <button type="button" class="whitebutton mst003-sub-btn" @click="copyButton2">
                할인설정복사
              </button>
            </div>
          </div>
          <div class="mst003-cell mt-3 w-full min-w-0">
            <span class="mst003-sg-label">결제코드/명</span>
            <div class="mst003-cell-field min-w-0">
              <input
                type="text"
                class="mst003-control w-full"
                @input="searchPayCd"
                v-model="searchWord2" />
            </div>
          </div>
          <div class="relative mt-3 min-h-[240px] flex-1">
          <Realgrid
            class="h-full w-full"
            @realgridname="realgridname"
            :progname="'MST01_033INS_VUE'"
            :progid="2"
            :rowData="clickrowData2"
            @checkedRowData="checkedRowData2"
            :searchColId="'lngCode,strName'"
            :searchWord3="searchWord2"
            :checkBarInactive="'lngMenu'"
            :initSelect="true"
            :ExceptionCheck="'lngMenu'"
            :hideCheckBarList="true"
            :rowStateeditable="false"
            :showTooltip="true"></Realgrid>
          </div>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="min-w-0">
          <div v-if="showImageGroupScopeControls" class="mst003-form-grid mt-3 w-full">
            <div class="mst003-form-label">공통 여부</div>
            <div class="mst003-field-span3 mst003-form-value">
              <select v-model="imageScope" class="mst003-control w-full">
                <option value="COMMON">공통(그룹)</option>
                <option value="STORE">매장별</option>
              </select>
            </div>

            <div class="mst003-form-label">저장 매장</div>
            <div class="mst003-field-span3 mst003-form-value mst003-vselect-slot">
              <v-select
                v-model="imageStoreCd"
                :options="imageStoreOptions"
                label="strName"
                placeholder="선택"
                class="custom-select2"
                append-to-body
                :clearable="true"
                :disabled="imageScope !== 'STORE'"
                :reduce="(item) => String(item.lngStoreCode)" />
            </div>
          </div>
          <div
            class="mt-6 grid w-full min-w-0 grid-cols-1 items-start gap-6 rounded-lg border border-gray-300 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div class="flex justify-center items-start w-full">
              <img
                :src="`https://www.pncapi.kr/MenuImage/Image/${currentImageFileName}?v=${Date.now()}`"
                @error="`../../assets/noimage2.png`"
                class="w-[80%] max-h-[min(40vh,320px)] object-contain" />
            </div>
            <div class="grid grid-rows-[1fr,5fr] grid-cols-[1fr,5fr] border w-full">
              <div
                class="customtableIndex border border-gray-400 rounded-l-lg h-full">
                파일명
              </div>
              <div class="flex h-full w-full items-center">
                <input
                  type="text"
                  v-model="fileName2"
                  class="border rounded-lg bg-gray-100 w-full"
                  disabled />
                <!--
                <button type="button" class="whitebutton mst003-sub-btn" @click="downloadFile">
                  다운로드
                </button>
                -->
                  <label for="fileInput" class="whitebutton mst003-sub-btn">
                    파일선택</label>
                  <input
                    id="fileInput"
                    type="file"
                    @change="handleFileUpload"
                    style="display: none"
                    accept=".jpg,.png,.jpeg" />
              </div>
              <div
                class="customtableIndex border border-gray-400 rounded-l-lg h-full w-full">
                파일크기
              </div>
              <div class="grid grid-rows-[1fr,5fr] grid-cols-1">
                <div class="flex">
                  <input
                    type="text"
                    v-model="fileSize"
                    class="border rounded-lg bg-gray-100 w-full h-[80%]"
                    disabled />
                  <button
                    type="button"
                    class="whitebutton mst003-sub-btn"
                    @click="handleFileDelete">
                    파일삭제
                  </button>
                </div>
                <div class="flex flex-col justify-start ml-2">
                  <span class="flex justify-start"
                    >* 이미지 사이즈 220*160
                  </span>
                  <span class="flex justify-start"
                    >* 이미지 포맷 : PNG, JPG 등 이미지 형식</span
                  >
                  <span class="flex justify-start"
                    >* 이미지 용량 제한 : 2MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="canUseDeliveryMenuTab"
          v-show="selectedMenu == 4"
          class="min-w-0">
          <div v-if="!isDeliveryMenuNoStoreMode" class="flex justify-end mb-2">
            <button
              type="button"
              class="whitebutton mst003-sub-btn"
              @click="openDeliveryCopyPopUp">
              배달메뉴복사
            </button>
          </div>
          <div
            class="mst003-form-grid w-full"
            :class="
              isDeliveryMenuNoStoreMode
                ? 'mst003-form-grid--delivery-compact'
                : 'mt-3'
            ">
            <template v-if="!isDeliveryMenuNoStoreMode">
              <div class="mst003-form-label">
                매장
              </div>
              <div class="mst003-field-span3 mst003-form-value mst003-vselect-slot">
                <v-select
                  v-model="deliveryStoreCd"
                  :options="imageStoreOptions"
                  label="strName"
                  placeholder="선택"
                  class="custom-select2"
                  append-to-body
                  :clearable="true"
                  :reduce="(item) => String(item.lngStoreCode)" />
              </div>
            </template>

            <template v-for="deliveryRow in deliveryMenuRows" :key="deliveryRow.code">
              <template
                v-if="
                  isDeliveryMenuNoStoreMode && isMultiNameDeliveryRow(deliveryRow)
                ">
                <div class="mst003-form-label mst003-baemin-merged-label">
                  {{ deliveryRow.name }}
                </div>
                <div
                  v-for="pairIndex in multiDeliveryMenuNameCount / 2"
                  :key="`${deliveryRow.code}-pair-${pairIndex}`"
                  class="mst003-field-span3 mst003-form-value mst003-baemin-pair">
                  <div class="mst003-baemin-pair-cell">
                    <input
                      type="text"
                      v-model="deliveryRow.menuNames[(pairIndex - 1) * 2]"
                      class="mst003-control w-full"
                      :placeholder="`배달메뉴명 입력 ${(pairIndex - 1) * 2 + 1}`"
                      :disabled="!canEditDeliveryMenuRows" />
                  </div>
                  <div class="mst003-baemin-pair-cell">
                    <input
                      type="text"
                      v-model="deliveryRow.menuNames[(pairIndex - 1) * 2 + 1]"
                      class="mst003-control w-full"
                      :placeholder="`배달메뉴명 입력 ${(pairIndex - 1) * 2 + 2}`"
                      :disabled="!canEditDeliveryMenuRows" />
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="mst003-form-label">
                  {{ deliveryRow.name }}
                </div>
                <div class="mst003-field-span3 mst003-form-value">
                  <input
                    type="text"
                    v-model="deliveryRow.menuName"
                    class="mst003-control w-full"
                    placeholder="배달메뉴명 입력"
                    :disabled="!canEditDeliveryMenuRows" />
                </div>
              </template>
            </template>
            <template v-if="deliveryMenuRows.length === 0">
              <div class="mst003-form-label">배달사</div>
              <div class="mst003-field-span3 mst003-form-value text-gray-500">
                배달사 정보가 없습니다.
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- 탭영역 -->
</template>

<script setup>
import {
  copyMenuListByCode,
  copyDeliveryMenuMap,
  deleteFile,
  getCommonList_ver2,
  getDeliveryMenuExcelColumn,
  getAmountListByMenuCode,
  getDeliveryMenuMap,
  getMenuCodeEnroll,
  getMenuDiscCount,
  getMenuDiscCount2,
  getMenuList,
  chatMenu,
  chatAssist,
  getMenuSales,
  getMenuDates,
  getMenuSnapshot,
  writeMenuChangeLog,
  getMenuCodeSuggestion,
  getSettingReference,
  getScreenList,
  appendMenuKeys,
  saveMultiLang,
  translateMenuName,
  saveDeliveryMenuMap,
  saveMenuCode,
  saveDiscountCode,
  uploadFile,
} from "@/api/master";
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
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

import RealGrid from "realgrid";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog, normalizeMenuListSoldOutYn, normalizeSoldOutYn, assertApiSuccess, findFirstMissingMenuCodeRequiredLabel, getMenuCodeRowIndicesToSave, getUpdatedRowsMissingMenuNameSwalText } from "@/customFunc/customFunc";
import { getPosList, getStoreList2 } from "@/api/common";
/**
 *  이미지 별도 호출
 *  */
import axios from "axios";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";

/*
 * 랜덤 값 도출 라이브러리
 */

import { v4 as uuidv4 } from "uuid";
/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const hidesub = ref(true);
const hideAttr = ref(true);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  //comsole.log(store.state.userData.lngCommonMenu);

  const pageLog = await insertPageLog(store.state.activeTab2);
  ////console.log(store.state.userData.lngCommonMenu);

  let res = null;

  if (nowStoreCd.value == "0"){ 
    res = await getMenuDiscCount2(store.state.userData.lngStoreGroup);
  } else {
    res = await getMenuDiscCount(store.state.userData.lngStoreGroup, nowStoreCd.value);
  }

  if (res.data.List[0].count == "0") {
    disableWithMenuDisc.value = true;
  } else {
    disableWithMenuDisc.value = false;
  }

  try {
    // console.log("[MST01_003INS][DELIVERY_COMPANY] fetch start", {
    //   CODE: 446,
    //   groupCd: groupCd.value,
    // });
    const deliveryCompanyRes = await getCommonList_ver2(446);
    const rawList = deliveryCompanyRes?.data?.List ?? [];
    // console.log(
    //   "[MST01_003INS][DELIVERY_COMPANY] raw response summary\n",
    //   JSON.stringify(
    //     {
    //       RESULT_CD: deliveryCompanyRes?.data?.RESULT_CD,
    //       RESULT_NM: deliveryCompanyRes?.data?.RESULT_NM,
    //       listLength: rawList.length,
    //       firstItem: rawList[0] ?? null,
    //     },
    //     null,
    //     2
    //   )
    // );
    // if (!rawList.length) {
    //   console.warn(
    //     "[MST01_003INS][DELIVERY_COMPANY] 배달사 List 비어있음 → UI에 '배달사 정보가 없습니다.' 표시"
    //   );
    // }
    deliveryCompanyOptions.value = rawList;
  } catch (error) {
    // console.error("[MST01_003INS][DELIVERY_COMPANY] fetch error", error);
    deliveryCompanyOptions.value = [];
  }
  await loadStoreOptions(groupCd.value);
});
const searchWord2 = ref("");
const nowStoreCd = ref(0);
const rowData = ref([]);
const filteredrowData = ref([]);
const hideNow = ref(false);
const hideRow = ref([]);
const MENUDEPEND = ref([]);
const moveOptionGroupPage = () => {
  store.state.moveOtherTab = {
    strTitle: "선택 메뉴 그룹 등록.(U)",
    lngProgramID: "73757",
    strUrl: "MIMASTER::MST01_011INS_01.xml",
  };
  // router.push("/MIMASTER/MST01_011INS_01.xml");
};

const realgrid2Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const updateDeleteInsertrowIndex = ref([]);
/**
 * 상태 변화된 행 세팅
 */
const isNewAutoMenuCode = ref(false);
const disableMenuAuto = ref(true);
const setAuto = () => {
  isNewAutoMenuCode.value = !isNewAutoMenuCode.value;
  if (isNewAutoMenuCode.value == true) {
    gridvalue3.value = "";
    const tagName = "lngCode";
    const value2 = "";
    //comsole.log(value2);
    changeColid.value = tagName;
    changeValue2.value = value2;
    changeNow.value = !changeNow.value;
  }
};
const allStateRows = (e) => {
  updateDeleteInsertrowIndex.value = e;
  //console.log(e);
};
const sendRowState = (e) => {
  if (e == "created") {
    isNew.value = true;
    disableMenuAuto.value = false;
  } else {
    isNew.value = false;
    disableMenuAuto.value = true;
  }

  //comsole.log(e);
};

const selectedMenu = ref(1);
const deliveryMenuTabAllowedGroups = ["9999", "3048", "3287"];
// 임시: 9999는 3048과 동일하게 매장별 조회/저장 테스트용 (롤백 시 ["9999","3287"]로 복구)
const deliveryMenuNoStoreGroups = ["3287"];
const multiDeliveryMenuNameCount = 10;
const canUseDeliveryMenuTab = computed(() =>
  deliveryMenuTabAllowedGroups.includes(String(groupCd.value ?? ""))
);
const isDeliveryMenuNoStoreMode = computed(() =>
  deliveryMenuNoStoreGroups.includes(String(groupCd.value ?? ""))
);
const selectMenu = (newValue) => {
  if (newValue === 4 && !canUseDeliveryMenuTab.value) {
    selectedMenu.value = 1;
    return;
  }
  selectedMenu.value = newValue;
};
watch(canUseDeliveryMenuTab, (allowed) => {
  if (!allowed && selectedMenu.value === 4) {
    selectedMenu.value = 1;
  }
});
const deliveryStoreCd = ref("");
const deliveryCompany = ref("");
const deliveryMenuName = ref("");
const deliveryCompanyOptions = ref([]);
const deliveryMenuRows = ref([]);
const selectedMenuCodeForDelivery = ref("");
const isMultiNameDeliveryRow = (row) =>
  /배달의\s*민족|요기요|쿠팡\s*이츠|네이버/.test(String(row?.name ?? ""));
const createEmptyMultiMenuNames = () =>
  Array.from({ length: multiDeliveryMenuNameCount }, () => "");
/** 3287: STORE_CD 고정 0 / 3048·9999(임시): 선택 매장 */
const resolveDeliveryStoreCdForApi = () => {
  if (isDeliveryMenuNoStoreMode.value) return "0";
  return normalizeDeliveryParam(deliveryStoreCd.value);
};
const readDeliveryStrInfo = (row, index) => {
  const n = index + 1;
  return String(
    row?.[`strInfo${n}`] ??
      row?.[`STR_INFO${n}`] ??
      row?.[`STRINFO${n}`] ??
      row?.[`StrInfo${n}`] ??
      ""
  ).trim();
};
const resolveDeliveryMenuNamesList = (response) => {
  const empty = createEmptyMultiMenuNames();
  const src = response?.data;
  const resultCd = String(src?.RESULT_CD ?? src?.result_cd ?? "");
  const list = Array.isArray(src?.List)
    ? src.List
    : Array.isArray(src?.list)
      ? src.list
      : [];

  const first =
    resultCd === "00" && list.length > 0
      ? list[0] || {}
      : (Array.isArray(src) && src[0]) || src?.Map || src || {};

  return empty.map((_, index) => readDeliveryStrInfo(first, index));
};
const canEditDeliveryMenuRows = computed(() => {
  const menuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  if (isDeliveryMenuNoStoreMode.value) {
    return Boolean(menuCd);
  }
  const storeCd = normalizeDeliveryParam(deliveryStoreCd.value);
  return Boolean(storeCd && menuCd);
});
const resolveMenuCdFromRow = (row) => {
  if (Array.isArray(row)) {
    return normalizeDeliveryParam(row[0]);
  }
  return normalizeDeliveryParam(
    row?.lngCode ??
      row?.menuCd ??
      row?.lngMenu ??
      row?.lngMenuCode ??
      row?.LNG_CODE ??
      row?.MENU_CD ??
      row?.LNGCODE ??
      row?.MENUCODE ??
      row?.LNG_MENU ??
      row?.LNG_MENUCODE ??
      row?.lng_code ??
      row?.menu_code ??
      row?.lng_menu ??
      row?.lng_menucode
  );
};
const normalizeMenuCodeKey = (value) => {
  const raw = normalizeDeliveryParam(value);
  if (!raw) return "";
  if (/^\d+$/.test(raw)) return String(Number(raw));
  return raw.toUpperCase();
};
const normalizeDeliveryParam = (value) => {
  const strValue = value == null ? "" : String(value).trim();
  if (!strValue || strValue === "0" || strValue === "-1") return "";
  return strValue;
};
const resolveDeliveryMenuName = (response) => {
  const src = response?.data;
  const resultCd = String(src?.RESULT_CD ?? src?.result_cd ?? "");
  const list = Array.isArray(src?.List)
    ? src.List
    : Array.isArray(src?.list)
      ? src.list
      : [];

  // C# getDeliveryMenuMap 응답 스펙: RESULT_CD == "00" && List[0].strInfo1
  if (resultCd === "00" && list.length > 0) {
    const first = list[0] || {};
    return String(first?.strInfo1 ?? first?.STRINFO1 ?? first?.STR_INFO1 ?? "");
  }

  // 하위호환(기존/타 응답 포맷)
  const row = (Array.isArray(src) && src[0]) || src?.Map || src || {};
  return String(
    row?.strDeliveryMenuName ??
      row?.STR_DELIVERY_MENU_NAME ??
      row?.deliveryMenuName ??
      row?.strMenuName ??
      row?.STR_MENU_NAME ??
      row?.strInfo1 ??
      ""
  );
};
const extractResultCode = (response) =>
  String(response?.data?.RESULT_CD ?? response?.data?.result_cd ?? "");
const extractResultName = (response) =>
  String(response?.data?.RESULT_NM ?? response?.data?.result_nm ?? "");
const extractDuplicateMenuCd = (response) => {
  const data = response?.data ?? {};
  const directCd = normalizeDeliveryParam(
    data?.DUPLICATE_MENU_CD ??
      data?.duplicate_menu_cd ??
      data?.DUPLICATE_MENUCODE ??
      data?.duplicateMenuCd
  );
  if (directCd) return directCd;

  const resultName = extractResultName(response);
  const matched = resultName.match(/\b\d+\b/);
  return matched ? normalizeDeliveryParam(matched[0]) : "";
};
const extractDuplicateName = (response) => {
  const data = response?.data ?? {};
  return String(
    data?.DUPLICATE_NAME ??
      data?.duplicate_name ??
      data?.DUPLICATE_NM ??
      data?.duplicateNm ??
      ""
  ).trim();
};
/** 메뉴명 + 배달메뉴명(1~10) 사이 중복 문구 생성 */
const findDuplicateDeliveryNameMessage = (menuNm, rows) => {
  const entries = [];
  const pushEntry = (label, value, channel = "") => {
    const raw = String(value ?? "").trim();
    if (!raw) return;
    entries.push({
      label,
      channel,
      value: raw.toLowerCase(),
    });
  };

  pushEntry("메뉴명", menuNm);
  (rows || []).forEach((row) => {
    const channel = String(row?.name ?? "").trim();
    if (isDeliveryMenuNoStoreMode.value && isMultiNameDeliveryRow(row)) {
      (row.menuNames || []).forEach((name, index) => {
        pushEntry(`배달메뉴명 ${index + 1}`, name, channel);
      });
    } else {
      pushEntry("배달메뉴명", row?.menuName, channel);
    }
  });

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (entries[i].value !== entries[j].value) continue;
      const left = entries[i];
      const right = entries[j];
      let leftLabel = left.label;
      let rightLabel = right.label;

      if (left.label === "메뉴명") {
        // 메뉴명 vs 배달메뉴명 → 뒤에 배달사 유지
        if (right.channel) rightLabel = `${right.channel} ${right.label}`;
      } else if (right.label === "메뉴명") {
        if (left.channel) leftLabel = `${left.channel} ${left.label}`;
      } else if (left.channel && right.channel && left.channel === right.channel) {
        // 같은 배달사끼리 → 앞에만 배달사, 뒤에는 배달메뉴명 N만
        leftLabel = `${left.channel} ${left.label}`;
        rightLabel = right.label;
      } else {
        // 서로 다른 배달사 → 양쪽 모두 배달사 표시
        if (left.channel) leftLabel = `${left.channel} ${left.label}`;
        if (right.channel) rightLabel = `${right.channel} ${right.label}`;
      }

      return `${leftLabel}과 ${rightLabel}이 똑같습니다. 다시 입력해주세요.`;
    }
  }
  return "";
};
const extractDeliveryMapList = (response) => {
  const src = response?.data;
  if (Array.isArray(src?.List)) return src.List;
  if (Array.isArray(src?.list)) return src.list;
  return [];
};
const buildDeliveryMenuRows = () => {
  const source = deliveryCompanyOptions.value || [];
  const rows = source
    .filter((item) => normalizeDeliveryParam(item?.strDCode) !== "")
    .map((item) => {
      const name = String(item?.strDName ?? item?.strDCode ?? "");
      return {
        code: normalizeDeliveryParam(item?.strDCode),
        name,
        menuName: "",
        originalMenuName: "",
        menuNames: createEmptyMultiMenuNames(),
        originalMenuNames: createEmptyMultiMenuNames(),
      };
    });

  // console.log("[MST01_003INS][DELIVERY_COMPANY] buildDeliveryMenuRows", {
  //   sourceLength: source.length,
  //   builtRowLength: rows.length,
  //   filteredOut: source
  //     .map((item, index) => ({
  //       index,
  //       strDCode: item?.strDCode,
  //       strDName: item?.strDName,
  //       normalized: normalizeDeliveryParam(item?.strDCode),
  //       keys: Object.keys(item ?? {}),
  //     }))
  //     .filter((item) => item.normalized === ""),
  //   rows,
  // });

  return rows;
};
const loadDeliveryMenuName = async () => {
  const storeCd = resolveDeliveryStoreCdForApi();
  const menuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  const baseRows = buildDeliveryMenuRows();
  deliveryMenuRows.value = baseRows;

  // 3048·9999(임시): 매장 필수 / 3287: STORE_CD=0 고정이라 메뉴만 있으면 조회
  if (
    !menuCd ||
    baseRows.length === 0 ||
    (!isDeliveryMenuNoStoreMode.value && !storeCd)
  ) {
    deliveryMenuName.value = "";
    return;
  }
  try {
    const loadedRows = await Promise.all(
      baseRows.map(async (row) => {
        const res = await getDeliveryMenuMap(
          groupCd.value,
          storeCd,
          row.code,
          menuCd
        );
        const useMulti =
          isDeliveryMenuNoStoreMode.value && isMultiNameDeliveryRow(row);
        if (useMulti) {
          const loadedNames = resolveDeliveryMenuNamesList(res);
          return {
            ...row,
            menuName: loadedNames[0] ?? "",
            originalMenuName: loadedNames[0] ?? "",
            menuNames: loadedNames,
            originalMenuNames: [...loadedNames],
          };
        }
        const loadedName = String(resolveDeliveryMenuName(res) ?? "").trim();
        return {
          ...row,
          menuName: loadedName,
          originalMenuName: loadedName,
          menuNames: createEmptyMultiMenuNames(),
          originalMenuNames: createEmptyMultiMenuNames(),
        };
      })
    );
    deliveryMenuRows.value = loadedRows;

    const selectedCd = normalizeDeliveryParam(deliveryCompany.value);
    const selectedRow = loadedRows.find((row) => row.code === selectedCd);
    deliveryMenuName.value = selectedRow?.menuName ?? "";
  } catch (error) {
    // console.error("[MST01_003INS][DELIVERY_MAP] request failed", error);
    deliveryMenuRows.value = baseRows;
    deliveryMenuName.value = "";
  }
};

/*
 * 공통 표준  Function
 */

watch(selectedMenu, () => {
  if (selectedMenu.value !== 2) return;
  const reagrid2 = document.getElementById(realgrid2Name.value);
  if (!reagrid2) return;
  setTimeout(() => {
    const instance = RealGrid.getGridInstance(reagrid2);
    if (!instance) return;
    instance.resetSize();
    instance.refresh(true);
  }, 100);
});
/**
 * 추가 버튼 함수
 */

const addRow4 = ref(false);
const updateRow = ref([]);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow3 = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref("");
const MenuGroup = ref("");
const SubMenuGroup = ref("");
const items = ref("");
const selectedPayDistinct = ref(true);
const selectedMultiple = ref(false);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const afterSearch = ref(false);
const clickedStoreNm = ref();
const storeOptions = ref([]);
const imageScope = ref("COMMON");
const imageStoreCd = ref("");
const pickedStoreCd = ref("");
/** 공통메뉴 플래그 — PickStore·저장 시 storecode 등 기존 동작 유지 */
const isStoreImageFeatureEnabled = computed(() => {
  const commonMenuFlag =
    store.state.userData.intCommonMenu ?? store.state.userData.lngCommonMenu;
  return String(commonMenuFlag) === "1";
});
/** 이미지 설정 탭 — 공통(그룹)/저장 매장 행만 허용할 매장 그룹 */
const MENU_IMAGE_SCOPE_STORE_GROUPS = [3051, 9999];
const isImageScopeStoreGroup = computed(() =>
  MENU_IMAGE_SCOPE_STORE_GROUPS.includes(Number(groupCd.value))
);
/** 공통 여부·저장 매장 UI 및 매장별 파일명 규칙 (위 두 조건 동시 만족) */
const showImageGroupScopeControls = computed(
  () => isStoreImageFeatureEnabled.value && isImageScopeStoreGroup.value
);
watch(
  isStoreImageFeatureEnabled,
  (enabled) => {
    hidesub.value = !enabled;
    hideAttr.value = !enabled;
  },
  { immediate: true }
);
watch(showImageGroupScopeControls, (ok) => {
  if (!ok && imageScope.value === "STORE") {
    imageScope.value = "COMMON";
    imageStoreCd.value = "";
  }
});
const normalizeStoreOption = (item) => {
  const lngStoreCode =
    item?.lngStoreCode ?? item?.LngStoreCode ?? item?.storeCd ?? item?.STORE_CD;
  if (lngStoreCode == null || lngStoreCode === "") {
    return null;
  }
  return {
    ...item,
    lngStoreCode,
    strName:
      item?.strName ??
      item?.strStoreName ??
      item?.StrStoreName ??
      item?.STORE_NM ??
      String(lngStoreCode),
  };
};
const normalizeStoreList = (payload) => {
  const rawList = payload?.data?.List ?? payload?.data?.store ?? payload?.data ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeStoreOption).filter(Boolean);
};
const loadStoreOptions = async (targetGroupCd = groupCd.value) => {
  try {
    const storeRes = await getStoreList2(targetGroupCd);
    storeOptions.value = normalizeStoreList(storeRes);
  } catch (error) {
    storeOptions.value = [];
  }
};
const imageStoreOptions = computed(() => {
  if (storeOptions.value.length > 0) {
    return storeOptions.value;
  }
  return (store.state.storeCd || []).map(normalizeStoreOption).filter(Boolean);
});
const normalizeImageStoreCd = (value) => {
  const strValue = value != null ? String(value) : "";
  if (!strValue || strValue === "-1" || strValue === "0") {
    return "";
  }
  return strValue;
};
const getEffectiveImageStoreCode = () => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    return "";
  }
  const selected = normalizeImageStoreCd(imageStoreCd.value || pickedStoreCd.value);
  return selected && selected !== "-1" && selected !== "0" ? selected : "";
};
watch(imageScope, (newValue) => {
  if (newValue !== "STORE") {
    // 공통(그룹) 전환 시 저장 매장을 "선택" 상태로 초기화
    imageStoreCd.value = "";
  }
});
const buildImageFileName = (menuCd, fallbackFileName = "") => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    return fallbackFileName || "";
  }
  const effectiveStoreCd = getEffectiveImageStoreCode();
  if (!effectiveStoreCd || !menuCd) {
    return fallbackFileName || "";
  }
  return (
    String(effectiveStoreCd).padStart(10, "0") +
    "_" +
    String(menuCd).padStart(10, "0") +
    ".jpg"
  );
};
const rowData2 = ref([]);
const clickrowData2 = ref([]);
const rowData3 = ref([]);
const filteredrowData3 = ref([]);
const itemDiscount = ref([]);
const payOptions = ref([]);
const rounding = ref([]);
const taxs = ref([]);
const isNew = ref(false);
const initCheckColumn = ref("menuCd");
const disCountGroup = ref([]);
const approveGroup = ref([]);
const approveType = ref([]);
const filteredapproveType = ref([]);
const initCheckValue = ref("");
const initCheckAct = ref(false);
const uncheckValue = ref();
const initSelect = ref(false);
const discountDisabled = ref(true);
const disableWithMenuDisc = ref(true);
// 할인선택 변경 감지용
const originalDiscountData = ref({}); // { menuCode: "strAmtCodeList" } 형태로 저장
const discountChanged = ref(false); // 할인선택 변경 여부 플래그
const labelsData = ref([
  ["할인", "지불", "할증"],
  ["사용", "미사용"],
]);
const valuesData = ref([
  ["1", "2", "3"],
  ["0", "1"],
]);
const labelingColumns = ref("payDistinct,blnInactive");
const gridvalue1 = ref(0);
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
const gridvalue19 = ref("");
const gridvalue20 = ref("");
const gridvalue21 = ref("");
const gridvalue22 = ref("");
const gridvalue23 = ref("");
const gridvalue24 = ref("");
const gridvalue25 = ref("");
const gridvalue26 = ref("");
const gridvalue27 = ref("");
const gridvalue28 = ref("");
const gridvalue29 = ref("");
const gridvalue30 = ref("");
const gridvalue31 = ref("");
const gridvalue32 = ref("");
const gridvalue33 = ref("");
const gridvalue34 = ref(false);
const gridvalue35 = ref(false);
const gridvalue36 = ref(false);
const gridvalue37 = ref(false);
const gridvalue38 = ref("");
const gridvalue39 = ref("");
const gridvalue40 = ref("");
const gridvalue41 = ref("");
const gridvalue42 = ref("");
const gridvalue100 = ref("");
watch([deliveryStoreCd, selectedMenuCodeForDelivery, gridvalue3, deliveryCompanyOptions], () => {
  loadDeliveryMenuName();
});
watch(gridvalue3, (newMenuCd) => {
  const normalized = normalizeDeliveryParam(newMenuCd);
  if (normalized && normalized !== selectedMenuCodeForDelivery.value) {
    selectedMenuCodeForDelivery.value = normalized;
  }
});
const clickedrowdata = ref([]);
const clickrowData4 = ref([]);
const filteredrowData5 = ref([]);
const afterClick = ref(true);
const fileName = ref();
const currentImageFileName = computed(() =>
  buildImageFileName(gridvalue3.value, fileName.value)
);
const rowIndex = ref();
const duplilfirstarr = ref();
const tempRowData2 = ref();

const onlyNumber = (e) => {
  gridvalue38.value = e.target.value.replace(/[^0-9]/g, "");

  const tagName = e.target.name;

  changeColid.value = tagName;
  changeValue2.value = gridvalue38.value;
  changeNow.value = !changeNow.value;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  rowIndex.value = e;
};

/**
 * 데이터셋 상세정보 셋팅
 */

function convertTo24Hour(timeStr) {
  //console.log(timeStr);
  if (!timeStr) return "";

  // "오전 12:00:00" → ["오전", "12:00:00"]

  const [no, ampm, time] = timeStr.split(" ");
  let [hour, minute, second] = time.split(":").map(Number);
  //console.log(hour);
  //console.log(minute);
  //console.log(second);
  if (ampm === "오전") {
    // 오전 12시는 0시로 변환
    if (hour === 12) hour = 0;
  } else if (ampm === "오후") {
    // 오후인데 12시는 그대로, 나머지는 12 더함
    if (hour !== 12) hour += 12;
  }

  // 항상 두 자리로 표시
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const ss = String(second).padStart(2, "0");

  return `${hh}:${mm}`;
}

const resolveSoldOutYnFromRow = (newvalue) => {
  const menuCd = Array.isArray(newvalue) ? newvalue[0] : newvalue?.lngCode;
  if (menuCd != null && menuCd !== "") {
    const rowObj = updateRow.value.find(
      (row) => String(row.lngCode) === String(menuCd)
    );
    if (rowObj?.blnSoldOutYN !== undefined && rowObj?.blnSoldOutYN !== null) {
      return normalizeSoldOutYn(rowObj.blnSoldOutYN);
    }
  }
  if (!Array.isArray(newvalue) && newvalue?.blnSoldOutYN != null) {
    return normalizeSoldOutYn(newvalue.blnSoldOutYN);
  }
  if (Array.isArray(newvalue)) {
    return normalizeSoldOutYn(newvalue[41]);
  }
  return "0";
};

const clickedRowData = async (newvalue) => {
  const payloadMenuCd = resolveMenuCdFromRow(newvalue);
  afterClick.value = false;
  // if (newvalue[9] == 0 || newvalue[12] == 0) {
  if (newvalue[9] == 0) {
    // 판매가 
    rowData2.value = [];
    clickrowData2.value = [];
    if (selectedMenu.value == 2) {
      selectedMenu.value = 1;
    }
  } else {
    rowData2.value = JSON.parse(JSON.stringify(tempRowData2.value));
    clickrowData2.value = JSON.parse(JSON.stringify(tempRowData2.value));
  }

  //comsole.log(SubMenuGroup.value);
  //comsole.log(newvalue[30]);
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == newvalue[30]
  );

  //comsole.log(filteredSubMenuGroup2.value);
  //rowIndex.value = newvalue.index;
  clickrowData4.value = [];
  filteredrowData5.value = [];

  searchWord2.value = "";
  searchWord3.value = "";
  clickedrowdata.value = newvalue[27];
  gridvalue1.value = newvalue[30];
  gridvalue2.value = newvalue[3];
  gridvalue3.value = newvalue[0];
  selectedMenuCodeForDelivery.value =
    payloadMenuCd || normalizeDeliveryParam(gridvalue3.value);
  gridvalue4.value = newvalue[4];
  gridvalue5.value = newvalue[5];
  gridvalue6.value = newvalue[1];
  gridvalue7.value = newvalue[6];
  gridvalue8.value = newvalue[7];
  gridvalue9.value = newvalue[8];
  gridvalue10.value = String(newvalue[9]).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  gridvalue11.value = newvalue[10];
  gridvalue12.value = newvalue[11];
  gridvalue13.value = newvalue[2];
  gridvalue14.value = newvalue[39];
  gridvalue15.value = newvalue[13];
  gridvalue16.value = newvalue[14];
  gridvalue17.value = newvalue[15];
  gridvalue18.value = newvalue[16];
  gridvalue19.value = newvalue[17];
  gridvalue20.value = newvalue[18];
  gridvalue21.value = newvalue[19];
  gridvalue22.value = newvalue[20];
  gridvalue23.value = newvalue[21];
  gridvalue24.value = newvalue[22];
  gridvalue25.value = newvalue[24];
  gridvalue26.value = newvalue[23];
  gridvalue27.value = newvalue[25];
  gridvalue28.value = newvalue[26];
  gridvalue42.value = resolveSoldOutYnFromRow(newvalue);
  gridvalue29.value = newvalue[27];
  gridvalue30.value = newvalue[28];
  gridvalue31.value = newvalue[29];

  gridvalue32.value = newvalue[35];
  gridvalue33.value = newvalue[36];
  gridvalue40.value = newvalue[12];
  gridvalue41.value = newvalue[40];

  gridvalue34.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 1) !== 0 : false;
  gridvalue35.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 2) !== 0 : false;
  gridvalue36.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 4) !== 0 : false;
  gridvalue37.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 8) !== 0 : false;

  gridvalue38.value = newvalue[37];
  gridvalue39.value = newvalue[38];

  if (gridvalue16.value == 1) {
    gridvalue100.value = 1;
    disabledKPG.value = true;
    if (gridvalue18.value != "1" && gridvalue18.value != "99") {
      showKPG.value = false;
    } else {
      showKPG.value = true;
    }
  } else {
    gridvalue100.value = 0;
    disabledKPG.value = false;
    showKPG.value = true;
  }
  discountDisabled.value =
    (newvalue[9] == 0 || newvalue[39] == 0) &&
    afterSearch.value == true &&
    afterClick.value == false;
  fileName.value = newvalue[33];
  // 최초 메뉴 선택 시에도 표시 파일명을 현재 이미지 규칙과 동일하게 노출
  fileName2.value = currentImageFileName.value || "";
  //comsole.log(newvalue);
  if (newvalue[34] === true) {
    const addedRow = rowData.value?.[newvalue.index];
    if (addedRow) clickaddrowSeq.value = addedRow.sequence;
  }

  const firstarr = newvalue[32] != undefined ? newvalue[32].split(";") : [];
  duplilfirstarr.value = firstarr;
  
  // 할인선택 원본 데이터 저장 (변경 감지용)
  const currentMenuCode = newvalue[0]?.toString();
  if (currentMenuCode) {
    originalDiscountData.value[currentMenuCode] = newvalue[32] || "";
    discountChanged.value = false; // 행 클릭 시 변경 플래그 초기화
  }
  if (rowData2.value.length > 0) {
    let dupliarr = JSON.parse(JSON.stringify(rowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = firstarr.indexOf(a.lngCode.toString());
      const bIndex = firstarr.indexOf(b.lngCode.toString());

      const rankA = aIndex !== -1 ? 0 : a.lngMenu === 0 ? 0 : 1;
      const rankB = bIndex !== -1 ? 0 : b.lngMenu === 0 ? 0 : 1;

      // 우선순위(rank)가 다르면 rank에 따라 정렬합니다.
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 둘 다 rank 0인 경우 : firstarr에 있으므로 인덱스 순서대로 정렬
      if (rankA === 0) {
        return Number(a.lngCode) - Number(b.lngCode);
      }

      // rank가 1 혹은 2인 경우, 추가 정렬 기준이 필요하면 여기에 추가합니다.
      // 예를 들어, lngCode 오름차순으로 정렬하는 식으로 할 수도 있습니다.
      // (여기서는 별도의 추가 기준이 없으므로 0을 반환하여 순서를 그대로 유지)
      return 0;
    });

    if (firstarr.length > 0 && firstarr[0] !== "") {
      for (var i = 0; i < firstarr.length; i++) {
        const change = dupliarr.find((item) => item.lngCode == firstarr[i]);
        //comsole.log(dupliarr);
        if (change) {
          change.checkbox = true;
        }
      }
    }

    clickrowData2.value = JSON.parse(JSON.stringify(dupliarr));
  }
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}?v=${Date.now()}`
    );
    await nextTick();
    //console.log(response);
    uploadImage.value.name = newvalue[31];
    fileSize.value = response.headers["content-length"];

    afterClick.value = false;
    setSubCd3();
  } catch (error) {
    //comsole.log("사진없음");
    uploadImage.value = { name: "" };
    fileSize.value = "";
  } finally {
    afterClick.value = false;
    
    // 파일 input 리셋
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = "";
    }
  }
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (e) => {
  changeRow.value = e;
};
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = async (e) => {
  groupCd.value = e;
  await loadStoreOptions(e);
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  ////console.log(newValue);
  pickedStoreCd.value = String(newValue);
  if (!imageStoreCd.value || imageStoreCd.value == "-1") {
    imageStoreCd.value = normalizeImageStoreCd(newValue);
  }
  if (newValue == "-1") {
    afterSearch.value = false;
    afterClick.value = true;
    gridvalue3.value = "";
    initAll();
    return;
  }
  if (nowStoreCd.value != newValue) {
    afterSearch.value = false;
    afterClick.value = true;
    gridvalue3.value = "";
    initAll();
  }
  if (isStoreImageFeatureEnabled.value) {
    nowStoreCd.value = 0;
  } else {
    nowStoreCd.value = newValue;
  }

  searchButton();
};
const clickmappingData = ref([]);
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
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};
/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  items.value = [];
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  afterSearch.value = false;
  searchword1.value = "";
  afterSearch.value = false;
};

const confirmData = ref([]);
const optionGroup = ref([]);
const subTitle = ref([]);
const menuOrderOption = ref([]);
const menuOptionCode = ref([]);

/**
 * 	조회버튼  처리 함수 (그리드 데이터 조회)
 */
/**
 *  조회 함수
 */

const searchButton = async () => {
  items.value = [];
  //comsole.log(nowStoreCd.value);
  if (nowStoreCd.value == -1) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  //comsole.log(groupCd.value, nowStoreCd.value);
  store.state.loading = true;
  try {
    initAll();
    clickrowData2.value = [];
    rowData.value = [];
    rowData3.value = [];
    filteredrowData3.value = [];
    rowData.value = [...rowData.value];
    filteredrowData3.value = [...filteredrowData3.value];

    const res = await getMenuCodeEnroll(groupCd.value, nowStoreCd.value);

    rowData.value = normalizeMenuListSoldOutYn(res.data.MENULIST);
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    MENUDEPEND.value = res.data.MENUDEPEND;
    subTitle.value = res.data.SUBTITLE;
    menuOrderOption.value = res.data.MENUORDEROPTION;
    menuOptionCode.value = res.data.MENUOPTIONCODE;
    confirmData.value = JSON.parse(JSON.stringify(rowData.value));

    optionGroup.value = res.data.OPTIONGROUP;
    tempRowData2.value = res.data.PAYCD;
    ////console.log(nowStoreCd.value);
    const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
    //rowData2.value = res2.data.menuList
    SubMenuGroup.value = res2.data.submenuGroup;
    MenuGroup.value = res2.data.menuGroup;
    //  //comsole.log(res)
    ////console.log(res2);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    approveType.value = Array.from(
      new Set(
        approveGroup.value.map((item) =>
          JSON.stringify({
            strDCode1: item.strDCode1,
            strDName1: item.strDName1,
          })
        )
      )
    )
      .map((item) => JSON.parse(item))
      .sort((a, b) => a.strDCode1 - b.strDCode1); // 다시 객체로 변환

    store.state.loading = false; // 로딩 상태 종료

    afterSearch.value = true;
    initFocus.value = !initFocus.value;
    initSelect.value = !initSelect.value;

    afterClick.value = true;
    uploadImages.value = [];
    uploadImagesCd.value = [];
  }
};

const searchWord = ref("");
const searchColValue2 = ref("");
const searchC1 = ref(-1);
const searchC2 = ref(-1);

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const FIELD_INFO_TOOLTIP_DURATION = 1500;
const fieldInfoTooltipKey = ref(null);
let fieldInfoTooltipTimer = null;

const hideFieldInfoTooltip = () => {
  if (fieldInfoTooltipTimer) {
    clearTimeout(fieldInfoTooltipTimer);
    fieldInfoTooltipTimer = null;
  }
  fieldInfoTooltipKey.value = null;
};

const toggleFieldInfoTooltip = (key) => {
  if (fieldInfoTooltipKey.value === key) {
    hideFieldInfoTooltip();
    return;
  }
  if (fieldInfoTooltipTimer) {
    clearTimeout(fieldInfoTooltipTimer);
    fieldInfoTooltipTimer = null;
  }
  fieldInfoTooltipKey.value = key;
  fieldInfoTooltipTimer = setTimeout(() => {
    hideFieldInfoTooltip();
  }, FIELD_INFO_TOOLTIP_DURATION);
};

const isFieldInfoTooltipVisible = (key) => fieldInfoTooltipKey.value === key;

const changeInfo = (e) => {
  const tagName = e.target.name;
  let value2 = e.target.value;
  if (tagName.includes("lngPrice")) {
    let val = value2.replace(/[^0-9]/g, "");
    value2 = val;

    gridvalue10.value = value2.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (tagName.includes("lngDiscount")) {
    let val = value2.replace(/[^0-9]/g, "");
    value2 = val;

    gridvalue14.value = val;
  }

  if (tagName.includes("lngType")) {
    changeColid.value = "lngType";
    changeValue2.value = 0;
    changeValue2.value += gridvalue34.value == true ? 1 : 0;
    changeValue2.value += gridvalue35.value == true ? 2 : 0;
    changeValue2.value += gridvalue36.value == true ? 4 : 0;
    changeValue2.value += gridvalue37.value == true ? 8 : 0;

    changeNow.value = !changeNow.value;
    return;
  }
  changeColid.value = tagName;
  changeValue2.value = value2;
  changeNow.value = !changeNow.value;
};
const searchColValue3 = ref("0,0");
const filteredSubMenuGroup = ref([]);
const searchValue = ref([-1, -1]);
/**
 * 조회 조건 설정
 */
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  if (name == "lngMainGroup") {
    //comsole.log(SubMenuGroup.value);
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == forsearchMain.value
    );
    forsearchSub.value = "-1";
    forsearchMain.value = value;
    searchValue.value = [value, forsearchSub.value];
  } else {
    forsearchSub.value = value;
    searchValue.value = [forsearchMain.value, value];
  }
};

const filteredSubMenuGroup2 = ref([]);
const setSubCd3 = () => {
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == gridvalue1.value
  );

  //gridvalue2.value = '0'

  //searchColValue3.value = gridvalue1.value+',0'
};
const setSubCd4 = () => {
  //comsole.log(SubMenuGroup.value);
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == gridvalue1.value
  );

  gridvalue2.value = "0";

  //searchColValue3.value = gridvalue1.value+',0'
};

const searchMenuList = (e) => {
  searchWord.value = e.target.value;
  hideRow.value = e.target.value;
  isNew.value = false;
  afterClick.value = true;
};
const changeColid = ref("checkedMenu");
const changeValue2 = ref("");
const changeRow = ref();
const changeNow = ref(false);

/**
 * 체크된 데이터 갱신
 */

/**
 * 체크된 값 데이터 세팅
 */
/**
 * 체크된 데이터 갱신
 */

const checkedRowData2 = (e) => {
  changeColid.value = "strAmtCodeList";
  //comsole.log(updateRow.value);
  //comsole.log(e);
  const newDiscountValue = e
    .filter((item) => item.lngMenu !== "0")
    .map((item2) => Number(item2.lngCode))
    .join(";");
  
  changeValue2.value = newDiscountValue;

  // 할인선택 변경 감지: 원본 데이터와 비교
  const currentMenuCode = gridvalue3.value?.toString();
  if (currentMenuCode && originalDiscountData.value[currentMenuCode] !== undefined) {
    const originalValue = originalDiscountData.value[currentMenuCode] || "";
    if (originalValue !== newDiscountValue) {
      discountChanged.value = true;
    } else {
      // 원본과 동일하면 변경 없음으로 표시
      discountChanged.value = false;
    }
  } else {
    // 원본 데이터가 없으면 변경된 것으로 간주
    discountChanged.value = true;
  }

  //changeValue2.value = e.changeRow.value = rowIndex.value;
  changeNow.value = !changeNow.value;
  //comsole.log(e);
};

const searchWord3 = ref();

const addrowProp = ref();
const addrowDefault = ref();
const addrowSeq = ref(1);
const clickaddrowSeq = ref();
/**
 * 그리드 행 추가 버튼 함수
 */
/**
 * 추가 버튼 함수
 */

const addRow = () => {
  const length = updateDeleteInsertrowIndex.value.created.length;
  if (length == 0) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA");
    addrowProp.value =
      "lngMainGroup,lngSubGroup,dtmFromDate,dtmToDate,strName,lngPrice,lngTax,blnInactive,strAmtCodeList,lngDCPrice,lngChain,blnDCPriceYN,lngDiscount,intCustCount,lngOrder,lngKPG,blnReceipt,lngMenuOption,blnFloat,strIcon,blnKitSingle,lngSubTitle,blnServing,blnOpen,blnDeliveryYN,blnSoldOutYN";
    addrowDefault.value =
      "0,0," +
      formattedDate +
      "," +
      "9999-12-31" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "" + // lngChain
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "1" + // lngKPG (주방출력제외 - 아니오)
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0";

    //comsole.log(addrowProp.value);
    addRow4.value = !addRow4.value;
    addrowSeq.value++;
    rowData.value.push({
      new: true,
      sequence: "new" + addrowSeq.value,
      lngStoreCode: nowStoreCd.value,
      strName: undefined,
      lngCode: undefined,
      blnInactive: undefined,
    });
    clickaddrowSeq.value = "new" + addrowSeq.value;
    // 주방출력제외 초기값을 "아니오"(1)로 설정 (UI 반영)
    gridvalue18.value = "1";
    disabledKPG.value = false;
    showKPG.value = true;
  }
};

/**
 * AI로 추가: 등록할 메뉴를 적용할 때 기존 addRow + changeInfo 경로로 신규 행에 값을 넣고, 저장은 기존 저장 버튼으로 한다
 */
const formatAiPrice = (price) =>
  String(price ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const buildAiGroupList = () =>
  JSON.stringify({
    main: (MenuGroup.value || []).map((i) => ({
      code: String(i.GroupCd),
      name: i.majorGroupNm,
    })),
    sub: (SubMenuGroup.value || []).map((i) => ({
      mainCode: String(i.sublngMajor),
      code: String(i.GroupCd),
      name: i.subGroupNm,
    })),
  });

// AI가 고른 분류 코드가 화면 목록에 있는지 다시 확인한다 (없으면 비우고 메모)
const normalizeAiRow = (row, idx) => {
  const notes = row.strNote ? [row.strNote] : [];
  let main = String(row.lngMainGroup ?? "");
  let sub = String(row.lngSubGroup ?? "");
  const mainItem = (MenuGroup.value || []).find(
    (i) => String(i.GroupCd) === main
  );
  if (main && !mainItem) {
    notes.push("메뉴분류 확인 필요");
    main = "";
  }
  const subItem = (SubMenuGroup.value || []).find(
    (i) => String(i.GroupCd) === sub && String(i.sublngMajor) === main
  );
  if (sub && !subItem) {
    notes.push("소분류 확인 필요");
    sub = "";
  }
  const price = String(row.lngPrice ?? "").replace(/[^0-9]/g, "");
  // 과세구분: 0 과세(기본) / 2 면세
  const tax = String(row.lngTax ?? "") === "2" ? "2" : "0";
  return {
    key: idx,
    strName: row.strName || "",
    lngPrice: price || "0",
    lngMainGroup: main,
    lngSubGroup: sub,
    lngTax: tax,
    taxText: tax === "2" ? "면세" : "과세",
    // 필수: 메뉴명·판매가·대분류·소분류 (과세구분은 기본 과세). 메뉴코드는 화면이 따로 정한다 (refreshAiChatComplete)
    baseComplete: !!row.strName && price !== "" && price !== "0" && main !== "" && sub !== "",
    complete: false,
    lngCode: "",
    mainName: mainItem && main ? mainItem.majorGroupNm : "",
    subName: subItem && sub ? subItem.subGroupNm : "",
    groupText: [mainItem && main ? mainItem.majorGroupNm : "", subItem && sub ? subItem.subGroupNm : ""]
      .filter((v) => v)
      .join(" > "),
    note: notes.join(" / "),
    applied: false,
  };
};

// changeNow 토글은 한 tick에 한 번만 그리드에 반영되므로 값마다 nextTick을 기다린다
const setAiField = async (colId, value) => {
  changeColid.value = colId;
  changeValue2.value = value;
  changeNow.value = !changeNow.value;
  await nextTick();
};

const applyAiRow = async (item) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // 기존 addRow는 신규 행이 하나 있으면 추가하지 않는다 → 저장 후 다음 메뉴 적용
  if ((updateDeleteInsertrowIndex.value.created?.length ?? 0) > 0) {
    Swal.fire({
      title: "경고",
      text: "추가된 신규 행이 있습니다. 저장한 뒤 다음 메뉴를 적용하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // 같은 메뉴코드가 이미 있으면 저장 시 기존 메뉴를 덮어쓰므로 적용하지 않는다 (적용 직전에 DB 기준으로 다시 확인)
  const check = item.lngCode
    ? await fetchMenuCodeSuggestion(item, item.lngCode, aiChatItems.value.indexOf(item))
    : null;
  if (check && check.inputUsed) {
    // 그사이 같은 코드가 생겼으면 빈 번호를 새로 제안해 바꿔 두고, 확인 후 다시 적용하게 한다
    const proposal = check.code;
    const usedCode = item.lngCode;
    item.lngCode = proposal;
    refreshAiChatComplete(item);
    Swal.fire({
      title: "경고",
      text: proposal
        ? `메뉴코드 ${usedCode}는 이미 사용 중이라 ${proposal}로 바꿨습니다. 확인 후 다시 적용해 주세요.`
        : `메뉴코드 ${usedCode}는 이미 사용 중입니다. AI 대화에서 다른 번호를 입력해 주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addRow();
  // 그리드가 새 행을 선택하고 clickedRowData·selectedIndex로 폼과 changeRow를 채울 때까지 기다린다
  await nextTick();
  await nextTick();

  // 메뉴코드는 직접 지정한 값을 쓰므로 자동 채번 체크는 끈다
  if (item.lngCode) {
    isNewAutoMenuCode.value = false;
    gridvalue3.value = item.lngCode;
    await setAiField("lngCode", item.lngCode);
  }
  if (item.lngMainGroup) {
    gridvalue1.value = item.lngMainGroup;
    setSubCd4();
    await setAiField("lngMainGroup", item.lngMainGroup);
  }
  if (item.lngSubGroup) {
    gridvalue2.value = item.lngSubGroup;
    await setAiField("lngSubGroup", item.lngSubGroup);
  }
  gridvalue6.value = item.strName;
  await setAiField("strName", item.strName);
  gridvalue10.value = formatAiPrice(item.lngPrice);
  await setAiField("lngPrice", item.lngPrice);
  // 과세구분(기본 과세), 유효기간 9999-12-31, 사용여부 사용 — addRow 기본값과 같지만 명시해서 넣는다
  gridvalue12.value = item.lngTax || "0";
  await setAiField("lngTax", gridvalue12.value);
  gridvalue5.value = "9999-12-31";
  await setAiField("dtmToDate", "9999-12-31");
  gridvalue13.value = "0";
  await setAiField("blnInactive", "0");
  // 추가 설정: 옵션그룹(lngChain), 다국어(메뉴명 영문 strNameE)
  if (item.lngChain) {
    gridvalue9.value = item.lngChain;
    await setAiField("lngChain", item.lngChain);
  }
  if (item.strNameE) {
    gridvalue7.value = item.strNameE;
    await setAiField("strNameE", item.strNameE);
  }
  // 주방출력(lngKPG)·할인적용(lngDiscount, discountYN): 각각 고른 값으로 (고르지 않았으면 addRow 기본값 그대로)
  if (item.lngKPG !== undefined && item.lngKPG !== "") {
    gridvalue18.value = item.lngKPG;
    await setAiField("lngKPG", item.lngKPG);
  }
  if (item.lngDiscount !== undefined && item.lngDiscount !== "") {
    gridvalue40.value = item.lngDiscount;
    await setAiField("lngDiscount", item.lngDiscount);
    if (item.discountYN !== undefined && item.discountYN !== "") {
      gridvalue14.value = item.discountYN;
      await setAiField("discountYN", item.discountYN);
    }
  }
  // 다국어: 메뉴 저장 뒤 저장할 수 있게 메뉴코드별로 담아 둔다
  if (item.multiLang && item.lngCode) {
    aiMultiLangByCode.value[item.lngCode] = { ...item.multiLang };
  }
  // 메뉴 이미지: 기존 handleFileUpload 와 같은 방식 (strUserFileName 설정 + 메뉴코드별 업로드 목록, 저장 시 업로드)
  if (item.imageFile && item.lngCode) {
    fileName2.value = item.imageName;
    await setAiField("strUserFileName", item.imageName);
    const existingIndex = uploadImagesCd.value.findIndex((cd) => cd === item.lngCode);
    if (existingIndex !== -1) {
      uploadImages.value.splice(existingIndex, 1);
      uploadImagesCd.value.splice(existingIndex, 1);
    }
    uploadImages.value.push(item.imageFile);
    uploadImagesCd.value.push(item.lngCode);
  }

  item.applied = true;
};

/**
 * AI 대화 팝업: 대화 기록과 지금까지 만든 등록할 메뉴를 매번 보내고(서버는 대화를 저장하지 않음), 답변과 전체 등록할 메뉴 목록을 받는다
 */
const AI_CHAT_MAX_TURNS = 10;
// 서버로 보낼 AI 대화 기록의 시작 위치. 메뉴 하나의 AI 단계(메뉴명~소분류)가 끝나면 그다음부터 새로 시작한다.
// 지금까지 만든 메뉴는 '등록할 메뉴 목록'으로 매번 함께 보내므로 이전 메뉴 수정 요청도 처리된다
const aiChatHistoryStart = ref(0);
const aiChatOpen = ref(false);
const aiChatMessages = ref([]);
const aiChatItems = ref([]);
const aiChatText = ref("");
const aiChatLoading = ref(false);
const aiChatTestMode = ref(false);
const aiChatLogRef = ref(null);
// 화면 표시용 대화: 첫 안내와 답변 대기 문구는 화면에만 보이고 서버로 보내는 기록에는 넣지 않는다
// AI 답변 하나는 확인(plain, 강조 없음)과 이번 질문을 서로 다른 말풍선으로 나눠 보여 준다
// 선택지를 같은 말풍선에 붙이지 않는 특수 말풍선 (표·버튼 등이 있는 말풍선)
const AI_CHAT_SPECIAL_BUBBLE_KEYS = [
  "startMenu",
  "searchRows",
  "salesRows",
  "groupRows",
  "editPick",
  "editRows",
  "typoFix",
  "imageAsk",
  "image",
  "imageConfirm",
  "multiLang",
  "codeConfirm",
  "optionsMenu",
  "menuKeyStores",
  "menuKeyScreens",
  "detailAsk",
  "summary",
];
const aiChatDisplayMessages = computed(() => {
  const list = [
    { role: "assistant", content: "안녕하세요. 원하시는 작업을 입력해 주세요.", startMenu: true },
    ...aiChatMessages.value.filter((m) => !m.hidden).flatMap((m) =>
      m.parts ? m.parts.map((p) => ({ role: m.role, content: p.text, plain: p.plain })) : [m]
    ),
    // (메시지 객체의 image: 미리보기 주소, imageConfirm: 등록/다시 선택 버튼 표시)
    ...(aiChatLoading.value
      ? [{ role: "assistant", content: "답변 작성 중...", typing: true }]
      : []),
  ];
  // 대분류·소분류·옵션그룹·주방출력/할인 기준 단계: 라디오 선택지를 마지막 질문 말풍선 안에 붙여 한 세트로 보여 준다.
  // 마지막 말풍선이 사용자 말이거나 표·버튼이 있는 말풍선이면 따로 선택지 말풍선을 붙인다
  if (
    !aiChatLoading.value &&
    ["main", "sub", "optionGroup", "settingRef", "editSub"].includes(aiChatStep.value) &&
    aiChatGroupChoices.value.length > 0
  ) {
    const last = list[list.length - 1];
    if (last.role === "assistant" && !AI_CHAT_SPECIAL_BUBBLE_KEYS.some((k) => last[k])) {
      list[list.length - 1] = { ...last, choicesInline: true };
    } else {
      list.push({ role: "assistant", content: "", choices: true });
    }
  }
  return list;
});

// 팝업 이동: 제목줄 드래그로 left/top 을 바꾼다 (크기 조정은 CSS resize). 처음 열 때 화면 가운데에 둔다
const aiChatPopupRef = ref(null);
const aiChatPos = ref(null);
const aiChatPopupStyle = computed(() =>
  aiChatPos.value
    ? { left: `${aiChatPos.value.x}px`, top: `${aiChatPos.value.y}px` }
    : { visibility: "hidden" }
);
const centerAiChatPopup = async () => {
  await nextTick();
  const el = aiChatPopupRef.value;
  if (!el) return;
  aiChatPos.value = {
    x: Math.max(0, Math.round((window.innerWidth - el.offsetWidth) / 2)),
    y: Math.max(0, Math.round((window.innerHeight - el.offsetHeight) / 2)),
  };
};
const startAiChatDrag = (e) => {
  if (e.button !== 0 || e.target.closest("button") || !aiChatPos.value) return;
  const el = aiChatPopupRef.value;
  const startX = e.clientX - aiChatPos.value.x;
  const startY = e.clientY - aiChatPos.value.y;
  const onMove = (ev) => {
    // 제목줄이 화면 밖으로 나가지 않게 제한
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 40;
    aiChatPos.value = {
      x: Math.min(Math.max(ev.clientX - startX, 80 - el.offsetWidth), maxX),
      y: Math.min(Math.max(ev.clientY - startY, 0), maxY),
    };
  };
  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  e.preventDefault();
};
// 다음에 물을 항목 (서버 STEP): name 메뉴명 / price 판매가 / main 대분류 / sub 소분류 / code 메뉴코드(화면 처리)
// intent: 시작(작업 종류 판단·조회·질문, chatAssist) / editPick·editSub·editConfirm: 메뉴 수정 (화면 처리)
const aiChatStep = ref("intent");
const AI_CHAT_STEP_TEXT = {
  intent: "원하시는 작업",
  editPick: "수정할 메뉴 선택",
  editSub: "소분류 선택",
  editConfirm: "수정 확인 (수정 저장 / 취소)",
  name: "메뉴명",
  price: "판매가",
  main: "대분류",
  sub: "소분류",
  confirm: "확인 (네 / 아니오)",
  code: "메뉴코드 확정 ('사용' 또는 숫자 4~9자리)",
  image: "메뉴 이미지 (없으면 '없음')",
  imageConfirm: "이미지 등록 확인 (등록 / 다시 선택)",
  detailAsk: "메뉴 상세 설정 필요 여부 (예 / 아니오)",
  options: "메뉴 상세 설정 (메뉴옵션 / 다국어 / 이미지 / 메뉴키 / 완료)",
  optionGroup: "메뉴옵션(옵션그룹) (없으면 '없음')",
  multiLang: "다국어 확인 (등록 / 취소 / 영어: …)",
  final: "최종 등록 확인 (최종 등록 / 다시 설정)",
  settingRef: "주방출력·할인적용 기준 메뉴 선택",
  menuKeyStore: "메뉴키 매장 선택 (다음 / 취소)",
  menuKeyScreen: "메뉴키 화면 선택 (확인 / 취소)",
};
const AI_CHAT_CONFIRM_WORDS = [
  "네",
  "예",
  "응",
  "좋아",
  "좋아요",
  "확인",
  "그대로",
  "사용",
  "사용할게",
  "사용할게요",
  "확정",
  "그래",
  "맞아",
  "ok",
  "OK",
  "넵",
];
// AI 답변을 확인/질문으로 나눈다. AI가 확인 문장을 reply 앞에 붙여 보내도, 앞쪽의 '…했습니다.' 같은 확인 문장은 confirm 으로 옮기고
// 질문 앞의 '다음으로·이어서' 같은 연결어는 뺀다
const AI_CHAT_ASK_RE = /(주세요|주십시오|할까요|될까요|하시겠습니까|\?)\s*$/;
const splitAiChatReply = (confirm, reply) => {
  const sentences = String(reply)
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s);
  const lead = [];
  while (sentences.length > 1 && !AI_CHAT_ASK_RE.test(sentences[0])) {
    lead.push(sentences.shift());
  }
  const confirmText = [String(confirm).trim(), ...lead].filter((t) => t).join(" ");
  const replyText = sentences
    .join(" ")
    .replace(/^(다음으로|그다음으로|그 다음으로|이어서|그럼|그러면)[\s,.]*/u, "");
  return { confirmText, replyText: replyText || String(reply) };
};

// AI 말풍선에서 빨간색으로 강조할 입력 항목 이름 (긴 이름부터 찾음)
const AI_CHAT_KEYWORDS = [
  "메뉴명(영문)",
  "메뉴 상세 설정",
  "메뉴 이미지 업로드",
  "메뉴 이미지",
  "이미지 업로드",
  "메뉴옵션설정",
  "메뉴키 설정",
  "주방출력",
  "할인적용",
  "메뉴키",
  "다국어 설정",
  "최종 등록",
  "메뉴코드",
  "메뉴명",
  "판매가",
  "대분류",
  "소분류",
  "과세구분",
  "옵션그룹",
  "다국어",
  "완료",
];
const AI_CHAT_KEYWORD_RE = new RegExp(
  "(" + AI_CHAT_KEYWORDS.map((k) => k.replace(/[()]/g, (c) => "\\" + c)).join("|") + ")",
  "g"
);
const splitAiChatKeywords = (content) =>
  String(content ?? "")
    .split(AI_CHAT_KEYWORD_RE)
    .filter((t) => t !== "")
    .map((t) => ({ text: t, key: AI_CHAT_KEYWORDS.includes(t) }));
// 상세 설정·최종 확인 단계에서 '메뉴 기본 정보 수정' 으로 보고 AI로 보낼 말 (메뉴명·판매가·분류·과세, 금액)
const AI_CHAT_EDIT_RE = /(메뉴명(?!\(영문\))|이름|판매가|가격|단가|금액|대분류|소분류|분류|면세|과세|\d[\d,]*\s*원|[만천]\s*원|\d{3,})/;
// 주방출력·할인 선택, 이미지·메뉴옵션·다국어·메뉴키 단계에서 수정 요청으로 보는 말 (항목 이름이 있어야 함)
const AI_CHAT_EDIT_EXTRA_STEPS = [
  "settingRef",
  "image",
  "imageConfirm",
  "optionGroup",
  "multiLang",
  "menuKeyStore",
  "menuKeyScreen",
];
const AI_CHAT_EDIT_STRICT_RE = /(메뉴명(?!\(영문\))|판매가|가격|대분류|소분류|분류|면세|과세)/;
const AI_CHAT_SKIP_WORDS =["없음", "없어", "없어요", "없습니다", "건너뛰기", "패스", "아니오", "아니요", "no", "NO"];

// 메뉴 이미지: PNG·JPG만 받고, 화면에서 220×160 으로 맞춰(비율 유지, 빈 곳은 흰색) JPG 로 바꾼다. 2MB 이하
const AI_IMAGE_WIDTH = 220;
const AI_IMAGE_HEIGHT = 160;
const AI_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const aiChatImageInputRef = ref(null);
// 이미지 미리보기 확대 보기 (미리보기 주소, 없으면 닫힘)
const aiChatZoomImage = ref(null);

// 이미지 안내 말풍선 번호: 가장 최근 말풍선의 버튼만 누를 수 있게 한다
const aiChatImageAskSeqNow = ref(0);
const goAiChatImageStep = () => {
  aiChatMessages.value.push({
    role: "assistant",
    content:
      "메뉴 이미지가 있으면 등록해 주세요. (PNG·JPG, 220×160 크기와 2MB 이하로 자동 조정됩니다)\n이미지가 없으면 '없음'이라고 입력해 주세요.",
    imageAsk: true,
    imageAskSeq: ++aiChatImageAskSeqNow.value,
    local: true,
  });
  aiChatStep.value = "image";
};

// 이미지 안내 말풍선 안 버튼: 파일 선택 / 이미지 없음
const chooseAiChatImageFile = () => {
  if (aiChatStep.value !== "image" || aiChatLoading.value) return;
  if (aiChatImageInputRef.value) aiChatImageInputRef.value.click();
};
const skipAiChatImage = () => {
  if (aiChatStep.value !== "image" || aiChatLoading.value) return;
  aiChatText.value = "없음";
  sendAiChat();
};

const resizeAiMenuImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = AI_IMAGE_WIDTH;
      canvas.height = AI_IMAGE_HEIGHT;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, AI_IMAGE_WIDTH, AI_IMAGE_HEIGHT);
      const scale = Math.min(AI_IMAGE_WIDTH / img.width, AI_IMAGE_HEIGHT / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      ctx.drawImage(img, (AI_IMAGE_WIDTH - w) / 2, (AI_IMAGE_HEIGHT - h) / 2, w, h);
      URL.revokeObjectURL(url);
      const encode = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("이미지 변환 실패"));
            if (blob.size > AI_IMAGE_MAX_BYTES && quality > 0.3) return encode(quality - 0.1);
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };
      encode(0.9);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽을 수 없습니다."));
    };
    img.src = url;
  });

const onAiChatImageSelected = async (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (!file || !current || aiChatStep.value !== "image") return;
  if (!/\.(png|jpe?g)$/i.test(file.name) || !/^image\/(png|jpeg)$/.test(file.type)) {
    pushAiChatLocal("assistant", "PNG 또는 JPG 이미지만 등록할 수 있습니다.");
    scrollAiChatLog();
    return;
  }
  try {
    const blob = await resizeAiMenuImage(file);
    if (blob.size > AI_IMAGE_MAX_BYTES) {
      pushAiChatLocal("assistant", "이미지 용량을 2MB 이하로 줄이지 못했습니다. 다른 이미지를 선택해 주세요.");
      return;
    }
    // 바로 등록하지 않고, 조정한 이미지를 보여 준 뒤 등록할지 묻는다
    const imageName = file.name.replace(/\.(png|jpe?g)$/i, ".jpg");
    aiChatPendingImage.value = {
      file: new File([blob], imageName, { type: "image/jpeg" }),
      name: imageName,
    };
    pushAiChatLocal("user", `이미지: ${file.name}`);
    aiChatMessages.value.push({
      role: "assistant",
      content: `${AI_IMAGE_WIDTH}×${AI_IMAGE_HEIGHT} 크기로 조정한 이미지입니다. (${Math.ceil(blob.size / 1024)}KB)`,
      image: URL.createObjectURL(blob),
      local: true,
      plain: true,
    });
    aiChatMessages.value.push({
      role: "assistant",
      content: "이대로 등록하시겠습니까?",
      imageConfirm: true,
      local: true,
    });
    aiChatStep.value = "imageConfirm";
  } catch (error) {
    pushAiChatLocal("assistant", error.message || "이미지를 처리하지 못했습니다.");
  } finally {
    scrollAiChatLog();
  }
};

// 조정한 이미지 등록 확인: 등록하면 메뉴에 붙이고 다음 메뉴로, 다시 선택이면 이미지 단계로 돌아간다
const aiChatPendingImage = ref(null);
const confirmAiChatImage = (accept) => {
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (aiChatStep.value !== "imageConfirm" || !current || !aiChatPendingImage.value) return;
  pushAiChatLocal("user", accept ? "등록" : "다시 선택");
  if (accept) {
    current.imageFile = aiChatPendingImage.value.file;
    current.imageName = aiChatPendingImage.value.name;
    aiChatPendingImage.value = null;
    pushAiChatLocal("assistant", "이미지를 등록했습니다.", true);
    goAiChatOptionsStep();
  } else {
    aiChatPendingImage.value = null;
    pushAiChatLocal(
      "assistant",
      "다른 메뉴 이미지를 선택해 주세요. 이미지가 없으면 '없음'이라고 입력해 주세요."
    );
    aiChatStep.value = "image";
  }
  scrollAiChatLog();
  focusAiChatInput();
};

// 등록 확인 단계에서 입력창에 쓴 답 처리 (항상 화면에서 끝냄)
const handleAiChatImageConfirmInput = (text) => {
  if (AI_CHAT_CONFIRM_WORDS.includes(text) || text === "등록") {
    confirmAiChatImage(true);
  } else if (["아니오", "아니요", "아니", "다시", "다시 선택", "no", "NO"].includes(text)) {
    confirmAiChatImage(false);
  } else {
    pushAiChatLocal("user", text);
    pushAiChatLocal("assistant", "이미지를 등록하려면 '등록', 다른 이미지를 고르려면 '다시 선택'을 눌러 주세요.");
  }
  return true;
};

// 이미지 단계 입력 처리 (항상 화면에서 끝냄). '없음' 등이면 이미지 없이 추가 설정으로 돌아간다
const handleAiChatImageInput = (text) => {
  pushAiChatLocal("user", text);
  if (AI_CHAT_SKIP_WORDS.includes(text) || text === "완료") {
    pushAiChatLocal("assistant", "이미지 없이 진행합니다.", true);
    goAiChatOptionsStep();
  } else {
    pushAiChatLocal("assistant", "이미지 선택 버튼으로 이미지를 고르거나, 이미지가 없으면 '없음'이라고 입력해 주세요.");
  }
  return true;
};

/**
 * 메뉴 상세 설정(선택): 메뉴코드를 확정하면 '아래 메뉴 상세 설정이 필요하신가요?' 를 묻고,
 * 예 → 메뉴옵션설정(옵션그룹)·다국어 설정·메뉴 이미지 업로드·메뉴키 설정 버튼, 아니오 → 바로 완료(최종 확인).
 * 완료하면 설정된 정보를 말풍선으로 보여 주고 '최종 등록' 버튼으로 메뉴를 바로 저장한다. 모두 화면에서만 처리한다 (AI 호출 없음)
 */
const AI_CHAT_DETAIL_ASK_TEXT =
  "아래 메뉴 상세 설정이 필요하신가요?\n• 메뉴옵션설정\n• 다국어 설정\n• 메뉴 이미지 업로드\n• 메뉴키 설정";
const AI_CHAT_OPTIONS_TEXT = "설정할 항목을 선택해 주세요. 다 되었으면 완료를 눌러 주세요.";
const AI_CHAT_OPTION_CHIPS = ["메뉴옵션설정", "다국어 설정", "메뉴 이미지 업로드", "메뉴키 설정", "완료"];
const AI_CHAT_YES_WORDS = [...AI_CHAT_CONFIRM_WORDS, "예", "필요해", "필요해요", "필요", "있어", "있어요"];
const AI_CHAT_NO_WORDS = [...AI_CHAT_SKIP_WORDS, "아니", "필요없어", "필요 없어", "필요 없어요", "괜찮아", "괜찮아요", "됐어", "완료"];

// 메뉴코드 확정 직후: 상세 설정이 필요한지 예/아니오로 묻는다
// 수정하러 앞 단계로 갔을 때 끝나면 돌아갈 단계 (final 최종 확인 / options 상세 설정 / detailAsk 상세 설정 여부, 없으면 "")
let aiChatReturnTo = "";
const goAiChatReturnStep = () => {
  const target = aiChatReturnTo;
  aiChatReturnTo = "";
  resumeAiChatStep(target);
};

// 수정을 마친 뒤 원래 단계로 다시 들어간다
// (주방출력·할인 선택은 고르던 항목부터 다시 묻고, 이미지·메뉴옵션·다국어·메뉴키 단계는 상세 설정 선택으로)
const resumeAiChatStep = (step) => {
  const current = aiChatItems.value.find((i) => !i.finished);
  if (step === "final") {
    finishAiChatMenu();
  } else if (step === "detailAsk") {
    goAiChatDetailAskStep();
  } else if (step === "settingRef" && current) {
    const index = AI_SETTING_STEPS.findIndex((s) => s.type === aiChatSettingType.value);
    askAiChatSetting(current, index < 0 ? 0 : index);
  } else {
    goAiChatOptionsStep();
  }
};

const goAiChatDetailAskStep = () => {
  aiChatMessages.value.push({
    role: "assistant",
    content: AI_CHAT_DETAIL_ASK_TEXT,
    detailAsk: true,
    local: true,
  });
  aiChatStep.value = "detailAsk";
};

const answerAiChatDetailAsk = (yes) => {
  if (aiChatStep.value !== "detailAsk") return;
  pushAiChatLocal("user", yes ? "예" : "아니오");
  if (yes) {
    goAiChatOptionsStep();
  } else {
    finishAiChatMenu();
  }
  scrollAiChatLog();
  focusAiChatInput();
};

const handleAiChatDetailAskInput = (text) => {
  if (AI_CHAT_NO_WORDS.includes(text) || /^아니|필요\s*없/.test(text)) {
    answerAiChatDetailAsk(false);
  } else if (AI_CHAT_YES_WORDS.includes(text)) {
    answerAiChatDetailAsk(true);
  } else if (/옵션|다국어|영문|번역|이미지|메뉴키/.test(text)) {
    // 바로 항목을 말하면 그 설정으로 간다
    aiChatStep.value = "options";
    handleAiChatOptionsInput(text);
  } else {
    pushAiChatLocal("user", text);
    pushAiChatLocal("assistant", "상세 설정이 필요하시면 '예', 필요 없으시면 '아니오'라고 말씀해 주세요.");
  }
  return true;
};

// 상세 설정 항목 버튼 안내
const goAiChatOptionsStep = () => {
  // 최종 확인 표의 「수정」으로 들어온 상세 설정(메뉴옵션·다국어·이미지·메뉴키)은 끝나면 최종 확인으로 돌아간다
  if (aiChatReturnTo === "final") {
    aiChatReturnTo = "";
    finishAiChatMenu();
    return;
  }
  aiChatMessages.value.push({
    role: "assistant",
    content: AI_CHAT_OPTIONS_TEXT,
    optionsMenu: true,
    local: true,
  });
  aiChatStep.value = "options";
};

// 최종 확인 표 번호: 가장 최근 표의 「수정」 버튼만 누를 수 있게 한다
const aiChatSummarySeq = ref(0);
// 최종 확인 표에서 「수정」을 누를 수 있는 항목 (사용여부·유효기간은 기본값 고정이라 제외)
const AI_SUMMARY_EDIT = {
  메뉴명: "name",
  판매가: "price",
  대분류: "group",
  소분류: "group",
  메뉴코드: "code",
  과세구분: "tax",
  주방출력: "KPG",
  할인적용: "DISCOUNT",
  메뉴옵션: "option",
  메뉴키: "menuKey",
  다국어: "multiLang",
  이미지: "image",
};

// 최종 확인 표의 항목 「수정」: 그 단계로 가서 고친 뒤 최종 확인으로 돌아온다
const editAiChatSummaryRow = async (label) => {
  const key = AI_SUMMARY_EDIT[label];
  const current = aiChatItems.value.find((i) => !i.finished);
  if (!key || !current || aiChatStep.value !== "final" || aiChatLoading.value) return;
  if (key === "group") {
    // AI 대화로 대분류부터 다시 고른다 (소분류 → 메뉴코드 다시 제안 → 최종 확인)
    aiChatText.value = "대분류 변경";
    await sendAiChat();
    return;
  }
  pushAiChatLocal("user", `${label} 수정`);
  if (key === "name" || key === "price" || key === "tax") {
    // 입력창에 항목 이름을 채워 두고, 보내면 AI가 반영한 뒤 최종 확인을 다시 보여 준다
    pushAiChatLocal(
      "assistant",
      key === "tax"
        ? "과세구분을 말씀해 주세요. 예: '면세로', '과세로'"
        : `바꿀 ${label}을(를) 입력해 주세요. 예: '${label} ${key === "name" ? current.strName : "5000"}'`
    );
    aiChatText.value = key === "tax" ? "과세구분 " : `${label} `;
  } else if (key === "code") {
    aiChatReturnTo = "final";
    aiChatStep.value = "code";
    aiChatMessages.value.push({
      role: "assistant",
      content: `현재 메뉴코드 : ${current.lngCode}\n이 메뉴코드를 그대로 사용하시겠습니까?\n변경을 원하시면 숫자로 메뉴코드를 4~9자리로 입력해 주세요.`,
      codeConfirm: true,
      local: true,
    });
  } else if (key === "KPG" || key === "DISCOUNT") {
    aiChatReturnTo = "final";
    aiChatLoading.value = true;
    aiChatSettingRefs.value = await loadAiChatSettingRefs();
    aiChatLoading.value = false;
    askAiChatSetting(
      current,
      AI_SETTING_STEPS.findIndex((s) => s.type === key)
    );
  } else {
    // 메뉴옵션·다국어·이미지·메뉴키: 상세 설정과 같은 흐름으로 고르고, 끝나면 최종 확인으로
    aiChatReturnTo = "final";
    aiChatStep.value = "options";
    aiChatMessages.value.pop(); // 「… 수정」 대신 상세 설정 처리에서 항목 이름을 사용자 말풍선으로 남긴다
    handleAiChatOptionsInput(label);
  }
  scrollAiChatLog();
  focusAiChatInput();
};

// 완료 → 지금 설정된 정보를 말풍선으로 보여 주고 최종 등록 여부를 묻는다
const finishAiChatMenu = () => {
  aiChatReturnTo = "";
  const current = aiChatItems.value.find((i) => !i.finished);
  if (!current) {
    pushAiChatLocal("assistant", "메뉴명을 입력해 주세요.");
    aiChatStep.value = "name";
    return;
  }
  // 화면에 저장하지 않은 다른 변경이 있으면 함께 저장되므로 미리 알린다
  const otherChanges =
    getMenuCodeRowIndicesToSave(updateRow.value, updateDeleteInsertrowIndex.value, confirmData.value).length +
    (updateDeleteInsertrowIndex.value.deleted?.length ?? 0);
  aiChatMessages.value.push({
    role: "assistant",
    content: "아래 정보로 메뉴를 등록합니다. 최종 등록을 누르면 바로 저장됩니다. 고칠 항목은 「수정」을 눌러 주세요.",
    summary: buildAiChatSummary(current),
    summarySeq: ++aiChatSummarySeq.value,
    summaryWarn: otherChanges > 0 ? "화면에 저장하지 않은 다른 변경이 있어 함께 저장됩니다." : "",
    local: true,
  });
  aiChatStep.value = "final";
};

// 최종 확인 말풍선에 보여 줄 설정 정보
const buildAiChatSummary = (item) => [
  { label: "메뉴명", value: item.strName },
  { label: "판매가", value: `${formatAiPrice(item.lngPrice)}원` },
  { label: "대분류", value: item.mainName || "-" },
  { label: "소분류", value: item.subName || "-" },
  { label: "메뉴코드", value: item.lngCode || "-" },
  { label: "과세구분", value: item.taxText },
  { label: "사용여부", value: "사용" },
  { label: "유효기간", value: "9999-12-31 까지" },
  {
    label: "주방출력",
    value:
      String(item.lngKPG) === "99"
        ? "주방 미출력"
        : item.kpgRefName
          ? `출력 (${item.kpgRefName} 메뉴와 동일)`
          : "출력 (기본값)",
  },
  {
    label: "할인적용",
    value: item.discountLater
      ? "나중에 설정"
      : item.discountRefName
        ? `${item.discountRefName} 메뉴와 동일`
        : "기본값",
  },
  { label: "메뉴옵션", value: item.chainName || "-" },
  {
    label: "메뉴키",
    value:
      item.menuKeyTargets && item.menuKeyTargets.length > 0
        ? item.menuKeyTargets.map((t) => `${t.storeName}: ${t.screenName}`).join(" / ")
        : "-",
  },
  {
    label: "다국어",
    value: item.multiLang
      ? `영어 ${item.multiLang.en} / 일본어 ${item.multiLang.ja} / 중국어 ${item.multiLang.zh}`
      : item.strNameE
        ? `영문 ${item.strNameE}`
        : "-",
  },
  { label: "이미지", value: item.imageFile ? item.imageName : "-" },
];

// AI 신규·수정 로그(sysAiChangeLog): 저장이 끝난 뒤 기록. 로그 기록이 실패해도 저장 결과에는 영향이 없다
const writeAiMenuLog = async (action, menuCode, beforeJson, remark) => {
  try {
    const res = await writeMenuChangeLog(
      groupCd.value,
      nowStoreCd.value,
      action,
      String(menuCode),
      beforeJson || "",
      remark
    );
    if (res.data.RESULT_CD !== "00") {
      console.warn("[AI 메뉴 관리] 변경 로그 기록 실패", res.data.RESULT_NM);
    }
  } catch (error) {
    console.warn("[AI 메뉴 관리] 변경 로그 기록 실패", error);
  }
};
// 수정 저장 직전 메뉴 현재 값(slsMenu 행 전체 JSON). 못 받으면 빈 문자열 (로그에 수정 전 값만 빠짐)
const fetchAiMenuSnapshot = async (menuCode) => {
  try {
    const res = await getMenuSnapshot(groupCd.value, nowStoreCd.value, String(menuCode));
    return res.data.RESULT_CD === "00" ? res.data.MENU_JSON || "" : "";
  } catch (error) {
    return "";
  }
};

// 최종 등록: 메뉴코드 목록에 적용한 뒤 기존 저장 로직(확인창 없이)으로 바로 저장. 성공하면 새 대화로 시작
const finalRegisterAiChat = async () => {
  const current = aiChatItems.value.find((i) => !i.finished);
  if (aiChatStep.value !== "final" || !current || aiChatLoading.value) return;
  if (aiStoreGuardFails()) return;
  pushAiChatLocal("user", "최종 등록");
  aiChatLoading.value = true;
  let saved = false;
  try {
    if (!current.applied) {
      await applyAiRow(current);
    }
    if (current.applied) {
      saved = (await saveButton({ skipConfirm: true })) === true;
    }
  } finally {
    aiChatLoading.value = false;
  }
  if (saved) {
    current.finished = true;
    aiChatLoading.value = true;
    // 신규 등록 로그: 등록 값은 서버가 slsMenu 에서 다시 읽는다 (다국어·메뉴키는 다른 테이블이라 비고에만 남김)
    await writeAiMenuLog(
      "INSERT",
      current.lngCode,
      "",
      [
        "AI 메뉴 관리 신규",
        current.multiLang ? "다국어 등록" : "",
        current.menuKeyTargets && current.menuKeyTargets.length > 0
          ? `메뉴키 추가(${current.menuKeyTargets.map((t) => t.storeName).join(",")})`
          : "",
      ]
        .filter((t) => t)
        .join(" / ")
    );
    // 메뉴를 저장한 뒤 메뉴키를 추가한다 (메뉴코드가 있어야 하므로 저장 뒤)
    const keyResult = await appendAiChatMenuKeys(current);
    aiChatLoading.value = false;
    // 새 메뉴는 새 대화로 시작한다
    resetAiChat();
    pushAiChatLocal("assistant", `'${current.strName}' 메뉴를 등록했습니다.`, true);
    if (keyResult) {
      pushAiChatLocal("assistant", `메뉴키 추가 결과\n${keyResult}`, true);
    }
    // 이 상태에서 닫기를 누르면 대화창을 모두 초기화한다
    aiChatSavedAndIdle.value = true;
  } else {
    pushAiChatLocal(
      "assistant",
      "메뉴를 등록하지 못했습니다. 화면에 나온 안내를 확인한 뒤 다시 최종 등록을 눌러 주세요.",
      true
    );
  }
  scrollAiChatLog();
  focusAiChatInput();
};

const reopenAiChatOptions = () => {
  if (aiChatStep.value !== "final") return;
  pushAiChatLocal("user", "다시 설정");
  goAiChatOptionsStep();
  scrollAiChatLog();
  focusAiChatInput();
};

// 최종 확인 단계 입력 처리 (항상 화면에서 끝냄)
const handleAiChatFinalInput = (text) => {
  if (AI_CHAT_CONFIRM_WORDS.includes(text) || /등록|저장/.test(text)) {
    finalRegisterAiChat();
  } else if (/다시|수정|설정/.test(text)) {
    reopenAiChatOptions();
  } else {
    pushAiChatLocal("user", text);
    pushAiChatLocal("assistant", "등록하려면 '최종 등록', 설정을 바꾸려면 '다시 설정'을 눌러 주세요.");
  }
  return true;
};

// 상세 설정 항목 입력 처리 (항상 화면에서 끝냄)
const handleAiChatOptionsInput = (text) => {
  pushAiChatLocal("user", text);
  if (text.includes("완료") || AI_CHAT_SKIP_WORDS.includes(text)) {
    finishAiChatMenu();
  } else if (text.includes("메뉴키")) {
    startAiChatMenuKey();
  } else if (text.includes("옵션")) {
    if ((optionGroup.value || []).length === 0) {
      pushAiChatLocal("assistant", "이 매장에는 등록된 메뉴옵션(옵션그룹)이 없습니다.", true);
      goAiChatOptionsStep();
    } else {
      pushAiChatLocal("assistant", "메뉴옵션(옵션그룹)을 선택해 주세요.");
      aiChatStep.value = "optionGroup";
    }
  } else if (text.includes("다국어") || text.includes("영문") || text.includes("번역")) {
    startAiChatMultiLang();
  } else if (text.includes("이미지")) {
    goAiChatImageStep();
  } else {
    pushAiChatLocal("assistant", AI_CHAT_OPTIONS_TEXT);
  }
  return true;
};

/**
 * 메뉴키 설정 (MST05_011INS 참고): 매장 체크박스 → 매장별 배치 화면 라디오 → 최종 등록 때 메뉴 저장 뒤 추가.
 * 포스는 보여 주지 않고, 매장의 포스 전체(MST05_011INS 포스 목록과 같은 getPosList)에 서버가 적용한다.
 * 추가는 화면의 마지막 위치에 한 개씩만 넣고 기존 키는 건드리지 않는다 (usp_VUE_MST01_003INS_AI_APPEND_MENUKEY).
 * 화면 목록은 매장의 첫 포스 기준으로 보여 준다 (포스마다 화면이 다르면 그 포스는 서버에서 건너뛰고 결과로 알림)
 */
const aiChatKeyStores = ref([]); // [{ code, name }]
const aiChatKeyChecked = ref([]); // 체크한 매장코드
const aiChatKeyScreens = ref([]); // [{ code, name, screens: [{ no, name }], selected, message }]

// 매장 목록: PickStore 와 같은 세션 매장 목록 (매장 계정은 자기 매장만).
// 메뉴는 조회한 매장코드(nowStoreCd)로 저장되고, POS 는 vewMenu(매장코드 0 = 그룹 공통 메뉴, 아니면 그 매장 메뉴만)로 메뉴를 찾는다.
// 그래서 특정 매장 메뉴면 그 매장에만, 공통 메뉴(0)일 때만 여러 매장을 고를 수 있게 한다
const getAiChatKeyStoreList = () => {
  const all = (store.state.storeCd || [])
    .map(normalizeStoreOption)
    .filter((s) => s && String(s.lngStoreCode) !== "0")
    .map((s) => ({ code: String(s.lngStoreCode), name: s.strName || String(s.lngStoreCode) }));
  const menuStoreCd = String(nowStoreCd.value ?? "");
  if (menuStoreCd !== "" && menuStoreCd !== "0") {
    const own = all.find((s) => s.code === menuStoreCd);
    return [own || { code: menuStoreCd, name: menuStoreCd }];
  }
  return all;
};

const startAiChatMenuKey = () => {
  const stores = getAiChatKeyStoreList();
  aiChatKeyStores.value = stores;
  if (stores.length === 0) {
    pushAiChatLocal("assistant", "메뉴키를 설정할 매장이 없습니다.", true);
    goAiChatOptionsStep();
    return;
  }
  if (stores.length === 1) {
    // 매장이 하나뿐이면 묻지 않고 그 매장으로
    aiChatKeyChecked.value = [stores[0].code];
    const menuStoreCd = String(nowStoreCd.value ?? "");
    pushAiChatLocal(
      "assistant",
      menuStoreCd !== "" && menuStoreCd !== "0"
        ? `이 메뉴는 '${stores[0].name}' 매장 메뉴라서 이 매장에만 메뉴키를 추가합니다.`
        : `매장이 하나뿐이라 '${stores[0].name}'에 설정합니다.`,
      true
    );
    loadAiChatKeyScreens();
    return;
  }
  aiChatKeyChecked.value = [];
  aiChatMessages.value.push({
    role: "assistant",
    content: "메뉴키를 추가할 매장을 선택해 주세요.",
    menuKeyStores: true,
    local: true,
  });
  aiChatStep.value = "menuKeyStore";
};

const confirmAiChatKeyStores = () => {
  if (aiChatStep.value !== "menuKeyStore") return;
  if (aiChatKeyChecked.value.length === 0) {
    pushAiChatLocal("assistant", "매장을 하나 이상 선택해 주세요.");
    scrollAiChatLog();
    return;
  }
  const names = aiChatKeyStores.value
    .filter((s) => aiChatKeyChecked.value.includes(s.code))
    .map((s) => s.name);
  pushAiChatLocal("user", names.join(", "));
  loadAiChatKeyScreens();
};

// 매장마다 첫 포스 기준 화면 목록을 가져와 라디오로 보여 준다 (화면이 하나면 자동 선택)
const loadAiChatKeyScreens = async () => {
  aiChatLoading.value = true;
  const list = [];
  try {
    for (const s of aiChatKeyStores.value.filter((x) => aiChatKeyChecked.value.includes(x.code))) {
      const row = { code: s.code, name: s.name, screens: [], selected: "", message: "" };
      try {
        const posRes = await getPosList(groupCd.value, s.code);
        const pos = (posRes.data.pos || [])[0];
        if (!pos) {
          row.message = "포스가 없어 메뉴키를 추가할 수 없습니다.";
        } else {
          const scrRes = await getScreenList(groupCd.value, s.code, pos.lngAreaCode, pos.lngCode);
          row.screens = (scrRes.data.ScreenList || [])
            .map((x) => ({ no: String(x.intScreenNo), name: x.strScreenName }))
            .sort((a, b) => Number(a.no) - Number(b.no));
          if (row.screens.length === 0) {
            row.message = "등록된 메뉴키 화면이 없습니다. 메뉴키 설정 화면에서 화면을 먼저 만들어 주세요.";
          } else if (row.screens.length === 1) {
            row.selected = row.screens[0].no;
          }
        }
      } catch (error) {
        row.message = "화면 목록을 가져오지 못했습니다.";
      }
      list.push(row);
    }
  } finally {
    aiChatLoading.value = false;
  }
  aiChatKeyScreens.value = list;
  const usable = list.filter((r) => r.screens.length > 0);
  if (usable.length === 0) {
    pushAiChatLocal("assistant", "선택한 매장에 메뉴키를 추가할 화면이 없습니다.", true);
    goAiChatOptionsStep();
  } else {
    aiChatMessages.value.push({
      role: "assistant",
      content: "매장별로 메뉴키를 배치할 화면을 선택해 주세요. 선택한 화면의 마지막 위치에 추가됩니다.",
      menuKeyScreens: true,
      local: true,
    });
    aiChatStep.value = "menuKeyScreen";
  }
  scrollAiChatLog();
  focusAiChatInput();
};

const confirmAiChatKeyScreens = () => {
  const current = aiChatItems.value.find((i) => !i.finished);
  if (aiChatStep.value !== "menuKeyScreen" || !current) return;
  const usable = aiChatKeyScreens.value.filter((r) => r.screens.length > 0);
  const missing = usable.filter((r) => !r.selected);
  if (missing.length > 0) {
    pushAiChatLocal("assistant", `${missing.map((r) => r.name).join(", ")}의 화면을 선택해 주세요.`);
    scrollAiChatLog();
    return;
  }
  current.menuKeyTargets = usable.map((r) => {
    const screen = r.screens.find((x) => x.no === r.selected);
    return { storeCd: r.code, storeName: r.name, screenNo: r.selected, screenName: screen ? screen.name : "" };
  });
  pushAiChatLocal(
    "user",
    current.menuKeyTargets.map((t) => `${t.storeName}: ${t.screenName}`).join(" / ")
  );
  pushAiChatLocal("assistant", "메뉴키는 최종 등록 때 메뉴를 저장한 뒤 함께 추가됩니다.", true);
  goAiChatOptionsStep();
  scrollAiChatLog();
  focusAiChatInput();
};

const cancelAiChatMenuKey = () => {
  if (!["menuKeyStore", "menuKeyScreen"].includes(aiChatStep.value)) return;
  pushAiChatLocal("user", "취소");
  pushAiChatLocal("assistant", "메뉴키 설정을 취소했습니다.", true);
  goAiChatOptionsStep();
  scrollAiChatLog();
  focusAiChatInput();
};

// 메뉴키 단계 입력 (항상 화면에서 끝냄)
const handleAiChatMenuKeyInput = (text) => {
  if (/취소|그만|안\s*할/.test(text)) {
    cancelAiChatMenuKey();
  } else if (/다음|확인|선택\s*완료|완료/.test(text)) {
    if (aiChatStep.value === "menuKeyStore") confirmAiChatKeyStores();
    else confirmAiChatKeyScreens();
  } else {
    pushAiChatLocal("user", text);
    pushAiChatLocal(
      "assistant",
      aiChatStep.value === "menuKeyStore"
        ? "말풍선에서 매장을 체크한 뒤 '다음'을 눌러 주세요."
        : "말풍선에서 매장별 화면을 선택한 뒤 '확인'을 눌러 주세요."
    );
  }
  return true;
};

// 최종 등록(메뉴 저장) 뒤 메뉴키 추가 → 결과 문장 (매장별 포스 결과 요약)
const AI_KEY_RESULT_TEXT = {
  OK: "추가",
  EXISTS: "이미 있음",
  NOSCREEN: "화면 없음",
  FULL: "화면이 가득 참",
  NOPOS: "포스 없음",
  ERROR: "오류",
};
const appendAiChatMenuKeys = async (item) => {
  if (!item.menuKeyTargets || item.menuKeyTargets.length === 0) return "";
  try {
    const res = await appendMenuKeys(
      groupCd.value,
      item.lngCode,
      item.strName,
      item.menuKeyTargets.map((t) => ({ STORE_CD: t.storeCd, SCREEN_NO: t.screenNo }))
    );
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    const rows = res.data.List || [];
    return item.menuKeyTargets
      .map((t) => {
        const mine = rows.filter((r) => String(r.STORE_CD) === t.storeCd);
        const counts = {};
        mine.forEach((r) => {
          const k = AI_KEY_RESULT_TEXT[r.RESULT] || r.RESULT;
          counts[k] = (counts[k] || 0) + 1;
        });
        const detail = Object.entries(counts)
          .map(([k, v]) => `${k} ${v}대`)
          .join(", ");
        return `${t.storeName}(${t.screenName}): ${detail || "결과 없음"}`;
      })
      .join("\n");
  } catch (error) {
    return "메뉴키를 추가하지 못했습니다. 메뉴키 설정 화면에서 확인해 주세요.";
  }
};

const chooseAiChatOption = (chip) => {
  if (aiChatStep.value !== "options" || aiChatLoading.value) return;
  handleAiChatOptionsInput(chip);
  scrollAiChatLog();
  focusAiChatInput();
};

// 옵션그룹 선택 (라디오 또는 코드·이름 입력). '없음'이면 옵션그룹을 비운다
const setAiChatOptionGroup = (code, name) => {
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (!current) return;
  current.lngChain = code;
  current.chainName = name;
  pushAiChatLocal(
    "assistant",
    code ? `옵션그룹을 ${name}(으)로 설정했습니다.` : "옵션그룹을 설정하지 않습니다.",
    true
  );
  goAiChatOptionsStep();
};

const handleAiChatOptionGroupInput = (text) => {
  pushAiChatLocal("user", text);
  if (AI_CHAT_SKIP_WORDS.includes(text)) {
    setAiChatOptionGroup("", "");
    return true;
  }
  const key = text.replace(/^옵션그룹\s*:\s*/, "").replace(/^\[(\d+)\].*$/, "$1").trim();
  const found = (optionGroup.value || []).find(
    (i) => String(i.lngCode) === key || String(i.strName).trim() === key
  );
  if (found) {
    setAiChatOptionGroup(String(found.lngCode), found.strName);
  } else {
    pushAiChatLocal("assistant", "목록에 없는 옵션그룹입니다. 아래에서 선택해 주세요.");
  }
  return true;
};

/**
 * 다국어 설정 (MST44_066INS 다국어관리와 같은 저장 방식: mstMultilingual, 구분 1=메뉴명)
 * 한국어는 입력한 메뉴명, 영어·일본어·중국어는 AI가 제안 → 확인(수정 가능) 후 등록.
 * 메뉴코드가 있어야 하므로 실제 저장은 메뉴 저장이 끝난 뒤 saveMultiLang 으로 한다 (saveAiMultiLangForSavedMenus)
 */
const AI_LANG_ROWS = [
  { key: "ko", id: "0", label: "한국어" },
  { key: "en", id: "1", label: "영어" },
  { key: "ja", id: "4", label: "일본어" },
  { key: "zh", id: "2", label: "중국어" },
];
const aiChatPendingLang = ref(null);
let aiChatLangSeq = 0;

const pushAiChatLangProposal = () => {
  aiChatLangSeq++;
  aiChatPendingLang.value = { ...aiChatPendingLang.value, seq: aiChatLangSeq };
  aiChatMessages.value.push({
    role: "assistant",
    content: "다국어 메뉴명을 제안합니다. 이대로 등록하시겠습니까?\n수정하려면 '영어: Americano' 처럼 입력해 주세요.",
    multiLang: { ...aiChatPendingLang.value },
    langSeq: aiChatLangSeq,
    local: true,
  });
  aiChatStep.value = "multiLang";
};

const startAiChatMultiLang = async () => {
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (!current) return;
  aiChatLoading.value = true;
  try {
    const res = await translateMenuName(groupCd.value, nowStoreCd.value, current.strName);
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    const row = (res.data.List || [])[0] || {};
    aiChatPendingLang.value = { ko: current.strName, en: row.EN || "", ja: row.JA || "", zh: row.ZH || "" };
    pushAiChatLangProposal();
  } catch (error) {
    pushAiChatLocal("assistant", "다국어 제안을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.", true);
    goAiChatOptionsStep();
  } finally {
    aiChatLoading.value = false;
    scrollAiChatLog();
    focusAiChatInput();
  }
};

const confirmAiChatMultiLang = (accept) => {
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (aiChatStep.value !== "multiLang" || !current || !aiChatPendingLang.value) return;
  pushAiChatLocal("user", accept ? "등록" : "취소");
  if (accept) {
    const { ko, en, ja, zh } = aiChatPendingLang.value;
    current.multiLang = { ko, en, ja, zh };
    // 메뉴 화면의 메뉴명(영문) 칸도 영어로 채운다
    current.strNameE = en;
    pushAiChatLocal("assistant", "다국어를 등록했습니다. 메뉴를 저장할 때 함께 저장됩니다.", true);
  } else {
    pushAiChatLocal("assistant", "다국어 설정을 취소했습니다.", true);
  }
  aiChatPendingLang.value = null;
  goAiChatOptionsStep();
  scrollAiChatLog();
  focusAiChatInput();
};

// 다국어 확인 단계 입력: 등록 / 취소 / 다시 제안 / '영어: …' 수정 (항상 화면에서 끝냄, 다시 제안만 AI 호출)
const handleAiChatMultiLangInput = (text) => {
  if (AI_CHAT_CONFIRM_WORDS.includes(text) || text === "등록") {
    confirmAiChatMultiLang(true);
    return true;
  }
  if (["취소", "아니오", "아니요", "아니", "no", "NO"].includes(text)) {
    confirmAiChatMultiLang(false);
    return true;
  }
  pushAiChatLocal("user", text);
  if (text.includes("다시")) {
    startAiChatMultiLang();
    return true;
  }
  const m = text.match(/^\s*(영어|영문|일본어|일어|중국어|중문)\s*[:：]\s*(.+)$/);
  if (m) {
    const key = { 영어: "en", 영문: "en", 일본어: "ja", 일어: "ja", 중국어: "zh", 중문: "zh" }[m[1]];
    aiChatPendingLang.value = { ...aiChatPendingLang.value, [key]: m[2].trim() };
    pushAiChatLocal("assistant", `${m[1]}를 '${m[2].trim()}'로 수정했습니다.`, true);
    pushAiChatLangProposal();
    return true;
  }
  pushAiChatLocal(
    "assistant",
    "등록하려면 '등록', 수정하려면 '영어: Americano' 처럼 입력해 주세요. '다시'라고 하면 새로 제안합니다."
  );
  return true;
};

// 메뉴 저장이 끝난 뒤, AI로 등록한 메뉴의 다국어를 MST44_066INS 와 같은 saveMultiLang 으로 저장한다
const aiMultiLangByCode = ref({});
const saveAiMultiLangForSavedMenus = async (savedRows) => {
  const codes = (savedRows || [])
    .map((r) => String(r.lngCode ?? ""))
    .filter((c) => c && aiMultiLangByCode.value[c]);
  if (codes.length === 0) return;
  const rows = [];
  codes.forEach((code) => {
    const lang = aiMultiLangByCode.value[code];
    AI_LANG_ROWS.forEach((l) => {
      if (lang[l.key]) rows.push({ code, langId: l.id, name: lang[l.key] });
    });
  });
  const join = (fn) => rows.map(fn).join("​");
  try {
    const res = await saveMultiLang(
      join(() => groupCd.value),
      join(() => nowStoreCd.value),
      join(() => "1"),
      join((r) => r.code),
      join((r) => r.langId),
      join((r) => r.name),
      "",
      "",
      "",
      "",
      ""
    );
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    codes.forEach((c) => delete aiMultiLangByCode.value[c]);
  } catch (error) {
    Swal.fire({
      title: "다국어 저장 실패",
      text: "메뉴는 저장되었지만 다국어는 저장하지 못했습니다. 다국어관리 화면에서 확인해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }
};

// 대분류·소분류 라디오 선택지: 소분류는 작성 중인 메뉴(맨 뒤)의 대분류에 속한 것만
const aiChatGroupChoices = computed(() => {
  if (aiChatStep.value === "main") {
    return (MenuGroup.value || []).map((i) => ({ code: String(i.GroupCd), name: i.majorGroupNm }));
  }
  if (aiChatStep.value === "sub") {
    const current = aiChatItems.value[aiChatItems.value.length - 1];
    const main = current ? current.lngMainGroup : "";
    return (SubMenuGroup.value || [])
      .filter((i) => main !== "" && String(i.sublngMajor) === main)
      .map((i) => ({ code: String(i.GroupCd), name: i.subGroupNm }));
  }
  if (aiChatStep.value === "editSub") {
    const main = aiEditPending.value?.changes?.lngMainGroup || "";
    return (SubMenuGroup.value || [])
      .filter((i) => main !== "" && String(i.sublngMajor) === main)
      .map((i) => ({ code: String(i.GroupCd), name: i.subGroupNm }));
  }
  if (aiChatStep.value === "optionGroup") {
    return [
      ...(optionGroup.value || []).map((i) => ({ code: String(i.lngCode), name: i.strName })),
      { code: "", name: "선택 안 함" },
    ];
  }
  if (aiChatStep.value === "settingRef") {
    return (aiChatSettingRefs.value[aiChatSettingType.value] || []).map((r) => ({
      code: r.lngCode,
      name: r.strName,
      label: describeSettingRefMenu(r),
    }));
  }
  return [];
});

const chooseAiChatGroup = (g) => {
  if (aiChatLoading.value) return;
  // 메뉴 수정에서 대분류를 바꿀 때의 소분류 선택
  if (aiChatStep.value === "editSub") {
    if (!aiEditPending.value) return;
    pushAiChatLocal("user", `소분류: [${g.code}] ${g.name}`);
    aiEditPending.value.changes.lngSubGroup = g.code;
    const summary = showAiEditConfirm();
    aiAssistHistory.value = [
      ...aiAssistHistory.value,
      { role: "user", content: `소분류 [${g.code}] ${g.name} 선택` },
      { role: "assistant", content: summary },
    ].slice(-(AI_ASSIST_MAX_MESSAGES - 1));
    scrollAiChatLog();
    focusAiChatInput();
    return;
  }
  if (aiChatStep.value === "settingRef") {
    const found = (aiChatSettingRefs.value[aiChatSettingType.value] || []).find(
      (r) => r.lngCode === g.code
    );
    if (found) {
      pushAiChatLocal("user", `${describeSettingRefMenu(found)}와 동일`);
      chooseAiChatSettingRef(found);
      scrollAiChatLog();
      focusAiChatInput();
    }
    return;
  }
  if (aiChatStep.value === "optionGroup") {
    pushAiChatLocal("user", g.code ? `옵션그룹: [${g.code}] ${g.name}` : "옵션그룹: 선택 안 함");
    setAiChatOptionGroup(g.code, g.code ? g.name : "");
    scrollAiChatLog();
    focusAiChatInput();
    return;
  }
  aiChatText.value = `${aiChatStep.value === "main" ? "대분류" : "소분류"}: [${g.code}] ${g.name}`;
  sendAiChat();
};

// 화면에서만 처리한 대화(메뉴코드 단계)는 local 표시를 붙여 서버로 보내는 기록에서 뺀다
// plain: 확인 문장(강조 없음)
const pushAiChatLocal = (role, content, plain = false) => {
  aiChatMessages.value.push({ role, content, local: true, plain });
};

/**
 * AI 도우미 시작·조회·수정·질문 (chatAssist): AI는 작업 종류와 조건만 정하고,
 * 조회는 화면에 조회된 메뉴 목록(rowData)에서, 수정 저장은 기존 그리드 값 변경 + 저장 로직으로 한다
 */
// 시작 안내에 보여 주는 입력 예시 (버튼 아님, 사용자가 문장으로 입력하면 AI가 작업 종류를 판단)
const AI_START_EXAMPLES = [
  { label: "메뉴 등록", text: "'아이스티 3000원 등록해줘'" },
  { label: "메뉴 조회", text: "'아메리카노 메뉴만 보여줘', '5천원 이상 메뉴', '미사용 메뉴'" },
  { label: "메뉴 수정", text: "'아메리카노 가격 5000원으로 바꿔줘', '1001 미사용으로'" },
  { label: "메뉴 매출", text: "'이번 주 아메리카노 매출', '지난달 많이 팔린 메뉴 10개'" },
  { label: "질문", text: "'메뉴코드는 어떻게 정해져?', '주방출력설정이 뭐야?'" },
];
const AI_SEARCH_MAX_ROWS = 20;
// 서버로 보내는 도우미 대화 기록은 이전 8턴 + 이번 질문까지 (user 로 시작·끝)
const AI_ASSIST_MAX_MESSAGES = 17;
// chatAssist 로 보내는 대화 기록 (화면 표시와 별도, user/assistant 번갈아)
const aiAssistHistory = ref([]);
// 바로 앞 조회·매출 결과의 메뉴코드 ('이 메뉴들 중 …'처럼 이어서 물으면 이 안에서만 다시 찾는다, 없으면 null)
const aiLastResultCodes = ref(null);
// fromPrevious 이면 앞 결과 메뉴코드 Set, 아니면(또는 앞 결과가 없으면) null
const aiPreviousScope = (cond) =>
  cond.fromPrevious === "Y" && aiLastResultCodes.value ? new Set(aiLastResultCodes.value) : null;
// 도우미가 등록 대화로 넘기는 다음 사용자 말을 화면에서 숨길지 (sendAiChat 에서 한 번 쓰고 끔)
let aiChatHideNextUser = false;
// 수정 준비 중인 메뉴: { seq, row, changes, candidates }
const aiEditPending = ref(null);
let aiEditSeq = 0;
// 메뉴 목록 그리드 행 이동 (realgrid moveFocusbyIndex·setReFocus)
const aiMoveFocusIndex = ref("");
const aiSetReFocus = ref(false);

const normAiText = (v) => String(v ?? "").replace(/\s+/g, "").toLowerCase();
const aiMainName = (code) =>
  (MenuGroup.value || []).find((i) => String(i.GroupCd) === String(code))?.majorGroupNm || "";
const aiSubName = (main, sub) =>
  (SubMenuGroup.value || []).find(
    (i) => String(i.sublngMajor) === String(main) && String(i.GroupCd) === String(sub)
  )?.subGroupNm || "";
const isAiInactive = (r) => ["1", "true"].includes(String(r.blnInactive).toLowerCase());
const aiMenuRows = () => (rowData.value || []).filter((r) => String(r.lngCode ?? "") !== "");
const aiNum = (v) => (v === "" || v === null || v === undefined ? -1 : Number(v));
// 메뉴명·영문 메뉴명(strNameE)에 찾는 말 중 하나가 들어 있거나 메뉴코드가 그 말로 시작하면 해당
const aiMenuNameHit = (r, terms) =>
  terms.some(
    (t) =>
      normAiText(r.strName).includes(t) ||
      normAiText(r.strNameE).includes(t) ||
      String(r.lngCode).startsWith(t)
  );

// 등록 흐름 시작: 기존 메뉴명 → 판매가 → … 단계로 넘어가고, 등록 대화 기록은 여기서부터 보낸다
const startAiRegister = () => {
  aiEditPending.value = null;
  aiChatStep.value = "name";
  aiChatHistoryStart.value = aiChatMessages.value.length;
  pushAiChatLocal("assistant", "메뉴명을 입력해 주세요.");
};

// 메뉴 목록 그리드에서 메뉴코드 행으로 이동하고 상세정보를 채운다 (사용자가 행을 누른 것과 같음). 못 찾으면 -1
const focusAiMenuRow = async (code) => {
  const idx = (rowData.value || []).findIndex((r) => String(r.lngCode) === String(code));
  if (idx < 0) return -1;
  const moveTo = async () => {
    aiMoveFocusIndex.value = "";
    await nextTick();
    aiMoveFocusIndex.value = String(idx);
    await nextTick();
    aiSetReFocus.value = !aiSetReFocus.value;
    await nextTick();
    await nextTick();
  };
  await moveTo();
  // 메뉴분류·메뉴명/코드 검색으로 목록에서 숨겨진 메뉴는 선택되지 않으므로, 검색 조건을 풀고 다시 선택한다
  if (String(gridvalue3.value) !== String(code)) {
    searchWord.value = "";
    forsearchMain.value = "-1";
    forsearchSub.value = "-1";
    searchValue.value = [-1, -1];
    await nextTick();
    await nextTick();
    await moveTo();
    if (String(gridvalue3.value) === String(code)) {
      pushAiChatLocal("assistant", "메뉴 목록의 검색 조건(메뉴분류·메뉴명/코드)을 풀고 이 메뉴를 선택했습니다.", true);
    }
  }
  return idx;
};

const focusAiMenuRowFromChat = async (code) => {
  if (aiChatLoading.value) return;
  if ((await focusAiMenuRow(code)) < 0) {
    pushAiChatLocal("assistant", "메뉴 목록에서 이 메뉴를 찾지 못했습니다. 다시 조회해 주세요.", true);
    scrollAiChatLog();
  }
};

// 조회: 화면에 조회된 메뉴 목록에서 조건으로 걸러 말풍선 표로 보여 준다. 반환값은 대화 기록용 요약
const runAiSearch = async (cond) => {
  const keyword = normAiText(cond.keyword);
  // 검색어와 AI가 준 다른 표기(영문↔한글)를 메뉴명·영문 메뉴명·메뉴코드에서 찾는다
  const aliases = (cond.aliases || []).filter((a) => normAiText(a) && normAiText(a) !== keyword);
  const terms = keyword ? [keyword, ...aliases.map(normAiText)] : [];
  const min = aiNum(cond.minPrice);
  const max = aiNum(cond.maxPrice);
  const main = String(cond.mainGroup ?? "");
  const sub = String(cond.subGroup ?? "");
  // 등록일·수정일 조건: 화면 메뉴 목록에는 일시가 없어 서버(slsMenu)에서 그 기간의 메뉴코드와 일시를 받아 거른다
  const dateType = cond.dateType === "insert" || cond.dateType === "update" ? cond.dateType : "";
  const dateLabel = dateType === "insert" ? "등록일시" : dateType === "update" ? "수정일시" : "";
  let dateByCode = null;
  let dateDesc = "";
  if (dateType) {
    const from = parseAiDate(cond.dateFrom);
    const to = parseAiDate(cond.dateTo) || from;
    if (!from || from > to) {
      pushAiChatLocal("assistant", "등록일·수정일 조건의 날짜를 이해하지 못했습니다. 예: '오늘 등록한 메뉴', '10월 27일 수정한 메뉴'", true);
      return "[조회] 날짜 조건 오류";
    }
    const fromText = formatAiDate(from);
    const toText = formatAiDate(to);
    const res = await getMenuDates(groupCd.value, nowStoreCd.value, dateType.toUpperCase(), fromText, toText);
    if (res.data.RESULT_CD !== "00") {
      pushAiChatLocal("assistant", `등록일·수정일을 조회하지 못했습니다. (${res.data.RESULT_NM})`, true);
      return "[조회] 등록일·수정일 조회 실패";
    }
    dateByCode = new Map(
      (res.data.List || []).map((d) => [
        String(d.lngCode),
        dateType === "insert" ? d.dtmInsertTime : d.dtmUpdateTime,
      ])
    );
    dateDesc = `${fromText === toText ? fromText : `${fromText} ~ ${toText}`} ${dateType === "insert" ? "등록" : "수정"}`;
  }
  const prevScope = aiPreviousScope(cond);
  const rows = aiMenuRows().filter((r) => {
    if (prevScope && !prevScope.has(String(r.lngCode))) return false;
    if (dateByCode && !dateByCode.has(String(r.lngCode))) return false;
    if (terms.length > 0 && !aiMenuNameHit(r, terms)) return false;
    if (main && String(r.lngMainGroup) !== main) return false;
    if (sub && String(r.lngSubGroup) !== sub) return false;
    const price = Number(r.lngPrice) || 0;
    if (min >= 0 && price < min) return false;
    if (max >= 0 && price > max) return false;
    if (cond.useYn === "use" && isAiInactive(r)) return false;
    if (cond.useYn === "unused" && !isAiInactive(r)) return false;
    if (cond.tax === "tax" && String(r.lngTax) === "2") return false;
    if (cond.tax === "free" && String(r.lngTax) !== "2") return false;
    return true;
  });
  // 정렬: 요청한 순서(비싼 순·싼 순·이름순·코드순), 없으면 날짜 조건일 때 최근 등록·수정 순
  const sort = AI_SEARCH_SORTS[cond.sort] ? cond.sort : "";
  if (sort) {
    rows.sort(AI_SEARCH_SORTS[sort].compare);
  } else if (dateByCode) {
    rows.sort((a, b) =>
      String(dateByCode.get(String(b.lngCode))).localeCompare(String(dateByCode.get(String(a.lngCode))))
    );
  }
  // 개수 제한: '5개만', '가장 비싼 메뉴' 처럼 말하면 그 개수까지만 보여 준다
  const limit = Math.max(0, Math.floor(Number(cond.limit) || 0));
  const total = rows.length;
  if (limit > 0) rows.splice(limit);
  const conds = [
    prevScope ? `앞 결과 ${prevScope.size}개 중` : "",
    dateDesc,
    keyword
      ? `'${cond.keyword}'${aliases.length > 0 ? `(${aliases.join(", ")} 포함)` : ""}`
      : "",
    main ? `대분류 ${aiMainName(main) || main}` : "",
    sub ? `소분류 ${aiSubName(main || rows[0]?.lngMainGroup, sub) || sub}` : "",
    min >= 0 ? `${formatAiPrice(min)}원 이상` : "",
    max >= 0 ? `${formatAiPrice(max)}원 이하` : "",
    cond.useYn === "use" ? "사용" : cond.useYn === "unused" ? "미사용" : "",
    cond.tax === "tax" ? "과세" : cond.tax === "free" ? "면세" : "",
  ].filter((t) => t);
  const desc = conds.length > 0 ? conds.join(", ") : "전체 메뉴";
  const sortText = sort ? ` (${AI_SEARCH_SORTS[sort].label})` : "";
  const content =
    rows.length === 0
      ? `${desc} 조건에 맞는 메뉴가 없습니다.`
      : `${desc} 조회 결과 ${total}건입니다${sortText}.` +
        (limit > 0 && limit < total ? ` 그중 ${rows.length}건을 보여 드립니다.` : "") +
        (rows.length > AI_SEARCH_MAX_ROWS
          ? ` 앞 ${AI_SEARCH_MAX_ROWS}건만 보여 드립니다. 조건을 더 좁혀 주세요.`
          : "") +
        " 행을 누르면 메뉴 목록에서 그 메뉴로 이동합니다.";
  aiChatMessages.value.push({
    role: "assistant",
    content,
    searchRows: rows.slice(0, AI_SEARCH_MAX_ROWS).map((r) => ({
      code: String(r.lngCode),
      name: r.strName,
      price: `${formatAiPrice(r.lngPrice)}원`,
      group: [aiMainName(r.lngMainGroup), aiSubName(r.lngMainGroup, r.lngSubGroup)]
        .filter((t) => t)
        .join(" > "),
      use: isAiInactive(r) ? "미사용" : "사용",
      date: dateByCode ? dateByCode.get(String(r.lngCode)) || "" : "",
    })),
    searchDateLabel: dateLabel,
    local: true,
  });
  // 다음 질문에서 '이 메뉴들 중'으로 이어받을 수 있게 이번 결과(표에 다 못 보여 준 것 포함)를 기억한다
  aiLastResultCodes.value = rows.map((r) => String(r.lngCode));
  // 대화 기록용 요약: 이어서 '비싼 순서대로'처럼 말하면 AI가 같은 조건을 다시 쓸 수 있게 조건 JSON 도 남긴다
  return `[조회] ${desc}${sortText}: ${total}건${
    rows.length > 0
      ? ` (${rows
          .slice(0, 5)
          .map((r) => `[${r.lngCode}] ${r.strName} ${formatAiPrice(r.lngPrice)}원`)
          .join(", ")}${rows.length > 5 ? " 외" : ""})`
      : ""
  } 조건=${JSON.stringify(cond)}`;
};

// 조회 정렬 (AI search.sort 값)
const AI_SEARCH_SORTS = {
  priceDesc: { label: "판매가 비싼 순", compare: (a, b) => (Number(b.lngPrice) || 0) - (Number(a.lngPrice) || 0) },
  priceAsc: { label: "판매가 싼 순", compare: (a, b) => (Number(a.lngPrice) || 0) - (Number(b.lngPrice) || 0) },
  nameAsc: { label: "이름순", compare: (a, b) => String(a.strName).localeCompare(String(b.strName), "ko") },
  codeAsc: { label: "메뉴코드 작은 순", compare: (a, b) => (Number(a.lngCode) || 0) - (Number(b.lngCode) || 0) },
  codeDesc: { label: "메뉴코드 큰 순", compare: (a, b) => (Number(b.lngCode) || 0) - (Number(a.lngCode) || 0) },
};

/**
 * 메뉴 매출: 기간(기본 최근 7일, 최대 31일)의 메뉴별 판매수량·실매출을 받아 화면 메뉴 목록과 이어서 보여 준다.
 * 안 팔린 메뉴는 조회된 메뉴 목록(사용 중) 가운데 매출이 없는 메뉴
 */
const AI_SALES_DEFAULT_DAYS = 7;
const AI_SALES_MAX_DAYS = 31;
const AI_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const formatAiDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseAiDate = (s) => {
  if (!AI_DATE_RE.test(String(s ?? ""))) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 ? date : null;
};
const formatAiAmount = (v) => formatAiPrice(Math.round(Number(v) || 0));

const runAiSales = async (cond) => {
  let from = parseAiDate(cond.fromDate);
  let to = parseAiDate(cond.toDate);
  // 기간을 말하지 않았으면 오늘까지 최근 7일
  if (!from || !to) {
    to = new Date();
    to.setHours(0, 0, 0, 0);
    from = new Date(to);
    from.setDate(from.getDate() - (AI_SALES_DEFAULT_DAYS - 1));
  }
  const fromText = formatAiDate(from);
  const toText = formatAiDate(to);
  const days = Math.round((to - from) / 86400000) + 1;
  if (days < 1 || days > AI_SALES_MAX_DAYS) {
    const text =
      days < 1
        ? "조회 시작일이 종료일보다 늦습니다. 기간을 다시 말씀해 주세요."
        : `메뉴 매출은 최대 1달(${AI_SALES_MAX_DAYS}일)까지만 조회할 수 있습니다. 요청하신 기간(${fromText} ~ ${toText}, ${days}일)을 줄여 주세요.`;
    pushAiChatLocal("assistant", text, true);
    return `[매출] 조회 불가: ${text}`;
  }

  const res = await getMenuSales(groupCd.value, nowStoreCd.value, fromText, toText);
  if (res.data.RESULT_CD !== "00") {
    const text = `매출을 조회하지 못했습니다. (${res.data.RESULT_NM})`;
    pushAiChatLocal("assistant", text, true);
    return `[매출] 조회 실패`;
  }

  const salesByCode = new Map(
    (res.data.List || []).map((s) => [
      String(s.lngCode),
      { cnt: Number(s.MENU_CNT) || 0, amt: Number(s.ACT_AMT) || 0 },
    ])
  );
  const totalAmt = [...salesByCode.values()].reduce((sum, s) => sum + s.amt, 0);
  const menus = aiMenuRows();
  const menuByCode = new Map(menus.map((r) => [String(r.lngCode), r]));
  const keyword = normAiText(cond.keyword);
  const terms = keyword
    ? [keyword, ...(cond.aliases || []).map(normAiText).filter((a) => a && a !== keyword)]
    : [];
  const mode = cond.mode || "all";
  const limit = Math.max(0, Math.floor(Number(cond.limit) || 0));
  const scope = String(nowStoreCd.value) === "0" ? "그룹 전체 매장" : "조회 매장";
  const period = `${fromText} ~ ${toText}`;
  // '이 메뉴들 중'처럼 앞 결과를 이어받으면 그 메뉴들 안에서만 본다
  const prevScope = aiPreviousScope(cond);
  // 순위 기준: 서버가 sortBy=qty 를 보내면 판매수량, 아니면(값이 없는 이전 API 포함) 실매출
  const byQty = cond.sortBy === "qty";
  const keywordText = (prevScope ? ` 앞 결과 ${prevScope.size}개 중` : "") + (keyword ? ` '${cond.keyword}'` : "");

  let rows;
  let content;
  if (mode === "unsold") {
    // 사용 중인 메뉴 가운데 기간 내 판매가 없는 메뉴
    rows = menus
      .filter((r) => !isAiInactive(r) && !salesByCode.has(String(r.lngCode)))
      .filter((r) => !prevScope || prevScope.has(String(r.lngCode)))
      .filter((r) => terms.length === 0 || aiMenuNameHit(r, terms))
      .map((r) => ({
        code: String(r.lngCode),
        name: r.strName,
        price: `${formatAiPrice(r.lngPrice)}원`,
        group: [aiMainName(r.lngMainGroup), aiSubName(r.lngMainGroup, r.lngSubGroup)]
          .filter((t) => t)
          .join(" > "),
      }));
    content =
      rows.length === 0
        ? `${period} ${scope}에서 안 팔린${keywordText} 메뉴가 없습니다.`
        : `${period} ${scope}에서 한 번도 안 팔린${keywordText} 메뉴는 ${rows.length}개입니다. (사용 중인 메뉴 기준)`;
  } else {
    // 앞 결과를 이어받으면 그 메뉴 전부를 순위에 넣는다 (안 팔린 메뉴는 수량 0으로 맨 아래)
    const base = prevScope
      ? [...prevScope].map((code) => [code, salesByCode.get(code) || { cnt: 0, amt: 0 }])
      : [...salesByCode.entries()];
    rows = base
      .map(([code, s]) => ({ code, cnt: s.cnt, amt: s.amt, menu: menuByCode.get(code) }))
      .filter((r) => terms.length === 0 || (r.menu && aiMenuNameHit(r.menu, terms)))
      // 순위 기준: 판매수량(sortBy=qty) 또는 실매출(기본). 같으면 다른 기준으로 한 번 더
      .sort((a, b) => {
        const [x, y] = byQty ? [a.cnt - b.cnt, a.amt - b.amt] : [a.amt - b.amt, a.cnt - b.cnt];
        const diff = x !== 0 ? x : y;
        return mode === "bottom" ? diff : -diff;
      })
      .map((r, idx) => ({
        rank: idx + 1,
        code: r.code,
        name: r.menu ? r.menu.strName : "(메뉴 목록에 없음)",
        cnt: formatAiPrice(r.cnt),
        amt: `${formatAiAmount(r.amt)}원`,
        rate: totalAmt > 0 ? `${((r.amt / totalAmt) * 100).toFixed(1)}%` : "-",
      }));
    const sumCnt = rows.reduce((sum, r) => sum + Number(String(r.cnt).replace(/,/g, "")), 0);
    const sumAmt = rows.reduce((sum, r) => sum + Number(String(r.amt).replace(/[,원]/g, "")), 0);
    content =
      rows.length === 0
        ? `${period} ${scope}에서${keywordText} 판매 내역이 없습니다.`
        : `${period} ${scope}${keywordText} 메뉴 매출입니다. 메뉴 ${rows.length}개, 수량 ${formatAiPrice(sumCnt)}개, 실매출 ${formatAiAmount(sumAmt)}원` +
          ` (${byQty ? "판매수량" : "실매출"} 기준 ${mode === "bottom" ? "적게" : "많이"} 팔린 순)`;
  }
  const total = rows.length;
  const shown = rows.slice(0, limit > 0 ? limit : AI_SEARCH_MAX_ROWS);
  if (shown.length < total) content += ` 앞 ${shown.length}개만 보여 드립니다.`;
  if (shown.length > 0) content += " 행을 누르면 메뉴 목록에서 그 메뉴로 이동합니다.";
  aiChatMessages.value.push({
    role: "assistant",
    content,
    salesRows: shown,
    salesUnsold: mode === "unsold",
    local: true,
  });
  // 다음 질문에서 '이 메뉴들 중'으로 이어받을 수 있게 이번 결과를 기억한다
  // ('TOP 5'처럼 개수를 정했으면 보여 준 그 메뉴들만, 아니면 표에 다 못 보여 준 것까지 전체)
  aiLastResultCodes.value = (limit > 0 ? shown : rows).map((r) => String(r.code));
  return `[매출] ${period}${keywordText} ${mode}: ${total}건${
    shown.length > 0
      ? ` (${shown
          .slice(0, 5)
          .map((r) => `${r.name}${r.amt ? ` ${r.amt}` : ""}`)
          .join(", ")})`
      : ""
  } 조건=${JSON.stringify({ ...cond, fromDate: fromText, toDate: toText })}`;
};

// 분류 목록: 대분류별 소분류를 표로 (메뉴 수는 조회된 메뉴 목록 기준)
const showAiGroups = (cond) => {
  const onlyMain = String(cond.mainGroup ?? "");
  const mains = (MenuGroup.value || []).filter((m) => !onlyMain || String(m.GroupCd) === onlyMain);
  const menus = aiMenuRows();
  const rows = [];
  let subCount = 0;
  mains.forEach((m) => {
    const mainCode = String(m.GroupCd);
    const subs = (SubMenuGroup.value || []).filter((s) => String(s.sublngMajor) === mainCode);
    subCount += subs.length;
    const mainText = `[${mainCode}] ${m.majorGroupNm}`;
    if (subs.length === 0) {
      rows.push({ key: mainCode, main: mainText, span: 1, sub: "소분류 없음", cnt: "-" });
      return;
    }
    subs.forEach((s, idx) => {
      const subCode = String(s.GroupCd);
      rows.push({
        key: `${mainCode}-${subCode}`,
        main: mainText,
        span: idx === 0 ? subs.length : 0,
        sub: `[${subCode}] ${s.subGroupNm}`,
        cnt: menus.filter(
          (r) => String(r.lngMainGroup) === mainCode && String(r.lngSubGroup) === subCode
        ).length,
      });
    });
  });
  const content =
    mains.length === 0
      ? "등록된 대분류가 없습니다. 대그룹 코드 등록 화면에서 먼저 등록해 주세요."
      : `대분류 ${mains.length}개, 소분류 ${subCount}개입니다. 원하는 분류가 없으면 대그룹 코드 등록 화면에서 먼저 등록해 주세요.`;
  aiChatMessages.value.push({ role: "assistant", content, groupRows: rows, local: true });
  return `[분류] 대분류 ${mains.length}개, 소분류 ${subCount}개`;
};

// 메뉴 목록 통계: '전부 과세야?' 같은 질문에 AI가 답할 수 있게 chatAssist 로 함께 보낸다 (메뉴 목록 자체는 보내지 않음)
const buildAiMenuStats = () => {
  const menus = aiMenuRows();
  if (menus.length === 0) return JSON.stringify({ total: 0 });
  const priced = menus.map((r) => ({ r, price: Number(r.lngPrice) || 0 }));
  const minItem = priced.reduce((a, b) => (b.price < a.price ? b : a));
  const maxItem = priced.reduce((a, b) => (b.price > a.price ? b : a));
  const byMain = {};
  menus.forEach((r) => {
    const name = aiMainName(r.lngMainGroup) || String(r.lngMainGroup);
    byMain[name] = (byMain[name] || 0) + 1;
  });
  const unused = menus.filter(isAiInactive).length;
  const taxFree = menus.filter((r) => String(r.lngTax) === "2").length;
  return JSON.stringify({
    total: menus.length,
    use: menus.length - unused,
    unused,
    tax: menus.length - taxFree,
    taxFree,
    zeroPrice: priced.filter((p) => p.price === 0).length,
    minPrice: { name: minItem.r.strName, code: String(minItem.r.lngCode), price: minItem.price },
    maxPrice: { name: maxItem.r.strName, code: String(maxItem.r.lngCode), price: maxItem.price },
    byMain,
  });
};

const AI_INFO_INTENTS = ["search", "sales", "groups", "faq", "other"];
// 조회·매출·분류·질문 응답을 화면에 보여 주고 대화 기록용 요약을 돌려준다 (수정·등록은 따로 처리)
const runAiInfoIntent = async (intent, data) => {
  if (intent === "search") return runAiSearch(data.SEARCH || {});
  if (intent === "sales") return runAiSales(data.SALES || {});
  if (intent === "groups") return showAiGroups(data.SEARCH || {});
  const reply = data.REPLY || "메뉴 등록·조회·수정·매출과 이 화면 사용법만 도와드릴 수 있어요.";
  pushAiChatLocal("assistant", reply, true);
  return reply;
};

// 수정할 수 있는 항목
const AI_EDIT_FIELDS = [
  { key: "strName", label: "메뉴명" },
  { key: "lngPrice", label: "판매가" },
  { key: "lngMainGroup", label: "대분류" },
  { key: "lngSubGroup", label: "소분류" },
  { key: "lngTax", label: "과세구분" },
  { key: "blnInactive", label: "사용여부" },
];
const aiEditFieldText = (key, row) => {
  if (key === "lngPrice") return `${formatAiPrice(row.lngPrice)}원`;
  if (key === "lngMainGroup") return aiMainName(row.lngMainGroup) || String(row.lngMainGroup ?? "-");
  if (key === "lngSubGroup") {
    return aiSubName(row.lngMainGroup, row.lngSubGroup) || String(row.lngSubGroup ?? "-");
  }
  if (key === "lngTax") return String(row.lngTax) === "2" ? "면세" : "과세";
  if (key === "blnInactive") return isAiInactive(row) ? "미사용" : "사용";
  return String(row[key] ?? "");
};

// 서버 EDIT 에서 바꿀 값만 꺼낸다 (빈 문자열·-1 은 바꾸지 않음)
const readAiEditChanges = (e) => {
  const c = {};
  if (String(e.strName ?? "").trim()) c.strName = String(e.strName).trim();
  const price = aiNum(e.lngPrice);
  if (price >= 0) c.lngPrice = String(Math.floor(price));
  if (e.lngMainGroup) c.lngMainGroup = String(e.lngMainGroup);
  if (e.lngSubGroup) c.lngSubGroup = String(e.lngSubGroup);
  if (e.lngTax === "0" || e.lngTax === "2") c.lngTax = e.lngTax;
  if (e.blnInactive === "0" || e.blnInactive === "1") c.blnInactive = e.blnInactive;
  return c;
};

// 대상 메뉴 찾기: 메뉴코드 일치 → 메뉴명(영문 메뉴명 포함) 일치 → 포함 순. 다른 표기(aliases)도 함께 찾는다
const findAiEditTargets = (target, aliases = []) => {
  const raw = String(target ?? "").trim();
  const t = normAiText(raw);
  if (!t) return [];
  const rows = aiMenuRows();
  const byCode = rows.filter((r) => String(r.lngCode) === raw);
  if (byCode.length > 0) return byCode;
  const terms = [t, ...aliases.map(normAiText).filter((a) => a && a !== t)];
  const exact = rows.filter((r) =>
    terms.some((term) => normAiText(r.strName) === term || normAiText(r.strNameE) === term)
  );
  if (exact.length > 0) return exact;
  return rows.filter((r) => aiMenuNameHit(r, terms));
};

// 화면에 저장하지 않은 변경(신규·수정·삭제 행, 이미지)이 있으면 수정 저장 때 함께 저장되므로 수정하지 않는다
const hasAiUnsavedChanges = () =>
  getMenuCodeRowIndicesToSave(updateRow.value, updateDeleteInsertrowIndex.value, confirmData.value).length +
    (updateDeleteInsertrowIndex.value.deleted?.length ?? 0) +
    (updateDeleteInsertrowIndex.value.created?.length ?? 0) +
    uploadImages.value.length >
  0;
const AI_EDIT_BLOCK_TEXT =
  "메뉴 목록에 저장하지 않은 변경이 있어 수정할 수 없습니다. 먼저 저장하거나 다시 조회한 뒤 말씀해 주세요.";

// 수정 요청 처리 (반환값은 대화 기록용 요약)
const startAiEdit = (edit) => {
  const changes = readAiEditChanges(edit);
  const pending = aiEditPending.value;
  // 대상 없이 바꿀 값만 말하면(예: '가격은 6000원으로') 준비 중인 메뉴에 합친다
  if (!String(edit.target ?? "").trim() && pending && pending.row) {
    return prepareAiEdit(pending.row, { ...pending.changes, ...changes });
  }
  if (hasAiUnsavedChanges()) {
    aiEditPending.value = null;
    aiChatStep.value = "intent";
    pushAiChatLocal("assistant", AI_EDIT_BLOCK_TEXT, true);
    return "[수정] 저장하지 않은 변경이 있어 수정 불가";
  }
  const rows = findAiEditTargets(edit.target, edit.targetAliases || []);
  // 준비 중인 메뉴를 다시 가리키면(예: 확인 표를 본 뒤 '판매가는 6000원') 이전에 말한 변경과 합친다
  if (rows.length === 1 && pending && pending.row && String(rows[0].lngCode) === String(pending.row.lngCode)) {
    return prepareAiEdit(pending.row, { ...pending.changes, ...changes });
  }
  if (rows.length === 0) {
    aiEditPending.value = null;
    aiChatStep.value = "intent";
    pushAiChatLocal(
      "assistant",
      String(edit.target ?? "").trim()
        ? `'${edit.target}' 메뉴를 찾지 못했습니다. 메뉴명이나 메뉴코드를 다시 확인해 주세요.`
        : "수정할 메뉴의 메뉴명이나 메뉴코드를 말씀해 주세요.",
      true
    );
    return `[수정] 대상 메뉴 없음: ${edit.target || "-"}`;
  }
  if (rows.length > 1) {
    const candidates = rows.slice(0, AI_SEARCH_MAX_ROWS);
    aiEditPending.value = { seq: ++aiEditSeq, row: null, changes, candidates };
    aiChatMessages.value.push({
      role: "assistant",
      content:
        `'${edit.target}'에 해당하는 메뉴가 ${rows.length}개입니다. 수정할 메뉴를 선택해 주세요.` +
        (rows.length > candidates.length ? ` (앞 ${candidates.length}개만 표시)` : ""),
      editPick: candidates,
      local: true,
    });
    aiChatStep.value = "editPick";
    return `[수정] '${edit.target}' 후보 ${rows.length}개, 선택 대기`;
  }
  return prepareAiEdit(rows[0], changes);
};

const pickAiEditTarget = (row) => {
  const pending = aiEditPending.value;
  if (aiChatStep.value !== "editPick" || !pending || aiChatLoading.value) return;
  pushAiChatLocal("user", `[${row.lngCode}] ${row.strName}`);
  const summary = prepareAiEdit(row, pending.changes);
  // 대화 기록은 user/assistant 쌍으로 붙인다 (다음 질문을 더해도 user 로 시작하도록 짝수 개 유지)
  aiAssistHistory.value = [
    ...aiAssistHistory.value,
    { role: "user", content: `[${row.lngCode}] ${row.strName} 선택` },
    { role: "assistant", content: summary },
  ].slice(-(AI_ASSIST_MAX_MESSAGES - 1));
  scrollAiChatLog();
  focusAiChatInput();
};

// 대상 메뉴가 정해졌을 때: 분류 확인 → (필요하면 소분류 선택) → 변경 전/후 확인
const prepareAiEdit = (row, changes) => {
  const c = { ...changes };
  const notes = [];
  if (c.lngMainGroup && !aiMainName(c.lngMainGroup)) {
    notes.push("말씀하신 대분류를 찾지 못했습니다.");
    delete c.lngMainGroup;
  }
  // 소분류만 말하면 그 소분류가 속한 대분류를 찾는다 (지금 대분류에 있으면 그대로)
  if (c.lngSubGroup && !c.lngMainGroup && !aiSubName(row.lngMainGroup, c.lngSubGroup)) {
    const owners = (SubMenuGroup.value || []).filter((i) => String(i.GroupCd) === c.lngSubGroup);
    if (owners.length === 1) {
      c.lngMainGroup = String(owners[0].sublngMajor);
    }
  }
  const mainAfter = c.lngMainGroup ?? String(row.lngMainGroup);
  if (c.lngSubGroup && !aiSubName(mainAfter, c.lngSubGroup)) {
    notes.push("말씀하신 소분류를 찾지 못했습니다.");
    delete c.lngSubGroup;
  }
  // 지금 값과 같은 항목은 뺀다 (대분류가 바뀌면 소분류는 남긴다)
  const mainChanged = c.lngMainGroup !== undefined && c.lngMainGroup !== String(row.lngMainGroup);
  if (!mainChanged) delete c.lngMainGroup;
  if (c.strName !== undefined && c.strName === String(row.strName)) delete c.strName;
  if (c.lngPrice !== undefined && Number(c.lngPrice) === Number(row.lngPrice)) delete c.lngPrice;
  if (!mainChanged && c.lngSubGroup !== undefined && c.lngSubGroup === String(row.lngSubGroup)) {
    delete c.lngSubGroup;
  }
  if (c.lngTax !== undefined && aiEditFieldText("lngTax", row) === aiEditFieldText("lngTax", c)) {
    delete c.lngTax;
  }
  if (c.blnInactive !== undefined && isAiInactive(row) === (c.blnInactive === "1")) delete c.blnInactive;

  aiEditPending.value = { seq: ++aiEditSeq, row, changes: c };
  const title = `[${row.lngCode}] ${row.strName}`;
  if (notes.length > 0) pushAiChatLocal("assistant", notes.join(" "), true);

  if (Object.keys(c).length === 0) {
    aiChatStep.value = "intent";
    pushAiChatLocal(
      "assistant",
      `${title} 메뉴에서 바꿀 내용을 말씀해 주세요. (메뉴명·판매가·대분류·소분류·과세구분·사용여부)`
    );
    return `[수정 준비] ${title}: 바꿀 내용 대기`;
  }
  // 대분류만 바꾸면 소분류를 새로 골라야 한다
  if (mainChanged && !c.lngSubGroup) {
    const subs = (SubMenuGroup.value || []).filter((i) => String(i.sublngMajor) === c.lngMainGroup);
    if (subs.length === 0) {
      delete c.lngMainGroup;
      aiChatStep.value = "intent";
      pushAiChatLocal(
        "assistant",
        "선택한 대분류에 등록된 소분류가 없어 분류를 바꿀 수 없습니다. 다른 대분류를 말씀해 주세요.",
        true
      );
      return `[수정 준비] ${title}: 대분류에 소분류 없음`;
    }
    if (subs.length === 1) {
      c.lngSubGroup = String(subs[0].GroupCd);
      pushAiChatLocal(
        "assistant",
        `소분류가 하나뿐이라 '[${subs[0].GroupCd}] ${subs[0].subGroupNm}'(으)로 자동 선택합니다.`,
        true
      );
    } else {
      aiChatStep.value = "editSub";
      pushAiChatLocal("assistant", "소분류를 선택해 주세요.");
      return `[수정 준비] ${title}: 대분류 ${aiMainName(c.lngMainGroup)}, 소분류 선택 대기`;
    }
  }
  return showAiEditConfirm();
};

// 변경 전/후 표 + 수정 저장/취소
const showAiEditConfirm = () => {
  const { row, changes } = aiEditPending.value;
  const after = { ...row, ...changes };
  const rows = AI_EDIT_FIELDS.filter(
    (f) => f.key in changes || (f.key === "lngSubGroup" && "lngMainGroup" in changes)
  ).map((f) => ({
    label: f.label,
    before: aiEditFieldText(f.key, row),
    after: aiEditFieldText(f.key, after),
  }));
  aiChatMessages.value.push({
    role: "assistant",
    content: `[${row.lngCode}] ${row.strName} 메뉴를 아래와 같이 수정합니다. 수정 저장을 누르면 바로 저장됩니다.`,
    editRows: rows,
    editSeq: aiEditPending.value.seq,
    local: true,
  });
  aiChatStep.value = "editConfirm";
  return `[수정 확인 대기] [${row.lngCode}] ${row.strName}: ${rows
    .map((r) => `${r.label} ${r.before} → ${r.after}`)
    .join(", ")}`;
};

const cancelAiEdit = () => {
  if (aiChatStep.value !== "editConfirm" || aiChatLoading.value) return;
  pushAiChatLocal("user", "취소");
  aiEditPending.value = null;
  aiChatStep.value = "intent";
  aiAssistHistory.value = [];
  pushAiChatLocal("assistant", "수정을 취소했습니다. 원하시는 작업을 입력해 주세요.", true);
  scrollAiChatLog();
  focusAiChatInput();
};

// 수정 저장: 메뉴 목록에서 그 행을 선택하고(상세정보 표시) 값을 그리드에 넣은 뒤 기존 저장 로직(확인창 없이)으로 저장
const saveAiEdit = async () => {
  const pending = aiEditPending.value;
  if (aiChatStep.value !== "editConfirm" || !pending || !pending.row || aiChatLoading.value) return;
  if (aiStoreGuardFails()) return;
  pushAiChatLocal("user", "수정 저장");
  if (hasAiUnsavedChanges()) {
    pushAiChatLocal("assistant", AI_EDIT_BLOCK_TEXT, true);
    scrollAiChatLog();
    return;
  }
  const { row, changes } = pending;
  const code = String(row.lngCode);
  aiChatLoading.value = true;
  let saved = false;
  let failText = "";
  let beforeJson = "";
  try {
    // 수정 로그의 '수정 전' 값: 저장하기 전에 DB(slsMenu) 현재 행을 받아 둔다
    beforeJson = await fetchAiMenuSnapshot(code);
    const idx = await focusAiMenuRow(code);
    // 상세정보가 그 메뉴로 바뀌었는지 확인한 뒤에만 값을 넣는다
    if (idx < 0 || String(gridvalue3.value) !== code) {
      failText = "메뉴 목록에서 이 메뉴를 선택하지 못했습니다. 메뉴명/코드 검색칸을 비우고 다시 조회한 뒤 수정해 주세요.";
    } else {
      changeRow.value = idx;
      if (changes.strName !== undefined) {
        gridvalue6.value = changes.strName;
        await setAiField("strName", changes.strName);
      }
      if (changes.lngPrice !== undefined) {
        gridvalue10.value = formatAiPrice(changes.lngPrice);
        await setAiField("lngPrice", changes.lngPrice);
      }
      if (changes.lngMainGroup !== undefined) {
        gridvalue1.value = changes.lngMainGroup;
        setSubCd3();
        await setAiField("lngMainGroup", changes.lngMainGroup);
      }
      if (changes.lngSubGroup !== undefined) {
        gridvalue2.value = changes.lngSubGroup;
        await setAiField("lngSubGroup", changes.lngSubGroup);
      }
      if (changes.lngTax !== undefined) {
        gridvalue12.value = changes.lngTax;
        await setAiField("lngTax", changes.lngTax);
      }
      if (changes.blnInactive !== undefined) {
        gridvalue13.value = changes.blnInactive;
        await setAiField("blnInactive", changes.blnInactive);
      }
      saved = (await saveButton({ skipConfirm: true })) === true;
      if (!saved) {
        failText = "수정하지 못했습니다. 화면에 나온 안내를 확인해 주세요. 메뉴 목록에 바뀐 값이 남아 있으면 다시 조회해 주세요.";
      }
    }
  } finally {
    aiChatLoading.value = false;
  }
  if (saved) {
    // 수정 로그: 수정 후 값은 서버가 slsMenu 에서 다시 읽고, 바뀐 항목도 서버가 전후를 비교해 남긴다
    aiChatLoading.value = true;
    await writeAiMenuLog("UPDATE", code, beforeJson, "AI 메뉴 관리 수정");
    aiChatLoading.value = false;
    aiEditPending.value = null;
    aiChatStep.value = "intent";
    aiAssistHistory.value = [];
    pushAiChatLocal("assistant", `'${changes.strName || row.strName}' 메뉴를 수정했습니다.`, true);
    aiChatSavedAndIdle.value = true;
  } else {
    pushAiChatLocal("assistant", failText, true);
  }
  scrollAiChatLog();
  focusAiChatInput();
};

// 화면에서 끝낼 수 있는 입력(수정 메뉴 선택·소분류 선택·수정 저장/취소)은 AI를 부르지 않는다
const handleAiEditLocalInput = (text) => {
  const pending = aiEditPending.value;
  if (!pending) return false;
  if (aiChatStep.value === "editPick") {
    const row = (pending.candidates || []).find(
      (r) => String(r.lngCode) === text || normAiText(r.strName) === normAiText(text)
    );
    if (row) {
      pickAiEditTarget(row);
      return true;
    }
  }
  if (aiChatStep.value === "editSub") {
    const g = aiChatGroupChoices.value.find(
      (c) => c.code === text || normAiText(c.name) === normAiText(text)
    );
    if (g) {
      chooseAiChatGroup(g);
      return true;
    }
  }
  if (aiChatStep.value === "editConfirm") {
    if (AI_CHAT_CONFIRM_WORDS.includes(text) || /^(수정\s*)?저장/.test(text)) {
      saveAiEdit();
      return true;
    }
    if (/^(취소|아니|그만)/.test(text)) {
      cancelAiEdit();
      return true;
    }
  }
  return false;
};

// 등록 중에 조회·질문으로 보는 말과, 답한 뒤 다시 보여 줄 등록 단계 질문
const AI_SIDE_ASK_RE = /(찾아|조회|검색|보여\s*줘|뭐야|뭔가요|무엇|어떻게|어디서|알려|매출|팔린)/;
const AI_REGISTER_REASK = {
  name: "메뉴명을 입력해 주세요.",
  price: "판매가를 입력해 주세요.",
  main: "대분류를 선택해 주세요.",
  sub: "소분류를 선택해 주세요.",
  confirm: "입력하신 내용이 맞는지 확인해 주세요.",
};

// 시작·조회·수정·질문 단계 입력: 작업 종류를 AI(chatAssist)로 판단한다
// keepStep: 등록 중에 들어온 조회·질문이면 그 등록 단계 (답한 뒤 그 단계로 돌아감)
const sendAiAssist = async (text, keepStep = "") => {
  if (!keepStep && handleAiEditLocalInput(text)) return;
  const userMsgIndex = aiChatMessages.value.length;
  pushAiChatLocal("user", text);
  const history = [...aiAssistHistory.value, { role: "user", content: text }].slice(
    -AI_ASSIST_MAX_MESSAGES
  );
  aiChatLoading.value = true;
  scrollAiChatLog();
  let errorText = "AI 요청 중 오류가 발생했습니다.";
  try {
    const res = await chatAssist(
      groupCd.value,
      nowStoreCd.value,
      JSON.stringify(history),
      buildAiGroupList(),
      buildAiMenuStats()
    );
    if (res.data.RESULT_CD !== "00") {
      errorText = res.data.RESULT_NM;
      throw new Error(errorText);
    }
    aiChatTestMode.value = res.data.RESULT_NM === "TEST_MODE";
    const intent = res.data.INTENT;
    if (keepStep) {
      let sideSummary;
      if (AI_INFO_INTENTS.includes(intent)) {
        sideSummary = await runAiInfoIntent(intent, res.data);
      } else {
        sideSummary = "메뉴 등록 중에는 다른 메뉴를 수정하거나 새로 등록할 수 없습니다. 지금 메뉴를 마치거나 새 대화에서 해 주세요.";
        pushAiChatLocal("assistant", sideSummary, true);
      }
      aiAssistHistory.value = [...history, { role: "assistant", content: sideSummary }];
      aiChatStep.value = keepStep;
      pushAiChatLocal("assistant", AI_REGISTER_REASK[keepStep]);
      return;
    }
    if (intent === "register") {
      aiAssistHistory.value = [];
      if (res.data.HAS_MENU_INFO === "Y") {
        // 메뉴 정보가 있으면 AI가 정리한 메뉴 정보(REPLY, 없으면 입력 문장)를 등록 대화(chatMenu)의 첫 입력으로 보낸다.
        // 입력 문장과 같으면 그 말풍선을 그대로 쓰고, 다르면(예: '등록해줘' → '아메리카노') 넘기는 말은 화면에 보이지 않게 한다
        const registerText = String(res.data.REPLY || "").trim() || text;
        if (registerText === text) {
          aiChatMessages.value.splice(userMsgIndex);
        } else {
          aiChatHideNextUser = true;
        }
        aiEditPending.value = null;
        aiChatStep.value = "name";
        aiChatHistoryStart.value = aiChatMessages.value.length;
        aiChatLoading.value = false;
        aiChatText.value = registerText;
        await sendAiChat();
      } else {
        startAiRegister();
      }
      return;
    }
    let summary;
    if (intent === "edit") {
      summary = startAiEdit(res.data.EDIT || {});
    } else {
      aiEditPending.value = null;
      aiChatStep.value = "intent";
      summary = await runAiInfoIntent(intent, res.data);
    }
    aiAssistHistory.value = [...history, { role: "assistant", content: summary || "처리했습니다." }];
  } catch (error) {
    // 실패한 질문은 대화에서 빼고 입력창에 되돌린다
    aiChatMessages.value.splice(userMsgIndex);
    aiChatText.value = text;
    Swal.fire({
      title: "AI 대화",
      text: errorText,
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    aiChatLoading.value = false;
    scrollAiChatLog();
    focusAiChatInput();
  }
};

// 같은 매장에 같은 메뉴코드가 있으면 저장 프로시저(MERGE)가 기존 메뉴를 덮어쓰므로, 조회된 메뉴와 대화 중 다른 메뉴의 코드를 모두 사용 중으로 본다
const getUsedMenuCodes = (exceptIndex) => {
  const used = new Set(
    (rowData.value || [])
      .map((r) => String(r.lngCode ?? ""))
      .filter((c) => c !== "" && c !== "undefined")
  );
  aiChatItems.value.forEach((item, idx) => {
    if (idx !== exceptIndex && item.lngCode) used.add(item.lngCode);
  });
  return used;
};

// 메뉴코드 예시: 같은 대분류·소분류의 4~9자리 코드 중 가장 큰 번호 + 1 (사용 중이면 다음 번호, 9자리 이하)
const suggestMenuCode = (item, used) => {
  const codes = (rowData.value || [])
    .filter(
      (r) =>
        String(r.lngMainGroup) === item.lngMainGroup &&
        String(r.lngSubGroup) === item.lngSubGroup
    )
    .map((r) => String(r.lngCode ?? ""))
    .filter((c) => /^\d{4,9}$/.test(c))
    .map(Number);
  if (codes.length === 0) return "";
  return findFreeMenuCode(Math.max(...codes) + 1, used);
};

// start 부터 올라가며 사용 중이 아닌 첫 번호 (4~9자리 범위)
const findFreeMenuCode = (start, used) => {
  let next = Math.max(start, 1000);
  while (next <= 999999999 && used.has(String(next))) next++;
  return next <= 999999999 ? String(next) : "";
};

// 적용 가능: 메뉴명·판매가·대분류·소분류(normalizeAiRow) + 메뉴코드 숫자 4~9자리
const refreshAiChatComplete = (item) => {
  item.complete = item.baseComplete && /^\d{4,9}$/.test(item.lngCode || "");
};

// 메뉴코드 제안·중복 확인: DB(slsMenu, 분류가 삭제된 메뉴 포함) 기준 프로시저를 쓰고, 대화 중 다른 메뉴의 코드도 피한다.
// 프로시저가 아직 없거나 오류면 화면에 조회된 메뉴 목록 기준으로 계산한다
// inputCode 가 있으면 그 코드의 사용 여부(inputUsed)와, 사용 중일 때의 다음 빈 번호(code)를 돌려준다
const fetchMenuCodeSuggestion = async (item, inputCode, index) => {
  const result = await fetchMenuCodeSuggestionByGroup(item, inputCode, index);
  // 분류에 기존 메뉴가 없어 제안할 번호가 없으면 '대분류코드 + 소분류코드 + 10' 으로 만든다 (4~9자리일 때만).
  // 이미 쓰는 번호면 그 다음 빈 번호
  if (!inputCode && !result.code) {
    const base = `${item.lngMainGroup ?? ""}${item.lngSubGroup ?? ""}10`;
    if (/^\d{4,9}$/.test(base)) {
      const checked = await fetchMenuCodeSuggestionByGroup(item, base, index);
      return { code: checked.inputUsed ? checked.code : base, inputUsed: false };
    }
  }
  return result;
};

// 분류 기준 메뉴코드 제안·중복 확인 (fetchMenuCodeSuggestion 에서 사용)
const fetchMenuCodeSuggestionByGroup = async (item, inputCode, index) => {
  const chatUsed = new Set(
    aiChatItems.value.filter((it, i) => i !== index && it.lngCode).map((it) => it.lngCode)
  );
  try {
    let start = inputCode;
    let inputUsed = false;
    for (let i = 0; i < 20; i++) {
      const res = await getMenuCodeSuggestion(
        groupCd.value,
        nowStoreCd.value,
        item.lngMainGroup,
        item.lngSubGroup,
        start
      );
      if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
      const row = (res.data.List || [])[0] || {};
      if (i === 0 && inputCode) {
        inputUsed = String(row.INPUT_USED) === "1" || chatUsed.has(inputCode);
      }
      const code = row.SUGGEST_CODE || "";
      if (!code || !chatUsed.has(code)) return { code, inputUsed };
      start = String(Number(code) + 1);
    }
  } catch (error) {
    // 화면 목록 기준으로 계산 (아래)
  }
  const used = getUsedMenuCodes(index);
  if (inputCode) {
    const inputUsed = used.has(inputCode);
    return {
      code: inputUsed ? findFreeMenuCode(Number(inputCode) + 1, used) : inputCode,
      inputUsed,
    };
  }
  return { code: suggestMenuCode(item, used), inputUsed: false };
};

// 메뉴코드 단계 입력 처리. 화면에서 끝냈으면 true (서버로 보내지 않음)
const handleAiChatCodeInput = async (text) => {
  const lastIndex = aiChatItems.value.length - 1;
  const current = aiChatItems.value[lastIndex];
  if (!current) {
    aiChatStep.value = "name";
    return false;
  }
  if (/^\d+$/.test(text)) {
    pushAiChatLocal("user", text);
    if (!/^\d{4,9}$/.test(text)) {
      pushAiChatLocal("assistant", "메뉴코드는 숫자 4~9자리로 입력해 주세요.");
      return true;
    }
    aiChatLoading.value = true;
    const { code: nextFree, inputUsed } = await fetchMenuCodeSuggestion(current, text, lastIndex);
    aiChatLoading.value = false;
    if (inputUsed) {
      // 겹치면 입력한 번호 다음의 빈 번호를 새로 제안한다
      const proposal = nextFree;
      pushAiChatLocal("assistant", `메뉴코드 ${text}는 이미 사용 중입니다.`, true);
      if (proposal) {
        current.lngCode = proposal;
        refreshAiChatComplete(current);
        aiChatMessages.value.push({
          role: "assistant",
          content: aiCodeProposalText(proposal),
          codeConfirm: true,
          local: true,
        });
      } else {
        pushAiChatLocal("assistant", "비어 있는 번호를 찾지 못했습니다. 메뉴코드를 숫자 4~9자리로 다시 입력해 주세요.");
      }
      return true;
    }
    current.lngCode = text;
    refreshAiChatComplete(current);
    confirmAiChatMenuCode(current);
    return true;
  }
  if (!current.lngCode) {
    pushAiChatLocal("user", text);
    pushAiChatLocal("assistant", "메뉴코드를 숫자 4~9자리로 입력해 주세요.");
    return true;
  }
  if (AI_CHAT_CONFIRM_WORDS.includes(text) || /^(이\s*)?(코드|메뉴코드)?\s*(사용|확정)/.test(text)) {
    pushAiChatLocal("user", text);
    confirmAiChatMenuCode(current);
    return true;
  }
  // 메뉴코드는 확정해야 다음으로 넘어간다 (다른 문장은 AI로 보내지 않고 다시 묻는다)
  pushAiChatLocal("user", text);
  pushAiChatLocal(
    "assistant",
    `메뉴코드 ${current.lngCode}를 사용하려면 '사용'이라고 말씀해 주세요. 변경을 원하시면 숫자로 메뉴코드를 4~9자리로 입력해 주세요.`
  );
  return true;
};

// 메뉴코드 확정 → 주방출력·할인적용 설정 → 메뉴 상세 설정이 필요한지 묻는다
const confirmAiChatMenuCode = (current) => {
  pushAiChatLocal("assistant", `메뉴코드를 ${current.lngCode}로 확정했습니다.`, true);
  // 뒤 단계에서 수정하러 왔으면(메뉴코드·분류 변경) 주방출력·할인은 다시 묻지 않고 돌아간다
  if (aiChatReturnTo) {
    goAiChatReturnStep();
    return;
  }
  goAiChatSettingRefStep(current);
};

// 주방출력·할인적용 다음 항목으로. 최종 확인에서 한 항목만 고치러 왔으면 바로 돌아간다
const nextAiChatSetting = (current, index) => {
  if (aiChatReturnTo) {
    goAiChatReturnStep();
    return;
  }
  askAiChatSetting(current, index);
};

/**
 * 주방출력(lngKPG)·할인적용(lngDiscount + discountYN) 설정: 같은 매장의 사용 중·판매가 있음·주메뉴종속 아닌 메뉴를
 * 항목별로 따로 묶고 값마다 최근 등록 대표 메뉴를 보여 준다. 값이 1개면 묻지 않고 그 값으로, 2개 이상이면 어느 메뉴와 같게 할지 고르게 한다.
 * 순서: 주방출력 → 할인적용 → 메뉴 상세 설정 질문.
 * DB 프로시저(usp_VUE_MST01_003INS_AI_GET_SETTING_REF)를 쓰고, 없거나 오류면 화면 메뉴 목록으로 계산한다 (최근 = 메뉴코드가 큰 것)
 */
const AI_SETTING_STEPS = [
  {
    type: "KPG",
    label: "주방출력",
    guide:
      "아래 메뉴 중 하나를 고르면 그 메뉴와 같은 주방출력(같은 주방 프린터)으로 설정됩니다. 주방에 출력하지 않으려면 '주방 미출력'을 골라 주세요.",
  },
  {
    type: "DISCOUNT",
    label: "할인적용",
    guide:
      "아래 메뉴 중 하나를 고르면 그 메뉴와 같은 할인 유형(할인여부·적용 할인)으로 설정됩니다. 지금 정하지 않으려면 '나중에 설정'을 고르고, 저장한 뒤 '할인선택' 탭에서 정해 주세요.",
  },
];
const aiChatSettingRefs = ref({ KPG: [], DISCOUNT: [] });
const aiChatSettingType = ref("");
// 주방출력 선택지 맨 위에 항상 붙이는 '주방 미출력' (값 99, 화면에 값은 표시하지 않음)
const AI_KPG_NO_PRINT = { value: "99", noPrint: true, lngCode: "NOPRINT", strName: "주방 미출력" };
// 할인적용 선택지 맨 위에 항상 붙이는 '나중에 설정' (값 0, 화면에 값은 표시하지 않음, 할인여부는 바꾸지 않음)
const AI_DISCOUNT_LATER = { value: "0", noPrint: true, lngCode: "LATER", strName: "나중에 설정" };
// 선택지 표시: 메뉴명 (가격원) - [메뉴코드]
const describeSettingRefMenu = (r) =>
  r.noPrint ? r.strName : `${r.strName} (${formatAiPrice(r.lngPrice)}원) - [${r.lngCode}]`;

const loadAiChatSettingRefs = async () => {
  try {
    const res = await getSettingReference(groupCd.value, nowStoreCd.value);
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    const list = res.data.List || [];
    // 프로시저가 아직 바뀌기 전(조합으로 묶던 형식)이면 화면 목록으로 계산한다
    if (list.length > 0 && !list[0].SETTING_TYPE) throw new Error("old format");
    const toRef = (r) => ({
      value: String(r.SETTING_VALUE),
      discountYN: String(r.discountYN),
      lngCode: String(r.lngCode),
      strName: r.strName,
      lngPrice: String(r.lngPrice),
      count: Number(r.MENU_CNT) || 0,
    });
    return {
      KPG: list.filter((r) => r.SETTING_TYPE === "KPG").map(toRef),
      DISCOUNT: list.filter((r) => r.SETTING_TYPE === "DISCOUNT").map(toRef),
    };
  } catch (error) {
    // 화면 메뉴 목록 기준 (프로시저 변경 전 등)
    const menus = (rowData.value || []).filter(
      (r) =>
        !r.new &&
        String(r.blnInactive ?? "0") !== "1" &&
        Number(r.lngPrice) > 0 &&
        String(r.blnCondimentprice ?? "0") !== "1"
    );
    const groupBy = (getValue) => {
      const groups = new Map();
      menus.forEach((r) => {
        const key = String(getValue(r));
        const g = groups.get(key);
        if (!g) {
          groups.set(key, { rep: r, count: 1 });
        } else {
          g.count++;
          if (Number(r.lngCode) > Number(g.rep.lngCode)) g.rep = r;
        }
      });
      return [...groups.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .map(([value, { rep, count }]) => ({
          value,
          discountYN: String(rep.discountYN ?? 1),
          lngCode: String(rep.lngCode),
          strName: rep.strName,
          lngPrice: String(rep.lngPrice ?? 0),
          count,
        }));
    };
    return {
      KPG: groupBy((r) => r.lngKPG ?? 0),
      DISCOUNT: groupBy((r) => r.lngDiscount ?? 1),
    };
  }
};

const setAiChatSettingRef = (current, type, refItem) => {
  const name = refItem.noPrint ? "" : `${refItem.strName}(${refItem.lngCode})`;
  if (type === "KPG") {
    current.lngKPG = refItem.value;
    current.kpgRefName = name;
  } else {
    current.lngDiscount = refItem.value;
    // 나중에 설정(0)은 할인여부를 바꾸지 않는다
    current.discountYN = refItem.noPrint ? undefined : refItem.discountYN;
    current.discountRefName = name;
    current.discountLater = !!refItem.noPrint;
  }
};

// 항목 하나(type)를 정한다: 값이 0개면 기본값, 1개면 자동, 2개 이상이면 선택. 끝나면 다음 항목 또는 상세 설정 질문
const askAiChatSetting = (current, index) => {
  const step = AI_SETTING_STEPS[index];
  if (!step) {
    goAiChatDetailAskStep();
    return;
  }
  let refs = aiChatSettingRefs.value[step.type] || [];
  if (step.type === "KPG") {
    // 미출력(99) 묶음은 대표 메뉴 대신 '주방 미출력' 하나로 보여 준다.
    // 출력 묶음이 1개뿐이고 미출력 메뉴가 없으면 묻지 않고, 그 밖에는 '주방 미출력'을 맨 위에 붙여 고르게 한다
    const printRefs = refs.filter((r) => String(r.value) !== "99");
    const hasNoPrint = printRefs.length !== refs.length;
    refs = printRefs.length === 1 && !hasNoPrint ? printRefs : [AI_KPG_NO_PRINT, ...printRefs];
    aiChatSettingRefs.value = { ...aiChatSettingRefs.value, KPG: refs };
  } else if (step.type === "DISCOUNT") {
    // 할인적용 0 묶음은 대표 메뉴 대신 '나중에 설정' 하나로, 맨 위에 보여 준다.
    // 값이 1개뿐이고 0인 메뉴가 없으면 묻지 않는다
    const valueRefs = refs.filter((r) => String(r.value) !== "0");
    const hasZero = valueRefs.length !== refs.length;
    refs = valueRefs.length === 1 && !hasZero ? valueRefs : [AI_DISCOUNT_LATER, ...valueRefs];
    aiChatSettingRefs.value = { ...aiChatSettingRefs.value, DISCOUNT: refs };
  }
  if (refs.length === 0) {
    pushAiChatLocal("assistant", `참고할 메뉴가 없어 ${step.label}은 기본값으로 둡니다.`, true);
    nextAiChatSetting(current, index + 1);
  } else if (refs.length === 1) {
    setAiChatSettingRef(current, step.type, refs[0]);
    pushAiChatLocal(
      "assistant",
      `${step.label}은 기존 메뉴와 같이 설정했습니다. (${describeSettingRefMenu(refs[0])})`,
      true
    );
    nextAiChatSetting(current, index + 1);
  } else {
    aiChatSettingType.value = step.type;
    pushAiChatLocal("assistant", `${step.label}을 어느 메뉴와 동일하게 설정할까요?\n${step.guide}`);
    aiChatStep.value = "settingRef";
  }
};

const goAiChatSettingRefStep = async (current) => {
  aiChatLoading.value = true;
  aiChatSettingRefs.value = await loadAiChatSettingRefs();
  aiChatLoading.value = false;
  askAiChatSetting(current, 0);
  scrollAiChatLog();
  focusAiChatInput();
};

const chooseAiChatSettingRef = (refItem) => {
  const current = aiChatItems.value.find((i) => !i.finished);
  if (!current || aiChatStep.value !== "settingRef") return;
  const index = AI_SETTING_STEPS.findIndex((s) => s.type === aiChatSettingType.value);
  const step = AI_SETTING_STEPS[index];
  setAiChatSettingRef(current, step.type, refItem);
  pushAiChatLocal(
    "assistant",
    refItem.noPrint
      ? `${step.label}을 '${refItem.strName}'(으)로 설정했습니다.`
      : `${step.label}을 '${refItem.strName}' 메뉴와 같이 설정했습니다.`,
    true
  );
  nextAiChatSetting(current, index + 1);
};

// 대표 메뉴 고르기 입력: 메뉴코드·메뉴명 (항상 화면에서 끝냄)
const handleAiChatSettingRefInput = (text) => {
  pushAiChatLocal("user", text);
  const key = text.replace(/^.*\[(\d+)\]\s*$/, "$1").trim();
  const refs = aiChatSettingRefs.value[aiChatSettingType.value] || [];
  const found =
    refs.find((r) => r.lngCode === key || String(r.strName).trim() === key) ||
    (/미출력|출력\s*안|나중/.test(text) ? refs.find((r) => r.noPrint) : null);
  if (found) {
    chooseAiChatSettingRef(found);
  } else {
    pushAiChatLocal("assistant", "목록에 있는 메뉴를 선택해 주세요.");
  }
  return true;
};

// 메뉴명 오타 확인: 이미 물어본 메뉴명 (새 대화에서 비움)
const aiChatTypoAsked = new Set();
// 오타 확인 버튼은 메뉴 기본 정보 단계(메뉴명~메뉴코드)에서만 누를 수 있다 (다국어 등 뒤 단계는 바뀐 이름과 어긋남)
const AI_TYPO_FIX_STEPS = ["name", "price", "main", "sub", "confirm", "code"];
const answerAiChatTypo = (msg, accept) => {
  if (msg.typoDone || aiChatLoading.value || !AI_TYPO_FIX_STEPS.includes(aiChatStep.value)) return;
  msg.typoDone = true;
  const { from, to, key } = msg.typoFix;
  const item = aiChatItems.value.find((i) => i.key === key && !i.finished);
  if (accept && item && item.strName === from) {
    item.strName = to;
    pushAiChatLocal("user", `'${to}'(으)로 변경`);
    pushAiChatLocal("assistant", `메뉴명을 '${to}'(으)로 바꿨습니다.`, true);
  } else {
    pushAiChatLocal("user", "그대로 사용");
    pushAiChatLocal("assistant", `메뉴명은 '${from}' 그대로 사용합니다.`, true);
  }
  scrollAiChatLog();
  focusAiChatInput();
};

// 자동생성 메뉴코드 안내 문구 (처음 제안·중복으로 다시 제안할 때 같은 문구)
const aiCodeProposalText = (code) =>
  `자동생성 메뉴코드 : ${code}\n자동생성 메뉴코드를 사용하시겠습니까?\n변경을 원하시면 숫자로 메뉴코드를 4~9자리로 입력해 주세요.`;

// 메뉴코드 예시 말풍선의 '이 코드 사용' 버튼
const useSuggestedAiChatCode = () => {
  const current = aiChatItems.value[aiChatItems.value.length - 1];
  if (aiChatStep.value !== "code" || !current || !current.lngCode || aiChatLoading.value) return;
  pushAiChatLocal("user", "사용");
  confirmAiChatMenuCode(current);
  scrollAiChatLog();
  focusAiChatInput();
};
// 등록할 메뉴 목록은 매 답변마다 새로 오므로, 이미 적용한 메뉴는 이름·가격으로 기억해 적용됨 표시를 유지한다
const aiChatAppliedKeys = new Set();
// 등록할 메뉴 행 키 (완료한 메뉴와 작성 중인 메뉴가 섞여도 겹치지 않게)
let aiChatItemSeq = 0;

const aiItemKey = (item) => `${item.strName}|${item.lngPrice}`;

// 답변을 기다리는 동안 입력창이 비활성화되어 포커스가 빠지므로, 끝나면 입력창으로 되돌린다
const aiChatTextareaRef = ref(null);
const focusAiChatInput = async () => {
  await nextTick();
  if (aiChatTextareaRef.value) aiChatTextareaRef.value.focus();
};

const scrollAiChatLog = async () => {
  await nextTick();
  if (aiChatLogRef.value) {
    aiChatLogRef.value.scrollTop = aiChatLogRef.value.scrollHeight;
  }
};

// 메뉴 개별 설정 브랜드(공통메뉴 아님)는 매장을 골라야 그 매장 메뉴로 AI 기능을 쓸 수 있다
// (매장 미선택이어도 AI 버튼은 누를 수 있게 두고, 누르면 매장 선택을 안내한다)
// PickStore 매장 콤보의 「선택」은 값 0 이다 (-1·빈 값도 미선택으로 본다)
const aiNeedsStorePick = computed(
  () =>
    !isStoreImageFeatureEnabled.value &&
    ["", "-1", "0"].includes(String(pickedStoreCd.value ?? ""))
);
// AI 메뉴 관리를 쓰지 않는 매장 그룹 (버튼 비활성화)
const AI_DISABLED_STORE_GROUPS = [3015];
const aiDisabledGroup = computed(() => AI_DISABLED_STORE_GROUPS.includes(Number(groupCd.value)));
// AI 대화를 마지막으로 연 매장 (그룹|매장). 매장이 바뀌면 이전 매장 대화는 새로 시작한다
let aiChatStoreKey = "";
// 보내기·최종 등록·수정 저장 직전 확인: AI 처리는 대화를 연 매장(선택된 매장)으로만 한다.
// 매장 미선택이거나 대화를 연 뒤 매장이 바뀌었으면 막고 대화창을 닫는다
const aiStoreGuardFails = () => {
  const storeKey = `${groupCd.value}|${nowStoreCd.value}`;
  if (!aiNeedsStorePick.value && afterSearch.value && storeKey === aiChatStoreKey) return false;
  Swal.fire({
    title: "경고",
    text: aiNeedsStorePick.value
      ? "매장을 선택해 주십시오."
      : storeKey !== aiChatStoreKey
        ? "조회한 매장이 바뀌었습니다. 매장을 다시 조회한 뒤 AI 메뉴 관리를 열어 주세요."
        : "메뉴 목록을 다시 조회한 뒤 AI 메뉴 관리를 열어 주세요.",
    icon: "warning",
    confirmButtonText: "확인",
  });
  aiChatOpen.value = false;
  return true;
};

const openAiChat = () => {
  if (aiDisabledGroup.value) return;
  if (aiNeedsStorePick.value) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // 다른 매장으로 바꿔 조회했으면 이전 매장의 대화·작성 중인 메뉴는 버리고 새로 시작한다
  const storeKey = `${groupCd.value}|${nowStoreCd.value}`;
  if (aiChatStoreKey && aiChatStoreKey !== storeKey) {
    resetAiChat();
  }
  aiChatStoreKey = storeKey;
  aiChatOpen.value = true;
  if (!aiChatPos.value) {
    centerAiChatPopup();
  }
  // 대분류가 하나도 없으면 메뉴를 등록할 수 없으므로 처음에 안내한다
  if ((MenuGroup.value || []).length === 0 && aiChatMessages.value.length === 0) {
    pushAiChatLocal(
      "assistant",
      "이 매장에는 등록된 대분류가 없어 메뉴를 등록할 수 없습니다. 대분류코드등록 화면에서 대분류·소분류를 먼저 등록해 주세요.",
      true
    );
  }
  scrollAiChatLog();
  focusAiChatInput();
};

const resetAiChat = () => {
  aiChatMessages.value = [];
  aiChatItems.value = [];
  aiChatText.value = "";
  aiChatTestMode.value = false;
  aiChatStep.value = "intent";
  aiChatHistoryStart.value = 0;
  aiAssistHistory.value = [];
  aiEditPending.value = null;
  aiChatPendingImage.value = null;
  aiChatPendingLang.value = null;
  aiChatSavedAndIdle.value = false;
  aiChatAppliedKeys.clear();
  aiChatTypoAsked.clear();
  aiChatReturnTo = "";
  aiLastResultCodes.value = null;
};

// 최종 등록(저장) 직후 아무것도 더 하지 않은 상태에서 닫으면 대화창을 모두 초기화한다
const aiChatSavedAndIdle = ref(false);
const closeAiChat = () => {
  if (aiChatSavedAndIdle.value) {
    resetAiChat();
  }
  aiChatZoomImage.value = null;
  aiChatOpen.value = false;
};

const onAiChatEnter = (e) => {
  if (e.isComposing || e.shiftKey) return;
  e.preventDefault();
  sendAiChat();
};

const sendAiChat = async () => {
  const text = aiChatText.value.trim();
  if (text === "" || aiChatLoading.value) return;
  if (aiStoreGuardFails()) return;
  // 저장 뒤 새 대화를 시작했으면 닫아도 초기화하지 않는다
  aiChatSavedAndIdle.value = false;
  // 시작(작업 판단)·조회·질문·메뉴 수정 단계는 chatAssist 로 처리한다 (등록 단계는 아래 기존 chatMenu 흐름)
  if (["intent", "editPick", "editSub", "editConfirm"].includes(aiChatStep.value)) {
    aiChatText.value = "";
    await sendAiAssist(text);
    scrollAiChatLog();
    focusAiChatInput();
    return;
  }
  // 등록 중(메뉴명~소분류·확인)에 조회·질문을 하면 도우미로 답한 뒤 같은 등록 단계로 돌아온다
  if (AI_REGISTER_REASK[aiChatStep.value] && AI_SIDE_ASK_RE.test(text)) {
    aiChatText.value = "";
    await sendAiAssist(text, aiChatStep.value);
    scrollAiChatLog();
    focusAiChatInput();
    return;
  }
  // 메뉴코드·상세 설정·최종 확인 단계에서 메뉴명·판매가·분류·과세를 고쳐 달라고 하면 AI로 보내 반영하고, 끝나면 원래 단계로 돌아온다
  // (메뉴코드 단계에서 숫자만 입력하면 메뉴코드 입력으로 본다)
  // 주방출력·할인 선택, 이미지·메뉴옵션·다국어·메뉴키 단계는 메뉴명·가격이 섞인 답도 오므로 항목 이름을 말한 경우만 수정 요청으로 본다
  const editFromStep =
    ((["detailAsk", "options", "final"].includes(aiChatStep.value) ||
      (aiChatStep.value === "code" && !/^\d+$/.test(text))) &&
      AI_CHAT_EDIT_RE.test(text)) ||
    (AI_CHAT_EDIT_EXTRA_STEPS.includes(aiChatStep.value) && AI_CHAT_EDIT_STRICT_RE.test(text))
      ? aiChatStep.value
      : null;
  if (
    !editFromStep &&
    ((aiChatStep.value === "code" && (await handleAiChatCodeInput(text))) ||
    (aiChatStep.value === "image" && handleAiChatImageInput(text)) ||
    (aiChatStep.value === "imageConfirm" && handleAiChatImageConfirmInput(text)) ||
    (aiChatStep.value === "options" && handleAiChatOptionsInput(text)) ||
    (aiChatStep.value === "optionGroup" && handleAiChatOptionGroupInput(text)) ||
    (aiChatStep.value === "multiLang" && handleAiChatMultiLangInput(text)) ||
    (aiChatStep.value === "detailAsk" && handleAiChatDetailAskInput(text)) ||
    (aiChatStep.value === "final" && handleAiChatFinalInput(text)) ||
    (aiChatStep.value === "settingRef" && handleAiChatSettingRefInput(text)) ||
    (["menuKeyStore", "menuKeyScreen"].includes(aiChatStep.value) && handleAiChatMenuKeyInput(text)))
  ) {
    aiChatText.value = "";
    scrollAiChatLog();
    focusAiChatInput();
    return;
  }
  // 턴 제한은 지금 작성 중인 메뉴의 대화에만 적용한다 (메뉴가 끝날 때마다 AI 대화 기록을 새로 시작)
  const userTurns = aiChatMessages.value
    .slice(aiChatHistoryStart.value)
    .filter((m) => m.role === "user" && !m.local).length;
  if (userTurns >= AI_CHAT_MAX_TURNS) {
    Swal.fire({
      title: "AI 대화",
      text: "이 메뉴의 대화가 길어졌습니다. 새 대화로 시작해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 도우미가 등록 대화로 넘긴 말(사용자가 직접 쓴 말과 다른 경우)은 서버에는 보내고 화면에는 보이지 않게 한다
  aiChatMessages.value.push({ role: "user", content: text, hidden: aiChatHideNextUser });
  aiChatHideNextUser = false;
  aiChatText.value = "";
  aiChatLoading.value = true;
  scrollAiChatLog();

  const stepAtSend = aiChatStep.value;
  // 대분류·소분류 선택지가 하나뿐이면 응답 처리 뒤 자동으로 선택해 보낸다
  let autoChoice = null;
  // AI에는 지금 작성 중인 메뉴 1개만 보낸다 (완료한 메뉴는 화면에서만 관리)
  const finishedItems = aiChatItems.value.filter((i) => i.finished);
  const prevCurrent = aiChatItems.value.find((i) => !i.finished) || null;
  let errorText = "AI 요청 중 오류가 발생했습니다.";
  try {
    const currentItems = prevCurrent
      ? [
          {
            strName: prevCurrent.strName,
            lngPrice: prevCurrent.lngPrice,
            lngMainGroup: prevCurrent.lngMainGroup,
            lngSubGroup: prevCurrent.lngSubGroup,
            lngTax: prevCurrent.lngTax,
            strNote: prevCurrent.note,
          },
        ]
      : [];
    const serverMessages = aiChatMessages.value
      .slice(aiChatHistoryStart.value)
      .filter((m) => !m.local)
      .map((m) => ({ role: m.role, content: m.content }));
    const res = await chatMenu(
      groupCd.value,
      nowStoreCd.value,
      JSON.stringify(serverMessages),
      JSON.stringify(currentItems),
      buildAiGroupList()
    );
    if (res.data.RESULT_CD !== "00") {
      errorText = res.data.RESULT_NM;
      throw new Error(errorText);
    }
    aiChatTestMode.value = res.data.RESULT_NM === "TEST_MODE";
    // 서버로 다시 보낼 때는 한 메시지(content), 화면에는 확인·질문 두 말풍선(parts)
    // AI가 안내 문장을 비워 보내면 다음 단계(STEP)에 맞는 질문으로 대신한다
    const AI_STEP_FALLBACK_ASK = {
      name: "메뉴명을 입력해 주세요.",
      price: "판매가를 입력해 주세요.",
      main: "대분류를 선택해 주세요.",
      sub: "소분류를 선택해 주세요.",
      confirm: "입력하신 내용이 맞는지 확인해 주세요.",
      code: "과세구분은 기본 과세로 설정됩니다. 변경이 필요하시면 말씀해 주세요.",
    };
    // 메뉴명과 판매가가 한 번에 들어와 AI가 확인 질문(confirm)을 하면, 묻지 않고 바로 확정해 다음 항목(대분류 등)으로 넘어간다.
    // 대분류·소분류 단계면 아래에서 선택지가 바로 붙는다 (잘못 나뉜 값은 상세 설정·최종 확인 단계에서 '메뉴명 …으로' 처럼 고칠 수 있음)
    const confirmList = res.data.List || [];
    const confirmRow = confirmList[confirmList.length - 1];
    if (!editFromStep && res.data.STEP === "confirm" && confirmRow && confirmRow.strName && Number(confirmRow.lngPrice) > 0) {
      const checked = normalizeAiRow(confirmRow, 0);
      const nextStep = !checked.lngMainGroup ? "main" : !checked.lngSubGroup ? "sub" : "code";
      res.data.STEP = nextStep;
      res.data.CONFIRM = `메뉴명 '${checked.strName}', 판매가 ${formatAiPrice(checked.lngPrice)}원으로 입력했습니다.`;
      res.data.REPLY = AI_STEP_FALLBACK_ASK[nextStep];
    }
    // 뒤 단계에서 분류가 아닌 항목(메뉴명·판매가·과세)만 고친 경우: AI가 다음 질문을 대분류 등으로 잘못 보내도
    // 대분류·소분류는 이전 값을 그대로 두고 바로 원래 단계(최종 확인 등)로 돌아간다 (메뉴코드도 유지됨)
    if (editFromStep && prevCurrent && !/(대분류|소분류|분류)/.test(text)) {
      const editedRow = (res.data.List || [])[(res.data.List || []).length - 1];
      if (editedRow) {
        editedRow.lngMainGroup = prevCurrent.lngMainGroup;
        editedRow.lngSubGroup = prevCurrent.lngSubGroup;
      }
      res.data.STEP = "code";
      res.data.REPLY = "";
    }
    // 수정 요청으로 모든 항목이 그대로 정해져 있으면(step=code) 질문 없이 확인 문장만 보여 주고 원래 단계로 돌아간다
    const editDone = editFromStep && (res.data.STEP === "code" || !res.data.STEP);
    // 뒤 단계에서 분류를 바꾸느라 대분류·소분류를 다시 고르게 되면, 메뉴코드까지 정한 뒤 원래 단계로 돌아간다
    // (최종 확인의 「수정」으로 들어온 중이면 최종 확인으로 돌아가는 것을 유지한다)
    if (editFromStep && editFromStep !== "code" && !editDone && !aiChatReturnTo) {
      aiChatReturnTo = editFromStep;
    }
    if (!res.data.REPLY && !editDone) {
      // 원인 확인용: 빈 안내가 온 응답을 개발자 도구 콘솔에 남긴다
      console.warn("[AI로 간편메뉴 추가] 빈 안내 응답", res.data);
    }
    const { confirmText, replyText } = editDone
      ? { confirmText: res.data.CONFIRM || "요청하신 내용을 반영했습니다.", replyText: "" }
      : splitAiChatReply(
          res.data.CONFIRM || "",
          res.data.REPLY || AI_STEP_FALLBACK_ASK[res.data.STEP] || "등록할 메뉴 정보를 정리했습니다."
        );
    aiChatMessages.value.push({
      role: "assistant",
      content: [confirmText, replyText].filter((t) => t).join("\n"),
      parts: [
        ...(confirmText ? [{ text: confirmText, plain: true }] : []),
        ...(replyText ? [{ text: replyText, plain: false }] : []),
      ],
    });
    const list = res.data.List || [];
    // 메뉴명 답변으로 새 메뉴가 생기고 AI가 판매가 질문으로 넘어갔으면(메뉴 이름만 받은 경우), 메뉴명은 숫자·가격이 있어도 입력한 그대로 쓴다.
    // 문장 속에 가격 등이 함께 있어 AI가 확인 질문(confirm)을 한 경우에는 AI가 나눈 값을 그대로 둔다
    if (stepAtSend === "name" && res.data.STEP === "price" && !prevCurrent && list.length > 0) {
      list[list.length - 1].strName = text;
    }
    // 작성 중인 메뉴: AI가 돌려준 값으로 바꾸고, AI가 다루지 않는 값(메뉴코드·이미지·옵션그룹·다국어)은 이어받는다.
    // AI가 메뉴를 비워 보내면(관계없는 말 등) 이전 값을 그대로 둔다
    let nextCurrent = prevCurrent;
    if (list.length > 0) {
      const item = normalizeAiRow(list[list.length - 1], 0);
      // 대분류·소분류가 바뀌면 이전 분류 기준으로 정한 메뉴코드는 버린다 (소분류까지 다시 정해지면 새 분류 기준으로 다시 제안)
      const sameGroup =
        prevCurrent &&
        prevCurrent.lngMainGroup === item.lngMainGroup &&
        prevCurrent.lngSubGroup === item.lngSubGroup;
      nextCurrent = {
        ...item,
        key: prevCurrent ? prevCurrent.key : `ai${++aiChatItemSeq}`,
        lngCode: sameGroup ? prevCurrent.lngCode : "",
        imageFile: prevCurrent ? prevCurrent.imageFile : null,
        imageName: prevCurrent ? prevCurrent.imageName : "",
        lngChain: prevCurrent ? prevCurrent.lngChain : "",
        chainName: prevCurrent ? prevCurrent.chainName : "",
        strNameE: prevCurrent ? prevCurrent.strNameE : "",
        multiLang: prevCurrent ? prevCurrent.multiLang : null,
        lngKPG: prevCurrent ? prevCurrent.lngKPG : undefined,
        lngDiscount: prevCurrent ? prevCurrent.lngDiscount : undefined,
        discountYN: prevCurrent ? prevCurrent.discountYN : undefined,
        kpgRefName: prevCurrent ? prevCurrent.kpgRefName : "",
        discountRefName: prevCurrent ? prevCurrent.discountRefName : "",
        discountLater: prevCurrent ? prevCurrent.discountLater : false,
        menuKeyTargets: prevCurrent ? prevCurrent.menuKeyTargets : null,
        finished: false,
        applied: aiChatAppliedKeys.has(aiItemKey(item)),
      };
      refreshAiChatComplete(nextCurrent);
    }
    aiChatItems.value = nextCurrent ? [...finishedItems, nextCurrent] : [...finishedItems];
    // 메뉴명 오타가 의심되면 바꿀지 한 번 묻는다 (같은 메뉴명은 한 번만, 묻는 동안에도 등록 흐름은 이어짐)
    const typo = String(res.data.TYPO_SUGGESTION || "").trim();
    if (typo && nextCurrent && typo !== nextCurrent.strName && !aiChatTypoAsked.has(nextCurrent.strName)) {
      aiChatTypoAsked.add(nextCurrent.strName);
      aiChatMessages.value.push({
        role: "assistant",
        content: `메뉴명 '${nextCurrent.strName}'에 오타가 있는 것 같아요. '${typo}'(으)로 바꿀까요?`,
        typoFix: { from: nextCurrent.strName, to: typo, key: nextCurrent.key },
        local: true,
      });
    }
    aiChatStep.value = AI_CHAT_STEP_TEXT[res.data.STEP] ? res.data.STEP : "name";
    // 작성 중인 메뉴가 없는데 code 단계라고 오면(관계없는 말 등) 메뉴명 단계로 둔다
    if (aiChatStep.value === "code" && !nextCurrent) {
      aiChatStep.value = "name";
    }
    // 수정 요청을 반영했으면 원래 단계로 돌아간다 (최종 확인이면 바뀐 정보로 다시 보여 줌)
    // 메뉴코드 단계에서 고친 경우는 아래 메뉴코드 안내(step=code)로 다시 돌아간다
    if (editDone && nextCurrent && editFromStep !== "code") {
      // 메뉴코드는 이미 확정돼 있으므로 다시 묻지 않는다
      aiChatHistoryStart.value = aiChatMessages.value.length;
      resumeAiChatStep(editFromStep);
    }

    // 대분류·소분류: 선택지가 하나뿐이면 묻지 않고 자동 선택, 하나도 없으면 안내
    if (aiChatStep.value === "main" || aiChatStep.value === "sub") {
      const label = aiChatStep.value === "main" ? "대분류" : "소분류";
      const choices = aiChatGroupChoices.value;
      if (choices.length === 0) {
        pushAiChatLocal(
          "assistant",
          aiChatStep.value === "main"
            ? "등록된 대분류가 없습니다. 대분류코드등록 화면에서 대분류를 먼저 등록해 주세요."
            : "선택한 대분류에 등록된 소분류가 없습니다. 소분류를 먼저 등록하거나 다른 대분류를 말씀해 주세요.",
          true
        );
      } else if (choices.length === 1) {
        pushAiChatLocal(
          "assistant",
          `${label}가 하나뿐이라 '[${choices[0].code}] ${choices[0].name}'(으)로 자동 선택합니다.`,
          true
        );
        autoChoice = choices[0];
      }
    }

    // 소분류까지 정해지면 화면이 메뉴코드 예시를 안내한다 (작성 중인 메뉴만)
    const last = nextCurrent;
    if (aiChatStep.value === "code" && last) {
      // 이 메뉴의 AI 단계(메뉴명~소분류)가 끝났으므로 다음 메뉴부터 AI 대화 기록을 새로 시작한다
      aiChatHistoryStart.value = aiChatMessages.value.length;
      if (!last.lngCode) {
        const { code } = await fetchMenuCodeSuggestion(last, "", aiChatItems.value.length - 1);
        last.lngCode = code;
        refreshAiChatComplete(last);
      }
      if (last.lngCode) {
        aiChatMessages.value.push({
          role: "assistant",
          content: aiCodeProposalText(last.lngCode),
          codeConfirm: true,
          local: true,
        });
      } else {
        // 분류에 기존 메뉴가 없고 '대분류코드 + 소분류코드 + 10' 도 9자리를 넘거나 숫자가 아니면 사람이 입력한다
        pushAiChatLocal(
          "assistant",
          `${last.lngMainGroup ?? ""}${last.lngSubGroup ?? ""}10`.length > 9
            ? "대분류코드와 소분류코드로 만든 번호가 9자리를 넘어 메뉴코드를 자동생성할 수 없습니다. 메뉴코드를 숫자 4~9자리로 입력해 주세요."
            : "이 분류에는 참고할 메뉴코드가 없습니다. 메뉴코드를 숫자 4~9자리로 입력해 주세요."
        );
      }
    }
  } catch (error) {
    // 실패한 질문은 대화 기록에서 빼고 입력창에 되돌린다 (user/assistant 순서 유지)
    aiChatMessages.value.pop();
    aiChatText.value = text;
    Swal.fire({
      title: "AI 대화",
      text: errorText,
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    aiChatLoading.value = false;
    scrollAiChatLog();
    focusAiChatInput();
  }
  // 선택지가 하나뿐인 대분류·소분류는 사용자가 고른 것처럼 바로 보낸다
  if (autoChoice) {
    chooseAiChatGroup(autoChoice);
  }
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  // 현재 선택된 행이 신규행인지 확인
  if (rowIndex.value === undefined || rowIndex.value === null) {
    Swal.fire({
      title: "경고",
      text: "삭제할 행을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 신규행 확인 방법 1: created 배열에 포함되어 있는지 확인
  const isNewRowInCreated = updateDeleteInsertrowIndex.value.created?.includes(rowIndex.value) || false;
  
  // 신규행 확인 방법 2: rowData의 new 속성 또는 sequence 확인
  const currentRow = rowData.value[rowIndex.value];
  const isNewRowByProperty = currentRow?.new === true || currentRow?.sequence?.toString().startsWith('new') || false;

  // 신규행이 아닌 경우 경고 메시지 표시
  if (!isNewRowInCreated && !isNewRowByProperty) {
    Swal.fire({
      title: "경고",
      text: "신규로 추가된 행만 삭제할 수 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 신규행인 경우에만 삭제 실행
  deleteRow3.value = !deleteRow3.value;
};

watch(gridvalue9, () => {
  const selectedCode = gridvalue9.value;
  if (selectedCode == "") {
    filteredapproveType.value = [];
    return;
  }
  filteredapproveType.value = approveGroup.value.filter(
    (item) => item.strDCode1 == selectedCode
  );
});

const saveDeliveryMenuTab = async () => {
  const targetStoreCd = resolveDeliveryStoreCdForApi();
  const targetMenuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  const targetMenuName = String(gridvalue6.value ?? "").trim();

  const rowsToSave = (deliveryMenuRows.value || [])
    .map((row) => {
      const code = normalizeDeliveryParam(row?.code);
      const useMulti =
        isDeliveryMenuNoStoreMode.value && isMultiNameDeliveryRow(row);
      if (useMulti) {
        const menuNames = Array.from(
          { length: multiDeliveryMenuNameCount },
          (_, index) => String(row?.menuNames?.[index] ?? "").trim()
        );
        const originalMenuNames = Array.from(
          { length: multiDeliveryMenuNameCount },
          (_, index) => String(row?.originalMenuNames?.[index] ?? "").trim()
        );
        const changed = menuNames.some(
          (name, index) => name !== originalMenuNames[index]
        );
        return { code, useMulti: true, menuNames, changed };
      }
      const menuName = String(row?.menuName ?? "").trim();
      const originalMenuName = String(row?.originalMenuName ?? "").trim();
      return {
        code,
        useMulti: false,
        menuName,
        changed: menuName !== originalMenuName,
      };
    })
    .filter((row) => row.code && row.changed);

  if (rowsToSave.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 배달메뉴명이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (!targetMenuCd || (!isDeliveryMenuNoStoreMode.value && !targetStoreCd)) {
    Swal.fire({
      title: "경고",
      text: isDeliveryMenuNoStoreMode.value
        ? "메뉴코드를 확인해주세요."
        : "매장, 메뉴코드를 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const duplicateNameMessage = isDeliveryMenuNoStoreMode.value
    ? findDuplicateDeliveryNameMessage(targetMenuName, deliveryMenuRows.value)
    : "";
  if (duplicateNameMessage) {
    Swal.fire({
      title: "경고",
      text: duplicateNameMessage,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "배달메뉴 설정을 저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    store.state.loading = true;
    try {
      for (const row of rowsToSave) {
        const targetDeliveryCd = row.code;
        const savePayloadBase = {
          GROUP_CD: groupCd.value,
          STORE_CD: targetStoreCd,
          MENU_CD: targetMenuCd,
          DELIVERY_CD: targetDeliveryCd,
          STR_NAME: targetMenuName,
        };
        if (row.useMulti) {
          row.menuNames.forEach((name, index) => {
            savePayloadBase[`STR_INFO${index + 1}`] = name;
          });
        } else {
          // C# saveDeliveryMenuMap이 STR_INFO1~10을 모두 받으므로 단일 저장도 빈값 포함 전송
          savePayloadBase.STR_INFO1 = row.menuName;
          for (let i = 2; i <= multiDeliveryMenuNameCount; i++) {
            savePayloadBase[`STR_INFO${i}`] = "";
          }
        }

        let saveRes = await saveDeliveryMenuMap({
          ...savePayloadBase,
          OVERWRITE_YN: "N",
        });

        if (extractResultCode(saveRes) === "97") {
          // 무매장(3287): 덮어쓰기 없이 경고만 / 매장단위(3048·9999): 기존 예/아니오
          if (isDeliveryMenuNoStoreMode.value) {
            const duplicateMenuCdForMsg = extractDuplicateMenuCd(saveRes);
            const duplicateNameForMsg = extractDuplicateName(saveRes);
            let warningText = "";
            if (duplicateNameForMsg && duplicateMenuCdForMsg) {
              warningText = `「${duplicateNameForMsg}」이(가) 메뉴코드 ${duplicateMenuCdForMsg}와 중복됩니다. 다시 입력해주세요.`;
            } else if (duplicateNameForMsg) {
              warningText = `「${duplicateNameForMsg}」이(가) 이미 사용 중입니다. 다시 입력해주세요.`;
            } else if (duplicateMenuCdForMsg) {
              warningText = `메뉴코드 ${duplicateMenuCdForMsg}와 배달메뉴명이 중복됩니다. 다시 입력해주세요.`;
            } else {
              warningText =
                extractResultName(saveRes) ||
                "중복된 메뉴명/배달메뉴명이 있습니다. 다시 입력해주세요.";
            }
            await Swal.fire({
              title: "경고",
              text: warningText,
              icon: "warning",
              confirmButtonText: "확인",
            });
            return;
          }

          let duplicateMenuCdForMsg = extractDuplicateMenuCd(saveRes);
          try {
            if (!duplicateMenuCdForMsg) {
              const duplicateCheckRes = await getDeliveryMenuMap(
                groupCd.value,
                targetStoreCd,
                targetDeliveryCd,
                ""
              );
              const targetInfo1 = String(row.menuName ?? "")
                .trim()
                .toLowerCase();
              const duplicateRow = extractDeliveryMapList(duplicateCheckRes).find(
                (item) => {
                  const rowInfo1 = String(
                    item?.strInfo1 ?? item?.STR_INFO1 ?? item?.STRINFO1 ?? ""
                  )
                    .trim()
                    .toLowerCase();
                  const rowMenuCd = normalizeDeliveryParam(
                    item?.lngCode ?? item?.MENU_CD ?? item?.lngcode ?? item?.menuCd
                  );
                  return rowInfo1 === targetInfo1 && rowMenuCd !== targetMenuCd;
                }
              );
              duplicateMenuCdForMsg = normalizeDeliveryParam(
                duplicateRow?.lngCode ??
                  duplicateRow?.MENU_CD ??
                  duplicateRow?.lngcode ??
                  duplicateRow?.menuCd
              );
            }
          } catch (_) {}

          const duplicateConfirm = await Swal.fire({
            title: "중복 배달메뉴명",
            text: duplicateMenuCdForMsg
              ? `${duplicateMenuCdForMsg} 메뉴코드가 이미 해당 배달메뉴명을 사용 중입니다. 그래도 저장하시겠습니까?`
              : "다른 메뉴코드에 중복된 배달메뉴명이 있습니다. 그래도 저장하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오",
          });

          if (!duplicateConfirm.isConfirmed) {
            return;
          }

          saveRes = await saveDeliveryMenuMap({
            ...savePayloadBase,
            OVERWRITE_YN: "Y",
          });
        }

        if (extractResultCode(saveRes) !== "00") {
          Swal.fire({
            title: "저장이 실패되었습니다.",
            text: extractResultName(saveRes) || "저장 중 오류가 발생했습니다.",
            confirmButtonText: "확인",
          });
          return;
        }
      }

      Swal.fire({
        title: "저장 되었습니다.",
        confirmButtonText: "확인",
      });
      await loadDeliveryMenuName();
    } catch (error) {
      Swal.fire({
        title: "저장이 실패되었습니다.",
        confirmButtonText: "확인",
      });
    } finally {
      store.state.loading = false;
    }
  });
};

/**
 *  저장 버튼 함수
 */

// options.skipConfirm: AI로 간편메뉴 추가의 최종 등록처럼 이미 확인을 받은 경우 확인창 없이 저장한다 (저장 성공 여부를 돌려줌)
const saveButton = (options = {}) => {
  if (selectedMenu.value === 4) {
    saveDeliveryMenuTab();
    return;
  }
  //comsole.log(updateRow.value);
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const saveIndices = getMenuCodeRowIndicesToSave(
    updateRow.value,
    updateDeleteInsertrowIndex.value,
    confirmData.value
  );
  const deletedCount = updateDeleteInsertrowIndex.value.deleted?.length ?? 0;
  const hasFileUploadChange = uploadImages.value.length > 0;

  if (
    saveIndices.length === 0 &&
    deletedCount === 0 &&
    !hasFileUploadChange &&
    !discountChanged.value
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const rowsToSave = saveIndices.map((index) => updateRow.value[index]);

  const updatedMissingMenuNameText = getUpdatedRowsMissingMenuNameSwalText(
    updateRow.value,
    saveIndices,
    updateDeleteInsertrowIndex.value
  );

  if (updatedMissingMenuNameText) {
    Swal.fire({
      title: "경고",
      text: updatedMissingMenuNameText,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const missingRequiredLabel = findFirstMissingMenuCodeRequiredLabel(
    rowsToSave,
    isNewAutoMenuCode.value
  );

  if (missingRequiredLabel) {
    Swal.fire({
      title: "경고",
      text: `${missingRequiredLabel} 항목이 미입력 되어 있습니다. 확인해 주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const saveMenuCodes = rowsToSave
    .map((item) => item.lngCode)
    .filter((code) => code !== "" && code !== undefined && code !== null);
  const validateRow2 = new Set(saveMenuCodes).size === saveMenuCodes.length;

  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 메뉴코드가 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 확인창 다음의 실제 저장 (기존 저장 로직 그대로). 저장에 성공하면 true
  const runSave = async () => {
    let saved = false;
      if (
        showImageGroupScopeControls.value &&
        imageScope.value === "STORE" &&
        uploadImages.value.length > 0 &&
        !getEffectiveImageStoreCode()
      ) {
        Swal.fire({
          title: "경고",
          text: "매장별 이미지 저장 시 저장 매장을 선택하세요.",
          icon: "warning",
          confirmButtonText: "확인",
        });
        return;
      }
      store.state.loading = true;
      try {
        const deletedRow = updateRow.value.filter((_, index) =>
          updateDeleteInsertrowIndex.value.deleted.includes(index)
        );
        const updatedAndInsertRow = saveIndices.map(
          (index) => updateRow.value[index]
        );

        //console.log(updatedAndInsertRow);
        //comsole.log(updateDeleteInsertrowIndex.value);
        //comsole.log(updatedAndInsertRow);
        const filterAndMap = (key, defaultValue) =>
          updatedAndInsertRow
            .map((item) => {
              const value = item[key];
              if (key === "blnSoldOutYN") {
                return normalizeSoldOutYn(value, defaultValue ?? "0");
              }
              if (
                defaultValue !== undefined &&
                (value === undefined || value === null || value === "")
              ) {
                return defaultValue;
              }
              return value;
            })
            .join("\u200B");

        const deleteCd = deletedRow.map((item) => item.lngCode);

        //comsole.log(updatedAndInsertRow);
        //comsole.log(deleteCd.join(","));
        //comsole.log(filterAndMap("lngMainGroup"));

        const res = await saveMenuCode(
          groupCd.value,
          nowStoreCd.value,
          filterAndMap("lngMainGroup"),
          filterAndMap("lngSubGroup"),
          filterAndMap("lngCode"),
          filterAndMap("dtmFromDate"),
          filterAndMap("dtmToDate"),
          filterAndMap("strName"),
          filterAndMap("strNameE"),
          filterAndMap("lngDCPrice"),
          filterAndMap("lngChain"),
          filterAndMap("lngPrice"),
          filterAndMap("blnDCPriceYN"),
          filterAndMap("lngTax"),
          filterAndMap("blnInactive"),
          filterAndMap("lngDiscount"),
          filterAndMap("intCustCount"),
          filterAndMap("blnCondimentprice"),
          filterAndMap("lngOrder"),
          filterAndMap("lngKPG"),
          filterAndMap("strBarCode"),
          filterAndMap("blnReceipt"),
          filterAndMap("lngMenuOption"),
          filterAndMap("blnFloat"),
          filterAndMap("strIcon"),
          filterAndMap("blnKitSingle"),
          filterAndMap("lngSubTitle"),
          filterAndMap("blnServing"),
          filterAndMap("blnOpen"),
          filterAndMap("blnDeliveryYN"),
          filterAndMap("blnSoldOutYN", "0"),
          filterAndMap("strNutrInfo"),
          filterAndMap("strCntryOrg"),
          filterAndMap("strMenuComment"),
          filterAndMap("strUserFileName"),
          filterAndMap("lngType"),
          filterAndMap("dtmStart"),
          filterAndMap("dtmEnd"),
          filterAndMap("lngKDS"),
          filterAndMap("strNameK"),
          filterAndMap("discountYN"),
          filterAndMap("strBigo"),
          isNewAutoMenuCode.value == true ? 1 : 0,
          deleteCd.join(",")
        );
        assertApiSuccess(res, "saveMenuCode failed");
        //console.log(res);
        //console.log(res);

        //comsole.log(updatedAndInsertRow);

        //comsole.log(uploadImages.value);
        //comsole.log(updateRow.value);

        const formData = new FormData();

        let storecode = nowStoreCd.value;
        if (
          showImageGroupScopeControls.value &&
          imageScope.value === "STORE"
        ) {
          storecode = getEffectiveImageStoreCode();
        } else if (isStoreImageFeatureEnabled.value) {
          storecode = groupCd.value;
        }

        if (groupCd.value == "1989" || groupCd.value == "1750") {
          storecode = groupCd.value;
        }

        formData.append("groupCd", groupCd.value);

        uploadImages.value.forEach((file, index) => {
          const existedName = uploadImagesCd.value[index];

          let newFileName =
            String(storecode).padStart(10, 0) +
            "_" +
            String(existedName).padStart(10, 0) +
            ".jpg";

          //console.log(newFileName);
          const newFile = new File([file], newFileName, { type: file.type });
          formData.append(`file${index}`, newFile);
        });

        if (uploadImages.value.length >= 1) {
          try {
            const res2 = await uploadFile(formData);
            // console.log(res2);
          } catch (error) {
            store.state.loading = false;
          } finally {
            store.state.loading = false;
          }
        }

        // 할인선택 변경이 있을 때만 저장
        if (discountChanged.value) {
          try {
            const res3 = await saveDiscountCode(
              groupCd.value,
              nowStoreCd.value,
              filterAndMap("lngCode"),
              filterAndMap("strAmtCodeList"),
              filterAndMap("lngPrice"),
              filterAndMap("discountYN"),
              isNewAutoMenuCode.value == true ? 1 : 0
            );
            
            // console.log(res3);
            
            // 저장 후 원본 데이터 업데이트 및 플래그 초기화
            updatedAndInsertRow.forEach((item) => {
              const menuCode = item.lngCode?.toString();
              if (menuCode) {
                originalDiscountData.value[menuCode] = item.strAmtCodeList || "";
              }
            });
            discountChanged.value = false;
          } catch (error) {
            // console.error("할인선택 저장 실패:", error);
            // 에러 발생 시에도 계속 진행
          }
        }

        // AI로 간편메뉴 추가에서 확인한 다국어: 메뉴 저장 뒤 MST44_066INS 와 같은 방식으로 저장 (없으면 아무것도 안 함)
        await saveAiMultiLangForSavedMenus(updatedAndInsertRow);

        saved = true;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
        store.state.loading = false;
      } catch (error) {
        //comsole.log(error);

        Swal.fire({
          title: "저장이 실패되었습니다.",
          text: error?.message || "",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;

        // 파일 input 리셋
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = "";
        }

        searchButton();
      }
    return saved;
  };

  if (options.skipConfirm === true) {
    return runSave();
  }
  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await runSave();
    }
  });
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  //console.log(newvalue);
  updateRow.value = newvalue;
};
const updatedList2 = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newvalue) => {
  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = clickrowData2.value.find(
        (item) => item.menuCd == newvalue[i].menuCd
      );
      findrow.checkbox = true;
    } else {
      const findrow = clickrowData2.value.find(
        (item) => item.menuCd == newvalue[i].menuCd
      );
      findrow.checkbox = false;
    }
  }
  clickrowData2.value = [...clickrowData2.value];

  const temp = ref([]);
  for (var i = 0; i < clickrowData2.value.length; i++) {
    if (clickrowData2.value[i].checkbox == true) {
      temp.value.push(clickrowData2.value[i].menuCd);
    }
  }

  const findrow = rowData.value.find(
    (item) => item.lngCode == gridvalue5.value
  );

  if (findrow) {
    findrow.checkedMenu = temp.value.join(",");
  }
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData3 = (newvalue) => {
  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = filteredrowData3.value.find(
        (item) => item.lngCode == newvalue[i].lngCode
      );
      findrow.checkbox = true;
    } else {
      const findrow = filteredrowData3.value.find(
        (item) => item.lngCode == newvalue[i].lngCode
      );
      findrow.checkbox = false;
    }
  }
  filteredrowData3.value = [...filteredrowData3.value];

  const temp = ref([]);
  for (var i = 0; i < filteredrowData3.value.length; i++) {
    if (filteredrowData3.value[i].checkbox != true) {
      temp.value.push(filteredrowData3.value[i].lngCode);
    }
  }

  const findrow = rowData.value.find(
    (item) => item.lngCode == gridvalue5.value
  );

  if (findrow) {
    findrow.unchecklngCode = temp.value.join(",");
  }
};
watch(filteredrowData3, () => {
  changeColid.value = "unchecklngCode";
  //comsole.log(filteredrowData3.value);
  const arr = filteredrowData3.value
    .filter((item) => item.checkbox != true)
    .map((item) => item.lngCode);
  //comsole.log(arr);
  changeValue2.value = arr.join(";");
  if (arr.length > 0) {
    changeNow.value = !changeNow.value;
  }
});
watch(clickrowData2, () => {
  // changeColid.value = 'checkedMenu'
  // const arr = clickrowData2.value.filter(item=> item.checkbox == true ).map(item => item.menuCd)
  // //comsole.log(arr)
  // changeValue2.value = arr.join(',')
  // if(arr.length > 0){
  // changeNow.value = !changeNow.value
  // }
});

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (e) => {
  const clickedRow = rowData.value.find(
    (item) => item.lngCode == gridvalue3.value.toString()
  );
  if (clickedRow) {
    changeRow.value = rowIndex.value;
    changeColid.value = "strAmtCodeList";

    if (e[0] == undefined || e[0] == false) {
      clickedRow.strAmtCodeList = clickedRow.strAmtCodeList
        .replace(e[1], "")
        .replace(/;;+/g, ";");
      changeValue2.value = clickedRow.strAmtCodeList
        .replace(e[1], "")
        .replace(/;;+/g, ";");
    } else {
      //comsole.log(clickedRow);
      changeValue2.value = clickedRow.strAmtCodeList
        .split(";")
        .filter((item) => item !== "")
        .filter((item) => {
          const finditem = rowData2.value.find(
            (item2) => item2.lngMenu == "0" && item2.lngCode == item
          );
          if (finditem) {
            return false;
          } else {
            return true;
          }
        })
        .concat(e[1])
        .map(Number)
        .sort((a, b) => a - b)
        .map(String)
        .join(";");
    }

    changeNow.value = !changeNow.value;
  }
};

const initFocus = ref(true);

/**
 * 페이지 로딩 시 초기화 (롤백)
 */
/**
 * 페이지 초기화
 */

const initAll = () => {
  selectedMenu.value = 1;
  clickrowData4.value = [];
  filteredrowData5.value = [];
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }

  clickrowData2.value = [];
  updateRow.value = [];
  forsearchMain.value = -1;
  forsearchSub.value = -1;
  searchWord3.value = "";
  searchWord2.value = "";
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "";
  gridvalue18.value = "";
  gridvalue19.value = "";
  gridvalue20.value = "";
  gridvalue21.value = "";
  gridvalue22.value = "";
  gridvalue23.value = "";
  gridvalue24.value = "";
  gridvalue25.value = "";
  gridvalue32.value = "";
  gridvalue33.value = "";

  gridvalue34.value = false;
  gridvalue35.value = false;
  gridvalue36.value = false;
  gridvalue37.value = false;

  gridvalue38.value = "";
  gridvalue39.value = "";
  gridvalue100.value = "";
  gridvalue40.value = "";
  gridvalue41.value = "";
  gridvalue42.value = "";
  selectedMenuCodeForDelivery.value = "";
  //initFocus.value = !initFocus.value
  fileName.value = "";
  fileSize.value = "";
  fileName2.value = "";
  imageScope.value = "COMMON";
  imageStoreCd.value = normalizeImageStoreCd(pickedStoreCd.value);

  isNewAutoMenuCode.value = false;
  isNew.value = false;
  disableMenuAuto.value = true;
  uploadImages.value = [];
  uploadImagesCd.value = [];
  // 할인선택 관련 초기화
  originalDiscountData.value = {};
  discountChanged.value = false;
};

const searchPayCd = (e) => {
  const value = e.target.value;
  searchWord2.value = value;
};
const uploadImage = ref({ name: "" });
const uploadImages = ref([]);
const uploadImagesCd = ref([]);
const fileSize = ref();
const fileName2 = ref();
const fileDownloadUrl = ref();
const randomuuid = ref();
const maxSize = 2 * 1024 * 1024;
const handleFileUpload = async (e) => {
  if (e.target.files.length == 0) {
    return;
  }
  fileSize.value = e.target.files[0].size;
  if (fileSize.value > maxSize) {
    Swal.fire({
      title: "경고",
      text: "파일 크기가 2MB를 초과합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    e.target.value = "";
    return;
  }
  fileName2.value = e.target.files[0].name;
  //console.log(fileName2.value);
  changeColid.value = "strUserFileName";
  changeValue2.value = fileName2.value;
  //comsole.log(changeValue2.value);
  changeNow.value = !changeNow.value;

  const file = e.target.files[0];
  uploadImage.value = new File([file], changeValue2.value, { type: file.type });
  
  // 같은 메뉴코드에 대한 기존 파일 제거
  const existingIndex = uploadImagesCd.value.findIndex(cd => cd === gridvalue3.value);
  if (existingIndex !== -1) {
    uploadImages.value.splice(existingIndex, 1);
    uploadImagesCd.value.splice(existingIndex, 1);
  }
  
  // 새 파일 추가
  uploadImages.value.push(uploadImage.value);
  uploadImagesCd.value.push(gridvalue3.value);
  
  // 파일 input 리셋 (같은 파일을 다시 선택할 수 있도록)
  e.target.value = "";
  //comsole.log(uploadImages.value);
};

const handleFileDelete = async () => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    Swal.fire({
      title: "경고",
      text: "공통 여부가 '매장별'일 때만 파일 삭제가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!getEffectiveImageStoreCode()) {
    Swal.fire({
      title: "경고",
      text: "저장 매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (!gridvalue3.value) {
    Swal.fire({
      title: "경고",
      text: "메뉴를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const result = await Swal.fire({
    title: "확인",
    text: "정말 삭제하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  if (!result.isConfirmed) {
    return;
  }


  if (currentImageFileName.value) {
    try {
      const deleteFormData = new FormData();
      deleteFormData.append("groupCd", groupCd.value);
      deleteFormData.append("fileName", currentImageFileName.value);
      await deleteFile(deleteFormData);
      Swal.fire({
        title: "이미지 파일을 삭제 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      Swal.fire({
        title: "오류",
        text: "파일 삭제에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      store.state.loading = false;
      return;
    } finally {
      store.state.loading = false;
    }
  }

  changeColid.value = "strUserFileName";
  changeValue2.value = "";
  changeNow.value = !changeNow.value;

  fileName.value = "";
  fileName2.value = "";
  fileSize.value = "";
  uploadImage.value = { name: "" };

  const existingIndex = uploadImagesCd.value.findIndex(
    (cd) => cd === gridvalue3.value
  );
  if (existingIndex !== -1) {
    uploadImages.value.splice(existingIndex, 1);
    uploadImagesCd.value.splice(existingIndex, 1);
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }
};

const refreshImageMeta = async () => {
  if (!gridvalue3.value || !currentImageFileName.value) {
    fileSize.value = "";
    return;
  }
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}?v=${Date.now()}`
    );
    fileSize.value = response.headers["content-length"];
  } catch (error) {
    fileSize.value = "";
  }
};

watch([imageScope, imageStoreCd], async () => {
  if (!showImageGroupScopeControls.value) {
    return;
  }
  if (selectedMenu.value !== 3) {
    return;
  }
  // 이미지 대상/저장 매장 변경 시 파일명 표시도 현재 규칙에 맞춰 동기화
  fileName2.value = currentImageFileName.value || "";
  await refreshImageMeta();
});

const downloadFile = async () => {
  ////console.log(store.state.StoreToken);
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}`,
      {
        responseType: "blob", // 응답을 Blob 형태로 받음
      }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${currentImageFileName.value}`; // 다운로드 파일명 설정
    downloadLink.click();

    // 다운로드 후 Blob URL 해제
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ////console.log(error);
    Swal.fire({
      title: "오류",
      text: "파일 다운로드 실패",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};

// const handleImageError = (e) => {
//   e.target.src = "http://211.238.145.30:8085/images/noimage2.png";
// };

const disabledKPG = ref(true);
const disableKPG = (e) => {
  const kpg = e.target.value;
  if (kpg == 1) {
    disabledKPG.value = true;
    showKPG.value = true;
  } else {
    disabledKPG.value = false;
    showKPG.value = true;
    gridvalue18.value = "1";
    changeColid.value = "lngKPG";
    changeValue2.value = "1";
    changeNow.value = !changeNow.value;
  }
};
const showKPG = ref(true);
const resetKPG = (e) => {
  if (e.target.value == "1" || e.target.value == "99") {
    showKPG.value = true;
  } else {
    showKPG.value = false;
  }
};

const showPopUp = ref(false);
const showDeliveryCopyPopUp = ref(false);
const deliveryCopyTargetStoreCd = ref("");
const deliveryCopyBaseStoreLabel = computed(() => {
  const baseStoreCd = normalizeDeliveryParam(deliveryStoreCd.value);
  if (!baseStoreCd) return "미선택";
  const hit = (imageStoreOptions.value || []).find(
    (item) => String(item.lngStoreCode) === baseStoreCd
  );
  if (!hit) return `[${baseStoreCd}]`;
  return `[${hit.lngStoreCode}] ${hit.strName}`;
});
const rowData4 = ref([]);
const rowData5 = ref([]);
/**
 * 할인설정복사 팝업
 */

const copyButton2 = async () => {
  const res = await getAmountListByMenuCode(groupCd.value, gridvalue3.value);
  rowData4.value = res.data.List;
  rowData5.value = res.data.List2;
  showPopUp.value = true;
};
/**
 * 할인설정복사 팝업 - 복사 함수
 */

const copyButton = async () => {
  if (selectedMenuCd.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "복사할 메뉴코드를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await copyMenuListByCode(
      groupCd.value,
      gridvalue3.value,
      selectedMenuCd.value.join("\u200b")
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "복사를 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: `복사에 실패하였습니다. ${res.data.RESULT_NM}`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const closePopUp = () => {
  showPopUp.value = false;
};
const openDeliveryCopyPopUp = () => {
  if (!normalizeDeliveryParam(deliveryStoreCd.value)) {
    Swal.fire({
      title: "경고",
      text: "기준 매장을 선택해야 배달메뉴복사가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!normalizeDeliveryParam(selectedMenuCodeForDelivery.value || gridvalue3.value)) {
    Swal.fire({
      title: "경고",
      text: "복사할 기준 메뉴를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deliveryCopyTargetStoreCd.value = "";
  showDeliveryCopyPopUp.value = true;
};
const closeDeliveryCopyPopUp = () => {
  showDeliveryCopyPopUp.value = false;
};
const copyDeliveryMenuToStore = async () => {
  const baseStoreCd = normalizeDeliveryParam(deliveryStoreCd.value);
  const targetStoreCd = normalizeDeliveryParam(deliveryCopyTargetStoreCd.value);
  const menuCd = normalizeDeliveryParam(selectedMenuCodeForDelivery.value || gridvalue3.value);
  const menuNm = String(gridvalue6.value ?? "").trim();

  if (!baseStoreCd) {
    Swal.fire({
      title: "경고",
      text: "기준 매장을 선택해야 배달메뉴복사가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!targetStoreCd) {
    Swal.fire({
      title: "경고",
      text: "복사할 대상 매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!menuCd) {
    Swal.fire({
      title: "경고",
      text: "기준 메뉴코드를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (baseStoreCd === targetStoreCd) {
    Swal.fire({
      title: "경고",
      text: "기준 매장과 대상 매장이 같습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const confirm = await Swal.fire({
    title: "복사",
    text: "기준 매장의 해당 메뉴에 대한 모든 배달사 설정을 대상 매장으로 복사하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "복사",
    cancelButtonText: "취소",
  });
  if (!confirm.isConfirmed) return;

  try {
    store.state.loading = true;
    const res = await copyDeliveryMenuMap({
      GROUP_CD: groupCd.value,
      BASE_STORE_CD: baseStoreCd,
      TARGET_STORE_CD: targetStoreCd,
      MENU_CD: menuCd,
      STR_NAME: menuNm,
    });

    if (res?.data?.RESULT_CD === "00") {
      Swal.fire({
        title: "성공",
        text: "복사를 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      showDeliveryCopyPopUp.value = false;
      if (targetStoreCd === normalizeDeliveryParam(deliveryStoreCd.value)) {
        await loadDeliveryMenuName();
      }
      return;
    }

    Swal.fire({
      title: "실패",
      text: `복사에 실패하였습니다. ${res?.data?.RESULT_NM ?? ""}`,
      icon: "error",
      confirmButtonText: "확인",
    });
  } catch (error) {
    Swal.fire({
      title: "실패",
      text: "복사 처리 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const searchWord5 = ref("");

const selectedMenuCd = ref([]);
/**
 * 체크된 데이터 갱신
 */

const checkedRowData5 = (e) => {
  selectedMenuCd.value = e.map((item) => item.menuCd);
};

const movePage = () => {
  if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_064INS.xml")
    ).length +
      store.state.minorCategory.filter((item) =>
        item.strUrl.includes("MIMASTER::MST44_062INS.xml")
      ).length ==
    2
  ) {
    return;
  }
  if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_064INS.xml")
    ).length > 0
  ) {
    store.state.moveOtherTab = {
      strUrl: "MIMASTER::MST44_064INS.xml",
      lngProgramID: 744064,
      strTitle: "주방출력관리",
    };
  } else if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_062INS.xml")
    ).length > 0
  ) {
    store.state.moveOtherTab = {
      strUrl: "MIMASTER::MST44_062INS.xml",
      lngProgramID: 744062,
      strTitle: "출력관리",
    };
  }
  // store.state.moveOtherTab = {
  //   strUrl: "MIMASTER::MST01_033INS.xml",
  //   lngProgramID: 73762,
  //   strTitle: "메뉴 코드 등록.",
  // };
};

const exporttoExcel = ref(false);
const documentTitle = ref("");
const defaultExportShowColumns = ["strBarCode", "strBigo"];
const exportExcelShowColumnsMain = ref([...defaultExportShowColumns]);
const exportExcelColumnHeadersMain = ref({});
const exportRestoreBackupMap = ref(null);
const exportRestoreTimer = ref(null);
const restoreExcelExportRows = () => {
  const backup = exportRestoreBackupMap.value;
  if (!backup) return;
  for (const [row, prevValues] of backup.entries()) {
    if (!row || !prevValues) continue;
    for (const [fieldName, oldValue] of Object.entries(prevValues)) {
      if (oldValue === undefined) delete row[fieldName];
      else row[fieldName] = oldValue;
    }
  }
  rowData.value = [...rowData.value];
  exportRestoreBackupMap.value = null;
  exportExcelShowColumnsMain.value = [...defaultExportShowColumns];
  exportExcelColumnHeadersMain.value = {};
  if (exportRestoreTimer.value) {
    clearTimeout(exportRestoreTimer.value);
    exportRestoreTimer.value = null;
  }
};
const onMainGridExportDone = () => {
  restoreExcelExportRows();
  store.state.loading = false;
};
const pulseGridExcelExport = async () => {
  exporttoExcel.value = false;
  await nextTick();
  exporttoExcel.value = true;
};
const resolveDeliveryMenuNameFromMapRow = (row) =>
  String(
    row?.strInfo1 ??
      row?.STRINFO1 ??
      row?.STR_INFO1 ??
      row?.strDeliveryMenuName ??
      row?.STR_DELIVERY_MENU_NAME ??
      ""
  ).trim();
const excelButton = async () => {
  try {
    // console.log("[MST01_003INS][EXCEL] click", {
    //   selectedMenu: selectedMenu.value,
    //   rowCount: Array.isArray(rowData.value) ? rowData.value.length : 0,
    //   exporttoExcelBefore: exporttoExcel.value,
    // });
    if (exportRestoreTimer.value) {
      clearTimeout(exportRestoreTimer.value);
      exportRestoreTimer.value = null;
    }

    documentTitle.value = "메뉴코드";
    exportExcelShowColumnsMain.value = [...defaultExportShowColumns];
    exportExcelColumnHeadersMain.value = {};

    // [임시 비활성화] 배달메뉴설정 탭(selectedMenu === 4) 엑셀 확장 로직
    // 검수/배포 안정화를 위해 아래 로직 전체를 막고, 초기 공통 엑셀 추출만 수행합니다.
    // if (selectedMenu.value === 4) {
    //   const exportStoreCd = normalizeDeliveryParam(deliveryStoreCd.value || nowStoreCd.value);
    //   ... 배달사별 동적 컬럼 생성/매핑/원복 로직 ...
    // }
    await pulseGridExcelExport();

    // console.log("[MST01_003INS][EXCEL] trigger sent", {
    //   exporttoExcelAfter: exporttoExcel.value,
    //   documentTitle: documentTitle.value,
    // });
  } catch (e) {
    // console.error("[MST01_003INS][EXCEL] failed", e);
    Swal.fire({
      title: "실패",
      text: "엑셀 추출 처리 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};
</script>

<style scoped>
.mst003-page {
  --mst003-label-col: 7rem;
  --mst003-item-gap: 0.75rem;
  --mst003-control-border: #cbd5e1;
  --mst003-control-focus-border: #3b82f6;
  --mst003-control-h: 1.75rem;
  --mst003-control-radius: 0.375rem;
  --mst003-cell-py: 0.125rem;
}

.mst003-search-grid {
  width: 100%;
  min-width: 0;
  --mst003-control-h: 2rem;
}

.mst003-search-grid .mst003-cell {
  max-width: 52rem;
}

.mst003-filter-stack {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mst003-item-gap);
}

/* 메뉴분류 select — 메뉴명/코드 input과 동일 높이·체감 */
.mst003-filter-stack input.mst003-control {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  box-sizing: border-box;
  padding: 0 0.5rem !important;
  font-size: 0.875rem !important;
  line-height: calc(var(--mst003-control-h) - 2px) !important;
}

.mst003-filter-stack select.mst003-control {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  box-sizing: border-box;
  padding: 0 1.75rem 0 0.5rem !important;
  font-size: 0.875rem !important;
  line-height: calc(var(--mst003-control-h) - 2px) !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.mst003-filter-stack .mst003-dual-control {
  align-items: stretch;
  min-height: var(--mst003-control-h);
}

.mst003-filter-stack .mst003-dual-control select.mst003-control {
  align-self: stretch;
}

.mst003-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--mst003-item-gap);
}

.mst003-sg-label {
  flex: 0 0 var(--mst003-label-col);
  width: var(--mst003-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.mst003-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst003-cell-field:not(.mst003-dual-control):not(.mst003-vselect-slot) > * {
  min-width: 0;
  width: 100%;
}

.mst003-control {
  box-sizing: border-box;
  height: var(--mst003-control-h);
  min-height: var(--mst003-control-h);
  max-height: var(--mst003-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--mst003-control-radius);
  border: 1px solid var(--mst003-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
}

.mst003-page select.mst003-control,
.mst003-page input.mst003-control {
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-control:focus,
.mst003-control:focus-visible {
  border-color: var(--mst003-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst003-control:disabled {
  background: #f3f4f6;
}

.mst003-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem !important;
}

.mst003-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

/* 상단 매장명: 그룹·속성·매장 = 3:4:5 */
.mst003-pick-slot :deep(> .flex > div:has(#storeGroup)) {
  flex: 3 1 0 !important;
  min-width: 0;
  width: auto !important;
}

.mst003-pick-slot :deep(#storeGroup) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.mst003-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup))) {
  flex: 4 1 0 !important;
  min-width: 0;
  width: auto !important;
}

.mst003-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)) > select) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.mst003-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)) {
  flex: 5 1 0 !important;
  min-width: 0;
  max-width: none !important;
  width: auto !important;
}

.mst003-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
  font-size: 0.875rem;
  line-height: 1;
}

.mst003-pick-slot :deep(select:focus) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-pick-slot :deep(.custom-select),
.mst003-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  border-radius: var(--mst003-control-radius) !important;
  overflow: hidden;
  border: 1px solid var(--mst003-control-border) !important;
  box-sizing: border-box;
}

.mst003-pick-slot :deep(.custom-select .vs__dropdown-toggle),
.mst003-pick-slot :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding: 0 0.375rem !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.mst003-pick-slot :deep(.pickstore-vs-shell .vs__dropdown-toggle:focus-within) {
  box-shadow: none !important;
}

.mst003-pick-slot :deep(.vs__selected-options) {
  min-height: 0 !important;
  padding: 0 !important;
}

.mst003-pick-slot :deep(.vs__selected) {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-pick-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-vselect-slot :deep(.custom-select2) {
  width: 100% !important;
  min-width: 0 !important;
  border-radius: var(--mst003-control-radius) !important;
  overflow: hidden;
}

.mst003-vselect-slot :deep(.vs__dropdown-toggle) {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-vselect-slot :deep(.vs__dropdown-toggle:focus-within) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-vselect-slot :deep(.vs__selected-options),
.mst003-vselect-slot :deep(.vs__selected),
.mst003-vselect-slot :deep(.vs__search) {
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

/* 서브타이틀 레이블 기호: 왼쪽 파란 세로 바 (PUR03_006INS .pur306-grid-title 과 동일) */
.mst003-title-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mst003-title-bar::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.mst003-detail-panel {
  /* 상세 탭 전용 — 기본 대비 약 7% 축소 */
  --mst003-detail-control-h: 1.625rem;
  --mst003-detail-font: 0.8125rem;
  --mst003-detail-row-h: 2.5rem;
  --mst003-detail-cell-py: 0.4375rem;
  --mst003-detail-scrollbar-thumb: #1e40af;
  --mst003-detail-scrollbar-thumb-hover: #1e3a8a;
  --mst003-detail-scrollbar-track: #e8eef7;
  scrollbar-width: auto;
  scrollbar-color: var(--mst003-detail-scrollbar-thumb) var(--mst003-detail-scrollbar-track);
}

.mst003-detail-panel::-webkit-scrollbar {
  width: 0.75rem;
}

.mst003-detail-panel::-webkit-scrollbar-track {
  background: var(--mst003-detail-scrollbar-track);
  border-radius: 0.375rem;
}

.mst003-detail-panel::-webkit-scrollbar-thumb {
  background: var(--mst003-detail-scrollbar-thumb);
  border-radius: 0.375rem;
  border: 2px solid var(--mst003-detail-scrollbar-track);
}

.mst003-detail-panel::-webkit-scrollbar-thumb:hover {
  background: var(--mst003-detail-scrollbar-thumb-hover);
}

.mst003-form-grid {
  display: grid;
  grid-template-columns: var(--mst003-label-col) minmax(0, 1fr) var(--mst003-label-col) minmax(
      0,
      1fr
    );
  grid-auto-rows: var(--mst003-detail-row-h, 2.5rem);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst003-detail-panel .mst003-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst003-detail-row-h);
  align-self: stretch;
}

.mst003-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst003-detail-row-h, 2rem);
  padding: var(--mst003-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst003-detail-font, 0.8125rem);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  overflow: visible;
  word-break: keep-all;
}

.mst003-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst003-form-label--with-info {
  gap: 0.375rem;
}

.mst003-info-btn {
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

.mst003-info-btn__icon {
  display: block;
  width: 100%;
  height: 100%;
}

.mst003-info-btn:hover {
  opacity: 0.8;
}

.mst003-info-tooltip-host {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.mst003-info-tooltip {
  position: absolute;
  left: 50%;
  top: calc(100% + 0.375rem);
  z-index: 30;
  width: max-content;
  max-width: 12rem;
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

.mst003-info-tooltip::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: #1e293b;
}

.mst003-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst003-detail-row-h, 2rem);
  min-width: 0;
  padding: var(--mst003-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: visible;
}

.mst003-form-value--inline {
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem 0.875rem;
}

.mst003-detail-panel .mst003-form-value--inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-value--inline input[type="radio"],
.mst003-detail-panel .mst003-form-value--inline input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  min-height: 0;
  max-height: none;
  margin: 0;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-value--inline label:has(input[type="checkbox"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.mst003-grid-void {
  min-height: var(--mst003-detail-row-h, 2.5rem) !important;
  padding: 0 !important;
  margin: 0;
  border: none !important;
  background: transparent;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
}

.mst003-field-span3 {
  grid-column: 2 / -1;
  min-width: 0;
}

.mst003-detail-panel--delivery {
  /* 왼쪽 '메뉴분류' 필터 라인과 상단 정렬 (탭 36px 기준) */
  padding-top: 1rem;
}

.mst003-form-grid--delivery-compact {
  --mst003-detail-row-h: 1.875rem;
  --mst003-detail-control-h: 1.375rem;
  --mst003-detail-cell-py: 0.1875rem;
  margin-top: 0;
}

.mst003-form-grid--delivery-compact .mst003-baemin-pair-cell {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.mst003-form-grid--delivery-compact .mst003-baemin-pair-cell .mst003-control {
  height: var(--mst003-detail-control-h);
  min-height: var(--mst003-detail-control-h);
  max-height: var(--mst003-detail-control-h);
}

.mst003-baemin-merged-label {
  grid-column: 1;
  grid-row: span 5;
  height: auto;
  min-height: 100%;
  align-self: stretch;
}

.mst003-baemin-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
  padding: 0 !important;
  min-width: 0;
}

.mst003-baemin-pair-cell {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: var(--mst003-detail-cell-py, 0.1875rem) 0.375rem;
  border-right: 1px solid #e5e7eb;
}

.mst003-baemin-pair-cell:last-child {
  border-right: none;
}

.mst003-baemin-pair-cell .mst003-control {
  width: 100%;
  max-width: 100%;
}

.mst003-inline-field {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem;
}

.mst003-inline-field__label {
  flex: 0 0 auto;
  font-size: var(--mst003-detail-font, 0.8125rem);
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.mst003-detail-panel .mst003-form-grid .mst003-control--menu-code {
  width: 7.8rem;
  max-width: 7.8rem;
  flex: 0 0 7.8rem;
  min-width: 0;
}

.mst003-detail-panel .mst003-form-grid .mst003-auto-check {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
}

.mst003-detail-panel .mst003-form-grid .mst003-auto-check input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  min-height: 0;
  max-height: none;
  margin: 0;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-grid select.mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-control,
.mst003-detail-panel .mst003-form-grid input[type="date"].mst003-control,
.mst003-detail-panel .mst003-form-grid input[type="time"].mst003-control {
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-detail-panel .mst003-form-grid .mst003-control:focus,
.mst003-detail-panel .mst003-form-grid .mst003-control:focus-visible,
.mst003-detail-panel .mst003-form-grid select.mst003-control:focus {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-detail-panel .mst003-form-grid .mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-form-value select:not(.mst003-control),
.mst003-detail-panel
  .mst003-form-grid
  .mst003-form-value
  input:not([type="radio"]):not([type="checkbox"]):not(.mst003-control),
.mst003-detail-panel .mst003-form-grid .mst003-field-span3 .mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-field-span3 select:not(.mst003-control) {
  height: var(--mst003-detail-control-h);
  min-height: var(--mst003-detail-control-h);
  max-height: var(--mst003-detail-control-h);
  font-size: var(--mst003-detail-font);
  line-height: 1.2;
}

.mst003-detail-panel .mst003-form-grid input[type="date"],
.mst003-detail-panel .mst003-form-grid input[type="time"] {
  height: var(--mst003-detail-control-h);
  min-height: var(--mst003-detail-control-h);
  max-height: var(--mst003-detail-control-h);
  font-size: var(--mst003-detail-font);
  line-height: 1.2;
}

/* 보조버튼 스타일 — 상단 button search/save/excel(메인)과 구분되는 화면 내 보조 액션 */
.mst003-sub-btn {
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

.mst003-sub-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst003-sub-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mst003-detail-panel .mst003-form-grid .mst003-sub-btn {
  font-size: var(--mst003-detail-font);
}

/* AI로 추가 버튼 — 보라색으로 강조 (크기는 옆 추가·삭제 버튼과 같음) */
.mst003-sub-btn.mst003-ai-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-color: #7c3aed;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-weight: 600;
}

.mst003-sub-btn.mst003-ai-add-btn:hover:not(:disabled) {
  border-color: #6d28d9;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
}

/* AI 메뉴 관리 버튼 강조 애니메이션: 보라색 빛 번짐 + 반짝임이 지나감 (조회 후 누를 수 있을 때만) */
.mst003-sub-btn.mst003-ai-add-btn {
  position: relative;
  overflow: hidden;
}

.mst003-sub-btn.mst003-ai-add-btn:not(:disabled) {
  animation: mst003-ai-glow 2.4s ease-in-out infinite;
}

.mst003-sub-btn.mst003-ai-add-btn:not(:disabled)::after {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  animation: mst003-ai-shine 2.4s linear infinite;
  pointer-events: none;
}

.mst003-sub-btn.mst003-ai-add-btn:not(:disabled) .mst003-ai-add-icon {
  animation: mst003-ai-bob 2.4s ease-in-out infinite;
}

@keyframes mst003-ai-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.45);
  }
  50% {
    box-shadow: 0 0 0 0.3rem rgba(139, 92, 246, 0);
  }
}

/* 쉬는 시간 없이 계속 지나가도록 한 바퀴 전체를 이동에 쓴다 */
@keyframes mst003-ai-shine {
  0% {
    left: -60%;
  }
  100% {
    left: 130%;
  }
}

@keyframes mst003-ai-bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-1px) rotate(-8deg);
  }
  75% {
    transform: translateY(-1px) rotate(8deg);
  }
}

/* 움직임 줄이기 설정을 켠 사용자에게는 애니메이션을 끈다 */
@media (prefers-reduced-motion: reduce) {
  .mst003-sub-btn.mst003-ai-add-btn:not(:disabled),
  .mst003-sub-btn.mst003-ai-add-btn:not(:disabled) .mst003-ai-add-icon,
  .mst003-sub-btn.mst003-ai-add-btn:not(:disabled)::after {
    animation: none;
  }
}

.mst003-ai-add-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

/* AI 대화 팝업 테스트 모드 안내 */
.mst003-ai-test {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b45309;
}

/* AI 대화 팝업 (Teleport to body) */
.mst003-chat-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.45);
}

.mst003-chat-popup {
  /* 위치는 스크립트(left/top), 크기는 오른쪽 아래 모서리로 조정 */
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: min(60rem, calc(100vw - 2rem));
  height: min(50rem, calc(100vh - 2rem));
  min-width: 26rem;
  min-height: 24rem;
  max-width: 100vw;
  max-height: 100vh;
  resize: both;
  overflow: hidden;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
}

.mst003-chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: move;
  user-select: none;
  touch-action: none;
}

.mst003-chat-head button {
  cursor: pointer;
}

.mst003-chat-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

/* 팝업 제목 옆 처리 중인 매장명 (메뉴 개별 설정 브랜드) */
.mst003-chat-store {
  margin-left: 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #6d28d9;
}

.mst003-chat-log {
  flex: 1 1 0;
  min-height: 12rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #f8fafc;
}

/* 말풍선: AI는 왼쪽(로봇 얼굴 + 꼬리), 사용자는 오른쪽(꼬리) */
.mst003-chat-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 85%;
}

.mst003-chat-row--ai {
  align-self: flex-start;
}

.mst003-chat-row--user {
  align-self: flex-end;
}

.mst003-chat-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
}

.mst003-chat-avatar svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* 로봇 움직임: 평소에는 천천히 끄덕이며 눈을 깜빡이고, 답변 작성 중에는 빠르게 통통 튄다 */
.mst003-chat-avatar {
  animation: mst003-robot-bob 2.4s ease-in-out infinite;
}

.mst003-chat-avatar--typing {
  animation: mst003-robot-hop 0.6s ease-in-out infinite;
}

.mst003-robot-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: mst003-robot-blink 3.2s ease-in-out infinite;
}

@keyframes mst003-robot-bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(-6deg);
  }
}

@keyframes mst003-robot-hop {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes mst003-robot-blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }
  96% {
    transform: scaleY(0.1);
  }
}

.mst003-chat-bubble {
  position: relative;
  min-width: 0;
  padding: 0.55rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.mst003-chat-row--ai .mst003-chat-bubble {
  background: #fff;
  border: 1px solid #ddd6fe;
  border-bottom-left-radius: 0.25rem;
  color: #1e293b;
}

.mst003-chat-row--user .mst003-chat-bubble {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-bottom-right-radius: 0.25rem;
  color: #fff;
}

/* 조정한 이미지 미리보기 (실제 등록 크기 220×160 그대로) */
.mst003-chat-img {
  display: block;
  width: 220px;
  height: 160px;
  margin-top: 0.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #fff;
}

.mst003-chat-img-wrap {
  position: relative;
  width: 220px;
}

.mst003-chat-img {
  cursor: zoom-in;
}

.mst003-chat-img-zoom {
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.65);
  color: #fff;
  font-size: 0.75rem;
}

.mst003-chat-img-zoom svg {
  width: 0.9rem;
  height: 0.9rem;
}

/* 확대 보기 (AI 대화 팝업 위) */
.mst003-zoom-mask {
  position: fixed;
  inset: 0;
  z-index: 10060;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.7);
  cursor: zoom-out;
}

.mst003-zoom-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.mst003-zoom-img {
  width: min(660px, 90vw);
  height: auto;
  aspect-ratio: 220 / 160;
  border-radius: 0.375rem;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.mst003-zoom-caption {
  font-size: 0.8125rem;
  color: #e2e8f0;
}

.mst003-chat-confirm-btns {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

/* 메뉴키: 매장 체크박스·매장별 화면 라디오 */
.mst003-chat-check-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.15rem 0.75rem;
  max-height: 12rem;
  overflow-y: auto;
  margin-top: 0.3rem;
}

.mst003-chat-key-store {
  margin-top: 0.4rem;
  padding-top: 0.3rem;
  border-top: 1px dashed #ddd6fe;
}

.mst003-chat-key-store-name {
  font-weight: 700;
  color: #4c1d95;
}

/* 최종 확인 표 */
.mst003-chat-summary th {
  width: 5rem;
}

/* 최종 확인 표 항목별 「수정」 버튼 */
.mst003-chat-lang td.mst003-summary-edit {
  width: 3.5rem;
  padding: 0.1rem 0.4rem;
  text-align: center;
}

.mst003-summary-edit-btn {
  padding: 0.05rem 0.5rem;
  border: 1px solid #c4b5fd;
  border-radius: 0.25rem;
  background: #f5f3ff;
  color: #6d28d9;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.mst003-summary-edit-btn:hover:not(:disabled) {
  background: #ede9fe;
}

.mst003-summary-edit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 최종 확인: AI 주의 문구(빨강)와 최종 등록 버튼(빨강) */
.mst003-ai-caution {
  margin-top: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #dc2626;
}

.pnc-sub-btn.mst003-final-btn {
  color: #fff;
  border-color: #dc2626;
  background-color: #dc2626;
}

.pnc-sub-btn.mst003-final-btn:hover:not(:disabled) {
  border-color: #b91c1c;
  background-color: #b91c1c;
}

/* AI 메뉴 도우미 시작 안내의 입력 예시 */
.mst003-chat-examples-title {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #7c3aed; /* AI 봇 아이콘 색 */
}

.mst003-chat-examples {
  margin-top: 0.15rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.mst003-chat-examples li {
  line-height: 1.5;
}

.mst003-chat-examples-label {
  display: inline-block;
  min-width: 4.5rem;
  font-weight: 600;
  color: #4b5563;
}

/* AI 메뉴 조회 결과 표 (행을 누르면 메뉴 목록에서 이동) */
.mst003-chat-result-wrap {
  max-height: 16rem;
  overflow-y: auto;
}

.mst003-chat-result th {
  width: auto;
  white-space: nowrap;
}

.mst003-chat-result-row {
  cursor: pointer;
}

.mst003-chat-result-row:hover td {
  background: #f5f3ff;
}

/* 다국어 제안 표 */
.mst003-chat-lang {
  margin-top: 0.4rem;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.mst003-chat-lang th,
.mst003-chat-lang td {
  padding: 0.2rem 0.6rem;
  border: 1px solid #e2e8f0;
  text-align: left;
  white-space: normal;
}

.mst003-chat-lang th {
  width: 4.5rem;
  background: #f5f3ff;
  font-weight: 600;
  color: #4c1d95;
}

/* AI 말풍선 안 입력 항목 이름 강조 */
.mst003-chat-key {
  color: #dc2626;
  font-weight: 700;
}

/* 말풍선 꼬리 */
.mst003-chat-bubble::after {
  content: "";
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 0;
  border-style: solid;
}

.mst003-chat-row--ai .mst003-chat-bubble::after {
  left: -0.45rem;
  border-width: 0 0 0.6rem 0.6rem;
  border-color: transparent transparent #ddd6fe transparent;
}

.mst003-chat-row--user .mst003-chat-bubble::after {
  right: -0.45rem;
  border-width: 0 0.6rem 0.6rem 0;
  border-color: transparent transparent #6366f1 transparent;
}

.mst003-chat-empty {
  font-size: 0.8125rem;
  color: #64748b;
}

/* 말풍선 안 대분류·소분류 라디오 (세로 배열) */

.mst003-chat-choice {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0;
  white-space: normal;
  cursor: pointer;
}

/* 질문 말풍선 안의 라디오 선택지: 질문 아래 점선으로 구분 */
.mst003-chat-choices-inline {
  margin-top: 0.4rem;
  padding-top: 0.3rem;
  border-top: 1px dashed #ddd6fe;
  white-space: normal;
}

.mst003-chat-choice:hover {
  color: #6d28d9;
}

/* 등록할 메뉴 표: 대화창보다 넉넉하게 (대화창은 남는 높이를 씀) */
/* 등록할 메뉴: 한 번에 하나씩 등록하므로 머리줄 + 한 줄 높이에 맞춤 (남는 높이는 대화창으로) */
.mst003-chat-items {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  min-width: 0;
}

.mst003-chat-items-title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  padding-bottom: 0.25rem;
}

.mst003-chat-items-hint {
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
}

.mst003-chat-table {
  flex: 0 0 auto;
  max-height: 6rem;
  overflow: auto;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}

.mst003-chat-tbl {
  width: 100%;
  min-width: 34rem;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.mst003-chat-tbl th,
.mst003-chat-tbl td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.mst003-chat-tbl thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f1f5f9;
  font-weight: 600;
  color: #334155;
  text-align: left;
}

.mst003-chat-tbl thead th.text-right {
  text-align: right;
}

.mst003-chat-tbl thead th.text-center {
  text-align: center;
}
.mst003-col-name {
  width: 28%;
}
.mst003-col-price {
  width: 14%;
}
.mst003-col-group {
  width: 18%;
}
.mst003-col-code {
  width: 12%;
}
.mst003-col-state {
  width: 10%;
}

.mst003-chat-input {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  min-width: 0;
}

/* 보내기 버튼: 입력창과 같은 높이 (공통 버튼의 고정 높이 2rem 대신 입력창 높이에 맞춤) */
.pnc-sub-btn.mst003-chat-send {
  align-self: stretch;
  height: auto;
}

/* AI 이용 안내: 입력창 아래 작은 회색 글씨 */
.mst003-chat-notice {
  flex-shrink: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: #9ca3af;
  text-align: center;
}

.mst003-chat-textarea {
  flex: 1 1 0;
  min-width: 0;
  resize: none;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
}
</style>

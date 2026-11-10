<!--
  모바일 초간단 메뉴등록 (전체 화면 대화창)
  웹 메뉴코드등록(MST01_003INS) 초간단 메뉴등록과 같은 순서·기본값으로 등록한다.
  '메뉴명 판매가' 한 줄 → AI가 메뉴명·판매가·소분류를 고름(quickMenu) → 메뉴코드 자동(getMenuCodeSuggestion)
  → 저장(saveMenuCode, 할인 0·주방출력 1) → 변경 로그(writeMenuChangeLog) → 메뉴키 자동 배치 여부(getMenuKeyTarget·appendMenuKeys)
-->
<template>
  <Teleport to="body">
    <div class="mq-sheet" role="dialog" aria-modal="true">
      <div class="mq-head">
        <span class="mq-head-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M13.2 2.5 5.6 13.1c-.3.4 0 1 .5 1h4.6l-1.3 7.2c-.1.6.6.9 1 .4l7.6-10.6c.3-.4 0-1-.5-1h-4.6l1.3-7.2c.1-.6-.6-.9-1-.4Z"
              fill="currentColor" />
          </svg>
        </span>
        <div class="mq-head-text">
          <div class="mq-title">초간단 메뉴등록</div>
          <div class="mq-store">{{ storeName }}</div>
        </div>
        <!-- 스피커: 켜져 있으면 안내·결과를 소리로 읽어 준다 (휴대폰 무음 여부는 브라우저가 알 수 없어 직접 켜고 끈다) -->
        <button
          v-if="ttsSupported"
          type="button"
          class="mq-speaker"
          :class="{ 'is-on': speakerOn }"
          :aria-label="speakerOn ? '소리 안내 끄기' : '소리 안내 켜기'"
          @click="toggleSpeaker">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
            <template v-if="speakerOn">
              <path d="M15.5 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </template>
            <path v-else d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <button type="button" class="mq-close" :disabled="loading" @click="close" aria-label="닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div v-if="testMode" class="mq-test">테스트 모드: AI를 호출하지 않은 고정 예시 응답입니다.</div>

      <div ref="logRef" class="mq-log">
        <div class="mq-guide">
          <div class="mq-guide-title">메뉴명과 판매가만 입력하시면 바로 등록해 드립니다.</div>
          <div class="mq-guide-example">예: 레몬에이드 4500</div>
          <ul>
            <li v-for="g in GUIDE_LINES" :key="g.label">
              <span class="mq-guide-label">{{ g.label }}</span>
              <span class="mq-guide-text">{{ g.text }}</span>
            </li>
          </ul>
        </div>

        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="mq-row"
          :class="msg.role === 'user' ? 'is-user' : 'is-ai'">
          <div class="mq-bubble" :class="{ 'is-done': msg.done }">
            <div v-if="msg.done" class="mq-done">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              등록 완료
            </div>
            <div class="mq-text">{{ msg.content }}</div>
            <div v-if="msg.keyAsk" class="mq-actions">
              <button
                type="button"
                class="mq-btn is-primary"
                :disabled="step !== 'keyAsk' || loading || msg.seq !== seq"
                @click="answerKey(true)">
                예, 배치
              </button>
              <button
                type="button"
                class="mq-btn"
                :disabled="step !== 'keyAsk' || loading || msg.seq !== seq"
                @click="answerKey(false)">
                아니오
              </button>
            </div>
            <div v-if="msg.keyStores" class="mq-stores">
              <label v-for="s in keyStores" :key="s.code" class="mq-store-item">
                <input
                  v-model="keyChecked"
                  type="checkbox"
                  :value="s.code"
                  :disabled="step !== 'keyStores' || loading || msg.seq !== seq" />
                <span>{{ s.name }}</span>
              </label>
              <div class="mq-actions">
                <button
                  type="button"
                  class="mq-btn is-primary"
                  :disabled="step !== 'keyStores' || loading || msg.seq !== seq || keyChecked.length === 0"
                  @click="confirmKeyStores">
                  배치
                </button>
                <button
                  type="button"
                  class="mq-btn"
                  :disabled="step !== 'keyStores' || loading || msg.seq !== seq"
                  @click="answerKey(false)">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="mq-row is-ai">
          <div class="mq-bubble mq-typing"><span></span><span></span><span></span></div>
        </div>
      </div>

      <!-- 음성 입력 흐름: 안내(스피커가 말하는 중) → 입력 대기(마이크 켜짐, 소리 막대 움직임). 누르면 멈춘다 -->
      <div v-if="voiceStep !== ''" class="mq-listening" :class="'is-' + voiceStep" @click="stopListening">
        <span class="mq-voice-visual" aria-hidden="true">
          <span class="mq-voice-ring"></span>
          <span class="mq-voice-circle">
            <svg v-if="voiceStep === 'prompt'" viewBox="0 0 24 24" focusable="false">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
              <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" focusable="false">
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
            </svg>
          </span>
        </span>
        <span class="mq-voice-bars" aria-hidden="true">
          <span v-for="n in 7" :key="n" :style="{ animationDelay: n * 0.09 + 's' }"></span>
        </span>
        <span class="mq-listening-state">{{ voiceStep === "prompt" ? "안내하고 있습니다" : "마이크가 켜졌습니다 · 듣고 있습니다" }}</span>
        <span class="mq-listening-title">{{ voicePrompt.title }}</span>
        <span class="mq-listening-sub">{{ voicePrompt.example }} · 화면을 누르면 멈춥니다</span>
        <span v-if="text" class="mq-listening-heard">{{ text }}</span>
      </div>
      <form class="mq-input" @submit.prevent="send">
        <!-- 음성 입력: 브라우저가 음성 인식을 지원할 때만 보인다. 말한 내용은 입력칸에만 넣고, 등록은 보내기를 눌러야 한다 -->
        <button
          v-if="speechSupported"
          type="button"
          class="mq-mic"
          :class="{ 'is-on': listening }"
          :disabled="loading"
          :aria-label="listening ? '음성 입력 멈추기' : '음성으로 입력'"
          @click="toggleListening">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
          </svg>
        </button>
        <!-- v-model 은 한글 조합 중인 글자를 늦게 넘겨 보내기 버튼이 꺼져 있거나 마지막 글자가 빠지므로 input 이벤트로 바로 반영 -->
        <input
          ref="inputRef"
          :value="text"
          @input="text = $event.target.value"
          type="text"
          enterkeyhint="send"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :readonly="loading"
          @focus="onInputFocus"
          @blur="onInputBlur"
          placeholder="예: 레몬에이드 4500" />
        <!-- 처리 중에도 입력창 포커스(키보드)를 유지: 잠그지 않고 읽기 전용.
             보내기 버튼은 누르면 입력창 커서가 빠지게 둔다 — 그래야 한글 조합 중인 마지막 글자가 확정된 뒤 보내진다 -->
        <button
          type="submit"
          class="mq-send"
          :disabled="loading || text.trim() === ''"
          aria-label="보내기">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
import {
  appendMenuKeys,
  getMenuCodeSuggestion,
  getMenuKeyTarget,
  quickMenu,
  writeMenuChangeLog,
} from "@/api/master";
import { newMenuRow, saveMenuRow } from "./mobileMenuSave";
import { computed, defineEmits, defineProps, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  groupCd: { type: [String, Number], required: true },
  // 메뉴를 저장하는 매장코드 (공통 메뉴는 0)
  storeCd: { type: [String, Number], required: true },
  storeName: { type: String, default: "" },
  // getMenuList 의 menuGroup / submenuGroup
  mainGroups: { type: Array, default: () => [] },
  subGroups: { type: Array, default: () => [] },
  // 지금 매장 메뉴 목록 (메뉴코드 중복 확인 보조)
  menuRows: { type: Array, default: () => [] },
  // 메뉴키 배치 가능 매장 [{ code, name }]
  keyStoreList: { type: Array, default: () => [] },
});
const emit = defineEmits(["close", "registered"]);

const GUIDE_LINES = [
  { label: "분류", text: "메뉴명으로 알맞은 소분류를 찾아 넣습니다. 못 찾으면 가장 작은 소분류 코드에 넣습니다." },
  { label: "메뉴코드", text: "자동 생성됩니다." },
  { label: "기본값", text: "할인 0(나중에 설정), 주방출력 1(기본 출력)" },
  { label: "메뉴키", text: "등록 후 메뉴키 자동 배치 여부를 묻습니다." },
  { label: "주의", text: "입력하시면 바로 등록됩니다. 등록 후 메뉴 정보를 꼭 확인해 주세요." },
];
const KEY_RESULT_TEXT = {
  OK: "추가",
  EXISTS: "이미 있음",
  NOSCREEN: "화면 없음",
  FULL: "화면이 가득 참",
  NOPOS: "포스 없음",
  ERROR: "오류",
};
const YES_RE = /^(예|네|응|좋아|확인|배치|그래|ㅇㅇ|ok|yes)/i;
const NO_RE = /^(아니|아뇨|괜찮|필요\s*없|안\s*해|no)/i;

const messages = ref([]);
const text = ref("");
const loading = ref(false);
const testMode = ref(false);
// input 메뉴 입력 / keyAsk 메뉴키 배치 여부 / keyStores 메뉴키 매장 선택(공통 메뉴)
const step = ref("input");
// 버튼이 있는 말풍선 번호: 가장 최근 것만 누를 수 있다
const seq = ref(0);
// 방금 등록한 메뉴 { code, name, main, sub }
const last = ref(null);
const keyStores = ref([]);
const keyChecked = ref([]);
const logRef = ref(null);
const inputRef = ref(null);
// 등록은 했지만 아직 남기지 않은 신규 등록 로그 { code, remark } — 메뉴키 배치 결과를 비고에 붙여 한 번에 남긴다
let pendingLog = null;

const push = (role, content, extra = {}) => {
  messages.value.push({ role, content, ...extra });
  if (role === "assistant") speakAssistant(content, extra);
  scrollLog();
};
const scrollLog = async () => {
  await nextTick();
  if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight;
};
// 휴대폰은 입력창에 커서를 주면 키보드가 올라와 화면을 가리므로, 사용자가 입력 중일 때(입력창에 커서가 있을 때)만
// 처리 뒤 입력창을 유지한다. 창을 열 때·버튼을 누른 뒤에는 키보드를 올리지 않는다
let typing = false;
const onInputFocus = () => {
  typing = true;
};
const onInputBlur = () => {
  typing = false;
};
const focusInput = async () => {
  await nextTick();
  if (typing && inputRef.value && document.activeElement !== inputRef.value) inputRef.value.focus();
};
const formatPrice = (price) => String(price ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const writeLog = async (action, menuCode, remark) => {
  try {
    await writeMenuChangeLog(props.groupCd, props.storeCd, action, String(menuCode), "", remark);
  } catch (error) {
    // 로그 기록 실패는 등록 결과에 영향 없음
  }
};
const flushLog = async (keyText) => {
  const pending = pendingLog;
  if (!pending) return;
  pendingLog = null;
  await writeLog("INSERT", pending.code, [pending.remark, keyText].filter((t) => t).join(" · "));
};

const close = () => {
  if (loading.value) return;
  flushLog("메뉴키 배치 답변 전 닫음");
  emit("close");
};
onBeforeUnmount(() => {
  stopListening();
  if (ttsSupported) window.speechSynthesis.cancel();
  flushLog("메뉴키 배치 답변 전 화면 이동");
});

/* ---------- 소리 안내 (브라우저 speechSynthesis) ---------- */
// 휴대폰 무음·볼륨 상태는 브라우저가 알 수 없으므로 머리줄 스피커 버튼으로 켜고 끈다 (기본 켜짐, 이 휴대폰에 기억)
const SPEAKER_KEY = "mobileQuickMenu.speaker";
const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;
const readSpeaker = () => {
  try {
    return localStorage.getItem(SPEAKER_KEY) !== "off";
  } catch (error) {
    return true;
  }
};
const speakerOn = ref(ttsSupported && readSpeaker());
const toggleSpeaker = () => {
  speakerOn.value = !speakerOn.value;
  try {
    localStorage.setItem(SPEAKER_KEY, speakerOn.value ? "on" : "off");
  } catch (error) {
    // 기억하지 못해도 이번에는 적용
  }
  if (!speakerOn.value && ttsSupported) window.speechSynthesis.cancel();
};
// 소리로 읽기. 끝나면 onEnd (스피커가 꺼져 있거나 지원하지 않으면 바로 onEnd)
const speak = (message, onEnd) => {
  const text = String(message || "").trim();
  if (!ttsSupported || !speakerOn.value || !text) {
    if (onEnd) onEnd();
    return;
  }
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (onEnd) onEnd();
  };
  try {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR";
    utter.rate = 1.05;
    utter.onend = finish;
    utter.onerror = finish;
    window.speechSynthesis.speak(utter);
    // 일부 브라우저는 onend 를 주지 않으므로 글자 수만큼 기다린 뒤 다음으로 넘어간다
    if (onEnd) setTimeout(finish, Math.min(8000, 1200 + text.length * 180));
  } catch (error) {
    finish();
  }
};
// 결과 안내 중 소리로 읽을 것: 등록 완료(첫 줄), 메뉴키 질문
const speakAssistant = (content, extra) => {
  if (!extra.done && !extra.keyAsk) return;
  speak(String(content || "").split("\n")[0]);
};

/* ---------- 음성 입력 (브라우저 Web Speech API, 한국어) ---------- */
// 휴대폰 Chrome·Safari 는 지원, 앱 안 WebView 는 대부분 지원하지 않는다 → 지원할 때만 마이크 버튼을 보인다
// 흐름: 마이크 버튼 → 입력창 비움 → (스피커 켜짐) 지금 단계에 맞는 안내 → 마이크 켜짐(입력 대기) → 말한 내용을 입력칸에 넣음
// 메뉴키 배치 질문 중이면 '예/아니오' 를 듣고 바로 답한다
const voicePrompt = computed(() =>
  step.value === "keyAsk"
    ? { title: "메뉴키를 배치할까요? 예 또는 아니오로 말씀해 주세요.", example: '예: "예" / "아니오"' }
    : { title: "메뉴명과 가격을 말씀해주세요.", example: '예: "레몬에이드 4500원"' }
);
const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const speechSupported = !!SpeechRecognitionCtor;
const voiceStep = ref(""); // '' 꺼짐 / prompt 안내 중 / listen 입력 대기
const listening = computed(() => voiceStep.value !== "");
let recognition = null;
const stopListening = () => {
  if (voiceStep.value === "prompt" && ttsSupported) window.speechSynthesis.cancel();
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      // 이미 멈춤
    }
  }
  voiceStep.value = "";
};
const startRecognition = () => {
  if (voiceStep.value === "") return; // 안내 중에 멈춘 경우
  recognition = new SpeechRecognitionCtor();
  recognition.lang = "ko-KR";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  let finalSaid = "";
  recognition.onresult = (event) => {
    // 멈춘 뒤 늦게 들어온 결과는 버린다
    if (voiceStep.value === "") return;
    let said = "";
    let isFinal = false;
    for (let i = 0; i < event.results.length; i++) {
      said += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    text.value = said.trim();
    if (isFinal) finalSaid = said.trim();
  };
  recognition.onerror = (event) => {
    voiceStep.value = "";
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      push("assistant", "마이크를 켜지 못했습니다. 브라우저의 마이크 권한을 허용하시거나, 마이크 버튼을 한 번 더 눌러 주세요. 키보드의 마이크 버튼으로도 말할 수 있습니다.");
    } else if (event.error === "no-speech") {
      push("assistant", "말소리가 들리지 않았습니다. 마이크 버튼을 다시 누르고 말씀해 주세요.");
    }
  };
  recognition.onend = () => {
    voiceStep.value = "";
    // 메뉴키 배치 질문에 '예/아니오' 로 답했으면 바로 처리한다 (메뉴명·가격은 확인 후 보내기를 눌러 등록)
    if (step.value === "keyAsk" && finalSaid && (YES_RE.test(finalSaid) || NO_RE.test(finalSaid))) {
      text.value = "";
      answerKey(YES_RE.test(finalSaid));
      return;
    }
    focusInput();
  };
  try {
    recognition.start();
    voiceStep.value = "listen";
  } catch (error) {
    voiceStep.value = "";
  }
};
const toggleListening = () => {
  if (!speechSupported || loading.value) return;
  if (voiceStep.value !== "") {
    stopListening();
    return;
  }
  // 매장 선택 단계는 화면에서 고른다 (음성 입력 안 함)
  if (step.value === "keyStores") {
    push("assistant", "메뉴키를 배치할 매장은 위에서 선택한 뒤 「배치」를 눌러 주세요.");
    return;
  }
  // 새로 말하므로 입력창에 있던 글은 지운다
  text.value = "";
  voiceStep.value = "prompt";
  if (ttsSupported) window.speechSynthesis.cancel();
  speak(voicePrompt.value.title, startRecognition);
};

/* ---------- 메뉴코드 자동 생성 (웹 fetchMenuCodeSuggestion 과 같은 규칙) ---------- */
const usedCodes = () =>
  new Set(
    (props.menuRows || [])
      .map((r) => String(r.lngCode ?? ""))
      .filter((c) => c !== "" && c !== "undefined")
  );
const findFreeCode = (start, used) => {
  let next = Math.max(start, 1000);
  while (next <= 999999999 && used.has(String(next))) next++;
  return next <= 999999999 ? String(next) : "";
};
// 화면 목록 기준: 같은 분류 4~9자리 코드 중 가장 큰 번호 + 1
const localSuggest = (item, used) => {
  const codes = (props.menuRows || [])
    .filter((r) => String(r.lngMainGroup) === item.main && String(r.lngSubGroup) === item.sub)
    .map((r) => String(r.lngCode ?? ""))
    .filter((c) => /^\d{4,9}$/.test(c))
    .map(Number);
  if (codes.length === 0) return "";
  return findFreeCode(Math.max(...codes) + 1, used);
};
// DB 기준 제안·중복 확인 (프로시저 오류면 화면 목록 기준)
const suggestByGroup = async (item, inputCode) => {
  try {
    const res = await getMenuCodeSuggestion(props.groupCd, props.storeCd, item.main, item.sub, inputCode);
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    const row = (res.data.List || [])[0] || {};
    return {
      code: row.SUGGEST_CODE || "",
      inputUsed: inputCode ? String(row.INPUT_USED) === "1" : false,
    };
  } catch (error) {
    const used = usedCodes();
    if (inputCode) {
      const inputUsed = used.has(inputCode);
      return { code: inputUsed ? findFreeCode(Number(inputCode) + 1, used) : inputCode, inputUsed };
    }
    return { code: localSuggest(item, used), inputUsed: false };
  }
};
const SIX_MIN = 100000;
const SIX_MAX = 999999;
const suggestSixDigit = async (item) => {
  const used = usedCodes();
  const groupSix = (props.menuRows || [])
    .filter((r) => String(r.lngMainGroup) === item.main && String(r.lngSubGroup) === item.sub)
    .map((r) => String(r.lngCode ?? ""))
    .filter((c) => /^\d{6}$/.test(c))
    .map(Number);
  const nextFreeSix = (start) => {
    for (let n = Math.max(start, SIX_MIN); n <= SIX_MAX; n++) if (!used.has(String(n))) return n;
    for (let n = SIX_MIN; n < start && n <= SIX_MAX; n++) if (!used.has(String(n))) return n;
    return 0;
  };
  let candidate = nextFreeSix(groupSix.length > 0 ? Math.max(...groupSix) + 1 : SIX_MIN);
  for (let i = 0; candidate && i < 20; i++) {
    const checked = await suggestByGroup(item, String(candidate));
    if (!checked.inputUsed) return String(candidate);
    used.add(String(candidate));
    candidate = nextFreeSix(candidate + 1);
  }
  return "";
};
// 분류 기준 → 대분류+소분류+10 → 9자리를 넘으면 6자리 빈 번호
const suggestCode = async (item) => {
  const first = await suggestByGroup(item, "");
  if (first.code) return first.code;
  const base = `${item.main}${item.sub}10`;
  if (/^\d{4,9}$/.test(base)) {
    const checked = await suggestByGroup(item, base);
    const code = checked.inputUsed ? checked.code : base;
    if (code) return code;
  }
  return suggestSixDigit(item);
};

/* ---------- 저장 (웹 addRow 기본값 + 초간단 값, saveMenuCode 1건) ---------- */
const saveNewMenu = (item) =>
  saveMenuRow(
    props.groupCd,
    props.storeCd,
    newMenuRow({
      lngMainGroup: item.main,
      lngSubGroup: item.sub,
      lngCode: item.code,
      strName: item.name,
      lngPrice: item.price,
    })
  );

const buildGroupList = () =>
  JSON.stringify({
    main: (props.mainGroups || []).map((i) => ({ code: String(i.GroupCd), name: i.majorGroupNm })),
    sub: (props.subGroups || []).map((i) => ({
      mainCode: String(i.sublngMajor),
      code: String(i.GroupCd),
      name: i.subGroupNm,
    })),
  });
const findSmallestSubGroup = () =>
  [...(props.subGroups || [])].sort(
    (a, b) => Number(a.GroupCd) - Number(b.GroupCd) || Number(a.sublngMajor) - Number(b.sublngMajor)
  )[0] || null;

const send = async () => {
  const input = text.value.trim();
  if (input === "" || loading.value) return;
  // 마이크가 듣는 중이면 멈춘다 (보낸 뒤 늦게 들어온 음성 결과가 입력창을 다시 채우지 않게)
  if (voiceStep.value !== "") stopListening();
  if (step.value === "keyAsk") {
    if (YES_RE.test(input)) {
      text.value = "";
      answerKey(true);
      return;
    }
    if (NO_RE.test(input)) {
      text.value = "";
      answerKey(false);
      return;
    }
    // 그 밖의 말은 다음 메뉴 등록으로 본다 (메뉴키는 배치하지 않음)
  }
  await flushLog("메뉴키 배치 안 함(다음 메뉴 입력)");
  text.value = "";
  step.value = "input";
  push("user", input);
  loading.value = true;
  try {
    const res = await quickMenu(props.groupCd, props.storeCd, input, buildGroupList());
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    testMode.value = res.data.RESULT_NM === "TEST_MODE";
    if (res.data.OK !== "Y") {
      push("assistant", res.data.REPLY || "메뉴명과 판매가를 함께 입력해 주세요. 예: 레몬에이드 4500");
      return;
    }
    const name = String(res.data.STR_NAME || "").trim();
    const price = String(res.data.PRICE || "").replace(/[^0-9]/g, "");
    if (!name || !price || price === "0") {
      push("assistant", "메뉴명과 판매가를 함께 입력해 주세요. 예: 레몬에이드 4500");
      return;
    }
    // 분류: AI가 고른 소분류가 목록에 있으면 그대로, 없으면 가장 작은 소분류 코드
    let subItem = (props.subGroups || []).find(
      (i) =>
        String(i.GroupCd) === String(res.data.SUB_GROUP || "") &&
        (!res.data.MAIN_GROUP || String(i.sublngMajor) === String(res.data.MAIN_GROUP))
    );
    const byName = !!subItem;
    if (!subItem) subItem = findSmallestSubGroup();
    if (!subItem) {
      push("assistant", "이 매장에는 등록된 소분류가 없어 메뉴를 등록할 수 없습니다. 웹에서 대분류·소분류를 먼저 등록해 주세요.");
      return;
    }
    const mainItem = (props.mainGroups || []).find((i) => String(i.GroupCd) === String(subItem.sublngMajor));
    const item = {
      name,
      price,
      main: String(subItem.sublngMajor),
      sub: String(subItem.GroupCd),
      code: "",
    };
    item.code = await suggestCode(item);
    if (!/^\d{4,9}$/.test(item.code || "")) {
      push("assistant", "비어 있는 메뉴코드를 찾지 못해 등록하지 못했습니다. 웹 메뉴코드등록에서 직접 등록해 주세요.");
      return;
    }
    await saveNewMenu(item);
    pendingLog = { code: item.code, remark: "초간단 메뉴등록(모바일)" };
    last.value = { code: item.code, name, main: item.main, sub: item.sub };
    emit("registered", item.code);
    push(
      "assistant",
      `'${name}'(${formatPrice(price)}원) 메뉴 등록이 완료되었습니다.\n` +
        `· 메뉴코드: ${item.code}\n` +
        `· 분류: ${mainItem?.majorGroupNm || item.main} > ${subItem.subGroupNm || item.sub} (${
          byName ? "메뉴명으로 찾은 분류입니다" : "알맞은 분류를 찾지 못해 가장 작은 소분류 코드에 넣었습니다"
        })\n` +
        "· 할인 0(나중에 설정)\n" +
        "· 주방출력 1(기본 출력)\n" +
        "분류가 맞지 않으면 웹 메뉴코드등록에서 바꿔 주세요.",
      { done: true }
    );
    push("assistant", "메뉴키도 자동으로 배치해 드릴까요?", { keyAsk: true, seq: ++seq.value });
    step.value = "keyAsk";
  } catch (error) {
    push("assistant", `처리하지 못했습니다. (${error.message || "오류"}) 잠시 후 다시 시도해 주세요.`);
  } finally {
    loading.value = false;
    scrollLog();
    focusInput();
  }
};

// 메뉴키 배치 여부 답변
const answerKey = (yes) => {
  if (!["keyAsk", "keyStores"].includes(step.value) || loading.value || !last.value) return;
  if (!yes) {
    flushLog("메뉴키 배치 안 함");
    push("user", step.value === "keyStores" ? "취소" : "아니오");
    push(
      "assistant",
      `'${last.value.name}' 메뉴 등록이 완료되었습니다. 메뉴키는 배치하지 않았습니다.\n창을 닫으면 메뉴 목록에서 확인할 수 있습니다. 다음 메뉴를 입력하셔도 됩니다.`
    );
    step.value = "input";
    focusInput();
    return;
  }
  push("user", "예");
  const stores = props.keyStoreList || [];
  if (stores.length === 0) {
    flushLog("메뉴키 배치 실패(배치할 매장 없음)");
    push("assistant", "메뉴키를 배치할 매장을 찾지 못했습니다. 메뉴키 설정 화면에서 배치해 주세요.");
    step.value = "input";
    focusInput();
    return;
  }
  // 매장별 메뉴는 그 매장에 바로, 공통 메뉴(매장코드 0)는 매장을 골라서 배치
  if (String(props.storeCd) !== "0") {
    placeMenuKey(stores);
    return;
  }
  keyStores.value = stores;
  keyChecked.value = [];
  push("assistant", "메뉴키를 배치할 매장을 선택해 주세요.", { keyStores: true, seq: ++seq.value });
  step.value = "keyStores";
};

const confirmKeyStores = () => {
  if (step.value !== "keyStores" || loading.value || keyChecked.value.length === 0) return;
  const stores = keyStores.value.filter((s) => keyChecked.value.includes(s.code));
  push("user", stores.map((s) => s.name).join(", "));
  placeMenuKey(stores);
};

// 매장마다 같은 소분류 메뉴가 가장 많이 놓인 화면(없으면 첫 화면)의 마지막 메뉴 다음 자리에, 그 매장 포스 전체로 배치
const placeMenuKey = async (stores) => {
  const menu = last.value;
  if (!menu) return;
  loading.value = true;
  let logText = "메뉴키 배치 실패";
  try {
    const res = await getMenuKeyTarget(props.groupCd, stores.map((s) => s.code).join(","), props.storeCd, menu.sub);
    if (res.data.RESULT_CD !== "00") throw new Error(res.data.RESULT_NM);
    const targets = res.data.List || [];
    if (targets.length === 0) {
      logText = "메뉴키 배치 실패(메뉴 화면 없음)";
      push("assistant", "선택하신 매장에 메뉴 화면이 없어 메뉴키를 배치하지 못했습니다. 메뉴키 설정 화면에서 확인해 주세요.");
      return;
    }
    const res2 = await appendMenuKeys(
      props.groupCd,
      menu.code,
      menu.name,
      targets.map((t) => ({ STORE_CD: String(t.lngStoreCode), SCREEN_NO: String(t.intScreenNo) }))
    );
    if (res2.data.RESULT_CD !== "00") throw new Error(res2.data.RESULT_NM);
    const rows = res2.data.List || [];
    const lines = stores.map((s) => {
      const t = targets.find((x) => String(x.lngStoreCode) === String(s.code));
      if (!t) return `· ${s.name}: 메뉴 화면이 없어 배치하지 못했습니다.`;
      const counts = {};
      rows
        .filter((r) => String(r.STORE_CD) === String(s.code))
        .forEach((r) => {
          const k = KEY_RESULT_TEXT[r.RESULT] || r.RESULT;
          counts[k] = (counts[k] || 0) + 1;
        });
      const posText = Object.entries(counts)
        .map(([k, v]) => `${k} ${v}대`)
        .join(", ");
      return `· ${s.name}: '${t.strScreenName || "이름 없음"}' 화면(${t.intScreenNo}번) 마지막 메뉴 다음 자리 (포스: ${
        posText || "결과 없음"
      })`;
    });
    logText = `메뉴키 배치(${stores
      .map((s) => {
        const t = targets.find((x) => String(x.lngStoreCode) === String(s.code));
        return t ? `${s.name} ${t.intScreenNo}번 화면` : `${s.name} 화면 없음`;
      })
      .join(", ")})`;
    push(
      "assistant",
      `'${menu.name}' 메뉴 등록과 메뉴키 배치가 완료되었습니다.\n${lines.join(
        "\n"
      )}\n포스에서 환경수신 후 확인해 주세요. 창을 닫으면 메뉴 목록에서 확인할 수 있습니다.`,
      { done: true }
    );
  } catch (error) {
    logText = `메뉴키 배치 실패(${error.message || "오류"})`;
    push("assistant", `메뉴키를 배치하지 못했습니다. (${error.message || "오류"}) 메뉴키 설정 화면에서 확인해 주세요.`);
  } finally {
    flushLog(logText);
    step.value = "input";
    loading.value = false;
    scrollLog();
    focusInput();
  }
};

// 창을 열어도 키보드는 올리지 않는다 (입력창을 누르면 올라옴)
onMounted(() => {
  scrollLog();
});
</script>

<style scoped>
/* 화면 전체 고정. 키보드가 올라올 때 크기·위치를 따라 바꾸면 휴대폰에서 키보드가 다시 닫히므로 바꾸지 않는다 */
.mq-sheet {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: #f8fafc;
}

.mq-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.mq-head-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  color: #fff;
}

.mq-head-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.mq-head-text {
  flex: 1;
  min-width: 0;
}

.mq-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
}

.mq-store {
  font-size: 0.7rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mq-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
}

.mq-close svg {
  width: 1.1rem;
  height: 1.1rem;
}

.mq-test {
  padding: 0.4rem 0.85rem;
  background: #fef3c7;
  font-size: 0.7rem;
  color: #92400e;
}

.mq-log {
  flex: 1;
  overflow-y: auto;
  padding: 0.85rem;
}

.mq-guide {
  padding: 0.8rem 0.85rem;
  border: 1px solid #fde68a;
  border-radius: 0.9rem;
  background: #fffbeb;
  font-size: 0.72rem;
  color: #78350f;
}

.mq-guide-title {
  font-weight: 700;
}

.mq-guide-example {
  margin-top: 0.15rem;
  color: #b45309;
}

.mq-guide ul {
  margin-top: 0.5rem;
}

.mq-guide li {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.2rem;
  line-height: 1.4;
}

.mq-guide-label {
  flex-shrink: 0;
  min-width: 3.4rem;
  font-weight: 700;
}

.mq-row {
  display: flex;
  margin-top: 0.6rem;
}

.mq-row.is-user {
  justify-content: flex-end;
}

.mq-bubble {
  max-width: 85%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.9rem;
  font-size: 0.8rem;
  line-height: 1.45;
}

.mq-row.is-ai .mq-bubble {
  border: 1px solid #e2e8f0;
  border-top-left-radius: 0.25rem;
  background: #fff;
  color: #1e293b;
}

.mq-row.is-user .mq-bubble {
  border-top-right-radius: 0.25rem;
  background: #3b82f6;
  color: #fff;
}

.mq-row.is-ai .mq-bubble.is-done {
  border-color: #86efac;
  background: #f0fdf4;
}

.mq-done {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.35rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #16a34a;
}

.mq-done svg {
  width: 1.05rem;
  height: 1.05rem;
}

.mq-text {
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.mq-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.55rem;
}

.mq-btn {
  flex: 1;
  padding: 0.45rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  background: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
}

.mq-btn.is-primary {
  border-color: #f97316;
  background: #f97316;
  color: #fff;
}

.mq-btn:disabled {
  opacity: 0.45;
}

.mq-stores {
  margin-top: 0.5rem;
}

.mq-store-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0;
  font-size: 0.78rem;
}

.mq-store-item input {
  width: 1rem;
  height: 1rem;
}

.mq-typing {
  display: flex;
  gap: 0.25rem;
}

.mq-typing span {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: #94a3b8;
  animation: mq-blink 1s infinite ease-in-out;
}

.mq-typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.mq-typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes mq-blink {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

.mq-input {
  display: flex;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem calc(0.65rem + env(safe-area-inset-bottom));
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.mq-input input {
  flex: 1;
  min-width: 0;
  height: 2.6rem;
  padding: 0 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  font-size: 1rem; /* 16px 미만이면 아이폰이 입력할 때 화면을 확대한다 */
  outline: none;
}

.mq-input input:focus {
  border-color: #f97316;
}

.mq-listening {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1rem 0.85rem;
  border-top: 1px solid #fecaca;
  background: #fef2f2;
  text-align: center;
}

/* 안내 중(파랑) → 입력 대기(빨강) */
.mq-listening.is-prompt {
  border-top-color: #bfdbfe;
  background: #eff6ff;
}

.mq-voice-visual {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
}

.mq-voice-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.18);
  animation: mq-ring 1.4s infinite ease-out;
}

.is-prompt .mq-voice-ring {
  background: rgba(59, 130, 246, 0.18);
}

.mq-voice-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #f87171, #dc2626);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
  color: #fff;
}

.is-prompt .mq-voice-circle {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

.mq-voice-circle svg {
  width: 1.5rem;
  height: 1.5rem;
}

@keyframes mq-ring {
  0% {
    transform: scale(0.75);
    opacity: 1;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* 소리 막대: 입력 대기일 때 움직이고, 안내 중에는 작게 */
.mq-voice-bars {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  height: 1.4rem;
}

.mq-voice-bars span {
  width: 0.25rem;
  height: 100%;
  border-radius: 999px;
  background: #ef4444;
  animation: mq-bar 0.9s infinite ease-in-out;
}

.is-prompt .mq-voice-bars span {
  background: #60a5fa;
  animation-duration: 1.4s;
}

@keyframes mq-bar {
  0%,
  100% {
    transform: scaleY(0.25);
  }
  50% {
    transform: scaleY(1);
  }
}

.mq-listening-state {
  font-size: 0.7rem;
  font-weight: 700;
  color: #dc2626;
}

.is-prompt .mq-listening-state {
  color: #2563eb;
}

.mq-speaker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #94a3b8;
}

.mq-speaker.is-on {
  background: #eff6ff;
  color: #2563eb;
}

.mq-speaker svg {
  width: 1.2rem;
  height: 1.2rem;
}

.mq-listening-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #b91c1c;
}

.mq-listening-sub {
  font-size: 0.7rem;
  color: #ef4444;
}

.mq-listening-heard {
  margin-top: 0.2rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}

.mq-mic {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #f8fafc;
  color: #475569;
}

.mq-mic svg {
  width: 1.25rem;
  height: 1.25rem;
}

.mq-mic.is-on {
  border-color: #ef4444;
  background: #ef4444;
  color: #fff;
  animation: mq-mic-pulse 1.2s infinite;
}

.mq-mic:disabled {
  opacity: 0.45;
}

@keyframes mq-mic-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45);
  }
  100% {
    box-shadow: 0 0 0 0.6rem rgba(239, 68, 68, 0);
  }
}

.mq-send {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  color: #fff;
}

.mq-send:disabled {
  opacity: 0.45;
}

.mq-send svg {
  width: 1.2rem;
  height: 1.2rem;
}
</style>

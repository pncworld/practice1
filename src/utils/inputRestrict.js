/**
 * 숫자만 / 문자만 입력 — 잔상(잠깐 보였다 사라짐) 없이 차단
 *
 * Vue 사용 예:
 *   const digits = makeDigitsOnlyHandlers({
 *     setValue: (v) => { myRef.value = v; },
 *     onCommit: (v) => { // 그리드 동기화 등
 *     },
 *   });
 *   <input
 *     v-model="myRef"
 *     inputmode="numeric"
 *     pattern="[0-9]*"
 *     lang="en"
 *     autocomplete="off"
 *     @keydown="digits.onKeydown"
 *     @beforeinput="digits.onBeforeInput"
 *     @paste="digits.onPaste"
 *     @compositionstart="digits.onCompositionStart"
 *     @compositionupdate="digits.onCompositionUpdate"
 *     @compositionend="digits.onCompositionEnd"
 *     @input="digits.onInput"
 *   />
 */

const NAV_KEYS = new Set([
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

const insertAtCaret = (el, text) => {
  const value = String(el?.value ?? "");
  const start = el?.selectionStart ?? value.length;
  const end = el?.selectionEnd ?? value.length;
  return `${value.slice(0, start)}${text}${value.slice(end)}`;
};

/** 숫자(0-9)만 */
export const sanitizeDigits = (value) =>
  String(value ?? "").replace(/[^\d]/g, "");

/**
 * 문자만 — 영문/한글(자모·완성형) + 공백
 * (숫자·기호 제외)
 */
export const sanitizeLetters = (value) =>
  String(value ?? "").replace(/[^A-Za-zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "");

/**
 * @param {{
 *   sanitize: (v: string) => string,
 *   allowKey: (key: string) => boolean,
 *   setValue?: (v: string) => void,
 *   onCommit?: (v: string, e?: Event) => void,
 *   blockComposition?: boolean,
 * }} opts
 */
const makeRestrictHandlers = ({
  sanitize,
  allowKey,
  setValue,
  onCommit,
  blockComposition = false,
}) => {
  const commit = (next, e) => {
    if (typeof setValue === "function") setValue(next);
    if (typeof onCommit === "function") onCommit(next, e);
  };

  const snapClean = (el, e) => {
    if (!el) return;
    const next = sanitize(el.value);
    if (el.value !== next) el.value = next;
    commit(next, e);
  };

  const onKeydown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (NAV_KEYS.has(e.key)) return;
    // 한글 IME: key가 Process이거나 composing 중이면 숫자 전용에서 즉시 차단
    if (blockComposition && (e.isComposing || e.key === "Process")) {
      e.preventDefault();
      return;
    }
    if (allowKey(e.key)) return;
    e.preventDefault();
  };

  const onBeforeInput = (e) => {
    const type = e.inputType || "";
    // 조합 삽입은 숫자 전용에서 전부 차단 (자모 잔상 방지)
    if (
      blockComposition &&
      (type === "insertCompositionText" || type === "deleteCompositionText")
    ) {
      e.preventDefault();
      return;
    }
    if (type !== "insertText" || e.data == null) return;
    if (sanitize(e.data) !== e.data) {
      e.preventDefault();
    }
  };

  const onPaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData?.getData("text") ?? "";
    const cleaned = sanitize(raw);
    if (!cleaned) return;
    const next = insertAtCaret(e.target, cleaned);
    commit(next, e);
  };

  /**
   * 숫자 전용: IME 조합 시작 즉시 취소 (한글 점선 잔상 방지)
   * blur→focus로 조합 세션을 끊는다.
   */
  const onCompositionStart = (e) => {
    if (!blockComposition) return;
    e.preventDefault();
    const el = e.target;
    snapClean(el, e);
    el.blur();
    requestAnimationFrame(() => {
      el.focus();
    });
  };

  const onCompositionUpdate = (e) => {
    if (!blockComposition) return;
    e.preventDefault();
    snapClean(e.target, e);
  };

  const onCompositionEnd = (e) => {
    snapClean(e.target, e);
  };

  const onInput = (e) => {
    // 조합 중 input은 숫자 전용에서 무시하고 composition*에서 처리
    if (blockComposition && e.isComposing) {
      e.preventDefault?.();
      snapClean(e.target, e);
      return;
    }
    const raw = e.target?.value;
    const next = sanitize(raw);
    if (String(raw) !== next) {
      commit(next, e);
      return;
    }
    if (typeof onCommit === "function") onCommit(next, e);
  };

  return {
    onKeydown,
    onBeforeInput,
    onPaste,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    onInput,
    sanitize,
  };
};

/**
 * 정수(숫자)만 입력 핸들러 — 한글 IME 조합 잔상까지 차단
 * @param {{ setValue?: (v: string) => void, onCommit?: (v: string, e?: Event) => void }} opts
 */
export const makeDigitsOnlyHandlers = (opts = {}) =>
  makeRestrictHandlers({
    sanitize: sanitizeDigits,
    allowKey: (key) => /^\d$/.test(key),
    setValue: opts.setValue,
    onCommit: opts.onCommit,
    blockComposition: true,
  });

/**
 * 문자만 입력 핸들러 — 한글 조합은 허용, 종료 시 숫자·기호 제거
 * @param {{ setValue?: (v: string) => void, onCommit?: (v: string, e?: Event) => void }} opts
 */
export const makeLettersOnlyHandlers = (opts = {}) =>
  makeRestrictHandlers({
    sanitize: sanitizeLetters,
    allowKey: (key) =>
      key.length === 1 && sanitizeLetters(key) === key && key !== "",
    setValue: opts.setValue,
    onCommit: opts.onCommit,
    blockComposition: false,
  });

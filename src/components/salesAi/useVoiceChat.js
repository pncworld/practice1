/**
 * PnC# AI 도우미 모바일 음성 대화 (2026-11-27)
 *  - 듣기: 브라우저 Web Speech API (SpeechRecognition, 한국어). 휴대폰 Chrome·Safari 지원, 앱 안 WebView 는 대부분 미지원 → supported=false 면 마이크 버튼을 숨긴다
 *  - 읽기: 휴대폰 기본 음성 (speechSynthesis). 외부 음성 서비스로 보내지 않으므로 고객 조회 답도 휴대폰 안에서만 읽는다
 *  - 대화 모드: 마이크 한 번 → 듣기 → 말이 끝나면 자동 전송 → 답 읽기 → 다시 듣기 … (멈춤 버튼·입력창 누르기·화면 떠나기로 끝)
 *  - 읽는 중 소리가 마이크로 다시 들어가지 않게, 읽기가 끝난 뒤에 듣기를 시작한다
 *
 * 사용: const voice = useVoiceChat({ send: async (text) => replyText, onInterim: (t) => …, onNotice: (msg) => … })
 */
import { onBeforeUnmount, reactive } from "vue";

// 음성 인식 기능은 쓸 때 찾는다 (화면을 연 뒤 권한·기능이 바뀌는 브라우저 대비)
const recognitionCtor = () => (typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition || null : null);
const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

/** 한국어 목소리 고르기: 휴대폰마다 다르므로 자연스러운 쪽(Google·Yuna 등 여성 신경망 음성)을 먼저 */
const PREFERRED_VOICE = [/google/i, /yuna/i, /sunhi/i, /heami/i, /sora/i, /유나|해미|선희/];
function pickKoreanVoice() {
  if (!ttsSupported) return null;
  const list = window.speechSynthesis.getVoices().filter((v) => /^ko/i.test(v.lang || ""));
  for (const re of PREFERRED_VOICE) {
    const v = list.find((x) => re.test(x.name || ""));
    if (v) return v;
  }
  return list[0] || null;
}

/**
 * 답 글을 소리로 읽기 좋게 줄인다
 *  - '[고객]' 표시, '※ 휴대폰·카드번호는 가려서…' 같은 화면용 안내는 뺀다
 *  - 날짜 2026-11-01 → 11월 1일 (올해면 연도 생략), '~' → '부터'
 *  - 길면 앞 몇 줄만 읽고 '자세한 내용은 화면에서 확인해 주세요'
 */
const MAX_LINES = 4;
const MAX_CHARS = 220;
export function speechText(raw) {
  const thisYear = new Date().getFullYear();
  let t = String(raw || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\[고객\]\s*/gm, "");
  const lines = t
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s && !/^※\s*휴대폰/.test(s) && !/^-{2,}/.test(s));
  let picked = [];
  let len = 0;
  let cut = false;
  for (const line of lines) {
    // 메뉴 관리의 선택지 안내는 길어도 읽는다 (말로 고를 수 있게)
    if (/^선택지는/.test(line)) {
      picked.push(line);
      continue;
    }
    if (cut) continue;
    if (picked.length >= MAX_LINES || len + line.length > MAX_CHARS) {
      if (picked.length === 0) picked.push(line.slice(0, MAX_CHARS));
      cut = true;
      continue;
    }
    picked.push(line);
    len += line.length;
  }
  // 줄였더라도 마지막 줄이 묻는 말이면(예: '…사용하시겠습니까?') 맨 끝에 읽는다 — 답할 말을 알아야 하므로
  const lastLine = lines[lines.length - 1] || "";
  const askLast = cut && /\?$/.test(lastLine) && !picked.includes(lastLine) ? lastLine : "";
  t = picked.join("\n");
  t = t
    // 메뉴코드처럼 쉼표 없는 긴 숫자는 한 자리씩 (9억… 처럼 읽지 않게)
    .replace(/(^|[^\d,])(\d{6,})(?![\d,])/g, (m, pre, num) => pre + num.split("").join(" "))
    .replace(/(\d{4})-(\d{2})-(\d{2})/g, (m, y, mo, d) => `${Number(y) === thisYear ? "" : `${y}년 `}${Number(mo)}월 ${Number(d)}일`)
    .replace(/^(\d+)\.\s+/gm, "$1위, ")
    .replace(/\s+:\s+/g, ", ")
    .replace(/\s*~\s*/g, "부터 ")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/[*#•·]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  if (cut) t += "\n자세한 내용은 화면에서 확인해 주세요.";
  if (askLast) t += "\n" + askLast;
  return t;
}

/**
 * 선택지를 번호로 말한 경우('2번', '두 번째', '이번') 몇 번째(0부터)인지. 아니면 -1
 *  영어 분류 이름(MISC 등)은 음성 인식이 한글로 받아 적어 이름으로 고르기 어렵기 때문 (2026-11-27 시험)
 */
const NUM_WORDS = {
  일: 1, 하나: 1, 한: 1, 첫: 1, 첫째: 1,
  이: 2, 둘: 2, 두: 2, 둘째: 2,
  삼: 3, 셋: 3, 세: 3, 셋째: 3,
  사: 4, 넷: 4, 네: 4, 넷째: 4,
  오: 5, 다섯: 5, 육: 6, 여섯: 6, 칠: 7, 일곱: 7, 팔: 8, 여덟: 8, 구: 9, 아홉: 9, 십: 10, 열: 10,
};
export function choiceIndexFromSpeech(said, count) {
  const s = String(said || "").replace(/\s+/g, "").replace(/[.?!]/g, "");
  if (!count || !s) return -1;
  const m = s.match(/^(\d{1,2}|[가-힣]{1,2}?)(번째|번|째)?(요|이요|으로|로|선택|이요)?$/);
  if (!m || (!m[2] && !/^\d+$/.test(m[1]))) return -1;
  const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM_WORDS[m[1]];
  if (!n || n < 1 || n > count) return -1;
  return n - 1;
}

/** 긴 글은 문장 단위로 나눠 읽는다 (일부 Android Chrome 은 긴 글을 15초쯤에서 끊음) */
function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[.?!。])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s);
}

export function useVoiceChat({ send, onInterim, onNotice }) {
  const voice = reactive({
    supported: !!recognitionCtor(),
    on: false, // 대화 모드 켜짐
    phase: "", // '' / listen 듣는 중 / think 답 기다림 / speak 읽는 중
    heard: "", // 듣는 중 글자
  });

  let recognition = null;
  let session = 0; // 멈췄다 다시 켜면 이전 콜백을 무시하려는 번호
  let emptyCount = 0; // 말 없이 끝난 횟수 (2번이면 쉬는 것으로 보고 멈춤)
  let speakTimer = null;
  let restartTimer = null;

  function clearTimers() {
    if (speakTimer) clearTimeout(speakTimer);
    if (restartTimer) clearTimeout(restartTimer);
    speakTimer = null;
    restartTimer = null;
  }

  function abortRecognition() {
    if (!recognition) return;
    const r = recognition;
    recognition = null;
    r.onresult = null;
    r.onerror = null;
    r.onend = null;
    try {
      r.abort();
    } catch (e) {
      // 이미 멈춤
    }
  }

  function cancelSpeech() {
    if (ttsSupported) window.speechSynthesis.cancel();
  }

  /** 읽기. 끝나면(또는 실패·멈춤) onEnd 한 번 */
  function speak(text, onEnd) {
    const my = session;
    const parts = splitSentences(text);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      if (speakTimer) clearTimeout(speakTimer);
      speakTimer = null;
      if (my === session && onEnd) onEnd();
    };
    if (!ttsSupported || parts.length === 0) {
      finish();
      return;
    }
    cancelSpeech();
    const v = pickKoreanVoice();
    let idx = 0;
    const next = () => {
      if (my !== session || !voice.on) return finish();
      if (idx >= parts.length) return finish();
      const part = parts[idx++];
      const u = new window.SpeechSynthesisUtterance(part);
      u.lang = "ko-KR";
      if (v) u.voice = v;
      u.rate = 1.05;
      u.pitch = 1;
      u.onend = next;
      u.onerror = next;
      // onend 를 주지 않는 브라우저 대비: 글자 수만큼 기다린 뒤 다음으로
      if (speakTimer) clearTimeout(speakTimer);
      speakTimer = setTimeout(next, 2500 + part.length * 220);
      try {
        window.speechSynthesis.speak(u);
      } catch (e) {
        next();
      }
    };
    next();
  }

  function listen() {
    const RecognitionCtor = recognitionCtor();
    if (!voice.on || !RecognitionCtor) return;
    abortRecognition();
    const my = session;
    let finalSaid = "";
    let failed = "";
    const r = new RecognitionCtor();
    recognition = r;
    r.lang = "ko-KR";
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      if (my !== session) return;
      let said = "";
      for (let i = 0; i < ev.results.length; i++) {
        said += ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalSaid = said.trim();
      }
      voice.heard = said.trim();
      if (onInterim) onInterim(voice.heard);
    };
    r.onerror = (ev) => {
      if (my !== session) return;
      failed = ev.error || "error";
    };
    r.onend = () => {
      if (my !== session || recognition !== r) return;
      recognition = null;
      if (!voice.on) return;
      if (failed === "not-allowed" || failed === "service-not-allowed" || failed === "audio-capture") {
        stop();
        if (onNotice) onNotice("마이크를 켜지 못했습니다. 브라우저 설정에서 이 사이트의 마이크 권한을 허용한 뒤 「말하기」 버튼을 다시 눌러 주세요.");
        return;
      }
      if (failed === "network") {
        stop();
        if (onNotice) onNotice("음성 인식 서버에 연결하지 못했습니다. 인터넷 연결을 확인하거나 글자로 입력해 주세요.");
        return;
      }
      // 끝까지 확정되지 않았어도 들은 글이 있으면 그것으로 보낸다
      const said = (finalSaid || voice.heard || "").trim();
      if (!said) {
        emptyCount += 1;
        if (emptyCount >= 2) {
          stop();
          if (onNotice) onNotice("말씀이 없어 음성 대화를 멈췄습니다. 다시 하시려면 「말하기」 버튼을 눌러 주세요.");
          return;
        }
        restartTimer = setTimeout(listen, 300);
        return;
      }
      emptyCount = 0;
      ask(said);
    };
    voice.heard = "";
    voice.phase = "listen";
    try {
      r.start();
    } catch (e) {
      recognition = null;
      stop();
      if (onNotice) onNotice("마이크를 시작하지 못했습니다. 잠시 후 「말하기」 버튼을 다시 눌러 주세요.");
    }
  }

  async function ask(said) {
    const my = session;
    voice.phase = "think";
    voice.heard = "";
    if (onInterim) onInterim("");
    let reply = "";
    try {
      reply = await send(said);
    } catch (e) {
      reply = "";
    }
    if (my !== session || !voice.on) return;
    voice.phase = "speak";
    const text = speechText(reply);
    speak(text || "답을 화면에 보여 드렸습니다.", () => {
      if (my !== session || !voice.on) return;
      // 스피커 소리가 마이크에 남지 않게 잠깐 쉬고 듣기
      restartTimer = setTimeout(listen, 350);
    });
  }

  /** 대화 모드 시작 (마이크 버튼 누를 때 = 사용자 동작 안에서 불러야 iPhone 소리가 열린다) */
  function start(greeting) {
    if (!voice.supported) return;
    stop();
    session += 1;
    emptyCount = 0;
    voice.on = true;
    voice.phase = "speak";
    // iPhone: 사용자 동작 안에서 한 번 읽어야 이후 자동 읽기가 된다 → 짧은 인사로 연다
    speak(greeting || "말씀하세요.", () => {
      if (voice.on) listen();
    });
  }

  /** 대화 모드 끝 (멈춤 버튼·입력창 누름·화면 떠남·새 대화) */
  function stop() {
    session += 1;
    clearTimers();
    abortRecognition();
    cancelSpeech();
    voice.on = false;
    voice.phase = "";
    voice.heard = "";
    if (onInterim) onInterim("");
  }

  /** 읽는 중이면 건너뛰고 바로 듣기 */
  function skip() {
    if (!voice.on || voice.phase !== "speak") return;
    const my = ++session;
    clearTimers();
    cancelSpeech();
    restartTimer = setTimeout(() => {
      if (my === session) listen();
    }, 200);
  }

  function onVisibility() {
    if (document.hidden && voice.on) stop();
  }
  if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
  // 목소리 목록은 늦게 채워지는 브라우저가 있어 미리 한 번 불러 둔다
  if (ttsSupported) window.speechSynthesis.getVoices();

  onBeforeUnmount(() => {
    stop();
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibility);
  });

  return { voice, start, stop, skip };
}

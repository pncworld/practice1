/**
 * 모바일 대화창(초간단 메뉴등록·AI 메뉴관리) 키보드 처리
 *
 * 1) 대화창이 열려 있는 동안만 viewport 에 interactive-widget=resizes-content 를 붙인다.
 *    → 안드로이드 크롬이 키보드만큼 화면 높이를 줄여 주므로, 화면 전체 고정 대화창의 입력창이 키보드 위에 붙고 제목줄은 남는다.
 *    (크롬 108 이전의 기본 동작. 아이폰 Safari 는 이 설정을 무시한다.) 닫으면 원래 설정으로 되돌린다.
 *    주의: 자바스크립트로 대화창 크기·위치를 직접 바꾸면 키보드가 다시 닫히는 문제가 있어(2026-11-10) 그렇게 하지 않는다.
 * 2) 키보드가 올라오면(보이는 영역 높이가 줄면) 대화 내용을 마지막 답변 위치로 내린다 — 스크롤만, 크기·위치는 바꾸지 않음.
 */
import { onBeforeUnmount, onMounted } from "vue";

const RESIZE_HINT = "interactive-widget=resizes-content";
let users = 0;
let originalContent = null;

const viewportMeta = () => document.querySelector('meta[name="viewport"]');

const addResizeHint = () => {
  const meta = viewportMeta();
  if (!meta) return;
  originalContent = meta.getAttribute("content") || "";
  if (!originalContent.includes("interactive-widget")) {
    meta.setAttribute("content", `${originalContent}, ${RESIZE_HINT}`);
  }
};

const restoreHint = () => {
  const meta = viewportMeta();
  if (meta && originalContent !== null) meta.setAttribute("content", originalContent);
  originalContent = null;
};

/**
 * 새 답변 보기 (Claude 앱 방식): 마지막으로 내가 보낸 말풍선을 대화 영역 맨 위에 맞추고 그 아래로 답변을 처음부터 보여 준다.
 * 답변이 짧아 화면이 남으면 맨 아래까지 내린다. 무조건 맨 아래로 내리면 긴 답변의 앞부분(알아야 할 내용)을 지나치기 때문
 * log: 대화 스크롤 영역, userSelector: 내 말풍선 줄의 선택자
 */
export const scrollToLatest = (log, userSelector) => {
  if (!log) return;
  const users = log.querySelectorAll(userSelector);
  const last = users[users.length - 1];
  const maxTop = log.scrollHeight - log.clientHeight;
  if (!last) {
    log.scrollTop = maxTop;
    return;
  }
  const top = last.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 8;
  log.scrollTop = Math.max(0, Math.min(top, maxTop));
};

/** 대화창 컴포넌트 setup 에서 부른다. scrollToBottom: 키보드가 올라올 때 대화 위치를 맞추는 함수 */
export const useChatKeyboard = (scrollToBottom) => {
  let lastHeight = 0;
  const onViewportResize = () => {
    const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    // 높이가 크게 줄면 키보드가 올라온 것 → 마지막 답변이 보이게 스크롤만 한다
    if (lastHeight && lastHeight - h > 120) setTimeout(() => scrollToBottom(), 60);
    lastHeight = h;
  };
  onMounted(() => {
    if (users++ === 0) addResizeHint();
    lastHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    (window.visualViewport || window).addEventListener("resize", onViewportResize);
  });
  onBeforeUnmount(() => {
    (window.visualViewport || window).removeEventListener("resize", onViewportResize);
    if (--users === 0) restoreHint();
  });
};

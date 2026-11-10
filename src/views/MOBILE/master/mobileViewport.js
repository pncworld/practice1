/**
 * 모바일 대화창용 화면 높이·키보드 감지 (초간단 메뉴등록·AI 메뉴관리에서 사용)
 * 휴대폰 키보드가 올라오면 보이는 영역(visualViewport)이 줄어든다. 그 높이·위치를 CSS 변수로 넘겨
 * 대화창이 키보드 바로 위까지만 차지하게 하고(입력창이 키보드에 붙음), 키보드가 떠 있으면 html 에 mkb-open 클래스를 붙인다.
 *   --mvv-h  : 보이는 영역 높이(px)
 *   --mvv-top: 보이는 영역 위쪽 위치(px) — 아이폰은 키보드가 뜨면 화면을 위로 밀어 올린다
 * 여러 대화창이 동시에 써도 한 번만 붙이고, 마지막 사용처가 사라지면 정리한다
 */
import { onBeforeUnmount, onMounted } from "vue";

let users = 0;
let baseHeight = 0;
const root = () => document.documentElement;

const update = () => {
  const vv = window.visualViewport;
  const h = vv ? vv.height : window.innerHeight;
  const top = vv ? vv.offsetTop : 0;
  // 키보드가 없을 때의 높이를 기준으로 기억 (화면 회전 등으로 커지면 갱신)
  if (h > baseHeight) baseHeight = h;
  root().style.setProperty("--mvv-h", `${Math.round(h)}px`);
  root().style.setProperty("--mvv-top", `${Math.round(top)}px`);
  root().classList.toggle("mkb-open", baseHeight - h > 150);
};

const attach = () => {
  baseHeight = 0;
  update();
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
};

const detach = () => {
  window.visualViewport?.removeEventListener("resize", update);
  window.visualViewport?.removeEventListener("scroll", update);
  window.removeEventListener("resize", update);
  root().style.removeProperty("--mvv-h");
  root().style.removeProperty("--mvv-top");
  root().classList.remove("mkb-open");
};

/** 컴포넌트 setup 에서 부른다 */
export const useKeyboardViewport = () => {
  onMounted(() => {
    if (users++ === 0) attach();
  });
  onBeforeUnmount(() => {
    if (--users === 0) detach();
  });
};

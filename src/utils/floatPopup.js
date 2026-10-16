import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

/**
 * 화면 위 팝업. 위치·크기는 픽셀.
 * 제목 줄로 옮기고, 오른쪽 아래 모서리로 크기를 바꾼다.
 */
export function useFloatPopup({
  width = 720,
  height = 480,
  minWidth = 360,
  minHeight = 220,
  maxWidthRatio = 0.92,
  maxHeightRatio = 0.88,
} = {}) {
  const left = ref(0);
  const top = ref(0);
  const w = ref(width);
  const h = ref(height);

  const clamp = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = Math.max(minWidth, vw - 16);
    const maxH = Math.max(minHeight, vh - 16);
    w.value = Math.min(Math.max(w.value, minWidth), maxW);
    h.value = Math.min(Math.max(h.value, minHeight), maxH);
    left.value = Math.min(Math.max(left.value, 8), Math.max(8, vw - 80));
    top.value = Math.min(Math.max(top.value, 8), Math.max(8, vh - 48));
  };

  const place = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    w.value = Math.min(width, Math.round(vw * maxWidthRatio));
    h.value = Math.min(height, Math.round(vh * maxHeightRatio));
    left.value = Math.max(8, Math.round((vw - w.value) / 2));
    top.value = Math.max(8, Math.round((vh - h.value) / 2));
    clamp();
  };

  const bindMove = (onMove) => {
    const up = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", up);
  };

  const startDrag = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = left.value;
    const startTop = top.value;
    bindMove((ev) => {
      left.value = startLeft + ev.clientX - startX;
      top.value = startTop + ev.clientY - startY;
      clamp();
    });
  };

  const startResize = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startW = w.value;
    const startH = h.value;
    bindMove((ev) => {
      w.value = startW + ev.clientX - startX;
      h.value = startH + ev.clientY - startY;
      clamp();
    });
  };

  const style = computed(() => ({
    position: "fixed",
    left: `${left.value}px`,
    top: `${top.value}px`,
    width: `${w.value}px`,
    height: `${h.value}px`,
  }));

  onMounted(() => window.addEventListener("resize", clamp));
  onUnmounted(() => window.removeEventListener("resize", clamp));

  return reactive({ style, place, startDrag, startResize });
}

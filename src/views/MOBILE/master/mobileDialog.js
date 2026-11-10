/**
 * 모바일 메뉴 화면 전용 확인창·알림 (웹 화면의 sweetalert2 는 그대로 두고 모바일에서만 사용)
 * - mobileConfirm: 아래에서 올라오는 확인 시트. 확인이면 true
 * - mobileAlert: 아래에서 올라오는 안내 시트 (확인 버튼 하나)
 * - mobileToast: 잠깐 떴다 사라지는 완료 알림
 * 화면에 <MobileDialog /> 를 한 번 넣어 두면 된다
 */
import { reactive } from "vue";

export const dialogState = reactive({
  open: false,
  type: "confirm", // confirm / alert
  tone: "info", // info / warning / error
  title: "",
  message: "",
  from: "", // 바꾸기 전 값 (있으면 전→후 카드로 보여 줌)
  to: "",
  confirmText: "확인",
  cancelText: "취소",
});
export const toastState = reactive({ show: false, text: "", tone: "success" });

let resolver = null;
let toastTimer = null;

const openDialog = (options) =>
  new Promise((resolve) => {
    if (resolver) resolver(false);
    resolver = resolve;
    Object.assign(dialogState, {
      tone: "info",
      title: "",
      message: "",
      from: "",
      to: "",
      confirmText: "확인",
      cancelText: "취소",
      ...options,
      open: true,
    });
  });

export const mobileConfirm = (options) => openDialog({ type: "confirm", confirmText: "저장", ...options });
export const mobileAlert = (options) => openDialog({ type: "alert", tone: "warning", ...options });

export const closeDialog = (result) => {
  dialogState.open = false;
  const done = resolver;
  resolver = null;
  if (done) done(result);
};

export const mobileToast = (text, tone = "success") => {
  toastState.text = text;
  toastState.tone = tone;
  toastState.show = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastState.show = false;
  }, 2200);
};

import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons"; // Regular 아이콘
import { fas } from "@fortawesome/free-solid-svg-icons"; // 필요한 아이콘만 import
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "realgrid/dist/realgrid-style.css";
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { createApp } from "vue";
import VueKonva from "vue-konva";
import { useLoading } from "vue-loading-overlay";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import App from "./App.vue";
import "./assets/index.css";
import "./customStyle/style.css";
import router from "./router";
import store from "./store";
import Swal from "sweetalert2";

library.add(fas, far);
window.addEventListener("storage", (event) => {
  if (event.key === "vuex") {
    store.replaceState(JSON.parse(event.newValue)); // 새로운 값으로 업데이트
  }
});
const app = createApp(App)
  .use(router)
  .use(store)
  .use(useLoading) // 'Loading' 제거
  .use(VueKonva)
  .component("VueDatePicker", VueDatePicker)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("VDatePicker", DatePicker)
  .component("v-select", VueSelect)
  .component("VCalendar", Calendar);

// app.config.errorHandler = function (err, vm, info) {
//   Swal.fire({
//     title: "경고",
//     icon: "warning",
//     text: "죄송합니다. 애플리케이션에서 에러가 발생했습니다. 개발팀에 문의해주세요.",
//   });
// };

app.mount("#app");

// 전역 오류 핸들러 설정
// app.config.errorHandler = (err, vm, info) => {
//     console.error('Vue 전역 에러 발생:', err, 'Info:', info);

//     Swal.fire({
//       title: '오류 발생',
//       text: '예기치 않은 오류가 발생했습니다. 이전 상태로 복원합니다.',
//       icon: 'error',
//       confirmButtonText: '확인'
//     });

//     // 롤백 처리
//     if (vm?.rollback) {
//       vm.rollback();
//     }
//   };

//   // Vue 경고 핸들러 추가 (개발 중 경고를 잡기 위해)
//   app.config.warnHandler = (msg, vm, trace) => {
//     console.warn('Vue 경고:', msg, trace);

//     Swal.fire({
//         title: '오류 발생',
//         text: '예기치 않은 오류가 발생했습니다. 이전 상태로 복원합니다.',
//         icon: 'error',
//         confirmButtonText: '확인'
//       });

//       // 롤백 처리
//       if (vm?.rollback) {
//         vm.rollback();
//       }
//   };

//   // 비동기 오류 캐치
//   window.onerror = function (message, source, lineno, colno, error) {
//     console.error('전역 오류 발생:', message, 'Source:', source, 'Line:', lineno, 'Column:', colno, 'Error:', error);

//     Swal.fire({
//       title: '오류 발생',
//       text: '예기치 않은 오류가 발생했습니다.',
//       icon: 'error',
//       confirmButtonText: '확인'
//     });
//   };

//   // Promise 관련 에러 잡기
//   window.addEventListener('unhandledrejection', event => {
//     console.error('Unhandled Promise rejection:', event.reason);
//     Swal.fire({
//       title: '오류 발생',
//       text: '비동기 작업 중 오류가 발생했습니다.',
//       icon: 'error',
//       confirmButtonText: '확인'
//     });
//   });

//   app.mount('#app');

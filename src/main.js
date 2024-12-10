import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import store from './store'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { AgGridVue } from 'ag-grid-vue3'
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import  "ag-grid-charts-enterprise";
import { useLoading } from 'vue-loading-overlay'
import 'v-calendar/style.css';
import { Calendar, DatePicker } from 'v-calendar'
import './customStyle/style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘만 import
import { far } from '@fortawesome/free-regular-svg-icons'; // Regular 아이콘
import 'realgrid/dist/realgrid-style.css';



library.add(fas ,far );

createApp(App).use(router).use(store).use('Loading', useLoading)
.component('VueDatePicker',VueDatePicker).component("font-awesome-icon", FontAwesomeIcon).component('VDatePicker',DatePicker ).component('VCalendar',Calendar ).component("ag-grid-vue",AgGridVue).mount('#app');



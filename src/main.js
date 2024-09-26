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

createApp(App).use(router).use(store)
.component('VueDatePicker',VueDatePicker).component("ag-grid-vue",AgGridVue).mount('#app');



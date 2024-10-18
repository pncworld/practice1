// eslint-disable-next-line no-unused-vars
import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '@/views/DashBoard.vue'
import DailySales from '@/views/DailySales.vue'
import CancelSales from '@/views/CancelSales.vue'
import DailySales2 from '../views/DailySales2.vue'
import LoginView from '../views/LoginView.vue'
import MasterEnroll from '@/views/masterEnroll.vue'
import StoreEnroll from '@/views/StoreEnroll.vue'
import HomePage from '@/views/homePage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoard
  }
  ,
  {
    path: '/SLS06_004RPT.xml',
    name: 'dailysales',
    component: DailySales
  },
  
  {
    path: '/SLS06_003RPT.xml',
    name: 'dailysales2',
    component: DailySales2
  }
  ,
  {
    path: '/cancelsales',
    name: 'cancelsales', 
    component: CancelSales
  }
  ,
  {
    path: '/MST01_032INS.xml',
    name: 'masterEnroll',
    component: MasterEnroll
  }
  ,{
    path: '/MST01_002INS.xml',
    name: 'storeEnroll',
    component: StoreEnroll
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

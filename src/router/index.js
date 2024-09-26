// eslint-disable-next-line no-unused-vars
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashBoard from '@/views/DashBoard.vue'
import DailySales from '@/views/DailySales.vue'
import CancelSales from '@/views/CancelSales.vue'

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
    path: '/dailysales',
    name: 'dailysales',
    component: DailySales
  }
  ,
  {
    path: '/MISALES::SLS06_004RPT.xml',
    name: 'dailysales',
    component: DailySales
  }
  ,
  {
    path: '/cancelsales',
    name: 'cancelsales', 
    component: CancelSales
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

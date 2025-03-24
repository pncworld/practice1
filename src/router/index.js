// eslint-disable-next-line no-unused-vars
import DashBoard from '@/views/DashBoard.vue'
import { createRouter, createWebHistory } from 'vue-router'


import HomePage from '@/views/homePage.vue'
import LoginView from '../views/LoginView.vue'
import accountRouter from './accountRouter'
import masterRouter from './masterRouter'
import miattendRouter from './miattendRouter'
import mobileRouter from './mobileRouter'
import salesRouter from './salesRouter'
import systemRouter from './systemRouter'
import MobileLogin from '@/views/MOBILE/common/mobileLogin.vue'




const isMobile = () =>{
  const userAgent = window.navigator.userAgent;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
} 


const routes = [
  {
    path: '/',

    component: !isMobile() ? LoginView : MobileLogin
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoard
  }
  ,
  {
    path: '/MISALES',
    //component : BasicLayout ,
    children: salesRouter()
  },
  {
    path: '/MIMASTER',
    //component : BasicLayout ,
    children: masterRouter()
  },
  {
    path: '/MIATTEND',
    //component : BasicLayout ,
    children: miattendRouter()
  },
  {
    path: '/MOBILE',
    //component : BasicLayout ,
    children: mobileRouter()
  },
  
  
  {
    path: '/homePage',
    name: 'homePage',
    component: HomePage
   
  },
  {
    path: '/MIACCOUNT',
    //component : BasicLayout ,
    children: accountRouter()
  },
  {
    path: '/MISYSTEM',
    children: systemRouter()
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})







export default router

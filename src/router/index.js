// eslint-disable-next-line no-unused-vars
import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '@/views/DashBoard.vue'

import LoginView from '../views/LoginView.vue'

import HomePage from '@/views/homePage.vue'
import salesRouter from './salesRouter'
import masterRouter from './masterRouter'
import mobileRouter from './mobileRouter'
import miattendRouter from './miattendRouter'
import accountRouter from './accountRouter'
import systemRouter from './systemRouter'


const isMobile = () =>{
  const userAgent = window.navigator.userAgent;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}
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
    path: '/m',
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

import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Mypage from '../pages/Mypage.vue'
// import AddTransaction from '../pages/AddTransaction.vue'
import Home from '../pages/Home.vue'
import TransactionList from '../pages/TransactionList.vue'


const routes = [
  { 
    path: '/', 
    name: 'login',
    component: Login
  },
  { 
    path: '/home', 
    name: 'home',
    component: Home
},
  { 
    path: '/list', 
    name: 'list',
    component: TransactionList
  },
  // { 
  //   path: '/add', 
  //   name: 'add',
  //   component: AddTransaction
  // },
  // { 
  //   path: '/edit/:id', 
  //   name: 'edit',
  //   component: AddTransaction, // 등록 페이지 재사용
  //   props: true // URL의 id를 컴포넌트의 props로 전달
  // },
  { 
    path: '/mypage', 
    name: 'mypage',
    component: Mypage,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
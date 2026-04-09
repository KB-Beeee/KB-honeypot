<template>

<div class="login-wrapper">
  <div class="login-card">
    <div class="card-header"></div>
    <img class="card-img-left" src="../assets/images/꿀벌/빵긋꿀벌.png" alt="bee">
  	<div class="card-body">
		  <h5 class="card-text">이메일 : 
        <input type="email" placeholder="honeypot@example.com" 
         v-model="loginForm.email" ></h5>
		  <h5 class="card-text">비밀번호 : 
        <input type="password" v-model="loginForm.pwd"> </h5>
      <button class="login-btn" @click="loginHandler">로그인</button>
	  </div>
  </div>
</div>

</template>

<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 

const loginForm = reactive({
  email: '',
  pwd: ''
 });

const userUrl = 'http://localhost:3000/users'; 

const loginHandler = async () => {
    if (!loginForm.email || !loginForm.pwd) {
    alert('이메일과 비밀번호를 모두 입력해주세요.');
    return; // 빈 값이면 함수 종료
  }

  try {
    const userResponse = await axios.get(userUrl);
    const users = userResponse.data;

    const foundUser = users.find(user => 
      user.email === loginForm.email && user.password == loginForm.pwd
    );

    if(foundUser) {
      alert(`${foundUser.name}님, 환영합니다🍯`);
      router.push('/home');
    }
  
   } catch (error) {
        alert('로그인 처리 중 에러 발생: ' + error);
    } 
}

</script>

<style scoped>
@import '@/assets/css/login.css';
</style>
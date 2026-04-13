<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img class="card-img-left" src="../assets/images/꿀벌/빵긋꿀벌.png" alt="bee">
      <div class="card-body">
        <div class="input-group">
          <input type="email" placeholder="이메일을 입력하세요" v-model="loginForm.email">
        </div>
        <div class="input-group">
          <input type="password" placeholder="비밀번호를 입력하세요" v-model="loginForm.pwd" @keyup.enter="loginHandler">
        </div>
        <button class="login-btn" @click="loginHandler">로그인</button>
      </div>
    </div>

    <div class="modal-overlay" v-if="isModalOpen">
      <div class="modal-box">
        <img src="../assets/images/꿀벌/빵긋꿀벌.png" alt="happy bee" class="modal-bee">
        <p>{{ welcomeMessage }}</p>
        <div class="modal-buttons">
          <button class="confirm-btn" @click="closeModalAndGoHome">확인</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive } from 'vue'; // ✨ ref 추가
import { useRouter } from 'vue-router';

const router = useRouter(); 

const loginForm = reactive({
  email: '',
  pwd: ''
});

// ✨ 모달창 상태 관리
const isModalOpen = ref(false);
const welcomeMessage = ref('');

const userUrl = 'http://localhost:3000/users'; 

const loginHandler = async () => {
  if (!loginForm.email || !loginForm.pwd) {
    alert('이메일과 비밀번호를 모두 입력해주세요.');
    return;
  }

  try {
    const userResponse = await axios.get(userUrl);
    const users = userResponse.data;

    const foundUser = users.find(user => 
      user.email === loginForm.email && user.password == loginForm.pwd
    );

    if(foundUser) {
      // ✨ alert 대신 모달창 열기
      welcomeMessage.value = `${foundUser.name}님, 환영합니다🍯`;
      isModalOpen.value = true; 
    } else {
      // 일치하는 유저가 없을 때의 처리 (선택사항)
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  
  } catch (error) {
    alert('로그인 처리 중 에러 발생: ' + error);
  } 
};

// ✨ 모달창 닫고 홈으로 이동하는 함수
const closeModalAndGoHome = () => {
  isModalOpen.value = false;
  router.push('/home');
};
</script>

<style scoped>
@import '@/assets/css/login.css';
</style>
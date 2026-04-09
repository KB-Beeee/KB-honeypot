<template>
  <div class="mypage-wrapper">
    <div class="mypage-content">
      
      <div class="profile-card">
        <button class="editBtn">수정</button>
        
        <img class="card-img-left" src="../assets/images/꿀벌/피식꿀벌.png" alt="bee">
        
        <div class="card-body">
          <div class="info-row">
            <span class="label">이름 :</span>
            <span class="value">{{ userInfo.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">이메일 :</span>
            <span class="value">{{ userInfo.email }}</span>
          </div>
        </div>
      </div>

      <div class="honey-pot-area">
        <p class="challenge-title">출석 챌린지</p>
        <p class="challenge-days">3일째 기록 중</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// UI 확인을 위해 더미데이터 입력
const userInfo = ref({
  name: '김꿀벌',
  email: 'abc@gmail.com'
});
</script>

<style scoped>
@import '../assets/css/mypage.css';
</style>
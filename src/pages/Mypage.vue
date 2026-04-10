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
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 1. 화면에 바인딩할 빈 유저 객체 생성
const userInfo = ref({
  name: '',
  email: '',
  password: '',
  att_cnt: 0
});

// 현재 로그인한 유저의 ID (나중에는 로그인 시 저장된 정보를 불러와서 사용)
const currentUserId = 'u001'; 
const userUrl = `http://localhost:3000/users/${currentUserId}`;

// 2. DB에서 유저 정보를 가져오는 함수
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(userUrl);
    
    if (response.status === 200) {
      // db.json에서 성공적으로 가져온 데이터를 userInfo에 덮어씌웁니다.
      // 이렇게 하면 Vue가 알아서 화면의 {{ userInfo.name }} 등을 업데이트해 줍니다.
      userInfo.value = response.data;
    }
  } catch (error) {
    console.error('유저 정보를 불러오는 중 에러 발생:', error);
    alert('유저 정보를 불러오지 못했습니다.');
  }
};

// 3. 컴포넌트가 화면에 렌더링될 때 딱 한 번 실행
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
@import '../assets/css/mypage.css';
</style>
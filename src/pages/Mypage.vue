<template>
  <div class="mypage-wrapper">
    <div class="mypage-content">
      
      <div class="profile-card">
        <button class="editBtn" @click="toggleEditMode">
          {{ isEditMode ? '완료' : '수정' }}
        </button>

        <Bee customClass="card-img-left" />
        <!-- <img class="card-img-left" src="../assets/images/꿀벌/피식꿀벌.png" alt="bee"> -->
        
        <div class="card-body">
          <div class="info-row">
            <span class="label">이름 :</span>
            <span v-if="!isEditMode" class="value">{{ userInfo.name }}</span>
            <div v-else class="edit-input-wrapper">
              <input type="text" v-model="userInfo.name" class="edit-input">
              <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
          </div>
          
          <div class="info-row">
            <span class="label">이메일 :</span>
            <span v-if="!isEditMode" class="value">{{ userInfo.email }}</span>
            <div v-else class="edit-input-wrapper">
              <input type="email" v-model="userInfo.email" class="edit-input">
              <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="honey-pot-area">
        <p class="challenge-title">출석 챌린지</p>
        <p class="challenge-days">3일째 기록 중</p>
      </div> -->
      <Attendance_Honeypot />

    </div>
  </div>

  <footer class="mypage-footer">
    <button class="footer-logout-btn" @click="openModal(isEditMode ? 'withdraw' : 'logout')">
      {{ isEditMode ? '탈퇴하기' : '로그아웃' }}
    </button>
  </footer>

  <div class="modal-overlay" v-if="isModalOpen">
    <div class="modal-box">
      <img src="../assets/images/꿀벌/우는꿀벌.png" alt="crying bee" class="modal-crying-bee">
      
      <p>{{ modalType === 'withdraw' ? '정말 탈퇴하시겠습니까?' : '정말 로그아웃 하시겠습니까?' }}</p>
      
      <div class="modal-buttons">
        <button class="cancel-btn" @click="closeModal">취소</button>
        <button class="confirm-btn" @click="executeAction">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Bee from '../components/bee.vue';
import Attendance_Honeypot from '../components/Attendance_Honeypot.vue';

const router = useRouter(); 

const userInfo = ref({
  name: '',
  email: '',
  password: '',
  att_cnt: 0
});

const currentUserId = 'u001'; 
const userUrl = `http://localhost:3000/users/${currentUserId}`;

const fetchUserInfo = async () => {
  try {
    const response = await axios.get(userUrl);
    if (response.status === 200) {
      userInfo.value = response.data;
    }
  } catch (error) {
    console.error('유저 정보를 불러오는 중 에러 발생:', error);
  }
};

const isEditMode = ref(false); 

const toggleEditMode = async () => {
  if (isEditMode.value) {
    try {
      await axios.put(userUrl, userInfo.value);
    } catch (error) {
      console.error('정보 수정 중 에러 발생:', error);
      alert('정보 수정에 실패했습니다.');
    }
  }
  isEditMode.value = !isEditMode.value;
};

// --- 👇 통합된 모달 관리 로직 ---
const isModalOpen = ref(false);
const modalType = ref(''); // 'logout' 또는 'withdraw' 상태 저장

// 버튼을 누를 때 어떤 모달을 띄울지 문자열을 받아옵니다.
const openModal = (type) => {
  modalType.value = type;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// 확인 버튼을 누르면 modalType에 따라 각각 다른 로직을 실행합니다.
const executeAction = async () => {
  if (modalType.value === 'withdraw') {
    try {
      // 1. 탈퇴 로직
      await axios.delete(userUrl);
      isModalOpen.value = false; 
      router.push('/');
    } catch (error) {
      console.error('탈퇴 처리 중 에러 발생:', error);
    }
  } else {
    // 2. 로그아웃 로직 (스토리지 비우기 등)
    isModalOpen.value = false;
    router.push('/');
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
@import '../assets/css/mypage.css';
</style>
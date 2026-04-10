<template>
  <div class="bee-container">
    <img :src="beeImage" alt="Bee Status" :class="customClass" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

import tiredBee from '@/assets/images/꿀벌/피곤꿀벌.png';
import sadBee from '@/assets/images/꿀벌/울상꿀벌.png';
import cryingBee from '@/assets/images/꿀벌/우는꿀벌.png';
import basicBee from '@/assets/images/꿀벌/기본꿀벌.png';
import happyBee from '@/assets/images/꿀벌/빵긋꿀벌.png';
import smirkingBee from '@/assets/images/꿀벌/피식꿀벌.png';

const props = defineProps({
  customClass: {
    type: String,
    default: 'bee-icon',
  },
});

const attCnt = ref(0);
const loading = ref(true);

// 0일이거나 2일 이상일 때 랜덤 이미지를 고르기
const getRandomImage = (imgArray) => {
  const randomIndex = Math.floor(Math.random() * imgArray.length);
  return imgArray[randomIndex];
};

// 출석 횟수에 따른 이미지 계산
const beeImage = computed(() => {
  if (loading.value) return basicBee; // 로딩 중 기본값

  if (attCnt.value === 0) {
    return getRandomImage([tiredBee, sadBee, cryingBee]);
  } else if (attCnt.value === 1) {
    return basicBee;
  } else {
    // 2일 이상
    return getRandomImage([happyBee, smirkingBee]);
  }
});

const fetchUserAttendance = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/users/u001');
    attCnt.value = response.data.att_cnt;
  } catch (error) {
    console.error('사용자 데이터 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserAttendance();
});
</script>

<style scoped>
.bee-icon {
  width: 50px;
  height: auto;
}
.bee-large {
  width: 200px;
  height: auto;
}
</style>

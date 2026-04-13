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
const API_URL = import.meta.env.VITE_API_URL;
const props = defineProps({
  customClass: {
    type: String,
    default: 'bee-icon',
  },
});

const transactions = ref([]);
const attCnt = ref(0);
const loading = ref(true);

// 연속 출석 계산 로직
const calculateAttendance = () => {
  if (transactions.value.length === 0) {
    attCnt.value = 0;
    return;
  }

  const recordedDates = new Set(
    transactions.value.map((item) => item.created_at.split('T')[0]),
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayRecorded = recordedDates.has(todayStr);

  let count = 0;
  let checkDate = new Date();

  // 오늘 기록이 없으면 어제부터 역산, 있으면 오늘부터 역산
  if (!isTodayRecorded) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const formattedCheckDate = checkDate.toISOString().split('T')[0];
    if (recordedDates.has(formattedCheckDate)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  attCnt.value = count;
};

// 출석 횟수에 따른 이미지 계산
const beeImage = computed(() => {
  if (loading.value) return basicBee;

  if (attCnt.value === 0) {
    return getRandomImage([tiredBee, sadBee, cryingBee]);
  } else if (attCnt.value === 1) {
    return basicBee;
  } else {
    // 2일 이상일 때
    return getRandomImage([happyBee, smirkingBee]);
  }
});

const getRandomImage = (imgArray) => {
  const randomIndex = Math.floor(Math.random() * imgArray.length);
  return imgArray[randomIndex];
};

const fetchData = async () => {
  try {
    loading.value = true;
    // 출석 기록이 담긴 transactions API 호출
    const res = await axios.get(`${API_URL}/transactions`);
    transactions.value = res.data;
    calculateAttendance();
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
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

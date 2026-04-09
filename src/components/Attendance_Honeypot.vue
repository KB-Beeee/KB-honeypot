<template>
  <div class="attendance-card">
    <h3 class="attendance-title">출석 챌린지</h3>

    <div class="status-message">
      <div v-if="isTodayRecorded" class="recorded-box">
        <p class="attendance-count">
          <span class="highlight">{{ attendanceCount }}일째 기록 중!</span>
        </p>
        <p class="sub-text">오늘의 꿀을 수확했어요 🍯</p>
      </div>

      <div v-else class="waiting-box">
        <p class="attendance-count">
          <span class="highlight">{{ attendanceCount }}일째 기록 중!</span>
        </p>
        <p class="sub-text">오늘 기록하면 {{ attendanceCount + 1 }}일째~✨</p>
      </div>
    </div>

    <div class="pot-image-wrapper">
      <img
        :src="currentPotImage"
        :alt="`${attendanceCount}단계 꿀단지`"
        class="honey-pot-img"
        :class="{ 'not-recorded': !isTodayRecorded }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const transactions = ref([]);
const attendanceCount = ref(0); // 실제 연속 일수 (제한 없음)
const isTodayRecorded = ref(false);

const potImages = [
  new URL('@/assets/images/꿀단지/0단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/1단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/2단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/3단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/4단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/5단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/6단계.png', import.meta.url).href,
];

const currentPotImage = computed(() => {
  // 숫자는 100일, 1000일 계속 올라가도
  // 이미지는 인덱스 6(6단계.png)까지만 참조하도록 제한
  const index = Math.min(attendanceCount.value, 6);
  return potImages[index];
});

const calculateAttendance = () => {
  const recordedDates = new Set(
    transactions.value.map((item) => item.created_at.split('T')[0]),
  );

  const todayStr = new Date().toISOString().split('T')[0];
  isTodayRecorded.value = recordedDates.has(todayStr);

  let count = 0;
  let checkDate = new Date();

  if (!isTodayRecorded.value) {
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
  // 여기서 count는 제한 없이 계속 쌓입니다.
  attendanceCount.value = count;
};

const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/transactions');
    transactions.value = res.data;
    calculateAttendance();
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.highlight {
  color: #f6bd60;
  font-size: 3rem;
  font-weight: 800;
  -webkit-text-stroke: 0.1px #ffd289;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.attendance-card {
  text-align: center;
  padding: 10px;
}
.attendance-title {
  font-size: 2.5rem;
  color: #555;
  margin-bottom: 15px;
  font-weight: lighter;
}
.sub-text {
  font-size: 0.95rem;
  color: #888;
  margin-top: 5px;
}
.pot-image-wrapper {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.honey-pot-img {
  width: 200px;
  height: auto;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 오늘 기록하지 않았을 때 이미지를 살짝 투명하게 처리하여 동기부여 제공 */
.honey-pot-img.not-recorded {
  filter: grayscale(0.3) opacity(0.7);
  transform: scale(0.95);
}

.honey-pot-img:hover {
  transform: scale(1.05) rotate(-3deg);
}
</style>

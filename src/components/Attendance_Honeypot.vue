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
      <div class="pot-container">
        <img
          :src="currentPotImage"
          :alt="`${attendanceCount}단계 꿀단지`"
          class="honey-pot-img"
          :class="{ 'not-recorded': !isTodayRecorded }"
        />
        <div class="attendance-percentage">{{ attendancePercentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const transactions = ref([]);
const attendanceCount = ref(0);
const isTodayRecorded = ref(false);

// 7일을 100% 기준으로 퍼센트 계산
const attendancePercentage = computed(() => {
  const percent = Math.floor((attendanceCount.value / 7) * 100);
  return percent > 100 ? 100 : percent;
});

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
  const count = attendanceCount.value;
  let index = 0;

  if (count === 0) index = 0;
  else if (count === 1) index = 1;
  else if (count === 2) index = 2;
  else if (count === 3) index = 3;
  else if (count === 4) index = 3;
  else if (count === 5) index = 4;
  else if (count === 6) index = 5;
  else index = 6;

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
/* 기존 스타일 유지 */
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

/* 퍼센트 표시를 위한 스타일 추가 */
.pot-image-wrapper {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.pot-container {
  position: relative;
  display: inline-block;
}

.attendance-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.85);
  color: #f6bd60;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none; /* 이미지 호버 방해 금지 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #f6bd60;
}

/* 호버 시 퍼센트 표시 */
.pot-container:hover .attendance-percentage {
  opacity: 1;
}

.honey-pot-img {
  width: 200px;
  height: auto;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.honey-pot-img.not-recorded {
  filter: grayscale(0.3) opacity(0.7);
  transform: scale(0.95);
}

.honey-pot-img:hover {
  transform: scale(1.05) rotate(-3deg);
  filter: brightness(1.1);
}
</style>

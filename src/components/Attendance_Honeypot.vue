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

const API_URL = import.meta.env.VITE_API_URL;
const transactions = ref([]);
const attendanceCount = ref(0);
const isTodayRecorded = ref(false);

// 7일 연속 출석을 100% 기준으로 계산
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

  // 꿀단지 단계별 이미지 매칭 (인덱스 오류 수정)
  if (count === 0) index = 0;
  else if (count === 1) index = 1;
  else if (count === 2) index = 2;
  else if (count === 3) index = 3;
  else if (count === 4)
    index = 4; // 4단계 정상 반영
  else if (count === 5) index = 5;
  else index = 6; // 6일 이상은 모두 만렙 꿀단지

  return potImages[index];
});

const calculateAttendance = () => {
  // 사용자가 입력한 '거래 날짜'인 date를 기준으로 Set 생성
  const recordedDates = new Set(transactions.value.map((item) => item.date));

  // 현재 날짜 구하기 (KST 기준 yyyy-mm-dd)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  isTodayRecorded.value = recordedDates.has(todayStr);

  let count = 0;
  let checkDate = new Date();

  // 오늘 기록이 없으면 '어제'부터 과거로 역추적
  if (!isTodayRecorded.value) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const formattedCheckDate = `${y}-${m}-${d}`;

    if (recordedDates.has(formattedCheckDate)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1); // 하루 전으로 이동하여 계속 확인
    } else {
      break; // 기록이 끊긴 날을 만나면 루프 종료
    }
  }
  attendanceCount.value = count;
};

const fetchData = async () => {
  try {
    const res = await axios.get(`${API_URL}/transactions`);
    // 삭제되지 않은 데이터만 사용
    transactions.value = res.data.filter((t) => !t.is_deleted);
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
/* 텍스트 강조 스타일 */
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

/* 꿀단지 컨테이너 */
.pot-image-wrapper {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.pot-container {
  position: relative;
  display: inline-block;
}

/* 호버 시 퍼센트 표시 UI */
.attendance-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: #f6bd60;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #f6bd60;
}

.pot-container:hover .attendance-percentage {
  opacity: 1;
}

/* 꿀단지 이미지 스타일 */
.honey-pot-img {
  width: 200px;
  height: auto;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.honey-pot-img.not-recorded {
  filter: grayscale(0.2) opacity(0.8);
  transform: scale(0.95);
}

.honey-pot-img:hover {
  transform: scale(1.05) rotate(-3deg);
  filter: brightness(1.05);
}
</style>

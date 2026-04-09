<template>
  <div class="monthly-honeypot">
    <span class="monthly-text">{{ currentMonth }}월 꿀단지 상태</span>
    <img
      :src="currentPotImage"
      :alt="`Honeypot_Level_${attendanceCount}`"
      class="month-icon"
    />
  </div>

  <div class="card-container">
    <div class="status-card income">
      <h3 class="card-title">총 수입</h3>
      <p class="card-amount">{{ totalIncome.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/icon/money_icon.png"
        alt="Card Income"
        class="card-illustration"
      />
    </div>

    <div class="status-card expense">
      <h3 class="card-title">총 지출</h3>
      <p class="card-amount">{{ totalExpense.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/icon/cart_icon.png"
        alt="Card Expense"
        class="card-illustration"
      />
    </div>

    <div class="status-card profit">
      <h3 class="card-title">순이익</h3>
      <p class="card-amount">{{ profit.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/icon/graph_icon.png"
        alt="Card Profit"
        class="card-illustration"
      />
    </div>
  </div>

  <div class="attendance-section">
    <Attendance_Honeypot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Attendance_Honeypot from './Attendance_Honeypot.vue';

// 상태 관리
const transactions = ref([]);
const categories = ref([]);
const attendanceCount = ref(0);
const isTodayRecorded = ref(false);

// 날짜 관련
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

// 🍯 꿀단지 이미지 배열 (0단계 ~ 6단계)
const potImages = [
  new URL('@/assets/images/꿀단지/0단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/1단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/2단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/3단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/4단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/5단계.png', import.meta.url).href,
  new URL('@/assets/images/꿀단지/6단계.png', import.meta.url).href,
];

// 상단 이미지 동적 바인딩 (최대 6단계 고정)
const currentPotImage = computed(() => {
  const index = Math.min(attendanceCount.value, 6);
  return potImages[index];
});

// 데이터 가져오기
const fetchData = async () => {
  try {
    const [transRes, catRes] = await Promise.all([
      axios.get('http://localhost:3000/transactions'),
      axios.get('http://localhost:3000/categories'),
    ]);
    transactions.value = transRes.data;
    categories.value = catRes.data;

    // 데이터 로드 후 출석 로직 계산
    calculateAttendance();
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

// 연속 출석 일수 계산 로직
const calculateAttendance = () => {
  const recordedDates = new Set(
    transactions.value.map((item) => item.created_at.split('T')[0]),
  );

  const todayStr = new Date().toISOString().split('T')[0];
  isTodayRecorded.value = recordedDates.has(todayStr);

  let count = 0;
  let checkDate = new Date();

  // 오늘 기록이 없으면 어제부터 역추적
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

onMounted(() => {
  fetchData();
});

// --- 통계 계산 로직 ---

// 이번 달 거래내역 필터링
const currentMonthTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === currentYear && m === currentMonth;
  });
});

// 카테고리 ID로 타입 찾기
const getTransType = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.type : '';
};

// 수입/지출/순이익 계산
const totalIncome = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => getTransType(t.category_id) === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

const totalExpense = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => getTransType(t.category_id) === 'expense')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

const profit = computed(() => totalIncome.value - totalExpense.value);
</script>

<style scoped>
@import '@/assets/css/card.css';
</style>

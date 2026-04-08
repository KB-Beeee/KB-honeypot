<template>
  <div class="monthly-honeypot">
    <span class="monthly-text">{{ currentMonth }}월 꿀단지 상태</span>
    <img
      src="@/assets/images/꿀단지/6단계.png"
      alt="Honeypot_6"
      class="month-icon"
    />
  </div>

  <div class="card-container">
    <div class="status-card income">
      <h3 class="card-title">총 수입</h3>
      <p class="card-amount">{{ totalIncome.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/card_income.png"
        alt="Card Income"
        class="card-illustration"
      />
    </div>

    <div class="status-card expense">
      <h3 class="card-title">총 지출</h3>
      <p class="card-amount">{{ totalExpense.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/card_expense.png"
        alt="Card Expense"
        class="card-illustration"
      />
    </div>

    <div class="status-card profit">
      <h3 class="card-title">순이익</h3>
      <p class="card-amount">{{ profit.toLocaleString() }} 원</p>
      <img
        src="@/assets/images/card_profit.png"
        alt="Card Profit"
        class="card-illustration"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'; // axios 임포트

// 1. 빈 배열로 초기화
const transactions = ref([]);

// 2. 외부 JSON Server에서 데이터 가져오기
const fetchTransactions = async () => {
  try {
    // JSON Server 주소
    const response = await axios.get('http://localhost:3000/transactions');
    transactions.value = response.data;
  } catch (error) {
    console.error('데이터를 불러오는데 실패했습니다:', error);
  }
};

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  fetchTransactions();
});

// 현재 기준 날짜 (오늘 날짜)
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

// 이번 달 거래내역 필터링 (연도와 월 모두 일치)
const currentMonthTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const transDate = new Date(t.date);
    return (
      transDate.getFullYear() === currentYear &&
      transDate.getMonth() + 1 === currentMonth
    );
  });
});

// 위 데이터에서 수입만 합산
const totalIncome = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => t.trans_type === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);
});

// 위 데이터에서 지출만 합산
const totalExpense = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => t.trans_type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);
});

//순수익 계산
const profit = computed(() => {
  return totalIncome.value - totalExpense.value;
});
</script>

<style scoped>
@import '../assets/css/card.css';
</style>

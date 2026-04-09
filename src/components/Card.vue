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
import axios from 'axios';

const transactions = ref([]);
const categories = ref([]); // 카테고리 정보도 가져와야 합니다.

const fetchData = async () => {
  try {
    // 두 데이터를 동시에 가져옵니다.
    const [transRes, catRes] = await Promise.all([
      axios.get('http://localhost:3000/transactions'),
      axios.get('http://localhost:3000/categories'),
    ]);
    transactions.value = transRes.data;
    categories.value = catRes.data;
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

onMounted(() => {
  fetchData();
});

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

// 이번 달 거래내역 필터링
const currentMonthTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === currentYear && m === currentMonth;
  });
});

// 카테고리 ID를 통해 수입/지출 타입을 판단
const getTransType = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.type : ''; // 'income' 또는 'expense' 반환
};

// 총 수입 계산
const totalIncome = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => getTransType(t.category_id) === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

// 총 지출 계산
const totalExpense = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => getTransType(t.category_id) === 'expense')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

// 순수익 계산
const profit = computed(() => {
  return totalIncome.value - totalExpense.value;
});
</script>

<style scoped>
@import '../assets/css/card.css';
</style>

<template>
  <div class="home-container">
    <div class="left-section">
      <div class="scroll-container">
        <div class="content-card calendar-wrapper">
          <Calendar />
        </div>

        <h1 class="title">최근 내역</h1>

        <div class="content-card transaction-list-card">
          <div v-if="loading" class="loading">데이터를 불러오는 중...</div>

          <div v-else-if="recentTransactions.length === 0" class="empty">
            최근 내역이 없습니다.
          </div>

          <div
            v-else
            v-for="item in recentTransactions"
            :key="item.id"
            class="transaction-item"
          >
            <span class="date">{{ formatDate(item.date) }}</span>

            <span :class="['amount', getTransType(item.category_id)]">
              {{ getTransType(item.category_id) === 'expense' ? '-' : '' }}
              {{ item.amount.toLocaleString() }}원
            </span>

            <span class="category">{{
              getCategoryName(item.category_id)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <aside class="right-section">
      <Card />
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Calendar from '../components/Calendar.vue';
import Card from '../components/Card.vue';

// 상태 관리
const transactions = ref([]);
const categories = ref([]);
const loading = ref(true);

// API 데이터 가져오기 (Transactions & Categories)
const fetchData = async () => {
  try {
    loading.value = true;
    const [transRes, catRes] = await Promise.all([
      axios.get('http://localhost:3000/transactions'),
      axios.get('http://localhost:3000/categories'),
    ]);
    transactions.value = transRes.data;
    categories.value = catRes.data;
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// 최근 날짜순 5개 추출 로직
const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// 카테고리 ID로 'income' 또는 'expense' 타입 찾기
const getTransType = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.type : 'expense';
};

// 카테고리 ID로 카테고리 이름 찾기
const getCategoryName = (id) => {
  const category = categories.value.find((c) => c.id === id);
  return category ? category.name : '기타';
};

// 날짜 포맷 (2026-04-07 -> 04. 07)
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${m}. ${d}`;
};
</script>
<style scoped>
@import '../assets/css/home.css';
</style>

<template>
  <div class="home-container">
    <div class="left-section">
      <div class="scroll-container">
        <div
          :class="[
            'content-card calendar-main-card',
            { 'split-layout': selectedDate },
          ]"
        >
          <div class="calendar-container">
            <Calendar @date-selected="handleDateSelected" />
          </div>
          <div v-if="selectedDate" class="day-detail-panel">
            <div class="detail-header">
              <h3>{{ formatDateDetail(selectedDate) }} 내역</h3>
              <button class="close-btn" @click="selectedDate = null">✕</button>
            </div>

            <div class="detail-list">
              <div v-if="filteredTransactions.length === 0" class="empty-msg">
                내역이 없습니다.
              </div>
              <div
                v-else
                v-for="item in filteredTransactions"
                :key="item.id"
                class="detail-item"
              >
                <span class="detail-cat">{{
                  getCategoryName(item.category_id)
                }}</span>
                <span :class="['detail-amt', getTransType(item.category_id)]">
                  {{
                    getTransType(item.category_id) === 'expense' ? '  -' : '  +'
                  }}
                  {{ item.amount.toLocaleString() }}원
                </span>
              </div>
            </div>
          </div>
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
const selectedDate = ref(null); //클릭 날짜 저장

// API 데이터 가져오기 (Transactions & Categories)
const fetchData = async () => {
  try {
    loading.value = true;
    const [transRes, catRes] = await Promise.all([
      axios.get('http://localhost:3000/transactions'),
      axios.get('http://localhost:3000/categories'),
    ]);
    transactions.value = transRes.data.filter((t) => t.is_deleted === false);
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

//날짜 클릭 핸들러
const handleDateSelected = (date) => {
  selectedDate.value = date;
};

//선택된 날짜 내역만 필터링
const filteredTransactions = computed(() => {
  if (!selectedDate.value) return [];
  return transactions.value.filter((t) => t.date === selectedDate.value);
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

const formatDateDetail = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(m)}월 ${parseInt(d)}일`;
};
</script>
<style scoped>
@import '../assets/css/home.css';
</style>

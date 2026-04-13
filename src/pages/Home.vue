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

            <div class="detail-footer">
              <button class="fab-btn shadow-sm" @click="isAddModalOpen = true">
                <span class="plus-icon">+</span>
              </button>
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

    <div
      class="modal-overlay"
      v-if="isAddModalOpen"
      @click.self="isAddModalOpen = false"
    >
      <AddTransaction
        :initialDate="selectedDate"
        @close="isAddModalOpen = false"
        @refresh="fetchData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Calendar from '../components/Calendar.vue';
import Card from '../components/Card.vue';
import AddTransaction from '../components/AddTransaction.vue';

// 상태 관리
const transactions = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedDate = ref(null);
const isAddModalOpen = ref(false);
const API_URL = import.meta.env.VITE_API_URL;
// 데이터 가져오기
const fetchData = async () => {
  try {
    loading.value = true;
    const [transRes, catRes] = await Promise.all([
      axios.get(`${API_URL}/transactions`),
      axios.get(`${API_URL}/categories`),
    ]);
    // 삭제되지 않은 내역만 필터링
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

// 날짜 클릭 핸들러
const handleDateSelected = (date) => {
  selectedDate.value = date;
};

// 선택된 날짜 내역 필터링
const filteredTransactions = computed(() => {
  if (!selectedDate.value) return [];
  return transactions.value.filter((t) => t.date === selectedDate.value);
});

// 최근 내역 5개 (최신순)
const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => {
      // 날짜(date)가 다르면 날짜순 정렬 (최신날짜가 위로)
      if (a.date !== b.date) {
        return new Date(b.date) - new Date(a.date);
      }

      // 날짜가 같다면 생성시간(created_at)으로 정렬
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      // 생성시간마저 같다면(또는 없다면) id를 문자열로 비교
      return b.id.localeCompare(a.id);
    })
    .slice(0, 5);
});

// 유틸리티 함수들
const getTransType = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.type : 'expense';
};

const getCategoryName = (id) => {
  const category = categories.value.find((c) => c.id === id);
  return category ? category.name : '기타';
};

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
@import '@/assets/css/home.css';
</style>

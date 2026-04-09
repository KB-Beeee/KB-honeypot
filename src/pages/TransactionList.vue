<template>
  <div class="container py-4">
    <div class="d-flex align-items-center gap-3">
      <div
        class="filter-bar d-flex justify-content-end flex-grow-1 p-3 border rounded-pill gap-3"
      >
        <select
          v-model="filterState.period"
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="7">1주일</option>
          <option value="30">1개월</option>
          <option value="90">3개월</option>
        </select>
        <select
          v-model="filterState.type"
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="all">전체</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select>
        <select
          v-model="filterState.sort"
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="latest">최신순</option>
          <option value="oldest">과거순</option>
        </select>
        <div class="vr mx-2"></div>
        <button
          @click="handleReset"
          class="reset-btn d-flex align-items-center gap-1 border-0 bg-transparent me-3"
        >
          reset
        </button>
      </div>
      <button
        @click="handleApply"
        class="apply-btn d-flex align-items-center justify-content-center fw-bold border-0 btn-sm rounded-pill"
      >
        적용
      </button>
    </div>
    <div class="list-container p-4 rounded-4 shadow-sm border mt-4">
      <h5 class="fw-bold mb-4">내 꿀단지 상황</h5>
      <div
        v-for="item in filteredTransactions"
        :key="item.trans_id"
        class="row align-items-center py-3 border-bottom g-0 px-2"
      >
        <div class="col-1 text-muted">{{ item.date }}</div>
        <div
          class="col-2 fw-bold text-end"
          :class="
            getCategory(item.category_id).type === 'expense'
              ? 'text-primary'
              : 'text-danger'
          "
        >
          {{ getCategory(item.category_id).type === 'expense' ? '-' : '+'
          }}{{ item.amount.toLocaleString() }}
        </div>
        <div class="col ms-4 text-secondary">{{ item.memo }}</div>
        <div class="col-auto">
          <button
            @click="openDetail(item)"
            class="btn btn-outline-secondary btn-sm rounded-pill px-3"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>
  </div>

  <TransactionDetail
    :isOpen="isDetailOpen"
    :transaction="selectedItem"
    @close="closeDetail"
  ></TransactionDetail>

  <div class="container py-4">
    <button class="fab-btn shadow-sm" @click="isModalOpen = true">
      <span class="plus-icon">+</span>
    </button>
  </div>

  <div
    class="modal-overlay"
    v-if="isModalOpen"
    @click.self="isModalOpen = false"
  >
    <AddTransaction @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore.js';
import AddTransaction from '@/components/AddTransaction.vue';
import TransactionDetail from '@/components/TransactionDetail.vue';

const isModalOpen = ref(false);

const store = useTransactionStore();

const filterState = ref({
  period: '90',
  type: 'all',
  sort: 'latest',
});

const appliedFilter = ref({ ...filterState.value });

const handleApply = () => {
  appliedFilter.value = { ...filterState.value };
};

const handleReset = () => {
  filterState.value = { period: '90', type: 'all', sort: 'latest' };
  appliedFilter.value = { ...filterState.value };
};

const getCategory = (categoryId) => {
  return store.categories.find((c) => c.id === categoryId) || {};
};

const filteredTransactions = computed(() => {
  if (!store.transactions) return [];

  let list = store.transactions.filter((item) => !item.is_deleted);

  if (appliedFilter.value.type !== 'all') {
    list = list.filter((item) => {
      const category = getCategory(item.category_id);
      return category.type === appliedFilter.value.type;
    });
  }

  const daysLimit = parseInt(appliedFilter.value.period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysLimit);

  list = list.filter((item) => {
    return new Date(item.date) >= startDate;
  });

  list.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (dateA !== dateB) {
      return appliedFilter.value.sort === 'latest'
        ? dateB - dateA
        : dateA - dateB;
    }

    const createA = new Date(a.created_at).getTime();
    const createB = new Date(b.created_at).getTime();

    if (appliedFilter.value.sort === 'latest') {
      return createB - createA;
    } else {
      return createA - createB;
    }
  });

  return list;
});

const isDetailOpen = ref(false);
const selectedItem = ref(null);

const openDetail = (item) => {
  selectedItem.value = item;
  isDetailOpen.value = true;
};

const closeDetail = () => {
  isDetailOpen.value = false;
  selectedItem.value = null;
};

onMounted(() => {
  store.fetchCategories();
  store.fetchTransactions();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.filter-bar {
  background-color: #f9f9fb;
  border-color: #d5d5d5 !important;
  min-height: 60px;
}
.apply-btn {
  background-color: #f5cac3;
  color: white;
  width: 100px;
  min-height: 60px;
}
.apply-btn:hover {
  background-color: #e8b4ac;
}
.filter-item {
  width: 150px;
}
.reset-btn {
  color: #ea0234;
}
.list-container {
  background-color: #fdfbf9;
}
.fab-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #f6bd60;
  border: none;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 0;
}
.fab-btn:hover {
  background-color: #da911d;
}
.plus-icon {
  font-size: 45px;
  font-weight: 300;
  margin-top: 6px;
}
</style>

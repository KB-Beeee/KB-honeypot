<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-window shadow">
      <div
        class="modal-header d-flex justify-content-between align-items-center mb-4"
      >
        <h5>상세내역</h5>
        <button class="close-x" @click="$emit('close')">X</button>
      </div>
      <div class="modal-body">
        <div class="detail-item">
          <span class="label">날짜</span>
          <span class="value">{{ transaction?.date }}</span>
        </div>
        <div class="detail-item">
          <span class="label">금액</span>
          <span class="value"
            >{{
              getCategory(transaction?.category_id).type === 'expense'
                ? '-'
                : '+'
            }}
            {{ transaction?.amount?.toLocaleString() }}원</span
          >
        </div>
        <div class="detail-item">
          <span class="label">카테고리</span>
          <span class="value">{{
            getCategory(transaction?.category_id).name
          }}</span>
        </div>
        <div class="detail-item">
          <span class="label">메모</span>
          <span class="value">{{ transaction?.memo || '메모 없음' }}</span>
        </div>
      </div>
      <hr class="divider" />
      <div class="modal-footer d-flex justify-content-center gap-3 mt-4">
        <button class="btn-action flex-grow-1">수정</button>
        <button class="btn-action flex-grow-1">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore.js';

const store = useTransactionStore();

defineProps({
  isOpen: Boolean,
  transaction: Object,
});

defineEmits(['close']);

const getCategory = (categoryId) => {
  return store.categories.find((c) => c.id === categoryId) || {};
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-window {
  background-color: white;
  width: 90%;
  max-width: 450px;
  border-radius: 30px;
  padding: 40px;
  position: relative;
}
.modal-header h5 {
  font-size: 1.25rem;
  color: #333;
}
.close-x {
  border: none;
  background: none;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
}
.modal-body {
  margin-top: 10px;
  margin-bottom: 50px;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.label {
  font-weight: bold;
  color: #333;
}
.value {
  color: #555;
  text-align: right;
}
.btn-action {
  background: white;
  border: 1.5px solid black;
  cursor: pointer;
  border-radius: 50px;
  padding: 10px 35px;
  min-width: 110px;
}
.btn-action:hover {
  background-color: #f5f5f5;
}
</style>

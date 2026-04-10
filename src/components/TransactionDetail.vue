<template>
  <Teleport to="body">
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
          <button class="btn-action flex-grow-1" @click="handleEdit">
            수정
          </button>
          <button class="btn-action flex-grow-1" @click="handleDelete">
            삭제
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const store = useTransactionStore();

const props = defineProps({
  isOpen: Boolean,
  transaction: Object,
});

const emit = defineEmits(['close', 'openEdit']);

const handleDelete = async () => {
  // 1. 삭제 여부 확인창 띄우기
  const result = await Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '삭제된 내역은 복구할 수 없습니다!🍯',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ffb3a7', // 가계부 포인트 컬러 (출금색)
    cancelButtonColor: '#aaa',
    confirmButtonText: '삭제할래요',
    cancelButtonText: '아니요',
    reverseButtons: true, // 확인/취소 버튼 위치 반전 (선택 사항)
  });

  // 2. 유저가 '확인'을 눌렀을 때만 삭제 진행
  if (result.isConfirmed) {
    try {
      await store.deleteTransaction(props.transaction.id);

      // 삭제 완료 알림
      await Swal.fire({
        title: '삭제 완료!',
        text: '내역이 정상적으로 삭제되었습니다🍯',
        icon: 'success',
        confirmButtonColor: '#84a59d', // 가계부 포인트 컬러 (테마색)
        confirmButtonText: '확인',
      });

      emit('close'); // 상세창 닫기
    } catch (error) {
      console.error('삭제 실패:', error);
      Swal.fire({
        title: '오류 발생',
        text: '삭제 중 문제가 발생했습니다.🍯',
        icon: 'error',
        confirmButtonColor: '#f5cac3',
      });
    }
  }
};
const handleEdit = () => {
  // 수정 요청
  emit('openEdit', props.transaction);
  emit('close'); // 상세창 닫기
};
const getCategory = (categoryId) => {
  return store.categories.find((c) => c.id === categoryId) || {};
};
</script>

<style scoped>
.modal-overlay {
  /* 1. 화면 전체를 꽉 채우고 고정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* vh 대신 %를 써서 모바일 브라우저 주소창 이슈 방지 */

  /* 2. 배경 설정 */
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);

  /* 3. ⭐ 핵심: 자식(모달창)을 무조건 화면 정중앙에 배치 */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important; /* 위아래 중앙 정렬 */

  z-index: 9999;
}

.modal-window {
  background-color: white;
  width: 90%;
  max-width: 450px;
  border-radius: 30px;
  padding: 30px; 
  position: relative;
  margin: 0; /* 마진 때문에 위로 쏠리는 것 방지 */

  /* 5. 모바일에서 너무 길어지면 내부 스크롤 생기게 (선택사항) */
  max-height: 90vh;
  overflow-y: auto;
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

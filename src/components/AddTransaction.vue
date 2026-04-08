<template>
  <div class="transaction-container">
    <div class="header">
      <span class="close-x">X</span>
      <div class="date-wrapper">
        <div class="date-display">
          {{ formattedDate }}
          <span class="calendar-icon">📅</span>
        </div>
        <input
          type="date"
          class="hidden-date-input"
          v-model="transactionDate"
        />
      </div>
    </div>

    <form @submit.prevent="saveData">
      <div class="main-content">
        <div class="left-panel">
          <div class="amount-wrapper">
            <input
              type="text"
              class="amount-input"
              :value="displayAmount"
              @input="handleAmountInput"
              placeholder="0"
            />
            <span class="currency-unit">원</span>
          </div>

          <div class="type-selector">
            <button
              type="button"
              class="type-btn"
              :class="{ active: transactionType === 'income' }"
              @click="changeType('income')"
            >
              입 금
            </button>

            <button
              type="button"
              class="type-btn"
              :class="{ active: transactionType === 'expense' }"
              @click="changeType('expense')"
            >
              출 금
            </button>
          </div>
        </div>

        <div class="category-panel" v-if="transactionType">
          <div class="category-list">
            <div
              v-for="name in currentCategoryNames"
              :key="name"
              class="category-item"
              :class="{ selected: selectedCategory === name }"
              @click="selectedCategory = name"
            >
              {{ name }}
            </div>
          </div>
        </div>
        <div class="category-panel placeholder-panel" v-else>
          <div class="category-list">
            <div class="category-item disabled">유형을 선택하세요</div>
          </div>
        </div>
      </div>

      <textarea
        class="memo-area"
        v-model="memo"
        placeholder="메 모 (선택사항)"
      ></textarea>

      <div class="footer-action">
        <button type="submit" class="save-submit-btn">저 장</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      transactionDate: new Date().toISOString().substr(0, 10),
      rawAmount: 0,
      transactionType: '', // 'income' 또는 'expense'
      selectedCategory: '', // 사용자가 클릭한 카테고리 '이름'
      memo: '',
      // 서버에서 가져온 카테고리 객체들을 타입별로 저장
      categoryGroups: {
        income: [],
        expense: [],
      },
      rawCategories: [], // 전체 카테고리 원본 (id 파싱용)
    };
  },
  computed: {
    formattedDate() {
      if (!this.transactionDate) return '';
      const [year, month, day] = this.transactionDate.split('-');
      return `${year} 년 ${month} 월 ${day} 일`;
    },
    displayAmount() {
      return this.rawAmount ? this.rawAmount.toLocaleString() : '';
    },
    // 현재 선택된 타입에 따른 카테고리 '이름'들만 추출하여 반환
    currentCategoryNames() {
      if (!this.transactionType) return [];
      return this.categoryGroups[this.transactionType].map((cat) => cat.name);
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.rawCategories = response.data;

        // DB의 type 필드와 정확히 매칭하여 그룹핑
        this.categoryGroups.income = this.rawCategories.filter(
          (cat) => cat.type === 'income',
        );
        this.categoryGroups.expense = this.rawCategories.filter(
          (cat) => cat.type === 'expense',
        );

        console.log('카테고리 로드 완료🍯', this.categoryGroups);
      } catch (error) {
        console.error('카테고리 로딩 실패🍯', error);
      }
    },
    handleAmountInput(e) {
      const val = e.target.value.replace(/[^0-9]/g, '');
      this.rawAmount = val ? parseInt(val, 10) : 0;
      // 입력창에 실시간으로 콤마 적용된 값 표시
      e.target.value = this.displayAmount;
    },
    changeType(type) {
      this.transactionType = type;
      this.selectedCategory = ''; // 타입 변경 시 선택 초기화
    },
    async saveData() {
      // 1. 유효성 검사
      if (
        this.rawAmount <= 0 ||
        !this.transactionType ||
        !this.selectedCategory
      ) {
        alert('금액, 유형, 카테고리를 모두 확인해주세요🍯');
        return;
      }

      // 2. 선택된 '이름'을 바탕으로 원본에서 실제 'id' 찾기
      const foundCategory = this.rawCategories.find(
        (cat) =>
          cat.name === this.selectedCategory &&
          cat.type === this.transactionType,
      );

      // 3. 고유 ID 생성 (t + 타임스탬프)
      const customId = `t${Date.now()}`;

      // 4. 전송 페이로드 구성
      const payload = {
        id: String(customId), // json-server 랜덤 ID 생성 방지용
        user_id: 'u001',
        category_id: foundCategory ? foundCategory.id : 'unknown',
        date: this.transactionDate,
        trans_type: this.transactionType,
        amount: Number(this.rawAmount),
        memo: this.memo,
      };

      try {
        const res = await axios.post(
          'http://localhost:3000/transactions',
          payload,
        );
        if (res.status === 201) {
          alert('거래 내역이 저장되었습니다🍯');
          this.resetForm();
        }
      } catch (error) {
        console.error('저장 실패:', error);
        alert('저장에 실패했습니다..🍯');
      }
    },
    resetForm() {
      this.rawAmount = 0;
      this.transactionType = '';
      this.selectedCategory = '';
      this.memo = '';
      this.transactionDate = new Date().toISOString().substr(0, 10);
    },
  },
};
</script>

<style scoped>
@import '../assets/css/addTransaction.css';
</style>

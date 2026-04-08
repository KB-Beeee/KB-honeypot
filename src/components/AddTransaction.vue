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
              v-for="item in currentCategories"
              :key="item"
              class="category-item"
              :class="{ selected: selectedCategory === item }"
              @click="selectedCategory = item"
            >
              {{ item }}
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
export default {
  data() {
    return {
      transactionDate: new Date().toISOString().substr(0, 10),
      rawAmount: 0,
      transactionType: '',
      selectedCategory: '',
      memo: '',
      categoryData: {
        income: ['용돈', '월급', '기타'],
        expense: ['식비', '교통', '공과금', '여가', '건강', '기타'],
      },
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
    currentCategories() {
      if (!this.transactionType) return [];
      return this.categoryData[this.transactionType];
    },
  },
  methods: {
    handleAmountInput(e) {
      const val = e.target.value.replace(/[^0-9]/g, '');
      this.rawAmount = val ? parseInt(val, 10) : 0;
      e.target.value = this.displayAmount;
    },
    changeType(type) {
      this.transactionType = type;
      this.selectedCategory = '';
    },
    saveData() {
      // 실제 서버 저장은 빼고, 콘솔에만 찍어서 확인해봅니다.
      if (
        this.rawAmount <= 0 ||
        !this.transactionType ||
        !this.selectedCategory
      ) {
        alert('모든 항목을 입력해주세요🍯');
        return;
      }

      const debugPayload = {
        date: this.transactionDate,
        amount: this.rawAmount,
        type: this.transactionType,
        category: this.selectedCategory,
        memo: this.memo,
      };

      console.log('입력된 데이터 확인:', debugPayload);
      alert('화면에서 입력을 완료했습니다! (콘솔 확인)🍯');

      this.resetForm();
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

import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const BASEURI = 'http://localhost:3000/transactions';

  const state = reactive({
    transactions: [],
    categories: [],
  });
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.transactions = response.data;
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      state.categories = response.data;
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${BASEURI}/${id}`, { is_delete: true });
      await fetchTransactions();
    } catch (error) {
      console.error('거래 삭제 실패:', error);
      throw error;
    }
  };

  const transactions = computed(() => state.transactions);
  const categories = computed(() => state.categories);
  return {
    transactions,
    categories,
    fetchTransactions,
    fetchCategories,
    deleteTransaction,
  };
});

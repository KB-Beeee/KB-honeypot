import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export const useTransactionStore = defineStore('transaction', () => {
  const BASEURI = `${API_URL}/transactions`;
  const CATEGORY_URI = `${API_URL}/categories`;

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
      const response = await axios.get(CATEGORY_URI);
      state.categories = response.data;
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.patch(`${BASEURI}/${id}`, { is_deleted: true });
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

<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const emit = defineEmits(['date-selected']);
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: '',
  },
  locale: 'ko', // 한국어 설정 (선택 사항)

  height: 'auto',
  
  // 1. 날짜 뒤의 '일' 제거 (숫자만 남기기)
  dayCellContent: function (info) {
    return info.date.getDate(); // '1일'에서 '1'만 반환
  },

  // 2. 다음 달 첫 주가 무조건 보이는 현상 방지
  // 이번 달이 끝나는 주까지만 표시
  fixedWeekCount: false,
  eventOrder: 'sortOrder',
  events: [],

  // 날짜 클릭 시 실행
  dateClick: function (info) {
    emit('date-selected', info.dateStr);
  },
});

// 서버에서 가져온 거래 내역들이 들어갈 변수
const states = reactive({
  transactions: [],
  isLoading: false,
});

// 거래 내역 url
const transactionUrl = 'http://localhost:3000/transactions';
const categoryUrl = 'http://localhost:3000/categories';

const fetchTransactions = async () => {
  states.isLoading = true;
  try {
    // 가져오기
    const [transResponse, catResponse] = await Promise.all([
      axios.get(transactionUrl),
      axios.get(categoryUrl),
    ]);

    if (transResponse.status === 200 && catResponse.status === 200) {
      states.transactions = transResponse.data.filter(
        (t) => t.is_deleted === false,
      );
      states.categories = catResponse.data;

      updateCalendarEvents();
    }
  } catch (error) {
    alert('데이터를 가져오는 중 에러 발생: ' + error);
  } finally {
    states.isLoading = false;
  }
};

const updateCalendarEvents = () => {
  const summary = {};

  const categoryTypeMap = {};
  if (states.categories) {
    states.categories.forEach((cat) => {
      categoryTypeMap[cat.id] = cat.type;
    });
  }

  states.transactions.forEach((trans) => {
    if (trans.is_deleted) return;
    const currentType = categoryTypeMap[trans.category_id];

    // 데이터에 없는 카테고리일 경우를 대비한 방어 코드
    if (!currentType) return;

    // 👇 누락되었던 key 변수 선언 추가
    const key = `${trans.date}_${currentType}`;

    if (!summary[key]) {
      summary[key] = { start: trans.date, amount: 0, type: currentType };
    }
    summary[key].amount += trans.amount;
  });

  const list = Object.values(summary);

  list.sort((a, b) => {
    if (a.type === b.type) {
      return 0;
    }
    if (a.type === 'income') {
      return -1;
    }
    return 1;
  });

  calendarOptions.events = list.map((item) => ({
    title: (item.type === 'income' ? '+' : '-') + item.amount.toLocaleString(),
    start: item.start,
    className: item.type === 'income' ? 'event-income' : 'event-expense',
    sortOrder: item.type === 'income' ? 1 : 2,
  }));
};

fetchTransactions();
</script>

<style scoped>
@import '../assets/css/calendar.css';
</style>

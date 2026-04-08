<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import { reactive } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';


const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: ''
  },
  locale: 'ko', // 한국어 설정 (선택 사항)

  // 1. 날짜 뒤의 '일' 제거 (숫자만 남기기)
  dayCellContent: function(info) {
    return info.date.getDate(); // '1일'에서 '1'만 반환
  },

  // 2. 다음 달 첫 주가 무조건 보이는 현상 방지
  // 이번 달이 끝나는 주까지만 표시
  fixedWeekCount: false,
  eventOrder: 'sortOrder',
  events: []
})

// 서버에서 가져온 거래 내역들이 들어갈 변수 
const states = reactive({
    transactions: [],
    isLoading: false
});

// 거래 내역 url 
const transactionUrl = 'http://localhost:3000/transactions';

const fetchTransactions = async () => {
    states.isLoading = true;
    try {
        // 가져오기 
        const response = await axios.get(transactionUrl);
        if(response.status===200) {
            states.transactions = response.data;

            updateCalendarEvents(); 
        }
    } catch(error) {
        alert('데이터를 가져오는 중 에러 발생: ' + error);
    } finally {
        states.isLoading = false; 
    }
}

const updateCalendarEvents = () => {
    const summary = {};

    // transactions 배열 요소를 하나씩 반복해서 실행 
states.transactions.forEach(trans => {
    const key = `${trans.date}_${trans.trans_type}`;

    if(!summary[key]) {
        summary[key] = { start: trans.date, amount: 0, type: trans.trans_type }; 
    }
    summary[key].amount += trans.amount; 

    
});

const list = Object.values(summary);

list.sort((a, b) => {
// 1. 둘의 타입이 같다면 순서를 바꾸지 않음 (0 반환)
    if (a.type === b.type) {
        return 0; 
    }
    // 2. a가 수입(income)이면 앞으로 보냄 (-1 반환)
    if (a.type === 'income') {
        return -1; 
    }
    // 3. 그 외의 경우(a가 지출)는 뒤로 보냄 (1 반환)
    return 1;
        
    });

calendarOptions.events = list.map(item => ({
title: (item.type === 'income' ? '+' : '-') + item.amount.toLocaleString(),
      start: item.start,
      className: item.type === 'income' ? 'event-income' : 'event-expense',
      // 👇 수입(income)이면 1, 지출(expense)이면 2를 부여해서 수입이 위로 가도록 설정
      sortOrder: item.type === 'income' ? 1 : 2
}));
};

fetchTransactions();

</script>

<style scoped>
@import "../assets/css/calendar.css";
</style>
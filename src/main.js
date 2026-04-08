import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 상태관리 라이브러리
import App from './App.vue';
import router from './router'; // 위에서 만든 라우터 불러오기
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 적용
import './assets/css/main.css'

const app = createApp(App);

app.use(createPinia());
app.use(router); // 라우터 사용 설정

app.mount('#app');
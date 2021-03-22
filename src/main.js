import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

const app = createApp(App);
app.config.globalProperties.$http = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:8081',
});
app.use(router).mount('#app');

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { AttendMeBackendClient } from './lib/AttendMeBackendClient'

import App from './App.vue'
import router from './router'

const backend = new AttendMeBackendClient('https://attendme-backend.runasp.net')

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

export { backend as Backend }

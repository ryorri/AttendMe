import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { AttendMeBackendClient } from './lib/AttendMeBackend/AttendMeBackendClient'

const backend = new AttendMeBackendClient('https://attendme-backend.runasp.net')

const app = createApp(App)

app.use(router)

app.mount('#app')

export { backend as Backend }

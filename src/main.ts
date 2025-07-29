import { createApp } from 'vue'
import './style.css'
import './font/DefineFont.css'
import App from './App.vue'

const app = createApp(App)

import { router } from './router'
app.use(router)

app.mount('#app')

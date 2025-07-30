import { createApp } from 'vue'
import './style.css'
import './font/DefineFont.css'
import App from './App.vue'
import 'md-editor-v3/lib/style.css'
import './md-theme/preview.css'

const app = createApp(App)

import { router } from './router'
app.use(router)

app.mount('#app')

import { createApp } from 'vue'
import './style.css'
import './font/DefineFont.css'
import App from './App.vue'
import 'md-editor-v3/lib/style.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { router } from './router'

import './theme-override/md-preview.css'
import './theme-override/toast.css'

const savedTheme = localStorage.getItem('nmo-theme')
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light')
}
const savedAccent = localStorage.getItem('nmo-accent')
if (savedAccent && savedAccent !== 'green') {
  document.documentElement.setAttribute('data-accent', savedAccent)
}

const app = createApp(App)

app.use(router)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  timeout: 3000,
})

app.mount('#app')

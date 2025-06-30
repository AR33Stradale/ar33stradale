import './assets/main.css' // Keep this line as is

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- ADD THIS LINE: Import your router instance

const app = createApp(App)

app.use(router) // <--- ADD THIS LINE: Tell Vue to use the router plugin

app.mount('#app') // Keep this line as is

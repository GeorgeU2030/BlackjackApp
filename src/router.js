import { createRouter, createWebHistory } from "vue-router";
import Landing from './views/Landing.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
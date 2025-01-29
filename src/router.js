import { createRouter, createWebHistory } from "vue-router";
import Landing from './views/Landing.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import Home from './views/Home.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
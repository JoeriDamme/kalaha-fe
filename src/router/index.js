import { createRouter, createWebHashHistory } from 'vue-router'
import Game from '../views/Game.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

import { estaLogado } from '../services/sessao'
import CadastroView from '../views/CadastroView.vue'
import FavoritosView from '../views/FavoritosView.vue'
import FilmesView from '../views/FilmesView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/filmes' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/cadastro', name: 'cadastro', component: CadastroView },
  { path: '/filmes', name: 'filmes', component: FilmesView, meta: { requerLogin: true } },
  { path: '/favoritos', name: 'favoritos', component: FavoritosView, meta: { requerLogin: true } },
  { path: '/:caminho(.*)*', redirect: '/filmes' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Telas protegidas só abrem com login; login e cadastro não abrem para quem já entrou
router.beforeEach((destino) => {
  if (destino.meta.requerLogin && !estaLogado()) {
    return { name: 'login' }
  }
  if (!destino.meta.requerLogin && estaLogado()) {
    return { name: 'filmes' }
  }
})

export default router

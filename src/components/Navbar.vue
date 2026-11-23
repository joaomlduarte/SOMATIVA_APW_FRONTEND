<script setup>
import { useRouter } from 'vue-router'

import { encerrarSessao, obterUsuario } from '../services/sessao'
import LogoMangeFlix from './LogoMangeFlix.vue'

const router = useRouter()
const usuario = obterUsuario()

function sair() {
  encerrarSessao()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/filmes" class="navbar-logo"><LogoMangeFlix /></RouterLink>

    <nav class="navbar-links">
      <RouterLink to="/filmes">Catálogo</RouterLink>
      <RouterLink to="/favoritos">Meus favoritos</RouterLink>
    </nav>

    <div class="navbar-usuario">
      <span class="navbar-ola">Olá, {{ usuario?.username }}</span>
      <button type="button" class="botao botao-secundario" @click="sair">Sair</button>
    </div>
  </header>
</template>

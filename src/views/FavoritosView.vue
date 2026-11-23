<script setup>
import { onMounted, ref } from 'vue'

import FilmeCard from '../components/FilmeCard.vue'
import MensagemAlerta from '../components/MensagemAlerta.vue'
import { useMensagem } from '../composables/useMensagem'
import { api } from '../services/api'

const favoritos = ref([])
const carregando = ref(true)
const erroCarregamento = ref('')
const favoritoEmRemocaoId = ref(null)
const { mensagem, mostrarMensagem } = useMensagem()

async function carregarFavoritos() {
  try {
    favoritos.value = await api.listarFavoritos()
  } catch (erro) {
    erroCarregamento.value = erro.message
  } finally {
    carregando.value = false
  }
}

async function removerFavorito(favorito) {
  favoritoEmRemocaoId.value = favorito.id
  try {
    await api.removerFavorito(favorito.id)
    favoritos.value = favoritos.value.filter((item) => item.id !== favorito.id)
    mostrarMensagem('sucesso', `"${favorito.filme.titulo}" foi removido dos favoritos.`)
  } catch (erro) {
    mostrarMensagem('erro', erro.message)
  } finally {
    favoritoEmRemocaoId.value = null
  }
}

onMounted(carregarFavoritos)
</script>

<template>
  <section class="pagina">
    <h1 class="pagina-titulo">Meus favoritos</h1>

    <p v-if="carregando" class="estado-vazio">Carregando favoritos...</p>
    <MensagemAlerta v-else-if="erroCarregamento" tipo="erro" :texto="erroCarregamento" />

    <div v-else-if="favoritos.length === 0" class="estado-vazio">
      <p>Você ainda não tem filmes favoritos.</p>
      <RouterLink to="/filmes" class="botao botao-primario">Ver catálogo</RouterLink>
    </div>

    <div v-else class="grade-filmes">
      <FilmeCard
        v-for="favorito in favoritos"
        :key="favorito.id"
        :filme="favorito.filme"
        favorito
        :carregando="favoritoEmRemocaoId === favorito.id"
        @alternar-favorito="removerFavorito(favorito)"
      />
    </div>

    <div v-if="mensagem" class="aviso-flutuante">
      <MensagemAlerta :tipo="mensagem.tipo" :texto="mensagem.texto" />
    </div>
  </section>
</template>

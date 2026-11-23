<script setup>
import { computed, onMounted, ref } from 'vue'

import FilmeCard from '../components/FilmeCard.vue'
import MensagemAlerta from '../components/MensagemAlerta.vue'
import { useMensagem } from '../composables/useMensagem'
import { api } from '../services/api'

const TODOS_OS_GENEROS = 'Todos'

const filmes = ref([])
const favoritoIdPorFilmeId = ref({}) // { idDoFilme: idDoFavorito }
const generoSelecionado = ref(TODOS_OS_GENEROS)
const carregando = ref(true)
const erroCarregamento = ref('')
const filmeEmAtualizacaoId = ref(null)
const { mensagem, mostrarMensagem } = useMensagem()

const generos = computed(() => {
  const generosUnicos = [...new Set(filmes.value.map((filme) => filme.genero))].sort()
  return [TODOS_OS_GENEROS, ...generosUnicos]
})

const filmesFiltrados = computed(() =>
  generoSelecionado.value === TODOS_OS_GENEROS
    ? filmes.value
    : filmes.value.filter((filme) => filme.genero === generoSelecionado.value),
)

async function carregarCatalogo() {
  try {
    const [listaDeFilmes, listaDeFavoritos] = await Promise.all([
      api.listarFilmes(),
      api.listarFavoritos(),
    ])
    filmes.value = listaDeFilmes
    favoritoIdPorFilmeId.value = Object.fromEntries(
      listaDeFavoritos.map((favorito) => [favorito.filme.id, favorito.id]),
    )
  } catch (erro) {
    erroCarregamento.value = erro.message
  } finally {
    carregando.value = false
  }
}

async function alternarFavorito(filme) {
  filmeEmAtualizacaoId.value = filme.id
  try {
    const favoritoId = favoritoIdPorFilmeId.value[filme.id]
    if (favoritoId) {
      await api.removerFavorito(favoritoId)
      delete favoritoIdPorFilmeId.value[filme.id]
      mostrarMensagem('sucesso', `"${filme.titulo}" foi removido dos favoritos.`)
    } else {
      const novoFavorito = await api.adicionarFavorito(filme.id)
      favoritoIdPorFilmeId.value[filme.id] = novoFavorito.id
      mostrarMensagem('sucesso', `"${filme.titulo}" foi adicionado aos favoritos.`)
    }
  } catch (erro) {
    mostrarMensagem('erro', erro.message)
  } finally {
    filmeEmAtualizacaoId.value = null
  }
}

onMounted(carregarCatalogo)
</script>

<template>
  <section class="pagina">
    <h1 class="pagina-titulo">Catálogo</h1>

    <div class="filtro-generos" role="group" aria-label="Filtrar por gênero">
      <button
        v-for="genero in generos"
        :key="genero"
        type="button"
        class="chip"
        :class="{ 'chip-ativo': genero === generoSelecionado }"
        @click="generoSelecionado = genero"
      >
        {{ genero }}
      </button>
    </div>

    <p v-if="carregando" class="estado-vazio">Carregando filmes...</p>
    <MensagemAlerta v-else-if="erroCarregamento" tipo="erro" :texto="erroCarregamento" />

    <div v-else class="grade-filmes">
      <FilmeCard
        v-for="filme in filmesFiltrados"
        :key="filme.id"
        :filme="filme"
        :favorito="Boolean(favoritoIdPorFilmeId[filme.id])"
        :carregando="filmeEmAtualizacaoId === filme.id"
        @alternar-favorito="alternarFavorito"
      />
    </div>

    <div v-if="mensagem" class="aviso-flutuante">
      <MensagemAlerta :tipo="mensagem.tipo" :texto="mensagem.texto" />
    </div>
  </section>
</template>

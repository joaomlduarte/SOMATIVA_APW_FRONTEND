<script setup>
defineProps({
  filme: { type: Object, required: true },
  favorito: { type: Boolean, default: false },
  carregando: { type: Boolean, default: false },
})

defineEmits(['alternar-favorito'])
</script>

<template>
  <article class="filme-card" :class="{ 'filme-card-favorito': favorito }">
    <div class="filme-poster">
      <img :src="filme.imagem" :alt="`Pôster do filme ${filme.titulo}`" loading="lazy" />
      <span v-if="favorito" class="filme-selo">♥ Favorito</span>
    </div>

    <div class="filme-info">
      <h3 class="filme-titulo">{{ filme.titulo }}</h3>
      <p class="filme-detalhes">{{ filme.genero }} · {{ filme.ano_lancamento }}</p>
      <p class="filme-sinopse">{{ filme.sinopse }}</p>

      <button
        type="button"
        class="botao botao-favorito"
        :class="{ 'botao-favorito-ativo': favorito }"
        :aria-pressed="favorito"
        :disabled="carregando"
        @click="$emit('alternar-favorito', filme)"
      >
        {{ favorito ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos' }}
      </button>
    </div>
  </article>
</template>

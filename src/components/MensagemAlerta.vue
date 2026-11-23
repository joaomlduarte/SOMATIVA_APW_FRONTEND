<script setup>
defineProps({
  tipo: { type: String, default: 'sucesso' }, // 'sucesso' ou 'erro'
  texto: { type: String, required: true },
})
</script>

<template>
  <p class="alerta" :class="`alerta-${tipo}`" role="alert">{{ texto }}</p>
</template>

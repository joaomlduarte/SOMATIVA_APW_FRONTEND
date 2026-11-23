import { ref } from 'vue'

// Mensagem de sucesso/erro que some sozinha depois de alguns segundos
export function useMensagem(duracaoEmMs = 3000) {
  const mensagem = ref(null)
  let temporizador

  function mostrarMensagem(tipo, texto) {
    mensagem.value = { tipo, texto }
    clearTimeout(temporizador)
    temporizador = setTimeout(() => {
      mensagem.value = null
    }, duracaoEmMs)
  }

  return { mensagem, mostrarMensagem }
}

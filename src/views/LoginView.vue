<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LogoMangeFlix from '../components/LogoMangeFlix.vue'
import MensagemAlerta from '../components/MensagemAlerta.vue'
import { api } from '../services/api'
import { salvarSessao } from '../services/sessao'

const route = useRoute()
const router = useRouter()

const formulario = reactive({ usuario: '', senha: '' })
const erros = reactive({ usuario: '', senha: '' })
const mensagemErro = ref('')
const enviando = ref(false)
const veioDoCadastro = route.query.cadastro === 'ok'

function validarFormulario() {
  erros.usuario = formulario.usuario.trim() ? '' : 'Informe seu usuário ou e-mail.'
  erros.senha = formulario.senha ? '' : 'Informe sua senha.'
  return !erros.usuario && !erros.senha
}

async function entrar() {
  mensagemErro.value = ''
  if (!validarFormulario()) return

  enviando.value = true
  try {
    const resposta = await api.login(formulario.usuario.trim(), formulario.senha)
    salvarSessao(resposta.access, resposta.usuario)
    router.push({ name: 'filmes' })
  } catch (erro) {
    mensagemErro.value = erro.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="pagina-autenticacao">
    <form class="cartao-autenticacao" novalidate @submit.prevent="entrar">
      <LogoMangeFlix />
      <h1>Login</h1>

      <MensagemAlerta
        v-if="veioDoCadastro && !mensagemErro"
        texto="Cadastro realizado com sucesso! Entre com seu usuário e senha."
      />
      <MensagemAlerta v-if="mensagemErro" tipo="erro" :texto="mensagemErro" />

      <div class="campo">
        <label for="login-usuario">Usuário ou e-mail</label>
        <input id="login-usuario" v-model="formulario.usuario" type="text" autocomplete="username" />
        <small v-if="erros.usuario" class="campo-erro">{{ erros.usuario }}</small>
      </div>

      <div class="campo">
        <label for="login-senha">Senha</label>
        <input
          id="login-senha"
          v-model="formulario.senha"
          type="password"
          autocomplete="current-password"
        />
        <small v-if="erros.senha" class="campo-erro">{{ erros.senha }}</small>
      </div>

      <button type="submit" class="botao botao-primario" :disabled="enviando">
        {{ enviando ? 'Entrando...' : 'Entrar' }}
      </button>

      <p class="rodape-autenticacao">
        Não tem uma conta? <RouterLink to="/cadastro">Cadastre-se</RouterLink>
      </p>
    </form>
  </section>
</template>

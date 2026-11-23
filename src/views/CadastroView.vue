<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import LogoMangeFlix from '../components/LogoMangeFlix.vue'
import MensagemAlerta from '../components/MensagemAlerta.vue'
import { api } from '../services/api'

const router = useRouter()

const formulario = reactive({ username: '', email: '', senha: '', confirmacaoSenha: '' })
const erros = reactive({ username: '', email: '', senha: '', confirmacaoSenha: '' })
const mensagemErro = ref('')
const enviando = ref(false)

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarFormulario() {
  erros.username = formulario.username.trim() ? '' : 'Informe um nome de usuário.'

  if (!formulario.email.trim()) erros.email = 'Informe seu e-mail.'
  else if (!FORMATO_EMAIL.test(formulario.email.trim())) erros.email = 'Informe um e-mail válido.'
  else erros.email = ''

  if (!formulario.senha) erros.senha = 'Informe uma senha.'
  else if (formulario.senha.length < 8) erros.senha = 'A senha deve ter pelo menos 8 caracteres.'
  else erros.senha = ''

  if (!formulario.confirmacaoSenha) erros.confirmacaoSenha = 'Confirme sua senha.'
  else if (formulario.confirmacaoSenha !== formulario.senha) erros.confirmacaoSenha = 'As senhas não conferem.'
  else erros.confirmacaoSenha = ''

  return Object.values(erros).every((erro) => !erro)
}

async function cadastrar() {
  mensagemErro.value = ''
  if (!validarFormulario()) return

  enviando.value = true
  try {
    await api.cadastrar({
      username: formulario.username.trim(),
      email: formulario.email.trim(),
      senha: formulario.senha,
      confirmacao_senha: formulario.confirmacaoSenha,
    })
    router.push({ name: 'login', query: { cadastro: 'ok' } })
  } catch (erro) {
    mensagemErro.value = erro.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="pagina-autenticacao">
    <form class="cartao-autenticacao" novalidate @submit.prevent="cadastrar">
      <LogoMangeFlix />
      <h1>Cadastro</h1>

      <MensagemAlerta v-if="mensagemErro" tipo="erro" :texto="mensagemErro" />

      <div class="campo">
        <label for="cadastro-username">Nome de usuário</label>
        <input
          id="cadastro-username"
          v-model="formulario.username"
          type="text"
          autocomplete="username"
        />
        <small v-if="erros.username" class="campo-erro">{{ erros.username }}</small>
      </div>

      <div class="campo">
        <label for="cadastro-email">E-mail</label>
        <input id="cadastro-email" v-model="formulario.email" type="email" autocomplete="email" />
        <small v-if="erros.email" class="campo-erro">{{ erros.email }}</small>
      </div>

      <div class="campo">
        <label for="cadastro-senha">Senha</label>
        <input
          id="cadastro-senha"
          v-model="formulario.senha"
          type="password"
          autocomplete="new-password"
        />
        <small v-if="erros.senha" class="campo-erro">{{ erros.senha }}</small>
      </div>

      <div class="campo">
        <label for="cadastro-confirmacao">Confirmar senha</label>
        <input
          id="cadastro-confirmacao"
          v-model="formulario.confirmacaoSenha"
          type="password"
          autocomplete="new-password"
        />
        <small v-if="erros.confirmacaoSenha" class="campo-erro">{{ erros.confirmacaoSenha }}</small>
      </div>

      <button type="submit" class="botao botao-primario" :disabled="enviando">
        {{ enviando ? 'Cadastrando...' : 'Cadastrar' }}
      </button>

      <p class="rodape-autenticacao">
        Já tem uma conta? <RouterLink to="/login">Faça login</RouterLink>
      </p>
    </form>
  </section>
</template>

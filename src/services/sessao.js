// Guarda o token JWT e os dados do usuário logado no navegador
const CHAVE_TOKEN = 'mangeflix_token'
const CHAVE_USUARIO = 'mangeflix_usuario'

export function salvarSessao(token, usuario) {
  localStorage.setItem(CHAVE_TOKEN, token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuario() {
  const usuario = localStorage.getItem(CHAVE_USUARIO)
  return usuario ? JSON.parse(usuario) : null
}

export function estaLogado() {
  return Boolean(obterToken())
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_TOKEN)
  localStorage.removeItem(CHAVE_USUARIO)
}

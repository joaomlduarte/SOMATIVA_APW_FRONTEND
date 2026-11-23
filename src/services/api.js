import { encerrarSessao, obterToken } from './sessao'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

function extrairMensagemDeErro(dados) {
  if (!dados) {
    return 'Não foi possível concluir a operação. Tente novamente.'
  }
  if (dados.detail) {
    return dados.detail
  }
  // Erros de validação do DRF chegam como { campo: ['mensagem', ...] }
  return Object.values(dados).flat().join(' ')
}

async function requisicao(caminho, { metodo = 'GET', corpo } = {}) {
  const token = obterToken()
  const cabecalhos = { 'Content-Type': 'application/json' }
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`
  }

  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
  }

  // Token vencido ou inválido: encerra a sessão e volta para o login
  if (resposta.status === 401 && token) {
    encerrarSessao()
    window.location.href = '/login'
    throw new Error('Sua sessão expirou. Faça login novamente.')
  }

  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null)
  if (!resposta.ok) {
    throw new Error(extrairMensagemDeErro(dados))
  }
  return dados
}

export const api = {
  login: (usuario, senha) => requisicao('/login/', { metodo: 'POST', corpo: { usuario, senha } }),
  cadastrar: (dadosCadastro) => requisicao('/cadastro/', { metodo: 'POST', corpo: dadosCadastro }),
  listarFilmes: () => requisicao('/filmes/'),
  listarFavoritos: () => requisicao('/favoritos/'),
  adicionarFavorito: (filmeId) =>
    requisicao('/favoritos/', { metodo: 'POST', corpo: { filme_id: filmeId } }),
  removerFavorito: (favoritoId) => requisicao(`/favoritos/${favoritoId}/`, { metodo: 'DELETE' }),
}

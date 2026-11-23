import { expect, test } from '@playwright/test'

const SENHA = 'Filmes@2026'

function novoUsuario() {
  const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  return { username: `teste${sufixo}`, email: `teste${sufixo}@email.com` }
}

async function cadastrar(page, usuario) {
  await page.goto('/cadastro')
  await page.getByLabel('Nome de usuário').fill(usuario.username)
  await page.getByLabel('E-mail').fill(usuario.email)
  await page.getByLabel('Senha', { exact: true }).fill(SENHA)
  await page.getByLabel('Confirmar senha').fill(SENHA)
  await page.getByRole('button', { name: 'Cadastrar' }).click()
}

async function entrar(page, login) {
  await page.getByLabel('Usuário ou e-mail').fill(login)
  await page.getByLabel('Senha').fill(SENHA)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('fluxo completo: cadastro, login, favoritar, remover e logout', async ({ page }) => {
  const usuario = novoUsuario()

  // Cadastro -> volta para o login com mensagem de sucesso
  await cadastrar(page, usuario)
  await expect(page).toHaveURL(/\/login\?cadastro=ok/)
  await expect(page.getByText('Cadastro realizado com sucesso!')).toBeVisible()

  // Login com e-mail -> catálogo com pelo menos 10 filmes
  await entrar(page, usuario.email)
  await expect(page).toHaveURL(/\/filmes$/)
  await expect(page.locator('.filme-card').first()).toBeVisible()
  expect(await page.locator('.filme-card').count()).toBeGreaterThanOrEqual(10)

  // Favoritar um filme
  const cartao = page.locator('.filme-card', { hasText: 'Além das Estrelas' })
  await cartao.getByRole('button', { name: 'Adicionar aos favoritos' }).click()
  await expect(page.getByText('"Além das Estrelas" foi adicionado aos favoritos.')).toBeVisible()
  await expect(cartao.getByRole('button', { name: 'Remover dos favoritos' })).toBeVisible()
  await expect(cartao).toHaveClass(/filme-card-favorito/)

  // Meus favoritos -> o filme aparece; remover -> mensagem de lista vazia
  await page.getByRole('link', { name: 'Meus favoritos' }).click()
  await expect(page.locator('.filme-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Remover dos favoritos' }).click()
  await expect(page.getByText('Você ainda não tem filmes favoritos.')).toBeVisible()

  // Logout -> volta para o login e as telas protegidas ficam bloqueadas
  await page.getByRole('button', { name: 'Sair' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto('/favoritos')
  await expect(page).toHaveURL(/\/login$/)
})

test('favoritos continuam salvos depois do logout', async ({ page }) => {
  const usuario = novoUsuario()
  await cadastrar(page, usuario)
  await entrar(page, usuario.username)

  const cartao = page.locator('.filme-card', { hasText: 'Ilha Perdida' })
  await cartao.getByRole('button', { name: 'Adicionar aos favoritos' }).click()
  await expect(cartao.getByRole('button', { name: 'Remover dos favoritos' })).toBeVisible()

  await page.getByRole('button', { name: 'Sair' }).click()
  await entrar(page, usuario.username)
  await page.getByRole('link', { name: 'Meus favoritos' }).click()

  await expect(page.locator('.filme-card')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Ilha Perdida' })).toBeVisible()
})

test('login com credenciais inválidas mostra mensagem de erro', async ({ page }) => {
  await page.goto('/login')
  await entrar(page, 'usuario-que-nao-existe')

  await expect(page.getByText('Usuário/e-mail ou senha inválidos.')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('cadastro valida campos obrigatórios e senhas diferentes', async ({ page }) => {
  await page.goto('/cadastro')
  await page.getByRole('button', { name: 'Cadastrar' }).click()
  await expect(page.getByText('Informe um nome de usuário.')).toBeVisible()
  await expect(page.getByText('Informe seu e-mail.')).toBeVisible()

  await page.getByLabel('Senha', { exact: true }).fill(SENHA)
  await page.getByLabel('Confirmar senha').fill('OutraSenha@1')
  await page.getByRole('button', { name: 'Cadastrar' }).click()
  await expect(page.getByText('As senhas não conferem.')).toBeVisible()
})

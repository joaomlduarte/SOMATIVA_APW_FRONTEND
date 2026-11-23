# MangeFlix: Frontend (Vue.js)

Interface web responsiva da plataforma **MangeFlix**, desenvolvida com **Vue.js 3** para a Situação de Aprendizagem de Aplicações Web (SENAI "Roberto Mange").
Ela consome a API REST em Django para cadastro, login, catálogo de filmes e favoritos.

> Backend (Django REST Framework): https://github.com/joaomlduarte/SOMATIVA_APW_BACKEND
>
> **No ar (Railway):** https://frontend-production-dc1ee1f6.up.railway.app

## Tecnologias

- Vue.js 3 (Composition API) e Vue Router
- Vite (servidor de desenvolvimento e build)
- Fetch API para as requisições HTTP
- Playwright (testes end-to-end)

## Telas

| Rota | Tela | O que faz |
|---|---|---|
| `/login` | `LoginView.vue` | Login com usuário ou e-mail, validação e mensagem de erro |
| `/cadastro` | `CadastroView.vue` | Cadastro com nome de usuário, e-mail, senha e confirmação |
| `/filmes` | `FilmesView.vue` | Catálogo em cartões, filtro por gênero, favoritar/desfavoritar |
| `/favoritos` | `FavoritosView.vue` | Favoritos do usuário, remover e aviso de lista vazia |

`/filmes` e `/favoritos` só abrem com login. O botão **Sair** encerra a sessão e volta para o login.

## Estrutura

```
src/
  components/
    Navbar.vue           menu: Catálogo, Meus favoritos e Sair
    FilmeCard.vue        cartão do filme (pôster, título, gênero, ano, sinopse, botão de favorito)
    MensagemAlerta.vue   mensagens de sucesso e erro
    LogoMangeFlix.vue    logo
  views/                 telas (Login, Cadastro, Filmes, Favoritos)
  router/index.js        rotas e proteção das telas que exigem login
  services/api.js        requisições HTTP à API REST
  services/sessao.js     token JWT e usuário logado (localStorage)
  composables/           mensagem temporária reutilizável
  assets/estilos.css     cores, fontes e componentes padronizados + layout responsivo
e2e/                     testes end-to-end (Playwright)
```

## Como executar

Pré-requisitos: Node.js 20+ e o [backend](https://github.com/joaomlduarte/SOMATIVA_APW_BACKEND) rodando em `http://127.0.0.1:8000`.

```powershell
# 1. Dependências
npm install

# 2. Variáveis de ambiente (endereço da API)
copy .env.example .env

# 3. Subir o frontend em http://localhost:5173
npm run dev
```

Build de produção: `npm run build` (gera a pasta `dist/`).

### Variáveis de ambiente (`.env`)

| Variável | Exemplo |
|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` |

## Testes end-to-end

Com o backend rodando:

```powershell
npm run test:e2e
```

O Playwright usa o Google Chrome instalado no computador e sobe o Vite sozinho. Os testes cobrem:

- o fluxo completo: cadastro, login, favoritar, ver em Meus favoritos, remover e logout;
- favoritos que continuam salvos depois do logout;
- mensagem de erro para login inválido;
- validação dos campos do cadastro.

## Publicação no Railway

O frontend é o serviço `frontend` do projeto `SOMATIVA_APW` no Railway (plano gratuito). Foi publicado a partir desta pasta com:

```powershell
railway up --service frontend
```

O Railpack roda `npm run build` e serve a pasta `dist/` com o Caddy, que manda todas as rotas para o `index.html`, como um SPA precisa.
Variáveis do serviço `frontend`:

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://backend-production-a2814271.up.railway.app/api` |
| `RAILPACK_SPA_OUTPUT_DIR` | `dist` |
| `RAILPACK_NODE_VERSION` | `22` |

## CI/CD e branches

- `master`: produção; `dev`: desenvolvimento.
- O GitHub Actions (`.github/workflows/ci.yml`) baixa e sobe a API, faz o build, roda os testes e2e e publica o build (`dist/`) como artefato a cada push.

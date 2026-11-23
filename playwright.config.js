import { defineConfig } from '@playwright/test'

// Testes end-to-end: abrem o navegador e usam o sistema como um usuário real.
// O backend Django precisa estar rodando em http://127.0.0.1:8000.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    // No computador usa o Google Chrome instalado; no GitHub Actions usa o Chromium do Playwright
    channel: process.env.CI ? undefined : 'chrome',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})

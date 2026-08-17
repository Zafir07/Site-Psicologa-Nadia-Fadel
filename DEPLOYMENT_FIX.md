# 🚀 Guia Completo - Correção de Deployments no Vercel

## O que foi corrigido

1. ✅ **Removido `@vercel/static-build`** — Builder incorreto que causava falhas
2. ✅ **Melhorado roteamento** — Static files agora servem corretamente
3. ✅ **Adicionado `.vercelignore`** — Evita conflitos com Docker e arquivos desnecessários

---

## 📋 Próximas Etapas: Configurar Variáveis de Ambiente

### **IMPORTANTE:** O backend requer variáveis SMTP para funcionar

O seu deploy está falhando porque **as variáveis de ambiente não estão configuradas no Vercel**.

### Passo 1: Acesse o Dashboard Vercel

1. Abra [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione **cada projeto** (você tem 4):
   - `zafir`
   - `nadia-fadel-backend`
   - `psicologanadiafadel.com.br`
   - `site-psicologia-nadia-fadel`

### Passo 2: Configure as Variáveis de Ambiente

Para **CADA projeto**, clique em **Settings** → **Environment Variables** e adicione:

#### 🔹 **Variáveis Obrigatórias (SMTP)**

```
SMTP_HOST              → smtp.gmail.com
SMTP_PORT              → 587
SMTP_SECURE            → false
SMTP_USER              → seu-email@gmail.com
SMTP_PASS              → sua-senha-de-app-google
CONTACT_RECEIVER_EMAIL → contato@seu-dominio.com.br
```

#### 🔹 **Variáveis Recomendadas**

```
NODE_ENV               → production
FRONTEND_URL           → https://seu-dominio.com.br
RATE_LIMIT_WINDOW_MINUTES → 15
RATE_LIMIT_MAX_REQUESTS   → 5
JSON_BODY_LIMIT        → 20kb
CONTACT_SENDER_NAME    → Site Nádia Fadel
```

---

## 🔐 Como Gerar a Senha de App do Gmail

1. Ative autenticação de dois fatores na sua conta Google
2. Acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Selecione "Mail" e "Windows Computer" (ou seu dispositivo)
4. Copie a senha gerada (16 caracteres)
5. Use esse valor em `SMTP_PASS` (sem espaços)

---

## ✅ Verificar após o Deploy

Depois de configurar as variáveis e fazer novo deploy:

```bash
# Testar o health check (deve retornar sucesso)
curl https://seu-projeto.vercel.app/api/health

# Testar o formulário (deve enviar e-mail)
curl -X POST https://seu-projeto.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "seu-email@teste.com",
    "telefone": "11999999999",
    "servico": "Psicoterapia",
    "mensagem": "Teste de contato"
  }'
```

---

## 🔧 Se Ainda Houver Erros

Após configurar variáveis, abra o Vercel CLI no seu terminal:

```bash
# Instale a CLI (primeira vez)
npm install -g vercel

# Faça login
vercel login

# Veja os logs do deploy
vercel logs --tail
```

---

## 📝 Checklist para Deploy Bem-Sucedido

- [ ] Todas as 6 variáveis SMTP configuradas em cada projeto
- [ ] Senha de App do Gmail (não a senha pessoal)
- [ ] `vercel.json` atualizado
- [ ] `.vercelignore` criado
- [ ] Fazer novo commit e push para GitHub
- [ ] Vercel automaticamente refaz deploy
- [ ] Testar `/api/health` (deve retornar `{"success": true, "message": "API operacional."}`

---

## 🆘 Dúvidas Frequentes

**P: Por que a email não é enviado?**
R: Verifique se `SMTP_USER` e `SMTP_PASS` estão corretos. Use senha de app, não senha pessoal.

**P: Erro de CORS?**
R: Configure `FRONTEND_URL` com seu domínio exato (ex: `https://seu-dominio.com.br`).

**P: Como saber qual projeto é qual?**
R: Verifique o domínio no painel Vercel:
- `zafir` → seu projeto principal (verifique qual domínio)
- `nadia-fadel-backend` → backend apenas
- Outros dois → possivelmente duplicatas


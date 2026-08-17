# 🚀 DEPLOY HOJE - Passos Imediatos

Seu site está retornando 404 no Vercel. Isso significa que o projeto ainda não foi conectado ou está falhando no build.

Siga esses passos AGORA:

---

## ✅ PASSO 1: Limpar Vercel (2 minutos)

No dashboard do Vercel:
1. Acesse: https://vercel.com/dashboard
2. Você vai ver 3 projetos
3. **Mantenha apenas este:**
   - `psicologanadiafadel.com.br`
4. Dos outros dois, você pode:
   - Deixar como está (não vai prejudicar)
   - Ou deletar depois

**Para este passo: não precisa fazer nada agora, vamos focar no projeto correto**

---

## ✅ PASSO 2: Abrir o Projeto Correto (1 minuto)

No Vercel dashboard:
1. Clique em: `psicologanadiafadel.com.br`
2. Você vai ver a aba "Overview"
3. Vá em "Deployments"
4. Procure pelo deploy mais recente

Se não tiver nenhum deploy recente, você vai fazer agora.

---

## ✅ PASSO 3: Conectar o Repositório Certo (3 minutos)

Se o projeto não tem repositório conectado:
1. Clique em "Settings"
2. Vá em "Git"
3. Clique em "Connect Git Repository"
4. Selecione:
   - GitHub
   - Usuário: Zafir07
   - Repositório: Site-Psicologa-Nadia-Fadel

Se já estiver conectado, pule para PASSO 4.

---

## ✅ PASSO 4: Configurar Environment Variables (5 minutos)

Aqui é CRÍTICO:

1. No Vercel, ainda em "Settings"
2. Vá em "Environment Variables"
3. Adicione EXATAMENTE estas variáveis:

```
NODE_ENV = production
FRONTEND_URL = https://psicologanadiafadel.com.br
SMTP_HOST = seu-smtp-aqui
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = seu-email-aqui
SMTP_PASS = sua-senha-aqui
CONTACT_RECEIVER_EMAIL = contato@psicologanadiafadel.com.br
CONTACT_SENDER_NAME = Site Nádia Fadel
RATE_LIMIT_WINDOW_MINUTES = 15
RATE_LIMIT_MAX_REQUESTS = 5
JSON_BODY_LIMIT = 20kb
```

> ⚠️ IMPORTANTE: Se você não tem SMTP configurado ainda, use valores temporários para o deploy funcionar.

---

## ✅ PASSO 5: Deploy Agora (2 minutos)

Duas opções:

### Opção A: Deploy Manual (recomendado agora)
1. No Vercel, vá em "Deployments"
2. Clique em "Redeploy"
3. Selecione o último commit
4. Clique em "Redeploy"

Aguarde 2-3 minutos.

### Opção B: Push no GitHub (automático)
No seu terminal:
```bash
cd "C:/Users/itz64/Downloads/Projeto_Nadia_Fadel_Site/nadia-fadel"
git add .
git commit -m "Deploy configuration"
git push origin main
```

---

## ✅ PASSO 6: Testar (1 minuto)

Depois do deploy:

1. Acesse:
   - https://psicologanadiafadel.com.br/

2. Se aparecer o site, OK!

3. Teste a API:
   - https://psicologanadiafadel.com.br/api/health

4. Deve responder:
   ```json
   {"success": true, "message": "API operacional."}
   ```

Se responder isso, o backend está funcionando.

---

## ⚠️ Se der erro no PASSO 4

Se o deploy falhar, você vai ver um aviso no Vercel.

O motivo mais comum é:
- Falta de variáveis de ambiente
- Valores errados de SMTP

Nesse caso:
1. Clique em "Deployments"
2. Clique no deploy que falhou
3. Veja a mensagem de erro
4. Copie a mensagem
5. Me manda que eu resolvo

---

## ✅ Se ainda não funcionar

Se depois de todos esses passos ainda der erro, a solução é:

1. Usar um SMTP profissional (Resend, SendGrid, etc)
2. Ou usar SMTP do seu domínio/host

---

## 🎯 Resumo: O que fazer AGORA

1. Acesse Vercel dashboard
2. Abra o projeto: `psicologanadiafadel.com.br`
3. Vá em "Settings" → "Environment Variables"
4. Preencha as variáveis acima
5. Vá em "Deployments"
6. Clique em "Redeploy"
7. Aguarde
8. Acesse o domínio e teste

Se conseguir fazer isso agora, o site deve estar online em 5-10 minutos.


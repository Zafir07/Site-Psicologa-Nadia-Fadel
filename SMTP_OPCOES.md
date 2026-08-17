# 📧 Configurações de SMTP - Escolha uma opção

## ⚡ Opção 1: MAIS RÁPIDA AGORA (Recomendado)

Use estes valores temporariamente para o deploy funcionar HOJE:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = seu-email-pessoal@gmail.com
SMTP_PASS = sua-senha-pessoal-do-gmail
CONTACT_RECEIVER_EMAIL = contato@psicologanadiafadel.com.br
```

> ⚠️ Isso funciona se você não tiver autenticação de dois fatores no Gmail.
> Se tiver, pule para a Opção 2.

---

## ⚡ Opção 2: RESEND (Mais profissional - 5 minutos)

Se você quer fazer certo, use Resend:

### 2.1) Crie conta no Resend
1. Acesse: https://resend.com
2. Clique em "Sign Up"
3. Faça login com seu email
4. Verifique o email

### 2.2) Configure o domínio
1. No painel do Resend, vá em "Domains"
2. Clique em "Add Domain"
3. Digite: `psicologanadiafadel.com.br`
4. Siga as instruções para adicionar os registros DNS
5. Após validação (pode levar alguns minutos), você consegue usar o domínio

### 2.3) Copie a API Key
1. No Resend, vá em "API Keys"
2. Copie a chave default (ou crie uma nova)
3. Use esse valor em `SMTP_PASS`

### 2.4) Configure no Vercel
```
SMTP_HOST = smtp.resend.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = resend
SMTP_PASS = sua-api-key-do-resend
CONTACT_RECEIVER_EMAIL = contato@psicologanadiafadel.com.br
CONTACT_SENDER_NAME = Site Nádia Fadel
```

---

## ⚡ Opção 3: SMTP do Seu Host/Provedor

Se você já tem hospedagem/email profissional em algum lugar:

1. Peça ao seu provedor:
   - SMTP Host
   - SMTP Port
   - Email (SMTP_USER)
   - Senha (SMTP_PASS)

2. Use esses valores no Vercel

Exemplo (HostGator, Hospedagem.com, etc):
```
SMTP_HOST = seu-host.com.br
SMTP_PORT = 587 ou 25 ou 465
SMTP_SECURE = true ou false (depende da porta)
SMTP_USER = seu-email@dominio.com.br
SMTP_PASS = senha-do-email
CONTACT_RECEIVER_EMAIL = contato@psicologanadiafadel.com.br
```

---

## 🎯 Minha recomendação URGENTE

Para funcionar HOJE:

**Use a Opção 1** (Gmail pessoal ou corporativo que você tem):
- Mais rápido de configurar
- Funciona em minutos
- Depois você muda para Resend se quiser

Se isso não funcionar por causa da autenticação:
**Use a Opção 2** (Resend):
- Leva 5 minutos para criar conta
- Leva 5 minutos para validar domínio
- Leva 2 minutos para configurar no Vercel
- Total: 15 minutos + validação de DNS

---

## ✅ Checklist Final

Escolha UMA das opções acima e:

1. Pegue os valores de SMTP
2. Vá no Vercel
3. Vá em Settings → Environment Variables
4. Preencha os valores EXATAMENTE como acima
5. Vá em Deployments
6. Clique em Redeploy
7. Aguarde 2-3 minutos
8. Acesse o domínio e teste

Se conseguir fazer isso em 15 minutos, o site está online.


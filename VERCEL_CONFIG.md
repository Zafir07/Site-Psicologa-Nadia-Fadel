# 🚀 Guia de Configuração - Deployment no Vercel

## Variáveis de Ambiente Requeridas

Para fazer o deployment do projeto no **Vercel**, você precisa configurar as seguintes variáveis de ambiente no painel de configuração do projeto:

### 1. **Configuração do Servidor**
```
NODE_ENV=production
FRONTEND_URL=https://seu-dominio-do-frontend.com
```

### 2. **Configuração de E-mail (SMTP)**
Para receber mensagens do formulário de contato:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
CONTACT_RECEIVER_EMAIL=contato@seu-dominio.com.br
CONTACT_SENDER_NAME=Site Nádia Fadel
```

> **⚠️ Importante:** Use uma **Senha de App** do Gmail (não a senha pessoal). 
> Ative a autenticação de dois fatores na sua conta Google e gere uma senha de app [aqui](https://myaccount.google.com/apppasswords).

### 3. **Rate Limiting**
```
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=5
```

### 4. **Tamanho de Requisição**
```
JSON_BODY_LIMIT=20kb
```

## Como Configurar no Vercel

1. Acesse o painel do seu projeto no [Vercel](https://vercel.com/dashboard)
2. Clique em **Settings** (Configurações)
3. Vá para **Environment Variables** (Variáveis de Ambiente)
4. Adicione cada variável listada acima com seus valores reais
5. Clique em **Deploy** para ativar as novas configurações

## Testando Localmente

Antes de fazer deploy, teste no seu ambiente local:

```bash
cd backend
npm install
npm run dev
```

O servidor será iniciado em `http://localhost:3000`.

Teste o endpoint de saúde:
```bash
curl http://localhost:3000/api/health
```

## Verificação de Deploy

Após fazer push para o GitHub, o Vercel automaticamente:
1. Detecta a mudança
2. Instala as dependências
3. Faz build do projeto
4. Faz o deployment

Você pode acompanhar o progresso no dashboard do Vercel.

## Solução de Problemas

- **Erro ao enviar e-mail?** Verifique se `SMTP_USER` e `SMTP_PASS` estão corretos
- **CORS error?** Configure `FRONTEND_URL` com o domínio exato do seu frontend
- **Build falha?** Verifique se todas as variáveis obrigatórias estão configuradas

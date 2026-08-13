# Site Institucional — Nádia Fadel (Psicóloga Clínica)

Projeto reestruturado em front-end (HTML/CSS/JS) e back-end (Node.js + Express),
com formulário de contato seguro, validado e em conformidade com boas práticas
de proteção de dados (LGPD).

## Estrutura do projeto

```
nadia-fadel/
├── frontend/
│   ├── index.html          → Página institucional (design e conteúdo originais)
│   ├── css/
│   │   └── styles.css      → Todo o CSS do site
│   └── js/
│       └── script.js       → Todo o JavaScript (animações, menu, FAQ, formulário)
├── backend/
│   ├── package.json
│   ├── .env.example        → Modelo de variáveis de ambiente
│   ├── server.js           → Servidor Express e rota /api/contact
│   └── middleware/
│       └── security.js     → Helmet, CORS, rate limiting, validação e sanitização
└── README.md
```

Nenhum aspecto visual, texto, animação ou funcionalidade original do site foi alterado —
apenas o código foi reorganizado e o envio do formulário passou a usar um back-end próprio.

---

## 1. Como instalar e rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem junto com o Node.js)

### 1.1. Back-end (API do formulário de contato)

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` recém-criado com as suas informações reais (veja a seção
[Variáveis de ambiente](#2-como-configurar-as-variáveis-de-ambiente) abaixo).

Para rodar em modo desenvolvimento (reinicia automaticamente ao salvar arquivos):

```bash
npm run dev
```

Para rodar normalmente:

```bash
npm start
```

Por padrão, a API sobe em `http://localhost:3000`. Você pode testar se está no ar acessando:

```
http://localhost:3000/api/health
```

### 1.2. Front-end

O front-end é estático (HTML, CSS e JS puros), então não precisa de instalação.
Basta abrir `frontend/index.html` em um servidor local. Algumas opções simples:

**Opção A — Extensão "Live Server" do VS Code**
Clique com o botão direito em `index.html` → "Open with Live Server".

**Opção B — servidor HTTP simples via Python**
```bash
cd frontend
python3 -m http.server 5500
```
Acesse `http://localhost:5500`.

**Opção C — servidor HTTP simples via Node**
```bash
cd frontend
npx serve -l 5500
```

> ⚠️ Importante: o endereço/porta que você usar para servir o front-end (ex.: `http://localhost:5500`)
> precisa estar cadastrado na variável `FRONTEND_URL` do `.env` do back-end, ou o CORS irá bloquear
> as requisições do formulário.

### 1.3. Apontando o front-end para a API

No arquivo `frontend/js/script.js`, a constante abaixo define para onde o formulário envia os dados:

```js
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';
```

- Em desenvolvimento, o valor padrão (`http://localhost:3000`) já funciona se você rodar o
  back-end localmente na porta padrão.
- Em produção, defina `window.API_BASE_URL` antes do script carregar (por exemplo, com uma
  tag `<script>` no `index.html`) ou edite diretamente essa constante para apontar para a
  URL pública da sua API, por exemplo:

```html
<script>window.API_BASE_URL = 'https://api.psicologanadiafadel.com.br';</script>
<script src="js/script.js"></script>
```

---

## 2. Como configurar as variáveis de ambiente

Todas as variáveis ficam no arquivo `backend/.env` (crie a partir do `.env.example`).

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o servidor Express vai rodar (padrão: `3000`) |
| `NODE_ENV` | `development` ou `production` |
| `FRONTEND_URL` | Domínio(s) autorizados a acessar a API via CORS, separados por vírgula |
| `RATE_LIMIT_WINDOW_MINUTES` | Janela de tempo do rate limiting (padrão: `15` minutos) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requisições por IP dentro da janela (padrão: `5`) |
| `SMTP_HOST` | Servidor SMTP usado para enviar os e-mails (ex.: `smtp.gmail.com`) |
| `SMTP_PORT` | Porta SMTP (normalmente `587` para TLS) |
| `SMTP_SECURE` | `true` para conexão SSL direta (porta 465), `false` para STARTTLS (porta 587) |
| `SMTP_USER` | E-mail/usuário usado para autenticar no SMTP |
| `SMTP_PASS` | Senha ou senha de aplicativo do SMTP |
| `CONTACT_RECEIVER_EMAIL` | E-mail que receberá as mensagens enviadas pelo formulário |
| `CONTACT_SENDER_NAME` | Nome exibido como remetente nos e-mails de notificação |
| `JSON_BODY_LIMIT` | Tamanho máximo aceito no corpo das requisições (padrão: `20kb`) |

### Usando Gmail como SMTP

Se for usar uma conta do Gmail para enviar os e-mails:
1. Ative a **verificação em duas etapas** na conta Google.
2. Gere uma **Senha de app** em [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Use essa senha de app (não a senha normal da conta) na variável `SMTP_PASS`.

Você também pode usar qualquer outro provedor SMTP (SendGrid, Amazon SES, Mailgun,
Zoho, etc.) — basta ajustar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` e `SMTP_PASS` conforme
a documentação do provedor escolhido.

> 🔒 **Nunca** faça commit do arquivo `.env` real em repositórios públicos. Ele já deve
> estar no `.gitignore` do projeto (veja a seção seguinte).

---

## 3. Como colocar em produção

### 3.1. Back-end

1. Escolha um serviço de hospedagem para aplicações Node.js — algumas opções comuns:
   - [Render](https://render.com/)
   - [Railway](https://railway.app/)
   - Um VPS próprio (ex.: DigitalOcean, Hetzner) rodando o servidor com [PM2](https://pm2.keymetrics.io/)
     e Nginx como proxy reverso (com certificado HTTPS via Let's Encrypt/Certbot).
2. Configure todas as variáveis de ambiente do `.env` diretamente no painel do serviço escolhido
   (nunca suba o arquivo `.env` para o servidor via Git).
3. Garanta que `NODE_ENV=production` esteja definido em produção.
4. Ajuste `FRONTEND_URL` para o(s) domínio(s) real(is) do site (com HTTPS).
5. Se estiver atrás de um proxy reverso (Nginx, Cloudflare, etc.), o `app.set('trust proxy', 1)`
   já presente em `server.js` garante que o rate limiting identifique corretamente o IP real do
   visitante — apenas confirme que o proxy está de fato encaminhando o cabeçalho `X-Forwarded-For`.

Exemplo de `.gitignore` recomendado para o back-end:

```
node_modules/
.env
*.log
```

### 3.2. Front-end

O front-end é estático e pode ser hospedado separadamente do back-end em qualquer serviço
de hospedagem de sites estáticos, por exemplo:

- [Netlify Drop](https://app.netlify.com/drop) (arraste a pasta `frontend/`)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)
- O mesmo VPS do back-end, servido via Nginx

Antes de publicar, lembre-se de:
1. Atualizar `window.API_BASE_URL` (ou a constante `API_BASE_URL` em `script.js`) para
   apontar para a URL pública real da API em produção (com HTTPS).
2. Verificar se essa mesma URL do front-end está cadastrada em `FRONTEND_URL` no `.env`
   do back-end, para que o CORS permita a comunicação entre os dois.

### 3.3. Checklist final de produção

- [ ] HTTPS ativo tanto no front-end quanto no back-end
- [ ] `.env` do back-end configurado com credenciais reais e `NODE_ENV=production`
- [ ] `FRONTEND_URL` restrito apenas ao(s) domínio(s) real(is) do site
- [ ] Teste de envio do formulário em produção (verificar recebimento do e-mail)
- [ ] Teste do rate limiting (5 envios seguidos devem bloquear o 6º por 15 minutos)
- [ ] Backup/monitoramento básico do servidor do back-end

## 4. Validação pronta para o cliente

Para validar com o cliente antes de publicar oficialmente:

1. No diretório `nadia-fadel`, execute:

```bash
docker compose up --build
```

2. Abra `http://localhost` no navegador.
3. Teste o formulário de contato e confirme que a API responde em `http://localhost/api/health`.
4. Se o cliente quiser validar pelo domínio real, configure o DNS ou o arquivo `hosts` para `psicologanadiafadel.com.br` apontar para o servidor de validação e use HTTPS.

Se o front-end estiver no mesmo domínio em produção, o site usará `window.location.origin` como `API_BASE_URL` e o proxy `/api` do Nginx encaminhará as requisições ao backend.

---

## Segurança e LGPD — resumo do que foi implementado

- **Validação rigorosa** dos campos do formulário (`express-validator`): nome, telefone,
  e-mail e mensagem são validados quanto a formato, tamanho e obrigatoriedade antes de
  qualquer processamento.
- **Sanitização de inputs** (`sanitize-html`): remove qualquer HTML/script embutido nos
  campos recebidos, prevenindo XSS e injection.
- **Rate limiting** (`express-rate-limit`): no máximo 5 requisições por IP a cada 15 minutos
  no endpoint `/api/contact` (configurável via `.env`).
- **Helmet**: define cabeçalhos HTTP de segurança (CSP restritiva, `X-Frame-Options`,
  `Referrer-Policy`, etc.).
- **CORS restrito**: apenas os domínios definidos em `FRONTEND_URL` podem consumir a API.
- **Sem armazenamento persistente de dados sensíveis**: os dados do formulário são
  encaminhados por e-mail via Nodemailer e não ficam salvos em nenhum banco de dados ou
  arquivo no servidor, reduzindo a superfície de exposição de dados pessoais.
- **Logs sem dados sensíveis**: os logs do servidor registram apenas metadados operacionais
  (data, rota, IP, status do envio) — nunca nome, telefone, e-mail ou conteúdo da mensagem.
- **Respostas padronizadas em JSON**: todo endpoint responde no formato
  `{ success: boolean, message: string, ... }`, facilitando o tratamento no front-end.
- **Tratamento de erros centralizado**: erros de validação, CORS, envio de e-mail e erros
  inesperados são tratados de forma consistente, sem expor detalhes internos ao usuário final.

---

## Dúvidas técnicas comuns

**O formulário não envia e aparece "Erro ao enviar. Tente pelo WhatsApp."**
Verifique, nesta ordem: (1) se o back-end está rodando, (2) se `API_BASE_URL` no front-end
aponta para o endereço correto do back-end, (3) se o domínio do front-end está em
`FRONTEND_URL` no `.env` do back-end, (4) se as credenciais SMTP no `.env` estão corretas.

**Recebo erro de CORS no console do navegador.**
O domínio de onde o front-end está sendo servido não está cadastrado em `FRONTEND_URL`.
Adicione-o (separando por vírgula, se houver mais de um) e reinicie o back-end.

**Quero trocar o e-mail de destino das mensagens.**
Basta alterar `CONTACT_RECEIVER_EMAIL` no `.env` e reiniciar o servidor.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const {
  helmetConfig,
  buildCorsOptions,
  buildContactRateLimiter,
  contactValidationRules,
  handleValidationErrors,
  sanitizeContactPayload,
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Confia no proxy reverso (necessário em produção atrás de Nginx/Load Balancer)
// para que o rate limiting identifique o IP real do cliente.
app.set('trust proxy', 1);

// ============================================================
// Middlewares globais de segurança
// ============================================================
app.use(helmetConfig);
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '20kb' }));

// Log básico de requisições, sem registrar dados sensíveis do corpo
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} — IP: ${req.ip}`);
  next();
});

// ============================================================
// Transportador de e-mail (Nodemailer)
// ============================================================
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const SERVICO_LABELS = {
  individual: 'Terapia Individual',
  casal: 'Terapia de Casal',
  familiar: 'Terapia Familiar',
  orientacao: 'Orientação e Aconselhamento',
  'nao-sei': 'Ainda não sabe / quer conversar',
};

function buildEmailContent({ nome, telefone, email, servico, mensagem }) {
  const servicoLabel = SERVICO_LABELS[servico] || 'Não informado';

  const text = [
    'Nova mensagem recebida pelo formulário de contato do site.',
    '',
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
    `E-mail: ${email}`,
    `Tipo de atendimento: ${servicoLabel}`,
    '',
    'Mensagem:',
    mensagem,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color:#1F3D3A; line-height:1.6;">
      <h2 style="color:#1F3D3A;">Nova mensagem pelo formulário de contato</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Tipo de atendimento:</strong> ${escapeHtml(servicoLabel)}</p>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space: pre-wrap; background:#F7F4ED; padding:16px; border-radius:8px;">${escapeHtml(mensagem)}</p>
    </div>
  `;

  return { text, html };
}

// Escapa HTML para exibição segura dentro do corpo do e-mail (defesa em profundidade,
// já que os dados também passam por sanitização antes de chegar aqui).
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// Rotas
// ============================================================

// Healthcheck simples
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API operacional.' });
});

// Endpoint principal do formulário de contato
app.post(
  '/api/contact',
  buildContactRateLimiter(),
  contactValidationRules,
  handleValidationErrors,
  sanitizeContactPayload,
  async (req, res) => {
    const { nome, telefone, email, servico, mensagem } = req.body;

    try {
      const transporter = createTransporter();
      const { text, html } = buildEmailContent({ nome, telefone, email, servico, mensagem });

      await transporter.sendMail({
        from: `"${process.env.CONTACT_SENDER_NAME || 'Site Nádia Fadel'}" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `Novo contato pelo site — ${nome}`,
        text,
        html,
      });

      // Log sem dados sensíveis (não registra nome, telefone, e-mail ou mensagem)
      console.log(`[${new Date().toISOString()}] Contato enviado com sucesso — servico: ${servico || 'não informado'}`);

      return res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso! Retornaremos em breve.',
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Erro ao enviar e-mail de contato:`, error.message);

      return res.status(502).json({
        success: false,
        message: 'Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde ou entre em contato pelo WhatsApp.',
      });
    }
  }
);

// ============================================================
// Tratamento de rotas não encontradas
// ============================================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// ============================================================
// Tratamento de erros centralizado
// ============================================================
app.use((err, req, res, next) => {
  // Erros de CORS
  if (err.message === 'Origem não autorizada pela política de CORS.') {
    return res.status(403).json({ success: false, message: err.message });
  }

  console.error(`[${new Date().toISOString()}] Erro não tratado:`, err.message);
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor. Tente novamente mais tarde.',
  });
});

// ============================================================
// Inicialização
// ============================================================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} (ambiente: ${process.env.NODE_ENV || 'development'})`);
});

module.exports = app;

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { helmetConfig, buildCorsOptions, buildContactRateLimiter, contactValidationRules, handleValidationErrors, sanitizeContactPayload } = require('./middleware/security');
const { sendContactMessage } = require('./services/emailService');
const { validateEnv } = require('./config/env');

function createApp({ emailService = { sendContactMessage } } = {}) {
  const app = express();

  try {
    validateEnv();
  } catch (error) {
    console.warn(`[config] ${error.message}`);
  }

  app.set('trust proxy', 1);
  app.use(helmetConfig);
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '20kb' }));

  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} — IP: ${req.ip}`);
    next();
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API operacional.' });
  });

  app.post(
    '/api/contact',
    buildContactRateLimiter(),
    contactValidationRules,
    handleValidationErrors,
    sanitizeContactPayload,
    async (req, res) => {
      const { nome, telefone, email, servico, mensagem } = req.body;

      try {
        await emailService.sendContactMessage({ nome, telefone, email, servico, mensagem });

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

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Rota não encontrada.' });
  });

  app.use((err, req, res, next) => {
    if (err.message === 'Origem não autorizada pela política de CORS.') {
      return res.status(403).json({ success: false, message: err.message });
    }

    console.error(`[${new Date().toISOString()}] Erro não tratado:`, err.message);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
    });
  });

  return app;
}

function startServer(port = process.env.PORT || 3000, app = createApp()) {
  return app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} (ambiente: ${process.env.NODE_ENV || 'development'})`);
  });
}

module.exports = {
  createApp,
  startServer,
};

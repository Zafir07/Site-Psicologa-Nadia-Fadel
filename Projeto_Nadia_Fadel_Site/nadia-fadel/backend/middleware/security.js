const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

/**
 * Configuração do Helmet — define cabeçalhos HTTP de segurança
 * (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, etc.)
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'no-referrer' },
});

/**
 * CORS — permite requisições apenas a partir do(s) domínio(s)
 * configurado(s) em FRONTEND_URL (separados por vírgula).
 */
function buildCorsOptions() {
  const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      // Permite chamadas sem origin (ex.: Postman, curl, requisições server-to-server)
      // apenas em ambiente de desenvolvimento.
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origem não autorizada pela política de CORS.'));
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
    maxAge: 600,
  };
}

/**
 * Rate limiting — no máximo N requisições por IP a cada X minutos
 * no endpoint de contato, prevenindo abuso e spam.
 */
function buildContactRateLimiter() {
  const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15;
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 5;

  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Muitas tentativas de envio. Por favor, aguarde alguns minutos antes de tentar novamente ou entre em contato pelo WhatsApp.',
    },
    handler(req, res, next, options) {
      res.status(options.statusCode).json(options.message);
    },
  });
}

/**
 * Regras de validação dos campos do formulário de contato.
 * Rejeita entradas fora do formato esperado antes de qualquer processamento.
 */
const contactValidationRules = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ min: 2, max: 120 }).withMessage('O nome deve ter entre 2 e 120 caracteres.')
    .matches(/^[\p{L}\s'.-]+$/u).withMessage('O nome contém caracteres inválidos.'),

  body('telefone')
    .trim()
    .notEmpty().withMessage('O telefone é obrigatório.')
    .matches(/^[\d\s()+-]{8,20}$/).withMessage('Informe um telefone válido.'),

  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.')
    .isLength({ max: 180 }).withMessage('O e-mail é muito longo.')
    .normalizeEmail(),

  body('servico')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['individual', 'casal', 'familiar', 'orientacao', 'nao-sei'])
    .withMessage('Tipo de atendimento inválido.'),

  body('mensagem')
    .trim()
    .notEmpty().withMessage('A mensagem é obrigatória.')
    .isLength({ min: 10, max: 3000 }).withMessage('A mensagem deve ter entre 10 e 3000 caracteres.'),
];

/**
 * Middleware que verifica o resultado da validação acima e,
 * em caso de erro, responde de forma padronizada sem prosseguir.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Há campos inválidos no formulário.',
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
}

/**
 * Sanitização final dos campos — remove qualquer HTML/script embutido,
 * protegendo contra XSS e injection antes de usar os dados
 * (ex.: montar o corpo do e-mail).
 */
function sanitizeContactPayload(req, res, next) {
  const stripAllTags = (value) =>
    sanitizeHtml(value || '', { allowedTags: [], allowedAttributes: {} }).trim();

  req.body.nome = stripAllTags(req.body.nome);
  req.body.telefone = stripAllTags(req.body.telefone);
  req.body.email = stripAllTags(req.body.email);
  req.body.servico = stripAllTags(req.body.servico);
  req.body.mensagem = stripAllTags(req.body.mensagem);

  next();
}

module.exports = {
  helmetConfig,
  buildCorsOptions,
  buildContactRateLimiter,
  contactValidationRules,
  handleValidationErrors,
  sanitizeContactPayload,
};

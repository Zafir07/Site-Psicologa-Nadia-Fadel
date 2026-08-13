const nodemailer = require('nodemailer');

const SERVICO_LABELS = {
  individual: 'Terapia Individual',
  casal: 'Terapia de Casal',
  familiar: 'Terapia Familiar',
  orientacao: 'Orientação e Aconselhamento',
  'nao-sei': 'Ainda não sabe / quer conversar',
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

async function sendContactMessage(payload) {
  const transporter = createTransporter();
  const { text, html } = buildEmailContent(payload);

  await transporter.sendMail({
    from: `"${process.env.CONTACT_SENDER_NAME || 'Site Nádia Fadel'}" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    replyTo: payload.email,
    subject: `Novo contato pelo site — ${payload.nome}`,
    text,
    html,
  });
}

module.exports = {
  buildEmailContent,
  sendContactMessage,
};

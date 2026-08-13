function validateEnv() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_RECEIVER_EMAIL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }
}

module.exports = { validateEnv };

const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('../app');

function startTestServer(app) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(server);
    });
  });
}

async function closeServer(server) {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

test('GET /api/health returns operational status', async () => {
  const app = createApp();
  const server = await startTestServer(app);

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, message: 'API operacional.' });
  } finally {
    await closeServer(server);
  }
});

test('POST /api/contact returns validation errors for invalid payload', async () => {
  const app = createApp();
  const server = await startTestServer(app);

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'A', telefone: 'abc', email: 'invalid', mensagem: 'ok' }),
    });

    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(Array.isArray(body.errors));
  } finally {
    await closeServer(server);
  }
});

test('POST /api/contact sends the message and returns success', async () => {
  let sentPayload = null;
  const fakeEmailService = {
    async sendContactMessage(payload) {
      sentPayload = payload;
      return { ok: true };
    },
  };

  const app = createApp({ emailService: fakeEmailService });
  const server = await startTestServer(app);

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Ana Souza',
        telefone: '(51) 99999-9999',
        email: 'ana@example.com',
        servico: 'individual',
        mensagem: 'Gostaria de agendar uma sessão.',
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(sentPayload.nome, 'Ana Souza');
    assert.equal(sentPayload.email, 'ana@example.com');
  } finally {
    await closeServer(server);
  }
});

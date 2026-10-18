const test = require('node:test');
const assert = require('node:assert/strict');

const NotificationService = require('../src/services/NotificationService');

test('deve enviar a confirmação do pedido', () => {
  const originalLog = console.log;
  const mensagens = [];

  console.log = (...args) => {
    mensagens.push(args.join(' '));
  };

  try {
    const service = new NotificationService();

    service.sendOrderConfirmation(
      { name: 'Mariana' },
      { id: 1 },
      100
    );

    assert.ok(mensagens.length > 0);
    assert.ok(
      mensagens.join(' ').includes('Mariana')
    );
    assert.ok(
      mensagens.join(' ').includes('100.00')
    );
  } finally {
    console.log = originalLog;
  }
});


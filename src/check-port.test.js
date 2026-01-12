const test = require('node:test');
const assert = require('node:assert');
const net = require('node:net');

const { checkPort } = require('./check-port');
const { startServers } = require('./start-server');

function delay(ms = 30) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getFreePort() {
  return new Promise(resolve => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

test('checkPort - returns true for open port', async () => {
  const port = await getFreePort();
  const res = await startServers([port]);

  try {
    const isOpen = await checkPort('127.0.0.1', port);
    assert.strictEqual(isOpen, true);
  } finally {
    res.closeAll();
    await delay();
  }
});

test('checkPort - returns false for closed port', async () => {
  const port = await getFreePort();

  const isOpen = await checkPort('127.0.0.1', port);
  assert.strictEqual(isOpen, false);
});

test('checkPort - returns false for unreachable host', async () => {
  // reserved TEST-NET-1 address, guaranteed unreachable
  const isOpen = await checkPort('192.0.2.1', 80);
  assert.strictEqual(isOpen, false);
});

test('checkPort - handles invalid port gracefully', async () => {
  const isOpen = await checkPort('127.0.0.1', 65000);
  assert.strictEqual(isOpen, false);
});

test('checkPort - custom timeout works', async () => {
  const start = Date.now();
  await checkPort('192.0.2.1', 80, 50);
  const elapsed = Date.now() - start;

  assert.ok(elapsed < 200);
});

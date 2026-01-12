const test = require('node:test');
const assert = require('node:assert');
const net = require('node:net');

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

test('startServers - opens valid ports', async () => {
  const p1 = await getFreePort();
  const p2 = await getFreePort();

  const res = await startServers([p1, p2]);

  try {
    assert.deepStrictEqual(res.opened.sort(), [p1, p2].sort());
    assert.strictEqual(res.servers.length, 2);
    assert.deepStrictEqual(res.skipped, []);
  } finally {
    res.closeAll();
    await delay();
  }
});

test('startServers - skips already in-use ports', async () => {
  const busyPort = await getFreePort();
  const freePort = await getFreePort();

  const busy = net.createServer().listen(busyPort);

  const res = await startServers([busyPort, freePort]);

  try {
    assert.deepStrictEqual(res.opened, [freePort]);
    assert.deepStrictEqual(res.skipped, [busyPort]);
    assert.strictEqual(res.servers.length, 1);
  } finally {
    busy.close();
    res.closeAll();
    await delay();
  }
});

test('startServers - ignores invalid ports', async () => {
  const freePort = await getFreePort();

  const res = await startServers([-1, 0, 70000, 'abc', freePort]);

  try {
    assert.deepStrictEqual(res.opened, [freePort]);
    assert.strictEqual(res.servers.length, 1);
  } finally {
    res.closeAll();
    await delay();
  }
});

test('startServers - closeAll frees ports', async () => {
  const p1 = await getFreePort();
  const p2 = await getFreePort();

  const res1 = await startServers([p1, p2]);

  try {
    assert.strictEqual(res1.servers.length, 2);
  } finally {
    res1.closeAll();
    await delay();
  }

  const res2 = await startServers([p1, p2]);

  try {
    assert.deepStrictEqual(res2.opened.sort(), [p1, p2].sort());
    assert.strictEqual(res2.servers.length, 2);
  } finally {
    res2.closeAll();
    await delay();
  }
});

const test = require('node:test');
const assert = require('node:assert');
const { scanPorts } = require('../src/checker');

test('scanPorts - localhost ports opened by startServers are detected as open', async () => {
  const ports = [45678, 45679];

  const result = await scanPorts({
    hosts: ['127.0.0.1'],
    ports,
    settings: {
      chunkSize: 10,
      timeout: 200,
      log: false,
    },
  });

  assert.deepStrictEqual(
    result.opened['127.0.0.1'].sort(),
    ports,
    'all ports should be detected as open on localhost'
  );

  assert.deepStrictEqual(
    result.closed['127.0.0.1'],
    [],
    'no ports should be closed on localhost'
  );
});

const test = require('node:test');
const assert = require('node:assert');

const { compressPorts, sleep } = require('./helpers');

test('compressPorts - empty array', () => {
  assert.strictEqual(compressPorts([]), '-');
});

test('compressPorts - single port', () => {
  assert.strictEqual(compressPorts([80]), '80');
});

test('compressPorts - two consecutive ports (no range)', () => {
  assert.strictEqual(compressPorts([100, 101]), '100, 101');
});

test('compressPorts - three consecutive ports (range)', () => {
  assert.strictEqual(compressPorts([80, 81, 82]), '80-82');
});

test('compressPorts - mixed ports', () => {
  assert.strictEqual(
    compressPorts([22, 80, 81, 83, 84, 90]),
    '22, 80, 81, 83, 84, 90'
  );
});

test('compressPorts - mixed with real ranges', () => {
  assert.strictEqual(
    compressPorts([22, 80, 81, 82, 84, 85, 86, 90]),
    '22, 80-82, 84-86, 90'
  );
});

test('compressPorts - unsorted input', () => {
  assert.strictEqual(
    compressPorts([443, 80, 82, 81]),
    '80-82, 443'
  );
});

test('compressPorts - duplicates', () => {
  assert.strictEqual(
    compressPorts([80, 80, 81, 81, 82]),
    '80-82'
  );
});

test('sleep waits at least given time', async () => {
  const start = Date.now();
  await sleep(50);
  const elapsed = Date.now() - start;

  assert.ok(elapsed >= 45);
});

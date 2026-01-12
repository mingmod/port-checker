const { compressPorts, sleep } = require('./helpers');
const { startServers } = require('./start-server');
const { checkPort } = require('./check-port');

/**
 * Scan ports on multiple hosts using chunked server binding
 *
 * @param {Object} params
 * @param {string[]} params.hosts
 * @param {number[]} params.ports
 * @param {Object} [params.settings]
 * @param {number} [params.settings.chunkSize=1000]
 * @param {number} [params.settings.bindDelay=100]
 * @param {number} [params.settings.closeDelay=50]
 * @param {number} [params.settings.timeout=500]
 * @param {boolean} [params.settings.log=true]
 */
async function scanPorts({
  hosts,
  ports,
  settings = {},
}) {
  const {
    chunkSize = 1000,
    bindDelay = 100,
    closeDelay = 50,
    timeout = 500,
    log = true,
  } = settings;

  if (!Array.isArray(hosts) || !hosts.length) {
    throw new Error('hosts must be a non-empty array');
  }

  if (!Array.isArray(ports) || !ports.length) {
    throw new Error('ports must be a non-empty array');
  }

  const uniquePorts = [...new Set(ports)].sort((a, b) => a - b);

  const opened = {};
  const closed = {};

  for (const h of hosts) {
    opened[h] = [];
    closed[h] = [];
  }

  async function scanChunk(chunk) {
    for (const host of hosts) {
      const results = await Promise.all(
        chunk.map(port => checkPort(host, port, timeout))
      );

      results.forEach((ok, idx) => {
        const port = chunk[idx];
        (ok ? opened[host] : closed[host]).push(port);
      });
    }
  }

  if (log) {
    console.log('\n=== CHUNKED SERVER + SCAN MODE ===\n');
  }

  for (let i = 0; i < uniquePorts.length; i += chunkSize) {
    const chunk = uniquePorts.slice(i, i + chunkSize);

    if (log) {
      console.log(`Processing ports ${chunk[0]}–${chunk[chunk.length - 1]}`);
    }

    const { servers } = await startServers(chunk);
    await sleep(bindDelay);

    await scanChunk(chunk);

    servers.forEach(s => s.close());
    await sleep(closeDelay);
  }

  if (log) {
    console.log('\n=== SCAN FINISHED ===\n');
    console.log('SCANNED:', compressPorts(uniquePorts), '\n');

    for (const h of hosts) {
      console.log(h);
      console.log('  OPEN:  ', compressPorts(opened[h]));
      console.log('  CLOSED:', compressPorts(closed[h]));
      console.log('');
    }
  }

  return { opened, closed };
}

module.exports = { scanPorts };

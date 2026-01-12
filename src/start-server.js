const net = require('node:net');

async function startServers(portsArray) {
  if (!Array.isArray(portsArray)) {
    throw new TypeError('portsArray must be an array');
  }

  const servers = [];
  const opened = [];
  const skipped = [];

  for (const port of portsArray) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      skipped.push(port);
      continue;
    }

    await new Promise(resolve => {
      const server = net.createServer();

      server.once('error', () => {
        skipped.push(port);
        server.close?.();
        resolve();
      });

      server.listen(port, '0.0.0.0', () => {
        servers.push(server);
        opened.push(port);
        resolve();
      });
    });
  }

  return {
    servers,
    opened,
    skipped,
    closeAll() {
      for (const s of servers) s.close();
    }
  };
}

module.exports = { startServers };

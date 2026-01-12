const net = require('node:net');

function checkPort(host, port, timeout = 500) {
  return new Promise(resolve => {
    const sock = new net.Socket();
    let done = false;

    const finish = (result) => {
      if (done) return;
      done = true;
      sock.destroy();
      resolve(result);
    };

    sock.setTimeout(timeout);

    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error', () => finish(false));

    sock.connect(port, host);
  });
}

module.exports = { checkPort };

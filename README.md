# port-checker

Lightweight Node.js utility for scanning TCP ports on multiple hosts.
Supports chunked scanning, configurable timeouts, and clear reporting of open and closed ports.

---

## Features

* Scan TCP ports on multiple hosts
* Chunked scanning to avoid resource exhaustion
* Configurable timeouts and delays
* Utility helpers for port range compression
* TypeScript typings included
* Works with Node.js 18+

---

## Installation

```bash
npm install port-checker
```

---

## Usage

### Basic example

```js
const { scanPorts } = require('port-checker');

(async () => {
  const hosts = ['127.0.0.1', '192.168.1.3'];
  const ports = [22, 80, 443, 3000, 5000];

  const result = await scanPorts({
    hosts,
    ports,
    settings: {
      chunkSize: 1000, // ports per scan batch
      timeout: 500,    // ms to wait for each port
      log: true        // enable console output
    }
  });

  console.log(result.opened);
  console.log(result.closed);
})();
```

---

## API

### scanPorts({ hosts, ports, settings })

Scans a list of ports on multiple hosts.

**Parameters**

* **hosts** (`string[]`) — hostnames or IP addresses
* **ports** (`number[]`) — ports to scan
* **settings** (`object`, optional):

  * `chunkSize` (`number`) — ports per scan batch (default: `1000`)
  * `bindDelay` (`number`) — delay after binding (ms, default: `100`)
  * `closeDelay` (`number`) — delay after closing (ms, default: `50`)
  * `timeout` (`number`) — per-port timeout in ms (default: `500`)
  * `log` (`boolean`) — enable console logging (default: `true`)

**Returns**

```ts
{
  opened: Record<string, number[]>;
  closed: Record<string, number[]>;
}
```

---

## Utility Functions

### checkPort(host, port, timeout?)

Checks whether a single TCP port is open.

```js
const { checkPort } = require('port-checker');

const isOpen = await checkPort('127.0.0.1', 80);
```

---

### compressPorts(ports)

Compresses consecutive ports into readable ranges.

```js
compressPorts([80, 81, 82, 443]);
// "80-82, 443"
```

---

### sleep(ms)

Async delay helper.

```js
await sleep(500);
```

---

## License

MIT © Sergey Arustamyan

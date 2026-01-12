function compressPorts(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '-';

  const ports = [...new Set(arr)].sort((a, b) => a - b);

  const res = [];
  let start = ports[0];
  let prev = ports[0];

  for (let i = 1; i < ports.length; i++) {
    const cur = ports[i];

    if (cur === prev + 1) {
      prev = cur;
    } else {
      pushRange(res, start, prev);
      start = prev = cur;
    }
  }

  pushRange(res, start, prev);
  return res.join(', ');
}

function pushRange(res, start, end) {
  if (start === end) {
    res.push(`${start}`);
  } else if (end === start + 1) {
    res.push(`${start}`, `${end}`);
  } else {
    res.push(`${start}-${end}`);
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

module.exports = {
  compressPorts,
  sleep
}

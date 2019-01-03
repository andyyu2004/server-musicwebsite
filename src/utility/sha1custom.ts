const sha1 = require('sha1');

export default function sha1_64nonzero(x) {
  // Ensure non-zero hash for reserved value
  let hash = sha1_64(x);
  while(hash === 0) 
    hash = sha1_64(x);
  return hash;
}

function sha1_64(x) {
  const sha1hash = sha1(x);
  const hex16 = sha1hash.substring(0, 15);
  return parseInt(hex16, 16);
}

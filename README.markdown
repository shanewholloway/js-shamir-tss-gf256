# Shamir Threshold Secret Sharing using Galois Field 2^8

Uses Shamir's secret sharing method to allows space-efficient secret sharing
(splitting) requiring a minimum threshold of shares in order to unlock the
original secret.

- Wikipedia on [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
- Octect-based Shamir Secret Sharing patterned after IETF informational draft [Threshold Secret Sharing](https://tools.ietf.org/html/draft-mcgrew-tss-03)
- [The Laws of Cryptography](http://www.cs.utsa.edu/~wagner/laws/FFM.html)

## Example

```javascript
import * as shamir_tss from 'shamir-tss-gf256'
// or const shamir_tss = require('shamir-tss-gf256')
// or <script src='https://unpkg.com/shamir-tss-gf256@0.3.2/umd/shamir-tss-gf256.min.js' ></script>

const secret = shamir_tss.randomBytes(16) // or any Uint8Array/Buffer

// split into 10 shares, allowing any 3 to unlock the secret
const shares = shamir_tss.generateShares_b64(secret, 3, 10)
// shares = [
//   'AwH9nHA-35qs4JvF8qkfngTK',
//   'AwI3E71t-b3c2odZ_2pNcT-3',
//   'AwO1ZJY6wtOKODOfme1m1wP0',
//   'AwSoWHr_aQSotSWu6Pl60tEj',
//   'AwUqL1GoUmr-V5Fojn5RdO1g',
//   'AwbgoJz7dE2ObY30g70Dm9Yd',
//   'Awdi17esTyPYjzky5TooPepe',
//   'AwjN7ewQD5wmByQm8vxuDECz',
//   'AwlPmsdHNPJw5ZDglHtFqnzw',
//   'AwqFFQoUEtUA34x8mbgXRUeN' ]


const res_under_a = shamir_tss.unlockShares([shares[2], shares[7]], false)
// res_under_a = false

try {
  const res_under = shamir_tss.unlockShares([shares[2], shares[7]])
} catch (err) {
  // Number of shares did not meet threshold to unlock shared secret
}


const res_min = shamir_tss.unlockShares([shares[2], shares[7], shares[4]])
// res_min = Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ]

const res_over = shamir_tss.unlockShares([shares[2], shares[7], shares[4], shares[9], shares[1]])
// res_over = Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ]

```



## API

### Primary

#### `generateShares(secret, thresholdShares, totalShares)`
Transforms `secret` into a Galois Field polynomial according to Shamir's secret
sharing method, returning the specified number of `totalShares` where any
unique subset of `thresholdShare` shares will unlock the original `secret`.

Returns the `shares` as array of `Uint8Array`.


#### `unlockShares(shares, valueIfUnderThreshold)`
Computes and returns the `secret` using provided `shares` array, given
sufficient number of shares. Otherwise, `valueIfUnderThreshold` is returned.


**Cautionary Note:** There are no self-consistency checks built into Shamir
Threshold Secret Shares -- combining shares from different source will result
in unlocking some undefined "secret".


#### `generateShares_b64(secret, thresholdShares, totalShares)`
`generateShares()` with results Base64 encoded.

#### `unlockShares_b64()`
`unlockShares()` with result Base64 encoded.


### Utilities

#### `function isBinarySecret(arg)`
True if `arg` is a `Buffer` or `Uint8Array`, false otherwise.

#### `function randomBytes(n_bytes)`
In Browser environments, generates a `Uint8Array` of specified byte length using `crypto.getRandomValues()`.

In NodeJS, generates a `Uint8Array` of specified byte length using `crypto.randomBytes()`.

#### `function u8_to_base64(u8)`
Converts a `Uint8Array` or `Buffer` to a Base64 (URL safe) encoded string.

#### `function base64_to_u8(string_b64)`
Converts a Base64 encoded string to a `Uint8Array` or `Buffer`.


### Internal API

The internal `class ShamirSecretShare` (alias `ShamirTSS`) is exposed. Please
read the source for understanding and details.

### Galois Field 256 (2^8) math primitives

```javascript
function compute_poly(x, poly_coeff) {}
function lagrange_basis_poly_at_zero(u) {}
function lagrange_interpolate(u, v_iterable) {}

function add(x, y) {}
function mul(x, y) {}
function div(x, y) {}
```

To use:
```javascript
const gf256 = require('shamir-tss-gf256/cjs/gf256')
// or import * as gf256 from 'shamir-tss-gf256/esm/gf256'
// or <script src='https://unpkg.com/shamir-tss-gf256@0.3.2/umd/gf256.js' ></script>
```


## License

[ISC](LICENSE)


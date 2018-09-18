const shamir_tss = require('shamir-tss-gf256')

//const secret = Buffer.from('some string of data')
const secret = shamir_tss.randomBytes(16) // or any Uint8Array/Buffer

// split into 10 shares, allowing any 3 to unlock the secret
const shares = shamir_tss.generateShares_b64(secret, 3, 10)
console.log(shares)
// [ 'AwH9nHA-35qs4JvF8qkfngTK',
//   'AwI3E71t-b3c2odZ_2pNcT-3',
//   'AwO1ZJY6wtOKODOfme1m1wP0',
//   'AwSoWHr_aQSotSWu6Pl60tEj',
//   'AwUqL1GoUmr-V5Fojn5RdO1g',
//   'AwbgoJz7dE2ObY30g70Dm9Yd',
//   'Awdi17esTyPYjzky5TooPepe',
//   'AwjN7ewQD5wmByQm8vxuDECz',
//   'AwlPmsdHNPJw5ZDglHtFqnzw',
//   'AwqFFQoUEtUA34x8mbgXRUeN' ]

const res_under_fallback = shamir_tss.unlockShares([shares[2], shares[7]], false)
console.log(res_under_fallback) // false

try {
  const res_under = shamir_tss.unlockShares([shares[2], shares[7]])
} catch (err) {
  console.error(err.message) // Number of shares did not meet threshold to unlock shared secret
}

const res_min = shamir_tss.unlockShares([shares[2], shares[7], shares[4]])
console.log({res_min}) // { res_min: Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ] }

const res_over = shamir_tss.unlockShares([shares[2], shares[7], shares[4], shares[9], shares[1]])
console.log({res_over}) // { res_over: Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ] }


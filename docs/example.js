const shamir_tss = require('shamir-tss-gf256')

const dbg = 'undefined' === typeof window
  ? v => v : v => Array.from(v)

//const secret = Buffer.from('some string of data')
const secret = shamir_tss.randomBytes(16) // or any Uint8Array/Buffer
console.log()
console.log('Original secret:')
console.log(dbg(secret))
console.log()

// split into 10 shares, allowing any 3 to unlock the secret
const shares = shamir_tss.generateShares_b64(secret, 3, 10)
console.log()
console.log('Shares:')
for (const ea of shares)
  console.log(' ', JSON.stringify(ea))
console.log()

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

const res_under_fallback = shamir_tss.unlockShares([shares[2], shares[7]], {'«insuffecient»':true})
console.log()
console.log('Unlocked with insuffecient shares:')
console.log(res_under_fallback)
console.log()

try {
  const res_under = shamir_tss.unlockShares([shares[2], shares[7]])
} catch (err) {
  console.log()
  console.log('// Expected error: Number of shares did not meet threshold to unlock shared secret. (2 of 3, 0 duplicates)')
  console.log('Actual error:', err.message) // Number of shares did not meet threshold to unlock shared secret. (2 of 3, 0 duplicates)
  console.log()
}

const res_min = shamir_tss.unlockShares([shares[2], shares[7], shares[4]])
console.log()
console.log('Unlocked with minimum shares:')
console.log(dbg(res_min)) // Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ]
console.log()

const res_over = shamir_tss.unlockShares([shares[2], shares[7], shares[4], shares[9], shares[1]])
console.log()
console.log('Unlocked with excess shares:')
console.log(dbg(res_over)) // Uint8Array [ 127, 235, 91, 105, 228, 244, 250, 2, 47, 3, 148, 46, 52, 56, 56, 137 ]
console.log()


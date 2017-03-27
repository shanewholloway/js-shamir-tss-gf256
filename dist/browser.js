'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateShares = generateShares;
exports.unlockShares = unlockShares;
// vim: ts=2 sw=2 expandtab filetype=javascript
const Buffer = require('buffer/').Buffer;
const randomBytes = require('randombytes');

const ShamirThresholdSecretShare_GF256 = exports.ShamirThresholdSecretShare_GF256 = require('./tss').default(Buffer, randomBytes);
const ShamirSecretShare = exports.ShamirSecretShare = ShamirThresholdSecretShare_GF256;
const ShamirTSS = exports.ShamirTSS = ShamirThresholdSecretShare_GF256;

function generateShares(secret, thresholdShares, totalShares) {
  return new ShamirSecretShare().generate(secret, thresholdShares, totalShares);
}function unlockShares(shares_of_secret) {
  return new ShamirSecretShare().unlock(shares_of_secret);
}
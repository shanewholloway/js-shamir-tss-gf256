'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// vim: ts=2 sw=2 expandtab filetype=javascript
const { randomBytes } = require('crypto');

const ShamirSecretShare = exports.ShamirSecretShare = require('./tss').default(Buffer, randomBytes);
const ShamirTSS = exports.ShamirTSS = ShamirSecretShare;
const generateShares = exports.generateShares = ShamirTSS.generateShares;
const unlockShares = exports.unlockShares = ShamirTSS.unlockShares;
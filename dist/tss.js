"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Buffer, randomBytes) {

  class ShamirThresholdSecretShare_GF256 {
    constructor() {
      this._randomBytes = randomBytes;
    }

    generate(secret, thresholdShares, totalShares) {
      if (!Buffer.isBuffer(secret)) {
        throw new Error("Expected secret to be a buffer");
      }

      if (thresholdShares <= 0) {
        throw new Error("Expected a positive threshold count");
      }

      if (null == totalShares) {
        totalShares = thresholdShares;
      } else if (totalShares < thresholdShares) {
        throw new Error("Expected the total count to be greater than the threshold count");
      }

      // initialize random Galois Field polynomials using provided
      // octects of secret for a0 coefficients
      const gf_polys = Array.from(secret, a0_secret => {
        let poly = this._randomBytes(thresholdShares);
        poly[0] = a0_secret; // use specified a0 as secret
        return poly;
      });

      // compute the shares given the Galois Field polynomials
      return new Array(totalShares).fill(null).map((_, i) => {
        const x = 1 + i,
              y_vec = gf_polys.map(poly => compute_poly(x, poly));
        return this._packShare(thresholdShares, x, y_vec);
      });
    }

    unlock(shares, valueIfUnderThreshold) {
      shares = Array.from(shares, this._unpackShare);
      const threshold = shares[0].threshold;
      if (shares.length < threshold) {
        if (undefined !== valueIfUnderThreshold) {
          return valueIfUnderThreshold;
        }
        throw new Error('Number of shares did not meet threshold to unlock shared secret');
      }

      const u = shares.slice(0, threshold).map(s => s.x);

      // v_vec = zip @ shares.map(s => s.y_vec)
      const v_vec = Array.from(shares[0].y_vec, (_, i) => shares.map(s => s.y_vec[i]));

      // Lagrange interpolation integrates the split share into the original secret
      const secret_octects = lagrange_interpolate(u, v_vec);
      return Buffer(Array.from(secret_octects));
    }

    _packShare(threshold, x, y_vec) {
      let data = [threshold, x].concat(y_vec);
      // use url-safe base64 encoding
      return Buffer(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    _unpackShare(buf) {
      if ('string' === typeof buf) {
        buf = Buffer.from(buf, 'base64');
      } else if (!Buffer.isBuffer(buf)) {
        throw new Error("Share must be a buffer or a string");
      }

      return { threshold: buf[0], x: buf[1], y_vec: buf.slice(2) };
    }

    static generateShares(secret, thresholdShares, totalShares) {
      return new ShamirThresholdSecretShare_GF256().generate(secret, thresholdShares, totalShares);
    }

    static unlockShares(shares_of_secret, valueIfUnderThreshold) {
      return new ShamirThresholdSecretShare_GF256().unlock(shares_of_secret, valueIfUnderThreshold);
    }
  }

  return ShamirThresholdSecretShare_GF256;
};

// vim: ts=2 sw=2 expandtab filetype=javascript
const { compute_poly, lagrange_interpolate } = require('./gf256_math');
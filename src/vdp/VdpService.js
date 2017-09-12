import request from 'request-promise-native';
import fs from 'fs';

import config from './config';

class VdpService {
  constructor(userConfig = {}) {
    this.config = { ...config, ...userConfig };
  }

  convertCurrency({ sourceAmount, sourceCurrency, destCurrency }) {
    const { API_FOREX_PATH: apiPath } = this.config;
    const sourceCurrencyCode = this._toCurrencyCode(sourceCurrency);
    const destCurrencyCode = this._toCurrencyCode(destCurrency);

    const headers = {
      Authorization: this._getAuthorizationHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const body = {
      sourceAmount,
      sourceCurrencyCode,
      destinationCurrencyCode: destCurrencyCode,
    };

    const url = this._getFullUrl(apiPath);

    const promise = request({
      url,
      method: 'POST',
      headers,
      body,
      json: true,
      timeout: 10000, // 10s
      agentOptions: {
        key: this._getKeyFile(),
        cert: this._getCertFile(),
      },
    });

    promise.then((response) => {
      const result = JSON.parse(response);
      return result;
    });

    return promise;
  }

  _getKeyFile() {
    return fs.readFileSync(this.config.KEY_FILE_PATH);
  }

  _getCertFile() {
    return fs.readFileSync(this.config.CERT_FILE_PATH);
  }

  _getFullUrl(apiPath) {
    return this.config.HOST_URL + apiPath;
  }

  _getAuthorizationHeader() {
    const { USER_ID: userId, PASSWORD: password } = this.config;

    return `Basic ${Buffer.from(`${userId}:${password}`).toString('base64')}`;
  }

  _toCurrencyCode(currency) {
    return currency.toUpperCase();
  }
}

export default VdpService;

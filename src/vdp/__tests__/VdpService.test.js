import path from 'path';
import dotenv from 'dotenv';

import VdpService from '../VdpService';

dotenv.config();

const vdpService = new VdpService({
  CERT_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_CERT_FILE_PATH),
  KEY_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_KEY_FILE_PATH),
});

test('converts currency', () => {
  const promise = vdpService.convertCurrency({
    sourceAmount: 100,
    sourceCurrency: 'SGD',
    destCurrency: 'USD',
  });

  promise.then(({ destinationAmount, conversionRate }) => {
    expect(destinationAmount).toBeTruthy();
    expect(conversionRate).toBeTruthy();
  });
});

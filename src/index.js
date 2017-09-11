import Alexa from 'alexa-sdk';
import path from 'path';

import VdpService from './vdp/vdp_service';
import speech from './resources/speech';
import { getResolvedSlotsFromIntent } from './alexa/helpers';

const vdpService = new VdpService({
  CERT_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_CERT_FILE_PATH),
  KEY_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_KEY_FILE_PATH),
});

const logObject = (name, object) => {
  console.log(`\n\n${name}: ${JSON.stringify(object, null, 2)}\n\n`);
};

const handlers = {

  HelloIntent() {
    this.emit(':tell', 'Hello!');
  },

  ConvertCurrencyIntent() {
    logObject('Request', this.event.request);

    // Check if all slots are filled
    const { dialogState } = this.event.request;
    if (dialogState !== 'COMPLETED') {
      this.emit(':delegate'); // Delegate to skill interface to prompt for slots
      return;
    }

    const intent = this.event.request.intent;

    const {
      amount: sourceAmount = '1',
      source_currency_code: sourceCurrency,
      dest_currency_code: destCurrency,
    } = getResolvedSlotsFromIntent(intent);

    console.log(`Converting ${sourceAmount} ${sourceCurrency} to ${destCurrency}...`);

    vdpService.convertCurrency({ sourceAmount, sourceCurrency, destCurrency })
      .then((result) => {
        const { destinationAmount: destAmount } = result;
        logObject('Result from vdpService.convertCurrency', result);

        const response = speech.convertCurrencyResponse({
          sourceAmount, destAmount, sourceCurrency, destCurrency,
        });

        const cardTitle = speech.convertCurrencyResponseCardTitle();

        this.emit(':tellWithCard', response, cardTitle, response);
        this.emit(':tell', response);
      })
      .catch((error) => {
        logObject('Error from vdpService.convertCurrency', error);

        this.emit(':tell', speech.errorMessage());
      });
  },

  'AMAZON.HelpIntent': () => {
    const message = speech.helpMessage();
    const reprompt = speech.helpReprompt();
    this.emit(':ask', message, reprompt);
  },

  'AMAZON.CancelIntent': () => {
    const message = speech.stopMessage();
    this.emit(':tell', message);
  },

  'AMAZON.StopIntent': () => {
    const message = speech.stopMessage();
    this.emit(':tell', message);
  },

  Unhandled() {
    this.emit('AMAZON.HelpIntent');
  },
};

const handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = process.env.APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

export default handler;

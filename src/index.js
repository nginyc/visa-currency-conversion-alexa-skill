import Alexa from 'alexa-sdk';
import path from 'path';

import VdpService from './vdp/VdpService';
import speech from './resources/speech';
import { getSlotValue, clearSlotValueFromIntent } from './alexa/helpers';

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
    logObject('Event', this.event);

    const { intent } = this.event.request;

    const sourceAmount = getSlotValue({
      intent,
      slotName: 'amount',
      resolveSlot: (slotValue) => {
        if (slotValue && !isNaN(slotValue)) {
          return slotValue;
        }
        return null;
      },
    }) || '1';

    const sourceCurrency = getSlotValue({
      intent,
      slotName: 'source_currency_code',
    });

    if (sourceCurrency === null) {
      clearSlotValueFromIntent({ intent, slotName: 'source_currency_code' });
      console.log('Invaild source currency.');
      this.emit(':delegate', intent);
      return;
    }

    const destCurrency = getSlotValue({
      intent,
      slotName: 'dest_currency_code',
    });

    if (destCurrency === null) {
      clearSlotValueFromIntent({ intent, slotName: 'dest_currency_code' });
      console.log('Invalid destination currency.');
      this.emit(':delegate', intent);
      return;
    }

    console.log(`Converting ${sourceAmount} ${sourceCurrency} to ${destCurrency}...`);

    vdpService.convertCurrency({ sourceAmount, sourceCurrency, destCurrency })
      .then((result) => {
        const { destinationAmount: destAmount } = result;
        logObject('Result from vdpService.convertCurrency', result);

        const response = speech.convertCurrencyResponse({
          sourceAmount, destAmount, sourceCurrency, destCurrency,
        });

        const cardTitle = speech.convertCurrencyResponseCardTitle({
          destCurrency, sourceCurrency,
        });

        const cardMessage = speech.convertCurrencyResponseCardMessage({
          sourceAmount, destAmount, sourceCurrency, destCurrency,
        });

        this.emit(':tellWithCard', response, cardTitle, cardMessage);
        this.emit(':tell', response);
      })
      .catch((error) => {
        logObject('Error from vdpService.convertCurrency', error);

        this.emit(':tell', speech.errorMessage());
      });
  },

  'AMAZON.HelpIntent': function () {
    const message = speech.helpMessage();
    const reprompt = speech.helpReprompt();
    this.emit(':ask', message, reprompt);
  },

  'AMAZON.CancelIntent': function () {
    const message = speech.stopMessage();
    this.emit(':tell', message);
  },

  'AMAZON.StopIntent': function () {
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

import Alexa from 'alexa-sdk';
import VdpService from './vdp/vdp_service';
import resources from './resources';
import path from 'path';

const vdpService = new VdpService({
    CERT_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_CERT_FILE_PATH),
    KEY_FILE_PATH: path.resolve(process.cwd(), process.env.VDP_KEY_FILE_PATH)
});

const logObject = (name, object) => {
    console.log(`\n\n${name}: ${JSON.stringify(object, null, 2)}\n\n`);
};

const handlers = {
    'HelloIntent': function () {
        this.emit(':tell', 'Hello!');
    },
    'ConvertCurrencyIntent': function () {
        logObject('Request', this.event.request);

        // Check if all slots are filled
        const { dialogState } = this.event.request;
        if (dialogState != 'COMPLETED') {
            this.emit(':delegate'); // Delegate to skill interface to prompt for slots
            return;
        }

        const { source_currency_code, dest_currency_code, amount } = this.event.request.intent.slots;
        const sourceAmount = amount.value;
        const sourceCurrency = source_currency_code.value;
        const destCurrency = dest_currency_code.value;

        console.log(`Converting ${sourceAmount} ${sourceCurrency} to ${destCurrency}...`);

        vdpService.convertCurrency({ sourceAmount, sourceCurrency, destCurrency })
            .then((result) => {
                const { destinationAmount: destAmount, conversionRate } = result;
                logObject('Result from vdpService.convertCurrency', result);

                this.emit(':tell',
                    `${sourceAmount} ${sourceCurrency}  <break time="1s"/>`
                        + ` is ${destAmount} ${destCurrency} <break time="1s"/>`
                        + ` at conversion rate of 1 ${sourceCurrency}  <break time="1s"/>`
                        + ` to ${conversionRate} ${destCurrency}`
                );
            })
            .catch((error) => {
                logObject('Error from vdpService.convertCurrency', error);

                this.emit(':tell', 'Something went wrong...');
            });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.emit(':tell', this.t('HELP_MESSAGE'));
    },
};

const handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = process.env.APP_ID;
    alexa.resources = resources;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

export default handler;

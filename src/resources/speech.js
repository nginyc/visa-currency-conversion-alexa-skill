const sayAsCharacters = (text) => {
  return `<say-as interpret-as="characters">${text}</say-as>`;
};

const speech = {
  helpMessage: () => `To do currency conversion with Visa's daily exchange rates,` +
    ` say something like "Convert 10 ${sayAsCharacters('USD')} to ${sayAsCharacters('SGD')}".`,

  helpReprompt: () => speech.helpMessage,

  stopMessage: () => 'Goodbye!',

  errorMessage: () => 'Something went wrong...',

  convertCurrencyResponse: ({
    sourceAmount, sourceCurrency, destAmount, destCurrency,
  }) => `${sourceAmount} ${sayAsCharacters(sourceCurrency)}` +
    ` is ${destAmount} ${sayAsCharacters(destCurrency)}.`,

  convertCurrencyResponseCardTitle: ({ sourceCurrency, destCurrency }) => `Converted` +
    ` ${sourceCurrency.toUpperCase()} to ${destCurrency.toUpperCase()}`,

  convertCurrencyResponseCardMessage: ({
    sourceAmount, sourceCurrency, destCurrency, destAmount,
  }) => `${sourceAmount} ${sourceCurrency.toUpperCase()}` +
  ` is ${destAmount} ${destCurrency.toUpperCase()}.`,
};

export default speech;

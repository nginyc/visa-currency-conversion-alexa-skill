import { getSlotValue, clearSlotValueFromIntent } from '../helpers';

test('getSlotValue with valid slots', () => {
  const intent = JSON.parse(`
  {
    "name": "ConvertCurrencyIntent",
    "confirmationStatus": "NONE",
    "slots": {
      "dest_currency_code": {
        "name": "dest_currency_code",
        "value": "s.g.d.",
        "resolutions": {
          "resolutionsPerAuthority": [
            {
              "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
              "status": {
                "code": "ER_SUCCESS_MATCH"
              },
              "values": [
                {
                  "value": {
                    "name": "SGD",
                    "id": "sgd"
                  }
                }
              ]
            }
          ]
        },
        "confirmationStatus": "NONE"
      },
      "amount": {
        "name": "amount",
        "value": "10",
        "confirmationStatus": "NONE"
      },
      "source_currency_code": {
        "name": "source_currency_code",
        "value": "u.s.d.",
        "resolutions": {
          "resolutionsPerAuthority": [
            {
              "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
              "status": {
                "code": "ER_SUCCESS_MATCH"
              },
              "values": [
                {
                  "value": {
                    "name": "USD",
                    "id": "usd"
                  }
                }
              ]
            }
          ]
        },
        "confirmationStatus": "NONE"
      }
    }
  }
  `);

  const destCurrencyCode = getSlotValue({ intent, slotName: 'dest_currency_code' });
  expect(destCurrencyCode).toBe('sgd');

  const sourceCurrencyCode = getSlotValue({ intent, slotName: 'source_currency_code' });
  expect(sourceCurrencyCode).toBe('usd');

  const amount = getSlotValue({
    intent,
    slotName: 'amount',
    resolveSlot: (slotValue) => {
      if (slotValue && !isNaN(slotValue)) {
        return slotValue;
      }
      return null;
    },
  });
  expect(amount).toBe('10');
});

test('getSlotValue with invalid slots', () => {
  const intent = JSON.parse(`
  {
    "name": "ConvertCurrencyIntent",
    "confirmationStatus": "NONE",
    "slots": {
      "dest_currency_code": {
        "name": "dest_currency_code",
        "value": "s.g.d.",
        "resolutions": {
          "resolutionsPerAuthority": [
            {
              "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
              "status": {
                "code": "ER_SUCCESS_MATCH"
              },
              "values": [
                {
                  "value": {
                    "name": "SGD",
                    "id": "sgd"
                  }
                }
              ]
            }
          ]
        },
        "confirmationStatus": "NONE"
      },
      "amount": {
        "name": "amount",
        "value": "?",
        "confirmationStatus": "NONE"
      },
      "source_currency_code": {
        "name": "source_currency_code",
        "value": "D",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
                    "status": {
                        "code": "ER_SUCCESS_NO_MATCH"
                    }
                }
            ]
        },
        "confirmationStatus": "NONE"
      }
    }
  }
  `);

  const destCurrencyCode = getSlotValue({ intent, slotName: 'dest_currency_code' });
  expect(destCurrencyCode).toBe('sgd');

  const sourceCurrencyCode = getSlotValue({ intent, slotName: 'source_currency_code' });
  expect(sourceCurrencyCode).toBe(null);

  const amount = getSlotValue({
    intent,
    slotName: 'amount',
    resolveSlot: (slotValue) => {
      if (slotValue && !isNaN(slotValue)) {
        return slotValue;
      }
      return null;
    },
  });
  expect(amount).toBe(null);
});

test('clearSlotValueFromIntent', () => {
  const intent = JSON.parse(`
  {
    "name": "ConvertCurrencyIntent",
    "confirmationStatus": "NONE",
    "slots": {
      "dest_currency_code": {
        "name": "dest_currency_code",
        "value": "s.g.d.",
        "resolutions": {
          "resolutionsPerAuthority": [
            {
              "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
              "status": {
                "code": "ER_SUCCESS_MATCH"
              },
              "values": [
                {
                  "value": {
                    "name": "SGD",
                    "id": "sgd"
                  }
                }
              ]
            }
          ]
        },
        "confirmationStatus": "NONE"
      },
      "amount": {
        "name": "amount",
        "value": "?",
        "confirmationStatus": "NONE"
      },
      "source_currency_code": {
        "name": "source_currency_code",
        "value": "D",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.9cd57764-a197-4e24-9da6-fb2da7b2e7f9.CurrencyCode",
                    "status": {
                        "code": "ER_SUCCESS_NO_MATCH"
                    }
                }
            ]
        },
        "confirmationStatus": "NONE"
      }
    }
  }
  `);

  expect(intent.slots.amount.value).toBeDefined();

  clearSlotValueFromIntent({ intent, slotName: 'amount' });
  expect(intent.slots.amount.value).toBeUndefined();

  clearSlotValueFromIntent({ intent, slotName: 'source_currency_code' });
  expect(intent.slots.source_currency_code.value).toBeUndefined();
  expect(intent.slots.source_currency_code.resolutions).toBeUndefined();

  expect(intent.slots.dest_currency_code.value).toBeDefined();
});

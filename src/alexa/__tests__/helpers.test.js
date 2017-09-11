import { getResolvedSlotsFromIntent } from '../helpers';

test('resolves slots from intent', () => {
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

  const { dest_currency_code, source_currency_code, amount } = getResolvedSlotsFromIntent(intent);
  expect(dest_currency_code).toBe('sgd');
  expect(source_currency_code).toBe('usd');
  expect(amount).toBeUndefined();
});

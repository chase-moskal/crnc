
# -c-r-n-c- <br/> currency conversions and formatting for the web

`npm install crnc`

- this is the currency library for [shopper](https://github.com/chase-moskal/shopper)
- downloads exchange rates from the [bank of canada's public api](https://www.bankofcanada.ca/valet/docs)
- caches results in localStorage for an hour by default
- no real documentation, read the source (so sorry)
- open source, contributions welcome

### crnc is a collection of handy functions

currency tools

- [downloadExchangeRates](./s/currency-tools/download-exchange-rates.ts)  
	download somewhat up-to-date currency exchange info from the internet

- [convertCurrency](./s/currency-tools/convert-currency.ts)  
	exchange a money value from one currency to another

- [formatCurrency](./s/currency-tools/format-currency.ts)  
	express a money value as a human-readable string  
	(adds dollar signs and commas and stuff)

- [convertAndFormatCurrency](./s/currency-tools/convert-and-format-currency.ts)  
	exchange a money value, and format it, in one shot  
	(simply a convenience function, combines the two above)

ecommerce helpers

- [ascertainEcommerceDetails](./s/ecommerce/ascertain-ecommerce-details.ts)  
	enhanced logic to retrieve exchange rates, fallback onto dud, caching

- [assumeUserCurrency](./s/ecommerce/assume-user-currency.ts)  
	assume what currency the user might want to see based on locale

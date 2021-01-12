
# -c-r-n-c- <br/> currency conversions and formatting for the web

`npm install crnc`

- this is the currency library for [shopper](https://github.com/chase-moskal/shopper)
- preconfigured to work with [exchangeratesapi.io](https://exchangeratesapi.io/) out of the box
- lackluster documentation, so you're going to need to read the source to learn any details.. so sorry
- open source, contributions welcome

### crnc is a collection of handy functions

currency tools

- [downloadExchangeRates](./s/currency-tools/download-exchange-rates.ts)  
	download up-to-date currency exchange info from the internet

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
	some logic to retrieve exchange rates, or fall back onto a dud (where no conversions occur)

- [assumeUserCurrency](./s/ecommerce/assume-user-currency.ts)  
	assume what currency the user might want to see

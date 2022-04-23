
import {Suite, expect} from "cynic"
import {mockBasicStorage} from "./mocks/mock-basic-storage.js"
import {makeCurrencyConverter, oneHour} from "./currency-converter.js"
import {currencies as defaultCurrencies} from "./ecommerce/currencies.js"
import {mockExchangeRateDownloaders} from "./mocks/mock-download-exchange-rates.js"

export default <Suite>{

	async "fresh startup can display in base currency"() {
		const converter = await makeCurrencyConverter({
			baseCurrency: "USD",
			persistence: {
				storage: mockBasicStorage(),
				cacheLifespan: oneHour,
				storageKeys: {
					exchangeRatesCache: "crnc-exchange-rates-cache",
					userDisplayCurrency: "crnc-user-display-currency",
				},
			},
			locale: "en-us",
			currencies: defaultCurrencies,
			downloadExchangeRates: mockExchangeRateDownloaders.successful,
		})
		const value = 1
		const result = converter.display(value)
		expect(result.value).equals(value)
	},

	"persistence": {

		async "user display currency is remembered"() {},
		async "exchange rates are cached"() {},
		async "cached exchange rates expire after an hour"() {},

	},
	"fail gracefully": {

		async "failed exchange rate download, results in no conversions"() {},
		async "setting an unknown userDisplayCurrency, falls back on baseCurrency"() {},
		async "remembering an unknown useDisplayCurrency, falls back on baseCurrency"() {},

	},
	"fail hard": {

		async "unknown baseCurrency throws an error"() {},

	},
}

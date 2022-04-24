
import {Suite, expect} from "cynic"
import {mockPersistence} from "./mocks/mock-persistence.js"
import {makeCurrencyConverter} from "./currency-converter.js"
import {currencies as defaultCurrencies} from "./ecommerce/currencies.js"
import {mockExchangeRateDownloaders} from "./mocks/mock-download-exchange-rates.js"

export default <Suite>{

	"fresh startups": {

		async "fresh startup can display in base currency"() {
			const converter = await makeCurrencyConverter({
				locale: "en-us",
				baseCurrency: "USD",
				currencies: defaultCurrencies,
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			const value = 1
			const result = converter.display(value)
			expect(result.value).equals(value)
		},

		async "fresh startup can convert USD to CAD"() {
			const converter = await makeCurrencyConverter({
				locale: "en-us",
				baseCurrency: "USD",
				currencies: defaultCurrencies,
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			converter.setDisplayCurrency("CAD")
			const value = 1
			const result = converter.display(value)
			expect(result.value).not.equals(value)
			expect(result.value).equals(1.5)
		},

	},
	"persistence": {

		async "user display currency is remembered"() {
			const persistence = mockPersistence.standard()
			const converter1 = await makeCurrencyConverter({
				persistence,
				locale: "en-us",
				baseCurrency: "USD",
				currencies: defaultCurrencies,
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			expect(converter1.snap.readable.userDisplayCurrency).equals("USD")
			converter1.setDisplayCurrency("CAD")
			expect(converter1.snap.readable.userDisplayCurrency).equals("CAD")
			const converter2 = await makeCurrencyConverter({
				persistence,
				locale: "en-us",
				baseCurrency: "USD",
				currencies: defaultCurrencies,
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			expect(converter2.snap.readable.userDisplayCurrency).equals("CAD")
		},
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

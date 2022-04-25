
import {Suite, expect} from "cynic"

import {nap} from "./toolbox/nap.js"
import {DownloadExchangeRatesResults, SupportedCurrencies} from "./interfaces.js"
import {mockPersistence} from "./mocks/mock-persistence.js"
import {makeCurrencyConverter} from "./currency-converter.js"
import {exchangeRates} from "./currency-tools/testing-tools.js"
import {mockExchangeRateDownloaders} from "./mocks/mock-download-exchange-rates.js"
import {cache} from "./toolbox/cache.js"
import {clone} from "./toolbox/clone.js"

const locale = "en-us"
const currencies = <SupportedCurrencies>Object.keys(exchangeRates)

export default <Suite>{

	"fresh startups": {

		async "fresh startup can display in base currency"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			const value = 1
			const result = converter.display(value)
			expect(result.value).equals(value)
		},

		async "fresh startup can convert USD to CAD"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
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
			{
				const converter1 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: mockExchangeRateDownloaders.successful(),
				})
				expect(converter1.snap.readable.userDisplayCurrency).equals("USD")
				converter1.setDisplayCurrency("CAD")
				expect(converter1.snap.readable.userDisplayCurrency).equals("CAD")
			}
			{
				const converter2 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: mockExchangeRateDownloaders.successful(),
				})
				expect(converter2.snap.readable.userDisplayCurrency).equals("CAD")
			}
		},
		async "exchange rates are cached"() {
			const persistence = mockPersistence.standard()
			const downloadCounter = mockExchangeRateDownloaders.downloadCounter()
			{
				const converter1 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: downloadCounter.download,
				})
				converter1.setDisplayCurrency("CAD")
				const value = 1
				const result = converter1.display(value)
				expect(result.value).not.equals(value)
				expect(result.value).equals(1.5)
			}
			expect(downloadCounter.count).equals(1)
			{
				const converter2 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: downloadCounter.download,
				})
				converter2.setDisplayCurrency("CAD")
				const value = 1
				const result = converter2.display(value)
				expect(result.value).not.equals(value)
				expect(result.value).equals(1.5)
			}
			expect(downloadCounter.count).equals(1)
		},
		async "when exchange rates cache expires, rates are redownloaded"() {
			const persistence = mockPersistence.standard()
			persistence.cacheLifespan = 1
			const downloadCounter = mockExchangeRateDownloaders.downloadCounter()
			{
				const converter1 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: downloadCounter.download,
				})
				converter1.setDisplayCurrency("CAD")
				const value = 1
				const result = converter1.display(value)
				expect(result.value).not.equals(value)
				expect(result.value).equals(1.5)
			}
			expect(downloadCounter.count).equals(1)
			await nap(2)
			{
				const converter2 = await makeCurrencyConverter({
					locale,
					currencies,
					persistence,
					baseCurrency: "USD",
					downloadExchangeRates: downloadCounter.download,
				})
				converter2.setDisplayCurrency("CAD")
				const value = 1
				const result = converter2.display(value)
				expect(result.value).not.equals(value)
				expect(result.value).equals(1.5)
			}
			expect(downloadCounter.count).equals(2)
		},

	},
	"fail gracefully": {

		async "failed exchange rate download, results in no conversions"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.failed(),
			})
			expect(converter.display(1).value).equals(1)
		},
		async "remembering insufficient exchange rates, results in fresh download"() {
			const downloadCounter = mockExchangeRateDownloaders.downloadCounter()
			const persistence = mockPersistence.standard()
			const ratesCache = cache<DownloadExchangeRatesResults>({
				lifespan: persistence.cacheLifespan,
				storage: persistence.storage,
				storageKey: persistence.storageKeys.exchangeRatesCache,
				load: async() => undefined,
			})
			const insufficientExchangeRates = clone(exchangeRates)
			delete insufficientExchangeRates.GBP
			await ratesCache.write({exchangeRates: insufficientExchangeRates})
			const converter = await makeCurrencyConverter({
				locale,
				currencies: [...currencies],
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: downloadCounter.download,
			})
			expect(downloadCounter.count).equals(1)
			expect(converter.snap.state.exchangeRates).defined()
			expect(converter.display(1).value).equals(1)
		},
		async "if fresh rates are downloaded, but insufficient, ignore the rates"() {
			const insufficientExchangeRates = clone(exchangeRates)
			delete insufficientExchangeRates.GBP
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders
					.useTheseRates(insufficientExchangeRates),
			})
			expect(converter.snap.state.exchangeRates).not.defined()
			expect(converter.display(1).value).equals(1)
		},
		async "setting an unknown userDisplayCurrency, falls back on baseCurrency"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			const {state} = converter.snap
			converter.setDisplayCurrency("LOL")
			expect(state.userDisplayCurrency).equals("USD")
			const value = 1
			const result = converter.display(value)
			expect(result.value).equals(value)
		},
		async "remembering an unknown userDisplayCurrency, falls back on baseCurrency"() {
			const persistence = mockPersistence.standard()
			persistence.storage.setItem(persistence.storageKeys.userDisplayCurrency, "LOL")
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				downloadExchangeRates: mockExchangeRateDownloaders.successful(),
			})
			const {state} = converter.snap
			expect(state.userDisplayCurrency).equals("USD")
			const value = 1
			const result = converter.display(value)
			expect(result.value).equals(value)
		},

	},
	"fail hard": {

		async "unknown baseCurrency throws an error"() {
			await expect(async() =>
				await makeCurrencyConverter({
					locale,
					currencies,
					baseCurrency: <any>"LOL",
					persistence: mockPersistence.standard(),
					downloadExchangeRates: mockExchangeRateDownloaders.successful(),
				})
			).throws()
		},
		async "unsupported currency throws an error"() {
			await expect(async() =>
				await makeCurrencyConverter({
					locale,
					currencies: <any>[...currencies, "LOL"],
					baseCurrency: "USD",
					persistence: mockPersistence.standard(),
					downloadExchangeRates: mockExchangeRateDownloaders.successful(),
				})
			).throws()
		},

	},
}

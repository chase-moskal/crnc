
import {Suite, expect} from "cynic"

import {nap} from "./toolbox/nap.js"
import {cache} from "./toolbox/cache.js"
import {clone} from "./toolbox/clone.js"
import {mockPersistence} from "./mocks/mock-persistence.js"
import {makeCurrencyConverter} from "./currency-converter.js"
import {exchangeRates} from "./currency-tools/testing-tools.js"
import {DownloadExchangeRatesResults, SupportedCurrencies} from "./interfaces.js"
import {mockExchangeRateDownloaders} from "./mocks/mock-download-exchange-rates.js"

const locale = "en-us"
const currencies = <SupportedCurrencies>Object.keys(exchangeRates)
const listenForStorageChange = () => {}

export default <Suite>{

	"fresh startups": {

		async "fresh startup can display in base currency"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
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
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
			})
			converter.setDisplayCurrency("CAD")
			const value = 1
			const result = converter.display(value)
			expect(result.value).not.equals(value)
			expect(result.value).equals(1.5)
		},

		async "user display currency change in other tab propagates to all tabs"() {
			const context = mockPersistence.multipleTabsSharingOneStorage()

			const tab1 = context.makeTab()
			const converter1 = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: tab1.persistence,
				listenForStorageChange: tab1.listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
			})
			expect(converter1.snap.state.userDisplayCurrency).equals("USD")
			converter1.setDisplayCurrency("CAD")
			tab1.triggerStorageChangeOnAllOtherTabs()
			expect(converter1.snap.state.userDisplayCurrency).equals("CAD")

			const tab2 = context.makeTab()
			const converter2 = await makeCurrencyConverter({
				locale,
				currencies,
				baseCurrency: "USD",
				persistence: tab2.persistence,
				listenForStorageChange: tab2.listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
			})
			expect(converter2.snap.state.userDisplayCurrency).equals("CAD")
			converter2.setDisplayCurrency("GBP")
			tab2.triggerStorageChangeOnAllOtherTabs()
			expect(converter2.snap.state.userDisplayCurrency).equals("GBP")

			expect(converter1.snap.state.userDisplayCurrency).equals("GBP")
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
					listenForStorageChange,
					downloadExchangeRates: mockExchangeRateDownloaders.success(),
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
					listenForStorageChange,
					downloadExchangeRates: mockExchangeRateDownloaders.success(),
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
					listenForStorageChange,
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
					listenForStorageChange,
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
					listenForStorageChange,
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
					listenForStorageChange,
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
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.fail(),
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
				listenForStorageChange,
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
				listenForStorageChange,
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
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
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
				persistence,
				baseCurrency: "USD",
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.success(),
			})
			const {state} = converter.snap
			expect(state.userDisplayCurrency).equals("USD")
			const value = 1
			const result = converter.display(value)
			expect(result.value).equals(value)
		},
		async "setting userDisplayCurrency without rates, falls back on baseCurrency"() {
			const converter = await makeCurrencyConverter({
				locale,
				currencies: ["USD", "CAD"],
				baseCurrency: "USD",
				persistence: mockPersistence.standard(),
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.useTheseRates({
					USD: 1,
				}),
			})
			const {state} = converter.snap
			converter.setDisplayCurrency("CAD")
			expect(state.userDisplayCurrency).equals(state.baseCurrency)
		},
		async "remembering userDisplayCurrency without rates, falls back on baseCurrency"() {
			const persistence = mockPersistence.standard()
			persistence.storage.setItem(persistence.storageKeys.userDisplayCurrency, "CAD")
			const converter = await makeCurrencyConverter({
				locale,
				persistence,
				currencies: ["USD", "CAD"],
				baseCurrency: "USD",
				listenForStorageChange,
				downloadExchangeRates: mockExchangeRateDownloaders.fail(),
			})
			const {state} = converter.snap
			expect(state.userDisplayCurrency).equals(state.baseCurrency)
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
					listenForStorageChange,
					downloadExchangeRates: mockExchangeRateDownloaders.success(),
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
					listenForStorageChange,
					downloadExchangeRates: mockExchangeRateDownloaders.success(),
				})
			).throws()
		},

	},
}

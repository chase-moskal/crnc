
import {cache} from "../toolbox/cache.js"
import {Currencies, ConverterPersistence, DownloadExchangeRates, CurrencyCodes, CurrencyExchangeRates} from "../interfaces.js"

export async function rememberOrDownloadExchangeRates({
			currencies,
			cacheLifespan,
			persistence: {storage, storageKeys},
			downloadExchangeRates,
		}: {
		cacheLifespan?: number
		currencies: Currencies
		persistence: ConverterPersistence
		downloadExchangeRates: DownloadExchangeRates
	}) {
	const currencyCodes = <CurrencyCodes>Object.keys(currencies)
	const ratesCache = cache({
		lifespan: cacheLifespan,
		storage,
		storageKey: storageKeys.exchangeRatesCache,
		load: async() => downloadExchangeRates({currencyCodes}),
	})
	let exchangeRates: CurrencyExchangeRates
	try {
		const results = await ratesCache.read()
		exchangeRates = results?.exchangeRates
	}
	catch (error) {}
	return exchangeRates
}

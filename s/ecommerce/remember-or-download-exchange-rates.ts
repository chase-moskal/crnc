
import {cache} from "../toolbox/cache.js"
import {Currencies, ConverterPersistence, DownloadExchangeRates, CurrencyCodes} from "../interfaces.js"

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
	const {exchangeRates} = await ratesCache.read()
	return exchangeRates
}


import {cache} from "../toolbox/cache.js"
import {ConverterPersistence, DownloadExchangeRates, SupportedCurrencies, CurrencyExchangeRates} from "../interfaces.js"

export async function rememberOrDownloadExchangeRates({
			currencies,
			persistence: {storage, storageKeys, cacheLifespan},
			downloadExchangeRates,
		}: {
		currencies: SupportedCurrencies
		persistence: ConverterPersistence
		downloadExchangeRates: DownloadExchangeRates
	}) {

	const ratesCache = cache({
		storage,
		lifespan: cacheLifespan,
		storageKey: storageKeys.exchangeRatesCache,
		load: async() => downloadExchangeRates({currencies: currencies}),
	})

	let exchangeRates: CurrencyExchangeRates

	try {
		const results = await ratesCache.read()
		exchangeRates = results?.exchangeRates
	}
	catch (error) {}

	return exchangeRates
}

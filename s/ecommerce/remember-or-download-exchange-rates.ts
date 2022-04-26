
import {cache} from "../toolbox/cache.js"
import {ConverterPersistence, DownloadExchangeRates, CurrencyExchangeRates} from "../interfaces.js"

export async function rememberOrDownloadExchangeRates({
			currencies,
			persistence: {storage, storageKeys, cacheLifespan},
			downloadExchangeRates,
		}: {
		currencies: string[]
		persistence: ConverterPersistence
		downloadExchangeRates: DownloadExchangeRates
	}) {

	const ratesCache = cache({
		storage,
		lifespan: cacheLifespan,
		storageKey: storageKeys.exchangeRatesCache,
		load: async() => downloadExchangeRates({currencies}),
	})

	let shouldDownloadFreshResults = false

	let results = await ratesCache.readCache()
	if (results)
		shouldDownloadFreshResults = !ratesAreSufficient(results.exchangeRates, currencies)
	else
		shouldDownloadFreshResults = true

	if (shouldDownloadFreshResults)
		results = await ratesCache.readFresh()

	const validAndSufficient = (
		results?.exchangeRates
		&& ratesAreSufficient(results.exchangeRates, currencies)
	)

	const exchangeRates = validAndSufficient
		? results.exchangeRates
		: undefined

	return exchangeRates
}

function ratesAreSufficient(rates: CurrencyExchangeRates, currencies: string[]) {
	const exchangeKeys = Object.keys(rates)
	const currenciesMissingInRates = currencies.filter(
		currency => exchangeKeys.indexOf(currency) === -1
	)
	return currenciesMissingInRates.length
		? false
		: true
}


import {restricted, snapstate} from "@chasemoskal/snapstate"

import {locale2} from "./locale2.js"
import {cache} from "./toolbox/cache.js"
import {formatCurrency} from "./currency-tools/format-currency.js"
import {assumeUserCurrency} from "./ecommerce/assume-user-currency.js"
import {currencies as defaultCurrencies} from "./ecommerce/currencies.js"
import {convertAndFormatCurrency} from "./currency-tools/convert-and-format-currency.js"
import {downloadExchangeRates as defaultDownloadExchangeRates} from "./currency-tools/download-exchange-rates.js"
import {ConverterPersistence, Currencies, CurrencyCodes, CurrencyExchangeRates, DownloadExchangeRates} from "./interfaces.js"

const oneHour = 1000 * 60 * 60

export async function makeCurrencyConverter({
		precision,
		persistence,
		baseCurrency,
		locale = locale2(),
		currencies = defaultCurrencies,
		downloadExchangeRates = defaultDownloadExchangeRates,
	}: {
		precision: number
		baseCurrency: string
		persistence: ConverterPersistence
		locale?: string
		currencies?: Currencies
		downloadExchangeRates?: DownloadExchangeRates
	}) {

	if (!isCurrencyAvailable(baseCurrency, currencies))
		throw new Error(`baseCurrency ${baseCurrency} is not an available currency`)

	const snap = snapstate({
		exchangeRates: undefined as CurrencyExchangeRates,
		currencies,
		baseCurrency,
		userDisplayCurrency: baseCurrency,
	})

	snap.state.userDisplayCurrency = rememberUserDisplayCurrency({
		locale,
		currencies,
		persistence,
		fallback: baseCurrency,
	})

	snap.state.exchangeRates = await fetchCachedExchangeRatesOrDownloadThem({
		currencies,
		persistence,
		cacheLifespan: oneHour,
		downloadExchangeRates,
	})

	return {
		snap: restricted(snap),
		display(valueInBaseCurrency: number) {
			const {exchangeRates, baseCurrency, userDisplayCurrency} = snap.state
			const currencyShouldBeConverted = baseCurrency !== userDisplayCurrency
			return (currencyShouldBeConverted && exchangeRates)
				? convertAndFormatCurrency({
					value: valueInBaseCurrency,
					locale,
					precision,
					exchangeRates,
					inputCurrency: baseCurrency,
					outputCurrency: userDisplayCurrency,
				})
				: formatCurrency({
					locale,
					precision,
					currencies,
					code: baseCurrency,
					value: valueInBaseCurrency,
				})
		},
		setDisplayCurrency(code: string) {
			if (!isCurrencyAvailable(code, currencies))
				throw new Error(`currency ${code} is not available`)
			snap.state.userDisplayCurrency = code
		},
	}
}

async function fetchCachedExchangeRatesOrDownloadThem({
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

function rememberUserDisplayCurrency({
		locale,
		fallback,
		currencies,
		persistence: {storage, storageKeys},
	}: {
		locale: string
		fallback: string
		currencies: Currencies
		persistence: ConverterPersistence
	}) {
	const remembered = storage.getItem(storageKeys.userDisplayCurrency)
	return remembered
		? isCurrencyAvailable(remembered, currencies)
			? remembered
			: assumeUserCurrency({locale, fallback})
		: assumeUserCurrency({locale, fallback})
}

function isCurrencyAvailable(code: string, currencies: Currencies) {
	return Object.keys(currencies).indexOf(code) !== -1
}

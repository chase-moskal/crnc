
import {restricted, snapstate} from "@chasemoskal/snapstate"

import {locale2} from "./locale2.js"
import {formatCurrency} from "./currency-tools/format-currency.js"
import {isCurrencyAvailable} from "./ecommerce/is-currency-available.js"
import {currencies as defaultCurrencies} from "./ecommerce/currencies.js"
import {convertAndFormatCurrency} from "./currency-tools/convert-and-format-currency.js"
import {rememberUserDisplayCurrency} from "./ecommerce/remember-user-display-currency.js"
import {rememberOrDownloadExchangeRates} from "./ecommerce/remember-or-download-exchange-rates.js"
import {downloadExchangeRates as defaultDownloadExchangeRates} from "./currency-tools/download-exchange-rates.js"
import {ConverterPersistence, Currencies, CurrencyExchangeRates, DownloadExchangeRates} from "./interfaces.js"

const oneHour = 1000 * 60 * 60

export async function makeCurrencyConverter({
		precision,
		persistence,
		baseCurrency,
		locale = locale2(),
		currencies = defaultCurrencies,
		exchangeRatesCacheLifespan = oneHour,
		downloadExchangeRates = defaultDownloadExchangeRates,
	}: {
		precision: number
		baseCurrency: string
		persistence: ConverterPersistence
		locale?: string
		currencies?: Currencies
		exchangeRatesCacheLifespan?: number
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

	snap.state.exchangeRates = await rememberOrDownloadExchangeRates({
		currencies,
		persistence,
		cacheLifespan: exchangeRatesCacheLifespan,
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
			snap.state.userDisplayCurrency = isCurrencyAvailable(code, currencies)
				? code
				: baseCurrency
		},
	}
}

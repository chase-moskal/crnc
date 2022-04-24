
import {restricted, snapstate} from "@chasemoskal/snapstate"

import {locale2} from "./locale2.js"
import {currencyLibrary} from "./ecommerce/currency-library.js"
import {formatCurrency} from "./currency-tools/format-currency.js"
import {isCurrencyAllowed} from "./ecommerce/is-currency-allowed.js"
import {convertAndFormatCurrency} from "./currency-tools/convert-and-format-currency.js"
import {rememberUserDisplayCurrency} from "./ecommerce/remember-user-display-currency.js"
import {validateCurrencyConverterParams} from "./ecommerce/validate-currency-converter-params.js"
import {rememberOrDownloadExchangeRates} from "./ecommerce/remember-or-download-exchange-rates.js"
import {downloadExchangeRates as defaultDownloadExchangeRates} from "./currency-tools/download-exchange-rates.js"
import {ConverterPersistence, CurrencyExchangeRates, DownloadExchangeRates, SupportedCurrencies, SupportedCurrency} from "./interfaces.js"

export const oneHour = 1000 * 60 * 60

export async function makeCurrencyConverter({
		currencies,
		baseCurrency,
		locale = locale2(),
		persistence = {
			storage: window.localStorage,
			cacheLifespan: oneHour,
			storageKeys: {
				exchangeRatesCache: "crnc-exchange-rates-cache",
				userDisplayCurrency: "crnc-user-display-currency",
			},
		},
		downloadExchangeRates = defaultDownloadExchangeRates,
	}: {
		currencies: SupportedCurrencies
		baseCurrency: SupportedCurrency
		locale?: string
		persistence?: ConverterPersistence
		downloadExchangeRates?: DownloadExchangeRates
	}) {

	validateCurrencyConverterParams({baseCurrency, currencies, currencyLibrary})

	const snap = snapstate({
		exchangeRates: undefined as CurrencyExchangeRates,
		currencies,
		baseCurrency,
		userDisplayCurrency: baseCurrency as string,
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
		downloadExchangeRates,
	})

	return {

		snap: restricted(snap),

		display(valueInBaseCurrency: number, precision = 2) {
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
					currencyLibrary,
					code: baseCurrency,
					value: valueInBaseCurrency,
				})
		},

		setDisplayCurrency(code: string) {
			const display = isCurrencyAllowed(code, currencies)
				? code
				: baseCurrency

			persistence.storage.setItem(
				persistence.storageKeys.userDisplayCurrency,
				display,
			)

			snap.state.userDisplayCurrency = display
		},
	}
}

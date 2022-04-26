
import {restricted, snapstate} from "@chasemoskal/snapstate"

import {locale2} from "./locale2.js"
import {currencyLibrary} from "./ecommerce/currency-library.js"
import {formatCurrency} from "./currency-tools/format-currency.js"
import {isCurrencyAllowed} from "./ecommerce/is-currency-allowed.js"
import {convertAndFormatCurrency} from "./currency-tools/convert-and-format-currency.js"
import {CurrencyConverterParams, CurrencyDetails, CurrencyExchangeRates} from "./interfaces.js"
import {validateCurrencyConverterParams} from "./ecommerce/validate-currency-converter-params.js"
import {rememberOrDownloadExchangeRates} from "./ecommerce/remember-or-download-exchange-rates.js"
import {defaultListenForStorageChange, defaultPersistence} from "./ecommerce/currency-converter-defaults.js"
import {downloadExchangeRates as defaultDownloadExchangeRates} from "./currency-tools/download-exchange-rates.js"

export async function makeCurrencyConverter({
		currencies,
		baseCurrency,
		locale = locale2(),
		persistence = defaultPersistence(),
		downloadExchangeRates = defaultDownloadExchangeRates,
		listenForStorageChange = defaultListenForStorageChange(persistence),
	}: CurrencyConverterParams) {

	currencies = currencies.map(currency => currency.toUpperCase())
	baseCurrency = baseCurrency.toUpperCase()
	validateCurrencyConverterParams({baseCurrency, currencies, currencyLibrary})

	const snap = snapstate({
		exchangeRates: undefined as CurrencyExchangeRates,
		currencies,
		baseCurrency,
		userDisplayCurrency: baseCurrency as string,
	})

	snap.state.exchangeRates = await rememberOrDownloadExchangeRates({
		currencies: <any>currencies,
		persistence,
		downloadExchangeRates,
	})

	function updateLocalStateUserDisplayCurrency(code: string) {
		code = code ?code.toUpperCase() :baseCurrency
		const display = !!snap.state.exchangeRates
			? isCurrencyAllowed(code, currencies)
				? code
				: baseCurrency
			: baseCurrency

		snap.state.userDisplayCurrency = display
	}

	const refreshUserDisplayCurrency = () => updateLocalStateUserDisplayCurrency(
		persistence.storage.getItem(persistence.storageKeys.userDisplayCurrency)
	)

	refreshUserDisplayCurrency()
	listenForStorageChange({refreshUserDisplayCurrency})

	return {

		snap: restricted(snap),

		getCurrencyDetails() {
			const details: {[key: string]: CurrencyDetails} = {}
			for (const code of currencies)
				details[code] = (<any>currencyLibrary)[code]
			return details
		},

		setDisplayCurrency(code: string) {
			code = code.toUpperCase()
			updateLocalStateUserDisplayCurrency(code)
			persistence.storage.setItem(
				persistence.storageKeys.userDisplayCurrency,
				snap.state.userDisplayCurrency,
			)
		},

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
	}
}

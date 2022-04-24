
import {CurrencyLibrary} from "../interfaces.js"
import {isCurrencyAllowed} from "./is-currency-allowed.js"

export function validateCurrencyConverterParams({
		baseCurrency, currencies, currencyLibrary
	}: {
		baseCurrency: string
		currencies: string[]
		currencyLibrary: CurrencyLibrary
	}) {

	const libraryKeys = Object.keys(currencyLibrary)
	const notInLibrary = currencies
		.filter(currency => libraryKeys.indexOf(currency) === -1)

	if (notInLibrary.length)
		throw new Error(`these currency codes are not in the currencyLibrary (${notInLibrary.join(", ")})`)

	if (!isCurrencyAllowed(baseCurrency, currencies))
		throw new Error(`baseCurrency "${baseCurrency}" is not an available currency`)
}

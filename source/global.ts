
import * as crnc from "./"
import * as locale2 from "locale2"

/**
 * Global access to the entire crnc module
 *  + accessible on the window object by all scripts
 */
; (<any>window).crnc = crnc

/**
 * Exposing locale2 for debugging purposes
 */
; (<any>window).locale2 = locale2

/**
 * Demo function to check that the crnc is working
 */
; (<any>window).crncDemo = async function crncDemo() {

	// download the exchange rates
	const {exchangeRates} = await crnc.downloadExchangeRates()

	// define some arbitrary demo values
	const value = 123.45
	const inputCurrency = "CAD"
	const outputCurrency = "USD"

	// perform a currency conversion
	const result = crnc.convertAndFormatCurrency({
		exchangeRates,
		value,
		inputCurrency,
		outputCurrency
	})

	// log the results to the console
	const start = crnc.formatCurrency({value, currency: inputCurrency})
	console.log(`crnc demo: convert ${start} into ${result}`)

	// ecommerce experiment
	const details = await crnc.ascertainEcommerceDetails({
		storeBaseCurrency: inputCurrency,
		userDisplayCurrency: crnc.assumeUserCurrency({fallback: inputCurrency})
	})
	console.log(`crnc ecommerce details:`, details)
}

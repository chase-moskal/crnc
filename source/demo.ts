
import * as locale2 from "locale2"

import {formatCurrency} from "./currency-tools/format-currency.js"
import {assumeUserCurrency} from "./ecommerce/assume-user-currency.js"
import {downloadExchangeRates} from "./currency-tools/download-exchange-rates.js"
import {ascertainEcommerceDetails} from "./ecommerce/ascertain-ecommerce-details.js"
import {convertAndFormatCurrency} from "./currency-tools/convert-and-format-currency.js"

; (<any>window).locale2 = locale2

async function crncDemo() {

	// download the exchange rates
	const {exchangeRates} = await downloadExchangeRates()

	// define some arbitrary demo values
	const value = 123.45
	const inputCurrency = "CAD"
	const outputCurrency = "USD"

	// perform a currency conversion
	const result = convertAndFormatCurrency({
		exchangeRates,
		value,
		inputCurrency,
		outputCurrency
	})

	// log the results to the console
	const start = formatCurrency({value, currency: inputCurrency})
	console.log(`crnc demo: convert ${start} into ${result}`)

	// ecommerce experiment
	const details = await ascertainEcommerceDetails({
		storeBaseCurrency: inputCurrency,
		userDisplayCurrency: assumeUserCurrency({fallback: inputCurrency})
	})
	console.log(`crnc ecommerce details:`, details)
}

crncDemo()

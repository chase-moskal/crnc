
import {downloadExchangeRates} from "../currency-tools/download-exchange-rates"

import {
	EcommerceDetails,
	AscertainEcommerceDetailsParams
} from "./interfaces"

/**
 * Establish some ecommerce-related currency details
 *  - attempt to download rates, and upon failure, avoid currency conversions
 */
export async function ascertainEcommerceDetails({
	ratesLink,
	storeBaseCurrency,
	userDisplayCurrency
}: AscertainEcommerceDetailsParams): Promise<EcommerceDetails> {
	try {
		const {exchangeRates} = await downloadExchangeRates({ratesLink})
		return {
			exchangeRates,
			storeBaseCurrency,
			userDisplayCurrency
		}
	}
	catch (error) {
		console.warn(`error loading currency exchange rates, now only using "${storeBaseCurrency}"`)
		const exchangeRates = {[storeBaseCurrency]: 1.0}
		return {
			exchangeRates,
			storeBaseCurrency,
			userDisplayCurrency: storeBaseCurrency
		}
	}
}


import * as locale2 from "locale2"
import {AssumeUserCurrencyParams} from "./interfaces.js"
import {localesToCurrencies as defaultLocalesToCurrencies} from "./locales-to-currencies.js"

/**
 * Assume what currency the user might want to see
 *  + guess is based on locale
 *  + if a currency doesn't exist for the given locale, fallback is used
 */
export function assumeUserCurrency({
	fallback,
	locale = locale2,
	localesToCurrencies = defaultLocalesToCurrencies
}: AssumeUserCurrencyParams): string {
	return localesToCurrencies[locale.toLowerCase()] || fallback
}

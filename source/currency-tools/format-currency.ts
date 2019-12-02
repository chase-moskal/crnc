
import {currencyFormatters} from "./currency-formatters.js"
import {CurrencyFormatter, FormatCurrencyParams, Money} from "./interfaces.js"

/**
 * Format currency
 *  + express monetary value in human-readable format
 *  + displays large number groupings differently based on locale
 *  + defaults to 2 digits of precision
 *  + you can provide your own set of currency formatters
 *  + returns a string
 */
export function formatCurrency({
	value,
	currency,
	precision = 2,
	locale = undefined,
	formatters = currencyFormatters,
}: FormatCurrencyParams): Money {

	const formatter: CurrencyFormatter = formatters[currency]
	if (!formatter) throw new Error(`unknown formatter "${currency}"`)
	return formatter({value, precision, locale})
}

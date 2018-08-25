
import {
	CurrencyFormatter,
	FormatCurrencyParams,
} from "./interfaces"

import {currencyFormatters} from "./currency-formatters"

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
}: FormatCurrencyParams): string {

	const formatter: CurrencyFormatter = formatters[currency]
	if (!formatter) throw new Error(`unknown formatter "${currency}"`)
	return formatter({value, precision, locale})
}

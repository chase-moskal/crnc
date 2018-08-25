
import {
	ConvertAndFormatCurrencyParams
} from "./interfaces"

import {formatCurrency} from "./format-currency"
import {convertCurrency} from "./convert-currency"

/**
 * Convert and format currency
 *  + exchange and format money in one shot
 *  + convenience function combining 'convertCurrency' and 'formatCurrency'
 */
export function convertAndFormatCurrency({
	value,
	exchangeRates,
	inputCurrency,
	outputCurrency,
	precision = 2,
	locale = undefined
}: ConvertAndFormatCurrencyParams): string {

	return formatCurrency({
		locale,
		precision,
		currency: outputCurrency,
		value: convertCurrency({value, inputCurrency, outputCurrency, exchangeRates})
	})
}

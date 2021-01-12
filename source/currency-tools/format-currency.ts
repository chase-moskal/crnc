
import {currencies as defaultCurrencies} from "../ecommerce/currencies.js"
import {CurrencyFormatter, FormatCurrencyParams, Money, FormattableNumber} from "../interfaces.js"

/**
 * Round a number to the desired number of decimal places
 */
function precisionRound(value: number, precision: number): number {
	const factor = Math.pow(10, precision)
	return Math.round(value * factor) / factor
}

/**
 * Display a number as a human-readable locale-abiding string
 */
function localize({value, precision, locale}: FormattableNumber): string {
	return precisionRound(value, precision).toLocaleString(locale, {
		maximumFractionDigits: precision,
		minimumFractionDigits: precision
	})
}

/**
 * Format currency
 *  + express monetary value in human-readable format
 *  + displays large number groupings differently based on locale
 *  + defaults to 2 digits of precision
 *  + you can provide your own set of currency formatters
 *  + returns a string
 */
export function formatCurrency({
	code,
	value,
	precision = 2,
	locale = undefined,
	currencies = defaultCurrencies,
}: FormatCurrencyParams): Money {

	const currency = currencies[code]
	if (!currency)
		throw new Error(`unknown currency code "${code}"`)

	const {symbol} = currency

	const amount = localize({value, locale, precision})
	const price = `${symbol}${amount} ${code}`
	return {currency, amount, value, price}
}

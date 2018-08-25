
import {FormattableNumber, CurrencyFormatters} from "./interfaces"

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
 * Formatter functions for each world currency
 */
export const currencyFormatters = <CurrencyFormatters>{
	CAD: formattable => `\$${localize(formattable)} CAD`,
	USD: formattable => `\$${localize(formattable)} USD`,
	EUR: formattable => `\€${localize(formattable)} EUR`,
	GBP: formattable => `\£${localize(formattable)} GBP`,
	XBT: formattable => `\Ƀ${localize(formattable)} XBT`
}

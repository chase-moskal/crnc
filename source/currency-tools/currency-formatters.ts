
import {
	Money,
	FormattableNumber,
	CurrencyFormatters,
} from "./interfaces.js"

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

function formatCurrency(
	formattable: FormattableNumber,
	{code, symbol}: {
		code: string
		symbol: string
	}
): Money {
	const {value} = formattable
	const local = localize(formattable)
	const total = `${symbol}${local} ${code}`
	return {code, symbol, local, value, total}
}

/**
 * Formatter functions for each world currency
 */
export const currencyFormatters = <CurrencyFormatters>{
	CAD: formattable => formatCurrency(formattable, {
		code: "CAD",
		symbol: "$",
	}),
	USD: formattable => formatCurrency(formattable, {
		code: "USD",
		symbol: "$",
	}),
	EUR: formattable => formatCurrency(formattable, {
		code: "EUR",
		symbol: "€",
	}),
	GBP: formattable => formatCurrency(formattable, {
		code: "GBP",
		symbol: "£",
	}),
	XBT: formattable => formatCurrency(formattable, {
		code: "XBT",
		symbol: "Ƀ",
	}),
}

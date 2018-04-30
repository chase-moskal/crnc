
import {FormattableNumber, CurrencyFormatters} from "./interfaces"

function precisionRound(value: number, precision: number): number {
	const factor = Math.pow(10, precision)
	return Math.round(value * factor) / factor
}

function localize({value, precision, locale}: FormattableNumber) {
	return precisionRound(value, precision).toLocaleString(locale, {
		maximumFractionDigits: precision,
		minimumFractionDigits: precision
	})
}

export default <CurrencyFormatters>{
	CAD: formattable => `\$${localize(formattable)} CAD`,
	USD: formattable => `\$${localize(formattable)} USD`,
	EUR: formattable => `\€${localize(formattable)} EUR`,
	GBP: formattable => `\£${localize(formattable)} GBP`,
	XBT: formattable => `\Ƀ${localize(formattable)} XBT`
}

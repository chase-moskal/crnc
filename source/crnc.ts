
/*

[-c-r-n-c-]

currency conversions and formatting for the web

*/

import {requestJson} from "commotion"

import {
	DownloadRatesParams,
	DownloadRatesResults,
	CurrencyExchangeRates,
	ExchangeCurrencyParams,
	FormattableNumber,
	CurrencyFormatter,
	CurrencyFormatters,
	FormatCurrencyParams,
	ExchangeAndFormatCurrencyParams
} from "./interfaces"

import currencyFormatters from "./currency-formatters"

/**
 * DOWNLOAD RATES
 *  + download up-to-date currency exchange information from the internet
 *  + powered by <https://exchangeratesapi.io/> — check it out
 *  + returns a promised results object
 *   - 'updated', the date-string of the information
 *   - 'rates', dictionary of exchange rate values
 */
export async function downloadRates({
	link = "https://exchangeratesapi.io/api/latest"
}: DownloadRatesParams = {}): Promise<DownloadRatesResults> {

	const {base, date, rates} = await requestJson({link})
	return {
		updated: date,
		rates: {...rates, [base]: 1.0}
	}
}

/**
 * EXCHANGE CURRENCY
 *  + exchange monetary value from one currency into another
 *  + provide a 'rates' object of relativistic currency values
 *  + returns a number
 */
export function exchangeCurrency({
	value,
	input,
	output,
	rates
}: ExchangeCurrencyParams): number {

	// get currency rates
	const inputRate = rates[input]
	const outputRate = rates[output]

	// scrutinize currencies and rates for validity
	const currenciesAndRates: [string, number][] = [[input, inputRate], [output, outputRate]]
	for (const [currency, rate] of currenciesAndRates) {
		if (rate === undefined || rate === null || isNaN(rate))
			throw new Error(`invalid rate "${currency}"`)
	}

	// calculate exchanged currency
	return value * (outputRate / inputRate)
}

/**
 * FORMAT CURRENCY
 *  + express monetary value in human-readable format
 *  + displays large number groupings differently based on locale
 *  + defaults to 2 digits of precision
 *  + you can provide your own set of currency formatters
 *  + returns a string
 */
export function formatCurrency({
	value,
	currency,
	locale = undefined,
	precision = 2,
	formatters = currencyFormatters,
}: FormatCurrencyParams): string {

	const formatter: CurrencyFormatter = formatters[currency]
	if (!formatter) throw new Error(`unknown formatter "${currency}"`)
	return formatter({value, precision, locale})
}

/**
 * EXCHANGE AND FORMAT CURRENCY
 *  + exchange and format money in one shot
 *  + convenience function combining 'exchangeCurrency' and 'formatCurrency'
 */
export function exchangeAndFormatCurrency({
	value,
	input,
	output,
	rates,
	precision = 2,
	locale = undefined
}: ExchangeAndFormatCurrencyParams): string {

	return formatCurrency({
		value: exchangeCurrency({value, input, output, rates}),
		currency: output,
		locale
	})
}


export interface DownloadRatesParams {
	link?: string
}

export interface DownloadRatesResults {
	updated: string
	rates: CurrencyExchangeRates
}

export interface CurrencyExchangeRates {
	[key: string]: number
}

export interface ExchangeCurrencyParams {
	value: number
	input: string
	output: string
	rates: CurrencyExchangeRates
}

export interface FormattableNumber {
	value: number
	precision?: number
	locale?: string
}

export type CurrencyFormatter = (formattable: FormattableNumber) => string
export type CurrencyFormatters = { [key: string]: CurrencyFormatter }

export interface FormatCurrencyParams extends FormattableNumber {
	currency: string
	formatters?: CurrencyFormatters
}

export interface ExchangeAndFormatCurrencyParams extends FormattableNumber {
	input: string
	output: string
	rates: CurrencyExchangeRates
}

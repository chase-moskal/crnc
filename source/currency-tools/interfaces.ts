
export interface DownloadExchangeRatesParams {
	ratesUrl?: string
}

export interface DownloadExchangeRatesResults {
	lastUpdatedDate: string
	exchangeRates: CurrencyExchangeRates
}

export interface CurrencyExchangeRates {
	[key: string]: number
}

export interface ConvertCurrencyParams {
	value: number
	inputCurrency: string
	outputCurrency: string
	exchangeRates: CurrencyExchangeRates
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

export interface ConvertAndFormatCurrencyParams extends FormattableNumber {
	inputCurrency: string
	outputCurrency: string
	exchangeRates: CurrencyExchangeRates
}

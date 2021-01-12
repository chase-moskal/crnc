
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

export interface Money {
	code: string   // "USD"
	value: number  // 1234.56
	amount: string // "1,234.56"
	symbol: string // "$",
	price: string  // "$1,234.56 USD"
}

export type CurrencyFormatter = (formattable: FormattableNumber) => Money
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

export interface LocalesToCurrencies {
	[locale: string]: string
}

export interface AssumeUserCurrencyParams {
	fallback: string
	locale?: string
	localesToCurrencies?: LocalesToCurrencies
}

export interface AscertainEcommerceDetailsParams {
	storeBaseCurrency: string
	userDisplayCurrency: string
	ratesUrl?: string
}

export interface EcommerceDetails {
	storeBaseCurrency: string
	userDisplayCurrency: string
	exchangeRates: CurrencyExchangeRates
}


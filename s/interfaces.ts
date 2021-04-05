
import {bankOfCanadaSupportedCurrencies} from "./currency-tools/bank-of-canada/supported-currencies.js"

export type BankOfCanadaSupportedCurrencies =
	typeof bankOfCanadaSupportedCurrencies[number]

export interface DownloadExchangeRatesParams {
	currencies?: BankOfCanadaSupportedCurrencies[]
}

export interface DownloadExchangeRatesResults {
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

export interface Currency {
	code: string   // "USD"
	name: string   // United States Dollar
	symbol: string // "$"
}

export interface Money {
	currency: Currency
	value: number  // 1234.56
	amount: string // "1,234.56"
	price: string  // "$1,234.56 USD"
}

export interface Currencies {
	[code: string]: Currency
}

export interface FormatCurrencyParams extends FormattableNumber {
	code: string
	currencies?: Currencies
}

export interface ConvertAndFormatCurrencyParams extends FormattableNumber {
	inputCurrency: string
	outputCurrency: string
	exchangeRates: CurrencyExchangeRates
}

export interface CurrenciesByLocales {
	[locale: string]: string
}

export interface AssumeUserCurrencyParams {
	fallback: string
	locale?: string
	currenciesByLocales?: CurrenciesByLocales
}

export interface AscertainEcommerceDetailsParams extends DownloadExchangeRatesParams {
	storeBaseCurrency: string
	userDisplayCurrency: string
	cacheLifespan?: number
	cacheStorageKey?: string
	cacheStorage?: typeof window.localStorage
}

export interface EcommerceDetails {
	storeBaseCurrency: string
	userDisplayCurrency: string
	exchangeRates: CurrencyExchangeRates
}

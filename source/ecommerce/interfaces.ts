
import {CurrencyExchangeRates} from "../currency-tools/interfaces"

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
	ratesLink?: string
}

export interface EcommerceDetails {
	storeBaseCurrency: string
	userDisplayCurrency: string
	exchangeRates: CurrencyExchangeRates
}


import {CurrencyExchangeRates} from "../currency-tools/interfaces.js"

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

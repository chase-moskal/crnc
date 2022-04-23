
import {DownloadExchangeRatesParams, DownloadExchangeRatesResults, CurrencyExchangeRates} from "../interfaces.js"

export const mockExchangeRateDownloaders = {

	successful: async({
			currencyCodes,
		}: DownloadExchangeRatesParams): Promise<DownloadExchangeRatesResults> => {
		const exchangeRates: CurrencyExchangeRates = {}
		for (const code of currencyCodes)
			exchangeRates[code] = 1.0
		return {
			exchangeRates: {
				...exchangeRates,
				"USD": 1.0,
				"CAD": 2.0,
				"GBP": 3.0,
			},
		}
	},
}

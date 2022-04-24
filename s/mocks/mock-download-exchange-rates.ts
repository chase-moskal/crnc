
import {DownloadExchangeRatesParams, DownloadExchangeRatesResults, CurrencyExchangeRates} from "../interfaces.js"
import {exchangeRates as exampleExchangeRates} from "../currency-tools/testing-tools.js"

export const mockExchangeRateDownloaders = {

	successful: () => async({
			currencyCodes,
		}: DownloadExchangeRatesParams): Promise<DownloadExchangeRatesResults> => {
		const exchangeRates: CurrencyExchangeRates = {}
		for (const code of currencyCodes)
			exchangeRates[code] = 1.0
		return {
			exchangeRates: {
				...exchangeRates,
				...exampleExchangeRates,
			},
		}
	},
}

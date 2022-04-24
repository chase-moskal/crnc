
import {CurrencyExchangeRates, DownloadExchangeRates} from "../interfaces.js"
import {exchangeRates as exampleExchangeRates} from "../currency-tools/testing-tools.js"

const successful = (): DownloadExchangeRates => async({currencies}) => {
	const exchangeRates: CurrencyExchangeRates = {}
	for (const code of currencies)
		exchangeRates[code] = 1.0
	return {
		exchangeRates: {
			...exchangeRates,
			...exampleExchangeRates,
		},
	}
}

export const mockExchangeRateDownloaders = {

	successful,

	downloadCounter: () => {
		let downloadCount = 0
		const downloader = successful()
		return {
			get count() {
				return downloadCount
			},
			download: <DownloadExchangeRates>(async(...params) => {
				downloadCount += 1
				return downloader(...params)
			}),
		}
	},

	failed: (): DownloadExchangeRates => async() => {
		throw new Error("failed to download rates")
	},
}

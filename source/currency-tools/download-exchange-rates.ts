
import {requestJson} from "commotion/dist/request-json.js"

import {
	DownloadExchangeRatesParams,
	DownloadExchangeRatesResults
} from "./interfaces"

/**
 * Download exchange rates
 *  + download up-to-date currency exchange information from the internet
 *  + powered by <https://exchangeratesapi.io/> — check it out
 *  + returns a promised results object
 *   - 'updated', the date-string of the information
 *   - 'rates', dictionary of exchange rate values
 */
export async function downloadExchangeRates({
	ratesUrl = "https://api.exchangeratesapi.io/latest"
}: DownloadExchangeRatesParams = {}): Promise<DownloadExchangeRatesResults> {

	const {base, date, rates} = await requestJson({url: ratesUrl})
	return {
		lastUpdatedDate: date,
		exchangeRates: {...rates, [base]: 1.0}
	}
}

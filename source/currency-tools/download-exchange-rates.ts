
import {requestJson} from "commotion"

import {
	DownloadRatesParams,
	DownloadRatesResults
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
	link = "https://api.exchangeratesapi.io/latest"
}: DownloadRatesParams = {}): Promise<DownloadRatesResults> {

	const {base, date, rates} = await requestJson({link})
	return {
		lastUpdatedDate: date,
		exchangeRates: {...rates, [base]: 1.0}
	}
}

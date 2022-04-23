import {Currencies, ConverterPersistence} from "../interfaces.js"
import {assumeUserCurrency} from "./assume-user-currency.js"
import {isCurrencyAvailable} from "./is-currency-available.js"

export function rememberUserDisplayCurrency({
		locale,
		fallback,
		currencies,
		persistence: {storage, storageKeys},
	}: {
		locale: string
		fallback: string
		currencies: Currencies
		persistence: ConverterPersistence
	}) {
	const remembered = storage.getItem(storageKeys.userDisplayCurrency)
	return remembered
		? isCurrencyAvailable(remembered, currencies)
			? remembered
			: assumeUserCurrency({locale, fallback})
		: assumeUserCurrency({locale, fallback})
}

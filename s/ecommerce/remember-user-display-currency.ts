
import {ConverterPersistence} from "../interfaces.js"
import {isCurrencyAllowed} from "./is-currency-allowed.js"
import {assumeUserCurrency} from "./assume-user-currency.js"

export function rememberUserDisplayCurrency({
		locale,
		fallback,
		currencies,
		persistence: {storage, storageKeys},
	}: {
		locale: string
		fallback: string
		currencies: string[]
		persistence: ConverterPersistence
	}) {
	const remembered = storage.getItem(storageKeys.userDisplayCurrency)
	return remembered
		? isCurrencyAllowed(remembered, currencies)
			? remembered
			: assumeUserCurrency({locale, currencies, fallback})
		: assumeUserCurrency({locale, currencies, fallback})
}

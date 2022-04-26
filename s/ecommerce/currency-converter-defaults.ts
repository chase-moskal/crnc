
import {ConverterPersistence, ListenForStorageChange} from "../interfaces.js"

export const oneHour = 1000 * 60 * 60

export const defaultPersistenceStorageKeys = Object.freeze({
	exchangeRatesCache: "crnc-exchange-rates-cache",
	userDisplayCurrency: "crnc-user-display-currency",
})

export const defaultPersistence = (): ConverterPersistence => ({
	storage: window.localStorage,
	cacheLifespan: oneHour,
	storageKeys: defaultPersistenceStorageKeys,
})

export const defaultListenForStorageChange = (
	(persistence: ConverterPersistence): ListenForStorageChange =>
		({refreshUserDisplayCurrency}) =>
			window.addEventListener("storage", storageEvent => {

				const storageEventIsRelevant =
					storageEvent.storageArea === persistence.storage
					&& storageEvent.key === persistence.storageKeys.userDisplayCurrency

				if (storageEventIsRelevant)
					refreshUserDisplayCurrency()
			})
)

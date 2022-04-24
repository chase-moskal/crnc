
import {oneHour} from "../currency-converter.js"
import {ConverterPersistence} from "../interfaces.js"
import {mockBasicStorage} from "./mock-basic-storage.js"

const storageKeys = {
	exchangeRatesCache: "crnc-exchange-rates-cache",
	userDisplayCurrency: "crnc-user-display-currency",
}

export const mockPersistence = {

	standard: () => <ConverterPersistence>({
		storageKeys,
		cacheLifespan: oneHour,
		storage: mockBasicStorage(),
	}),
}

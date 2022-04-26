
import {ConverterPersistence} from "../interfaces.js"

export function rememberUserDisplayCurrency({
		persistence: {storage, storageKeys},
	}: {
		persistence: ConverterPersistence
	}) {

	return storage.getItem(storageKeys.userDisplayCurrency)
}

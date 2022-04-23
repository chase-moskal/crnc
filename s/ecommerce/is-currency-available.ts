
import {Currencies} from "../interfaces.js"

export function isCurrencyAvailable(code: string, currencies: Currencies) {
	return Object.keys(currencies).indexOf(code) !== -1
}

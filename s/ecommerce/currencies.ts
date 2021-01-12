
import {Currency} from "../interfaces.js"

export const currencies: {[code: string]: Currency} = {
	USD: {
		code: "USD",
		symbol: "$",
		name: "United States Dollar",
	},
	CAD: {
		code: "CAD",
		symbol: "$",
		name: "Canadian Dollar",
	},
	EUR: {
		code: "EUR",
		symbol: "€",
		name: "Euro",
	},
	GBP: {
		code: "GBP",
		symbol: "£",
		name: "British Pound Sterling",
	},
	XBT: {
		code: "XBT",
		symbol: "Ƀ",
		name: "Bitcoin",
	},
}

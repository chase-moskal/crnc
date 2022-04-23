
import {Suite, expect} from "cynic"

export default <Suite>{

	async "fresh startup can convert USD to CAD"() {},

	"persistence": {

		async "user display currency is remembered"() {},
		async "exchange rates are cached"() {},
		async "cached exchange rates expire after an hour"() {},

	},
	"fail gracefully": {

		async "failed exchange rate download, results in no conversions"() {},
		async "setting an unknown userDisplayCurrency, falls back on baseCurrency"() {},
		async "remembering an unknown useDisplayCurrency, falls back on baseCurrency"() {},

	},
	"fail hard": {

		async "unknown baseCurrency throws an error"() {},

	},
}

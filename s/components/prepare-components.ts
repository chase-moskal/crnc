
import {CrncPrice} from "./price/crnc-price.js"
import {CurrencyConverter} from "../interfaces.js"
import {themeComponents} from "../framework/utils/theme-components.js"

import themeCss from "../framework/theme.css.js"

export function prepareComponents({currencyConverter}: {
		currencyConverter: CurrencyConverter
	}) {

	return themeComponents(themeCss, {
		CrncPrice: CrncPrice.withContext({currencyConverter}),
	})
}

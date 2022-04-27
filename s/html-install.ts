
import {makeCurrencyConverter} from "./currency-converter.js"
import {prepareComponents} from "./components/prepare-components.js"
import {registerComponents} from "./framework/utils/register-components.js"

void function htmlInstall() {

	const config = document.querySelector("crnc-config")
	if (!config)
		throw new Error("<crnc-config> element is required")

	const baseCurrency = config.getAttribute("base-currency")
	if (!baseCurrency)
		throw new Error("<crnc-config> base-currency attribute is required.")

	const currencies = (() => {
		const raw = config.getAttribute("currencies")
		return raw
			? raw.split(/[\s,]+/).map(c => c.trim()).filter(c => c.length > 0)
			: undefined
	})()
	if (!currencies)
		throw new Error("<crnc-config> currencies attribute is required.")

	const currencyConverter = makeCurrencyConverter({
		baseCurrency,
		currencies,
	})

	registerComponents(prepareComponents({currencyConverter}))
}()

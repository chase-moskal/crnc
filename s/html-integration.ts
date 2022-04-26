
import {makeCurrencyConverter} from "./currency-converter.js"
import {prepareComponents} from "./components/prepare-components.js"
import {registerComponents} from "./framework/utils/register-components.js"

void function htmlIntegration() {

	const config = document.querySelector("crnc-config")
	if (!config)
		throw new Error("<crnc-config> element is required")

	const baseCurrency = config.getAttribute("base-currency")
	const rawCurrencies = config.getAttribute("currencies")
	const currencies = rawCurrencies
		? rawCurrencies.split(",").map(c => c.trim()).filter(c => c.length > 0)
		: undefined

	if (!baseCurrency)
		throw new Error("<crnc-config> base-currency attribute is required.")

	if (!currencies)
		throw new Error("<crnc-config> currencies attribute is required.")

	const currencyConverter = makeCurrencyConverter({
		baseCurrency,
		currencies,
	})

	registerComponents(prepareComponents({currencyConverter}))
}()

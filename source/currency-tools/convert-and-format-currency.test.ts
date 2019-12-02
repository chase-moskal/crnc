
import {exchangeRates} from "./testing-tools.js"
import {convertAndFormatCurrency} from "./convert-and-format-currency.js"

describe("convert and format currency - function", () => {
	it("respects precision", async() => {
		expect(convertAndFormatCurrency({
			exchangeRates,
			value: 60,
			precision: 0,
			inputCurrency: "CAD",
			outputCurrency: "USD"
		}).price).toBe("$40 USD")
	})
})

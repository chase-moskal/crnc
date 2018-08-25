
import {exchangeRates} from "./testing-tools"
import {convertAndFormatCurrency} from "./convert-and-format-currency"

describe("convert and format currency - function", () => {
	it("respects precision", async() => {
		expect(convertAndFormatCurrency({
			exchangeRates,
			value: 60,
			precision: 0,
			inputCurrency: "CAD",
			outputCurrency: "USD"
		})).toBe("$40 USD")
	})
})

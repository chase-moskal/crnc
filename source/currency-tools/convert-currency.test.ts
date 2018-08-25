
import {exchangeRates} from "./testing-tools"
import {convertCurrency} from "./convert-currency"

describe("convert currency - function", () => {
	it("converts values", async() => {
		expect(convertCurrency({
			value: 100,
			inputCurrency: "GBP",
			outputCurrency: "USD",
			exchangeRates
		})).toBe(200)
		expect(convertCurrency({
			value: 200,
			inputCurrency: "USD",
			outputCurrency: "GBP",
			exchangeRates
		})).toBe(100)
		expect(convertCurrency({
			value: 60,
			inputCurrency: "CAD",
			outputCurrency: "USD",
			exchangeRates
		})).toBe(40)
	})

	it("survives same input/output currencies", async() => {
		expect(convertCurrency({
			value: 123,
			inputCurrency: "CAD",
			outputCurrency: "CAD",
			exchangeRates
		})).toBe(123)
	})

	it("throws on invalid currency", async() => {
		expect(() => convertCurrency({
			value: 100,
			inputCurrency: "xyz",
			outputCurrency: "USD",
			exchangeRates
		})).toThrow()
		expect(() => convertCurrency({
			value: 100,
			inputCurrency: null,
			outputCurrency: "USD",
			exchangeRates
		})).toThrow()
		expect(() => convertCurrency({
			value: 100,
			inputCurrency: "",
			outputCurrency: "USD",
			exchangeRates
		})).toThrow()
		expect(() => convertCurrency({
			value: 100,
			inputCurrency: "GBP",
			outputCurrency: "xyz",
			exchangeRates
		})).toThrow()
	})
})

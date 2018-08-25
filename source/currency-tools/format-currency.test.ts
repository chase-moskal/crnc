
import {exchangeRates} from "./testing-tools"
import {formatCurrency} from "./format-currency"
import {convertAndFormatCurrency} from "./convert-and-format-currency"

describe("format currency - function", () => {
	const locale = "en-US"

	it("displays human-readable currency", async() => {
		expect(formatCurrency({
			value: 1.23,
			currency: "CAD",
			locale
		})).toBe("$1.23 CAD")

		expect(formatCurrency({
			value: 1234.56,
			currency: "CAD",
			locale
		})).toBe("$1,234.56 CAD")

		expect(formatCurrency({
			value: 1.23,
			currency: "XBT",
			precision: 8,
			locale
		})).toBe("Ƀ1.23000000 XBT")
	})

	it("rounds numbers", async() => {
		expect(formatCurrency({
			value: 1.234,
			currency: "CAD",
			locale
		})).toBe("$1.23 CAD")
		expect(formatCurrency({
			value: 1.235,
			currency: "CAD",
			locale
		})).toBe("$1.24 CAD")
		expect(formatCurrency({
			value: 1234567.89,
			currency: "CAD",
			precision: 0,
			locale
		})).toBe("$1,234,568 CAD")
	})

	it("respects precision", async() => {
		expect(convertAndFormatCurrency({
			exchangeRates,
			value: 123,
			precision: 0,
			inputCurrency: "CAD",
			outputCurrency: "CAD"
		})).toBe("$123 CAD")
	})

	it("throws on unknown currency", async() => {
		expect(() => formatCurrency({value: 123, currency: "xyz", locale})).toThrow()
	})
})

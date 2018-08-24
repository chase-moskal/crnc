
import {
	formatCurrency,
	convertCurrency,
	convertAndFormatCurrency
} from "./crnc"

describe("crnc", () => {
	const rates = {
		CAD: 3.0,
		USD: 2.0,
		GBP: 1.0
	}

	describe("convert currency - function", () => {
		it("converts values", async() => {
			expect(convertCurrency({
				value: 100,
				input: "GBP",
				output: "USD",
				rates
			})).toBe(200)
			expect(convertCurrency({
				value: 200,
				input: "USD",
				output: "GBP",
				rates
			})).toBe(100)
			expect(convertCurrency({
				value: 60,
				input: "CAD",
				output: "USD",
				rates
			})).toBe(40)
		})

		it("survives same input/output currencies", async() => {
			expect(convertCurrency({
				value: 123,
				input: "CAD",
				output: "CAD",
				rates
			})).toBe(123)
		})

		it("throws on invalid currency", async() => {
			expect(() => convertCurrency({
				value: 100,
				input: "xyz",
				output: "USD",
				rates
			})).toThrow()
			expect(() => convertCurrency({
				value: 100,
				input: null,
				output: "USD",
				rates
			})).toThrow()
			expect(() => convertCurrency({
				value: 100,
				input: "",
				output: "USD",
				rates
			})).toThrow()
			expect(() => convertCurrency({
				value: 100,
				input: "GBP",
				output: "xyz",
				rates
			})).toThrow()
		})
	})

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
				rates,
				value: 123,
				precision: 0,
				input: "CAD",
				output: "CAD"
			})).toBe("$123 CAD")
		})

		it("throws on unknown currency", async() => {
			expect(() => formatCurrency({value: 123, currency: "xyz", locale})).toThrow()
		})
	})

	describe("convert and format currency - function", () => {
		it("respects precision", async() => {
			expect(convertAndFormatCurrency({
				rates,
				value: 60,
				precision: 0,
				input: "CAD",
				output: "USD"
			})).toBe("$40 USD")
		})
	})
})


import {Suite, expect} from "cynic"

import {exchangeRates} from "./testing-tools.js"
import {formatCurrency} from "./format-currency.js"
import {convertAndFormatCurrency} from "./convert-and-format-currency.js"

const locale = "en-US"

export default <Suite>{
	"displays human-readable currency": async() => {
		expect(formatCurrency({
			value: 1.23,
			currency: "CAD",
			locale
		}).price).equals("$1.23 CAD")
		expect(formatCurrency({
			value: 1234.56,
			currency: "CAD",
			locale
		}).price).equals("$1,234.56 CAD")
		expect(formatCurrency({
			value: 1.23,
			currency: "XBT",
			precision: 8,
			locale
		}).price).equals("Ƀ1.23000000 XBT")
	},
	"rounds numbers": async() => {
		expect(formatCurrency({
			value: 1.234,
			currency: "CAD",
			locale
		}).price).equals("$1.23 CAD")
		expect(formatCurrency({
			value: 1.235,
			currency: "CAD",
			locale
		}).price).equals("$1.24 CAD")
		expect(formatCurrency({
			value: 1234567.89,
			currency: "CAD",
			precision: 0,
			locale
		}).price).equals("$1,234,568 CAD")
	},
	"respects precision": async() => {
		expect(convertAndFormatCurrency({
			exchangeRates,
			value: 123,
			precision: 0,
			inputCurrency: "CAD",
			outputCurrency: "CAD"
		}).price).equals("$123 CAD")
	},
	"throws on unknown currency": async() => {
		expect(() => formatCurrency({value: 123, currency: "xyz", locale}))
			.throws()
	},
}

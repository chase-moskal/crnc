
export const bankOfCanadaSupportedCurrencies = <const>[
	"CAD",
	"AUD",
	"BRL",
	"CNY",
	"EUR",
	"HKD",
	"INR",
	"IDR",
	"JPY",
	"MYR",
	"MXN",
	"NZD",
	"NOK",
	"PEN",
	"RUB",
	"SAR",
	"SGD",
	"ZAR",
	"KRW",
	"SEK",
	"CHF",
	"TWD",
	"THB",
	"TRY",
	"GBP",
	"USD",
	"VND",
]

export function validateCurrenciesAreSupportedByBankOfCanada(currencies: string[]) {

	const unsupportedCurrencies = currencies.filter(
		currency => bankOfCanadaSupportedCurrencies.indexOf(<any>currency) === -1
	)

	if (unsupportedCurrencies.length)
		throw new Error(`exchange rates for these currencies are not supported by the bank of canada (${unsupportedCurrencies.join(", ")})`)
}

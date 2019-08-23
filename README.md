
# -c-r-n-c- <br/> currency conversions and formatting for the web

- works with [exchangeratesapi.io](https://exchangeratesapi.io/) out of the box
- `npm install crnc`  
	`import {downloadExchangeRates, convertAndFormatCurrency} from "crnc"`

### currency tools

1. *async function* **[downloadExchangeRates](./source/currency-tools/download-exchange-rates.ts) `(` [params](./source/currency-tools/interfaces.ts#L2) `): Promise<` [results](/source/currency-tools/interfaces.ts#L6) `>`**  
	download up-to-date currency exchange information from the internet

2. *function* **[convertCurrency](./source/currency-tools/convert-currency.ts) `(` [params](./source/currency-tools/interfaces.ts#L15) `): number`**  
	exchange monetary value from one currency into another

3. *function* **[formatCurrency](./source/currency-tools/format-currency.ts) `(` [params](./source/currency-tools/interfaces.ts#L31) `): string`**  
	express monetary value as a human-readable string

4. *function* **[convertAndFormatCurrency](./source/currency-tools/convert-and-format-currency.ts) `(` [params](./source/currency-tools/interfaces.ts#L36) `): string`**  
	exchange and format money in one shot

### ecommerce

1. *async function* **[ascertainEcommerceDetails](./source/ecommerce/ascertain-ecommerce-details.ts) `(` [params](./source/ecommerce/interfaces.ts#L14) `): Promise<` [details](./source/ecommerce/interfaces.ts#L20) `>`**  
	establish some ecommerce-related currency details

2. *function* **[assumeUserCurrency](./source/ecommerce/assume-user-currency.ts) `(` [params](./source/ecommerce/interfaces.ts#L8) `): string`**  
	assume what currency the user might want to see

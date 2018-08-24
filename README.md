
# -c-r-n-c- <br/> currency conversions and formatting

get started

1. `npm install crnc`
2. `import {downloadRates, convertCurrency, formatCurrency} from "crnc"`

primary functionality

1. *async function* **`downloadRates(` [params](./source/interfaces.ts#L2) `): Promise<` [results](/source/interfaces.ts#L6) `>`**  
	download up-to-date currency exchange information from the internet

2. *function* **`convertCurrency(` [params](./source/interfaces.ts#L15) `): number`**  
	exchange monetary value from one currency into another

3. *function* **`formatCurrency(` [params](./source/interfaces.ts#L31) `): string`**  
	express monetary value as a human-readable string

4. *function* **`convertAndFormatCurrency(` [params](./source/interfaces.ts#L36) `): string`**  
	exchange and format money in one shot

read the sourcecode for details

- [crnc.ts](./source/crnc.ts)
- [currency-formatters.ts](./source/currency-formatters.ts)
- [interfaces.ts](./source/interfaces.ts)

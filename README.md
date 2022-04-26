
# -c-r-n-c-

## 📦 **`npm install crnc`**

💵 currency conversions and formatting (used in [shopper](https://github.com/chase-moskal/shopper))  
📜 typescript library for web browsers  
⏬ download exchange rates from the [bank of canada](https://www.bankofcanada.ca/valet/docs)  
💾 rates are cached for an hour by default  
🌎 formats numbers in accordance to browser locale  
💴 guesses display currency preference based on locale  
📜 currency codes are in [iso 4217 format](https://en.wikipedia.org/wiki/ISO_4217#Active_codes)  
💖 free and open source, just for you  

<br/>
<br/>

## currency converter

- all currency codes are in [iso 4217 format](https://en.wikipedia.org/wiki/ISO_4217#Active_codes)
- the currency converter assumes you're running an ecommerce situation where all your prices are share a single `baseCurrency`.
- we use the currency converter to convert and format base-currency prices into the user's currency preference.
- exchange rates are downloaded from the internet.
- the currency converter will display prices in the base currency, until rates are downloaded.
- if the rates download fails, the currency converter will continue to work, only showing prices in the base currency.

### currency converter usage examples

- create a currency converter
  ```js
  import {makeCurrencyConverter} from "crnc/x/currency-converter.js"

  const currencyConverter = makeCurrencyConverter({

    // all values you run through this converter must be in this currency
    baseCurrency: "USD",

    // other currencies you desire (base currency is already assumed)
    currencies: ["CAD", "AUD", "EUR", "GBP", "JPY"],
  })

  // you can wait for the exchange rates to finish downloading.
  // but if you don't, all prices will be displayed in the base currency,
  // until the download is complete.
  await currencyConverter.exchangeRatesDownload
  ```

- display money in the base currency (always works)
  ```js
  const dollars = currencyConverter.display(1234.56, {currency: "USD"})
  dollars.value  // 1234.56
  dollars.amount // "1,234.56"
  dollars.price  // "$1,234.56 USD"
  dollars.currency.code   // "USD"
  dollars.currency.name   // "United States Dollar"
  dollars.currency.symbol // "$"
  ```

- display money in the user's preferred currency (initially auto-detected based on locale)
  ```js
  const money = currencyConverter.display(1234.56)
  money.value  // 1571.42
  money.amount // "1,571.42"
  money.price  // "$1,571.42 CAD"
  money.currency.code   // "CAD"
  money.currency.name   // "Canadian Dollar"
  money.currency.symbol // "$"
  ```

- change the currency preference
  ```js
  currencyConverter.setCurrencyPreference("EUR")

  const euros = currencyConverter.display(1234.56)
  euros.value  // 1152.97
  euros.amount // "1,152.97"
  euros.price  // "$1,152.97 EUR"
  euros.currency.code   // "EUR"
  euros.currency.name   // "Euro"
  euros.currency.symbol // "$"
  ```

- display money in a specific currency, ignoring the currency preference
  ```js
  const pounds = currencyConverter.display("1234.56", {currency: "GBP"})
  pounds.value  // 968.90
  pounds.amount // "968.90"
  pounds.price  // "£968.90 GBP"
  pounds.currency.code   // "GBP"
  pounds.currency.name   // "British Pound Sterling"
  pounds.currency.symbol // "£"
  ```

- display money with a specific precision
  ```js
  const dollars = currencyConverter.display(
    1234.56,
    {precision: 0},
  )
  dollars.price // "£969 GBP"
  ```

- check what is the current currency preference
  ```js
  currencyConverter.currencyPreference
    // {
    //   code: "CAD",
    //   name: "Canadian Dollar",
    //   symbol: "$",
    // }
  ```

- check what currencies are currently available
  ```js
  currencyConverter.availableCurrencies
    // {
    //   USD: {
    //     code: "USD",
    //     name: "United States Dollar",
    //     symbol: "$",
    //   },
    //   CAD: {
    //     code: "CAD",
    //     name: "Canadian Dollar",
    //     symbol: "$",
    //   },
    // }
  ```

- check what currency is targeted for conversions, despite the currency preference.  
  the currency preference may not be available, in which case the base currency will be targeted.
  ```js
  currencyConverter.targetCurrency
    // {
    //   code: "USD",
    //   name: "United States Dollar",
    //   symbol: "$",
    // }
  ```

- listen for changes (see [snapstate docs](https://github.com/chase-moskal/snapstate#readme))
  ```js
  currencyConverter.snap.subscribe(() => {
    currencyPreference // "JPY"
    availableCurrencies // {USD: {...}, CAD: {...}}
  })
  ```

### currency converter parameters

- `baseCurrency` — the native currency used by your ecommerce store. using the currency converter, you will *input* all money numbers in this base currency.

- `currencies` — the array of currencies you want available for conversions. only these currencies will be requested for, when downloading exchange rates.

- `locale` ***(optional)*** — the locale string for formatting numbers, and also for guessing the currency preference. *(default: auto-detected from browser)*

- `downloadExchangeRates` ***(optional)*** — async function for fetching exchange rates. *(default: downloads from the bank of canada api)*

- `listenForStorageChanges` ***(optional)*** — function that instructs the currency converter when it should reload the currency preference from storage, for example, when another tab fires a storage event, so when the user changes the preference, it affects multiple tabs. *(default: adds a storage event listener to the window)*

- `persistence` ***(optional)*** — details about where to cache exchange rates and store the currency preference. *(default: shown below)*
  ```js
  persistence: {

    // which storage object to use
    storage: window.localStorage,

    // number of milliseconds cached exchange rates should remain valid
    cacheLifespan: 1000 * 60 * 60,

    storageKeys: {

      // storage key used to caching exchange rates
      exchangeRatesCache: "crnc-exchange-rates-cache",

      // storage key used to store currency preference
      currencyPreference: "crnc-currency-preference",
    },
  },
  ```

<br/>
<br/>

## handy functions for currency conversions and formatting

### currency tools

- [downloadExchangeRates](./s/currency-tools/download-exchange-rates.ts)  
	downloads exchange rates from the [bank of canada's open api](https://www.bankofcanada.ca/valet/docs)

- [convertCurrency](./s/currency-tools/convert-currency.ts)  
	exchange a money value from one currency to another

- [formatCurrency](./s/currency-tools/format-currency.ts)  
	express a money value as a human-friendly string  
	(adds dollar signs and commas and stuff)

- [convertAndFormatCurrency](./s/currency-tools/convert-and-format-currency.ts)  
	exchange a money value, and format it, in one shot  
	(simply a convenience function, combines convertCurrency and formatCurrency)

### ecommerce helpers

- [ascertainEcommerceDetails](./s/ecommerce/ascertain-ecommerce-details.ts)  
	enhanced logic to retrieve exchange rates, fallback onto dud, caching

- [assumeUserCurrency](./s/ecommerce/assume-user-currency.ts)  
	assume what currency the user might want to see based on locale

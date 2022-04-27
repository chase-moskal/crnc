
import {html} from "lit"
import {property} from "lit/decorators.js"

import {CurrencyConverter} from "../../interfaces.js"
import {Component} from "../../framework/component.js"
import {mixinStyles} from "../../framework/mixins/mixin-styles.js"
import {calculatePercentOff} from "../../toolbox/calculate-percent-off.js"
import {mixinRequireContext} from "../../framework/mixins/mixin-context.js"

import crncPriceCss from "./crnc-price.css.js"

export interface PriceContext {
	currencyConverter: CurrencyConverter
}

@mixinStyles(crncPriceCss)
export class CrncPrice extends mixinRequireContext<PriceContext>()(Component) {

	@property({type: Number, reflect: true})
	value: number

	@property({type: String, reflect: true})
	currency: string

	@property({type: Number, reflect: true})
	precision: number

	@property({type: Number, reflect: true})
	comparedValue: number

	@property({type: Boolean, reflect: true})
	"menu-open": boolean

	#toggleMenu = () => {
		this["menu-open"] = !this["menu-open"]
	}

	#prepareMenuClickHandler = (currency: string) => () => {
		this.context.currencyConverter.setCurrencyPreference(currency)
		this.#toggleMenu()
	}

	render() {
		const {value} = this
		return value !== undefined
			? this.#renderValidPrice(value)
			: this.#renderNoValue()
	}

	#renderValidPrice(value: number) {
		const {currencyConverter} = this.context
		const {currency, precision, comparedValue, "menu-open": menuOpen} = this
		const {targetCurrency, baseCurrency, availableCurrencies} = currencyConverter

		const currencyIsConverted = targetCurrency !== baseCurrency
		const conversionMark = currencyIsConverted ?"*" :""

		const money = currencyConverter.display(value, {currency, precision})

		const comparedMoney = comparedValue
			? currencyConverter.display(comparedValue, {currency, precision})
			: undefined

		return html`
			<div class="price-display">
				<div class="price-area">
					<span class="symbol">${money.currency.symbol}</span
					><span class="amount">${money.amount}</span>
					<button class="code" @click=${this.#toggleMenu}>
						${money.currency.code}${conversionMark}<span class="down">▼</span>
					</button>
					${menuOpen ? html`
						<div class="blanket" @click=${this.#toggleMenu}></div>
						<ul class="menu">
							${Object.values(availableCurrencies).map(({symbol, code, name}) => html`
								<li>
									<button @click=${this.#prepareMenuClickHandler(code)}>
										<span class="menu-symbol">${symbol}</span
										><span class="menu-star">${code === baseCurrency ? "" : "*"}</span>
										<span class="menu-name">${name}</span>
									</button>
								</li>
							`)}
							<div class="menu-note">
								<slot name="menu-note">
									* converted currency: prices are estimates and may be 
									different at checkout
								</slot>
							</div>
						</ul>
					` : html``}
				</div>
				${comparedMoney ? html`
					<div class="discount-area">
						<span class="compared">
							<span class="symbol">${comparedMoney.currency.symbol}</span
							><span class="amount">${comparedMoney.amount}</span>
						</span>
						<span class="percent-off">
							${calculatePercentOff({
								currentValue: money.value,
								comparisonValue: comparedMoney.value,
							})}% off
						</span>
					</div>
				` : null}
			</div>
		`
	}

	#renderNoValue() {
		return html`
			no value found
		`
	}
}

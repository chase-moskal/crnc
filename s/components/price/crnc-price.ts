
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
	right: boolean = false

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
		const {baseCurrency, availableCurrencies} = currencyConverter

		const money = currencyConverter.display(value, {currency, precision})

		const currencyIsConverted = money.currency.code !== baseCurrency
		const conversionMark = currencyIsConverted ?"*" :""

		const comparedMoney = comparedValue
			? currencyConverter.display(comparedValue, {currency, precision})
			: undefined

		const menuIsAllowed = !currency

		const codeButtonClick = menuIsAllowed
			? this.#toggleMenu
			: () => {}

		return html`
			<div class="price-display" ?data-menu-is-allowed=${menuIsAllowed}>
				<div class="price-area">
					<span class="symbol">${money.currency.symbol}</span
					><span class="amount">${money.amount}</span>
					${this.#renderCurrencyCode({
						currencyCode: money.currency.code,
						menuIsAllowed,
						conversionMark,
						currencyIsConverted,
						codeButtonClick,
					})}
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

	#renderCurrencyCode({
			currencyCode, conversionMark, menuIsAllowed, currencyIsConverted,
			codeButtonClick,
		}: {
			currencyCode: string
			conversionMark: string
			menuIsAllowed: boolean
			currencyIsConverted: boolean
			codeButtonClick: () => void
		}) {

		const codeButtonTitle = currencyIsConverted
			? "estimated currency conversion"
			: ""

		const downSymbol = menuIsAllowed
			? html`<span class="down">▼</span>`
			: null

		return menuIsAllowed
			? html`
				<button class="code" @click=${codeButtonClick} title=${codeButtonTitle}>
					${currencyCode}${conversionMark}${downSymbol}
				</button>
			`
			: html`
				<span class="code" @click=${codeButtonClick} title=${codeButtonTitle}>
					${currencyCode}${conversionMark}${downSymbol}
				</span>
			`
	}

	#renderNoValue() {
		return html`
			--
		`
	}
}

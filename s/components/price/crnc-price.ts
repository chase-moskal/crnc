
import {CurrencyConverter} from "../../interfaces.js"
import {Component} from "../../framework/component.js"
import {mixinStyles} from "../../framework/mixins/mixin-styles.js"
import {mixinRequireContext} from "../../framework/mixins/mixin-context.js"

import crncPriceCss from "./crnc-price.css.js"

export interface PriceContext {
	currencyConverter: CurrencyConverter
}

@mixinStyles(crncPriceCss)
export class CrncPrice extends mixinRequireContext<PriceContext>()(Component) {

	lol() {
		this.context.currencyConverter
	}
}

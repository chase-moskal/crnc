
import {LitElement} from "lit"
import themeCss from "./theme.css.js"
import {property} from "lit/decorators.js"

export class Component extends LitElement {

	static styles = [themeCss]

	@property({type: Boolean, reflect: true})
	"initially-hidden": boolean

	firstUpdated() {
		this["initially-hidden"] = false
	}
}

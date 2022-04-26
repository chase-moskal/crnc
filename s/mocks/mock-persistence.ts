
import {oneHour} from "../currency-converter.js"
import {BasicStorage, ConverterPersistence} from "../interfaces.js"
import {mockBasicStorage} from "./mock-basic-storage.js"

const storageKeys = {
	exchangeRatesCache: "crnc-exchange-rates-cache",
	userDisplayCurrency: "crnc-user-display-currency",
}

export const mockPersistence = {

	standard: (): ConverterPersistence => ({
		storageKeys,
		cacheLifespan: oneHour,
		storage: mockBasicStorage(),
		listenForStorageChange: () => {},
	}),

	multipleTabsSharingOneStorage: () => {
		const storage: BasicStorage = mockBasicStorage()

		const tabs = new Set<{
			persistence: ConverterPersistence
			triggerStorageChangeOnThisTab: () => void
			triggerStorageChangeOnAllOtherTabs: () => void
		}>()

		function makeTab() {
			let trigger = (): void => {
				throw new Error(`cannot trigger storage change before listenForStorageChange is setup`)
			}
			const triggerStorageChangeOnThisTab = () => trigger()
			const persistence: ConverterPersistence = ({
				storage,
				storageKeys,
				cacheLifespan: oneHour,
				listenForStorageChange: refresh => {
					trigger = () => {
						refresh()
					}
				},
			})
			const tab = {
				persistence,
				triggerStorageChangeOnThisTab,
				triggerStorageChangeOnAllOtherTabs: () => {
					for (const t of tabs)
						if (t !== tab) {
							t.triggerStorageChangeOnThisTab()
						}
				},
			}
			tabs.add(tab)
			return tab
		}

		return {
			makeTab,
		}
	},
}

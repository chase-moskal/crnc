
import {BasicStorage} from "../interfaces.js"

export function cache<xPayload extends any>({
		lifespan, storage, storageKey, load,
	}: {
		lifespan: number
		storage: BasicStorage
		storageKey: string
		load: () => Promise<xPayload>
	}) {

	type CacheStore = {
		time: number
		payload: xPayload
	}

	function timeIsValid(time: number) {
		const since = Date.now() - time
		return since < lifespan
	}

	function getStore(): undefined | CacheStore {
		const data = storage.getItem(storageKey)
		let validStore: CacheStore
		if (data) {
			try {
				const store = JSON.parse(data)
				if (timeIsValid(store.time))
					validStore = store
			}
			catch (error) {}
		}
		return validStore
	}

	function setStore(payload: xPayload) {
		const store: CacheStore = {
			payload,
			time: Date.now(),
		}
		const data = JSON.stringify(store)
		storage.setItem(storageKey, data)
	}

	async function loadAndWriteCacheStore() {
		const payload = await load()
		setStore(payload)
		return payload
	}

	return {

		async read() {
			const store = getStore()
			return store
				? store.payload
				: await loadAndWriteCacheStore()
		},

		async readFresh() {
			return loadAndWriteCacheStore()
		},

		async readCache() {
			return getStore()
		},

		async write(payload: xPayload) {
			setStore(payload)
		},

		async clear() {
			storage.removeItem(storageKey)
		},
	}
}


export function calculatePercentOff({
		currentValue,
		comparisonValue
	}: {
		currentValue: number
		comparisonValue: number
	}) {

	const fraction = comparisonValue / currentValue
	const difference = 1.0 - fraction
	const percentage = -Math.round(difference * 100)
	return percentage
}

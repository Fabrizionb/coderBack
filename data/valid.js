const productKeys = ['title', 'description', 'price', 'code', 'stock', 'category']

export function validateProduct (maybeProduct) {
  const maybeProductKeys = Object.keys(maybeProduct)
  return (
    productKeys.every((key) => maybeProductKeys.includes(key) && maybeProduct[key] !== null && maybeProduct[key] !== undefined && maybeProduct[key] !== '') &&
      maybeProductKeys.every((key) => productKeys.includes(key))
  )
}

export function validarProductPartial (maybeProductPartial) {
  const maybeProductKeys = Object.keys(maybeProductPartial)
  return (
    maybeProductKeys.length <= productKeys.length &&
      maybeProductKeys.every((key) => productKeys.includes(key) && maybeProductPartial[key] !== null && maybeProductPartial[key] !== undefined && maybeProductPartial[key] !== '')
  )
}

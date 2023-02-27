const productKeys = ['title', 'description', 'price', 'image', 'code', 'stock']

export function validateProduct (maybeProduct) {
  const maybeProductKeys = Object.keys(maybeProduct)
  return (
    productKeys.every((key) => maybeProductKeys.includes(key)) &&
      maybeProductKeys.every((key) => productKeys.includes(key))
  )
}

export function validarProductPartial (maybeProductPartial) {
  const maybeProductKeys = Object.keys(maybeProductPartial)
  return (
    maybeProductKeys.length <= productKeys.length &&
      maybeProductKeys.every((key) => productKeys.includes(key))
  )
}

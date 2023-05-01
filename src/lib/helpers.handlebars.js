export function saludar (nombre) {
  return `Hola ${nombre}`
}

export function multiply (a, b) {
  return a * b
}

export function total (cart) {
  let total = 0
  cart.products.forEach(product => {
    total += product.quantity * product.product.price
  })
  return total.toFixed(2)
}

export function finalPrice (cart) {
  let total = 0
  const shipping = 5
  cart.products.forEach(product => {
    total += Number(product.quantity) * Number(product.product.price)
  })

  return shipping + total
}

export function eq (a, b) {
  return a === b
}
export default {
  saludar,
  multiply,
  total,
  finalPrice,
  eq
}

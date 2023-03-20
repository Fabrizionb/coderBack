import mongoose from 'mongoose'

const cartCollection = 'cart'

// Esquema del array de objetos
const productSchema = new mongoose.Schema({
  quantity: { type: Number, required: true }
})

// Esquema del cart con la referencia del esquema del array de objetos.
const cartSchema = new mongoose.Schema({
  products: { type: [productSchema], required: true }
})

export const cartModel = mongoose.model(cartCollection, cartSchema)

import mongoose, { Schema, model } from 'mongoose'

import { productsCollection } from './product.model.js'
/* eslint-disable  */
const cartCollection = 'carts'

// // Esquema del array de objetos
// const productSchema = new mongoose.Schema({
//   quantity: { type: Number, required: true }
// })

// // Esquema del cart con la referencia del esquema del array de objetos.
// const cartSchema = new mongoose.Schema({
//   products: { type: [productSchema], required: true }
// })

const cartSchema = new Schema({
  
products : {
  type : [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: productsCollection
      },
      quantity: { type: Number, required: true }
    }
  ],
  default: [],
}
})

cartSchema.pre('find', function(){
  this.populate('products.product')
})

const cartModel = model(cartCollection, cartSchema)
export default cartModel

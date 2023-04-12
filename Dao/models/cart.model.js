import mongoose, { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { productsCollection } from './product.model.js'
const cartCollection = 'carts'

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productsCollection
        },
        quantity: { type: Number, required: true }
      }
    ],
    default: []
  }
})

cartSchema.pre('find', function () {
  this.populate('products.product')
})
cartSchema.plugin(mongoosePaginate)

const cartModel = model(cartCollection, cartSchema)
export default cartModel

import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { productsCollection } from './product.model.js'

const ticketCollection = 'tickets'

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'carts',
    required: true
  },
  purchased_products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: productsCollection
    },
    quantity: {
      type: Number,
      required: true
    }
  }]
})

ticketSchema.pre('find', function () {
  this.populate('cartId')
  this.populate('purchased_products.product')
})

const ticketModel = model(ticketCollection, ticketSchema)
export default ticketModel

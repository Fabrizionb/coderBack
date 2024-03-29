/* eslint-disable  */
import { Router } from 'express'
import { authorization, passportCall } from '../utils/auth.js'
import cartController from '../controller/cart.controller.js'
import ticketController from '../controller/ticket.controller.js'
const route = Router()

// Get All
route.get('/', passportCall('current'), authorization(['user', 'admin']), cartController.findAll.bind(cartController))
// Get one cart
route.get('/:id', authorization(['user', 'admin']), cartController.findOne.bind(cartController))
// Get one ticket
route.get('/ticket/:tid', ticketController.findOne.bind(ticketController))
// Get all tickets
route.get('/tickets/all', ticketController.find.bind(ticketController))


// Create cart
route.post('/', cartController.create.bind(cartController))
// Purchase
route.post('/:cid/purchase', authorization(['user', 'admin']), passportCall('current'), cartController.purchase.bind(cartController))
// Add product in cart
route.post('/:cid/product/:pid', authorization(['user', 'premium']), cartController.addProduct.bind(cartController))
// Modify quantity
route.put('/:cid/product/:pid', authorization(['user', 'premium']), cartController.updateQuantity.bind(cartController))


// Delete one product form cart
route.delete('/:cid/product/:pid', authorization(['user']), cartController.deleteOne.bind(cartController))
// Delete all products in cart
route.delete('/:cid', authorization(['user']), cartController.deleteAll.bind(cartController))
// Delete one ticket
route.delete('/ticket/:tid', ticketController.delete.bind(ticketController))

export default route

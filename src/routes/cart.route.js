import { Router } from 'express'
import { authorization, passportCall } from '../utils/auth.js'
import controller from '../controller/cart.controller.js'
const route = Router()

// Get All
route.get('/', passportCall('current'), controller.findAll.bind(controller))
// Get one cart
route.get('/:id', authorization(['user', 'admin']), controller.findOne.bind(controller))
// Create cart
route.post('/', controller.create.bind(controller))
// Delete one product form cart
route.delete('/:cid/product/:pid', authorization(['user', 'admin']), controller.deleteOne.bind(controller))
// Delete all products in cart
route.delete('/:cid', authorization(['user', 'admin']), controller.deleteAll.bind(controller))
// Add product in cart
route.post('/:cid/product/:pid', authorization(['user', 'admin']), controller.addProduct.bind(controller))
// Modify quantity
route.put('/:cid/product/:pid', authorization(['user', 'admin']), controller.updateQuantity.bind(controller))

export default route

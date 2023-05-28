import { Router } from 'express'
import { multiUploader } from '../utils/multiUploader.js'
import { authorization, passportCall } from '../utils/auth.js'
import controller from '../controller/product.controller.js'
const route = Router()

// Get All
route.get('/', controller.findAll.bind(controller))
// Get One Product
route.get('/:pid', authorization(['user', 'admin']), controller.findOne.bind(controller))
// Post Product
route.post('/', passportCall('current'), multiUploader, authorization(['admin']), controller.create.bind(controller))
// route.post('/', authorization(['admin']), multiUploader, controller.create.bind(controller))
// Update Product
route.put('/:id', authorization(['admin']), controller.update.bind(controller))
// Delete Product
route.delete('/:pid', authorization(['admin']), controller.delete.bind(controller))

export default route

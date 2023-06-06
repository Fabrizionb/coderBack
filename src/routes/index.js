import { Router } from 'express'
import cartRoute from './cart.route.js'
import productsRoute from './products.route.js'
import usersRoute from './user.route.js'
import mockingRoute from './mocking.route.js'
import loggerRoute from './logger.route.js'

const route = Router()

route.use('/product', productsRoute)
route.use('/cart', cartRoute)
route.use('/user', usersRoute)
route.use('/mockingproducts', mockingRoute)
route.use('/loggerTest', loggerRoute)

export default route

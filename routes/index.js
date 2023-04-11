import { Router } from 'express'
import cartRoute from './cart.route.js'
import productsRoute from './products.route.js'
import usersRoute from './users.route.js'

const route = Router()

route.use('/product', productsRoute)
route.use('/cart', cartRoute)
route.use('/users', usersRoute)

export default route

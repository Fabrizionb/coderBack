import { Router } from 'express'
import sessionRouter from './session.route.js'
import authRouter from './auth.route.js'

import cartRoute from './cart.route.js'
import productsRoute from './products.route.js'
import usersRoute from './users.route.js'

const route = Router()
route.use('/session', sessionRouter)
route.use('/auth', authRouter)

route.use('/products', productsRoute)
route.use('/cart', cartRoute)
route.use('/users', usersRoute)

export default route

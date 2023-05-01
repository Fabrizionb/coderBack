import { Router } from 'express'
import cartRoute from './cart.route.js'
import productsRoute from './products.route.js'
import usersRoute from './user.route.js'
import cookieRoute from './cookie.route.js'
const route = Router()

route.use('/product', productsRoute)
route.use(cartRoute.path, cartRoute.router)
route.use('/user', usersRoute)
route.use('/cookie', cookieRoute)

export default route

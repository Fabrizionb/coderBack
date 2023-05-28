/* eslint-disable */
import { Router } from 'express'
import controller from '../controller/mocking.controller.js'

const route = Router()


// Get All
route.get('/', controller.generateProduct.bind(controller))


export default route 
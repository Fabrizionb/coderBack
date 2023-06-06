
/* eslint-disable */
import { Router } from 'express'
import controller from '../controller/logger.controller.js'

const route = Router()

// Logger Test
route.get('/', controller.loggerTest.bind(controller))

export default route 
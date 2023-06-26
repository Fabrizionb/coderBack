import * as path from 'path'
import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Coderhouse Api Project',
      version: '1.0.0',
      description: 'Api for Coderhouse project'
    }
  },
  apis: [
    path.resolve('./src/docs/**/*.yaml'),
    path.resolve('./src/routes/*.router.js')

  ]
}

const spec = swaggerJsDoc(swaggerOptions)
export default spec

import ErrorEnum from './errors.enum.mjs'

export default (error, req, res, next) => {
  console.error(error.cause)

  switch (Math.floor(error.code / 100)) {
    case 1: // Errores de Entrada
      res.userErrorResponse({ message: 'Error de entrada', error: error.code })
      break
    case 2: // Errores Lógicos
      res.userErrorResponse({ message: 'Error lógico', error: error.code })
      break
    case 4: // Errores BAD_REQUEST
      res.status(400).json({
        message: error.message || 'Bad Request',
        code: error.code || ErrorEnum.BAD_REQUEST
      })
      break
    case 5: // Errores SERVER_ERROR
    default:
      res.status(500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || ErrorEnum.SERVER_ERROR
      })
      break
  }
}

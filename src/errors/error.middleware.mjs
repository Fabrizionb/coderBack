export default (error, req, res, next) => {
  console.error(error.cause)

  switch (Math.floor(error.code / 100)) {
    case 1: // Errores de Entrada
      res.userErrorResponse({ message: 'Input Error', code: error.code })
      break
    case 2: // Errores Lógicos
      res.userErrorResponse({ message: 'Logic Error', code: error.code })
      break
    case 4: // Errores BAD_REQUEST
      res.userErrorResponse({ message: 'Bad Request', code: error.code })
      break
    case 5: // Errores SERVER_ERROR
    default:
      res.serverErrorResponse({ message: 'Server Error', code: error.code })
      break
  }
}

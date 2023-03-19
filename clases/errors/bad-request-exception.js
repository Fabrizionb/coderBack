import { ValidationError } from './validation-exception.js'

export class BadRequestException extends ValidationError {
  constructor (mensaje) {
    super({
      code: 400,
      mensaje
    })
  }
}
// throw new BadRequestException("algo es invalido")

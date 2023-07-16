import moment from 'moment'
class UserDto {
  constructor (user) {
    // this._id = user._id
    this.name = user.name
    this.lastname = user.lastname
    this.cartId = user.cartId
    this.role = user.role
    this.email = user.email
    this.lastConnection = moment(user.lastConnection).format('YYYY-MM-DD') // Devuelve una fecha como "2023-07-16"
  }
}

export default UserDto

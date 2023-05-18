class UserDto {
  constructor (user) {
    // this._id = user._id
    this.name = user.name
    this.lastname = user.lastname
    this.cartId = user.cartId
    this.role = user.role
    this.email = user.email
  }
}

export default UserDto

async function send (event) {
  event.preventDefault()
  const name = document.getElementById('form-name').value
  const lastname = document.getElementById('form-last-name').value
  const email = document.getElementById('form-email').value
  const age = document.getElementById('form-edad').value
  const password = document.getElementById('form-password').value

  api
    .post('/api/users', {
      name,
      lastname,
      email,
      age,
      password
    })
    .then(() => {
      alert('Usuario Registrado')
      setTimeout(() => window.location.href = '/login', 1000)
    })
    .catch((error) => console.log(error)) // manejar cualquier error
}

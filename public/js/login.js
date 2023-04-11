const loginForm = document.querySelector('form')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

loginForm.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('trigger')
  const email = emailInput.value
  const password = passwordInput.value

  if (email === '' || password === '') {
    Swal.fire('Error!', 'All fields are required', 'error')
    return
  }

  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(() => {
    window.location.href = '/'
  })
})

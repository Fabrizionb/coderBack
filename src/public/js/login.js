const loginForm = document.querySelector('#login-form')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

function sendLogin (event) {
  event.preventDefault()
  const email = emailInput.value
  const password = passwordInput.value

  if (email === '' || password === '') {
    Swal.fire('Error!', 'All fields are required', 'error')
    return
  }

  fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message)
        })
      }
      return response.json()
    })
    .then((data) => {
    // Successful login
      Swal.fire('Success!', 'redirecting to the home page...', 'success').then(() => {
      // Redirect to '/' after the alert is closed
        window.location.href = '/'
      })
    })
    .catch((error) => {
      Swal.fire('Error!', `${error.message}`, 'error')
    })

  emailInput.value = ''
  passwordInput.value = ''
}

loginForm.addEventListener('submit', sendLogin)

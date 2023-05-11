const loginForm = document.querySelector('#login-form')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const email = emailInput.value
  const password = passwordInput.value

  if (email === '' || password === '') {
    Swal.fire('Error!', 'All fields are required', 'error')
    return
  }

  try {
    const response = await fetch(loginForm.action, {
      method: loginForm.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    console.log('response', response)
    console.log('responseStatus', response.status)
    console.log('responseStatustypeof', typeof response.status)
    if (response.status === 200) {
      window.location.href = '/'
    } else {
      Swal.fire('Error!', data.message, 'error')
    }
  } catch (error) {
    console.error(error)
  }
})
/* eslint-disable */
const emailForm = document.querySelector('#email')
const passwordForm = document.querySelector('#password')
const nameForm = document.querySelector('#name')
const lastnameForm = document.querySelector('#lastname')
const registerBtn = document.querySelector('#registerBtn')

function send(event) {
  event.preventDefault()
  const email = emailForm.value
  const password = passwordForm.value
  const name = nameForm.value
  const lastname = lastnameForm.value

  if (email === '' || password === '' || name === '' || lastname === '') {
    Swal.fire('Error!', 'All fields are required', 'error')
    return
  }
  console.log("register.js handler")
  fetch('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name, lastname })
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error('Error on register');
      }
    })
    .then((response) => {
      Swal.fire('Success!', 'User created.')
      setTimeout(() => {
        const url = window.location.href
        const first = url.split('/')[2]
        window.location.href = `http://${first}/profile`
      }, 1500)
    })
    .catch((error) => {
      if (error.message === 'Error on register') {
        Swal.fire('Error!', 'User not created.', 'error')
      } else {
        Swal.fire('Error!', 'An unexpected error occurred.', 'error')
      }
    })

  emailForm.value = ''
  passwordForm.value = ''
  nameForm.value = ''
  lastnameForm.value = ''
}

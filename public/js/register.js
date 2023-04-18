/* eslint-disable */
const emailForm = document.querySelector('#email')
const passwordForm = document.querySelector('#password')
const nameForm = document.querySelector('#name')
const lastnameForm = document.querySelector('#lastname')
const registerBtn = document.querySelector('#registerBtn')

registerBtn.addEventListener('click', (event) => {
  event.preventDefault()
  const email = emailForm.value
  const password = passwordForm.value
  const name = nameForm.value
  const lastname = lastnameForm.value

  if (email === '' || password === '' || name === '' || lastname === '') {
    Swal.fire('Error!', 'All fields are required', 'error')
    return
  }

  emailForm.value = ''
  passwordForm.value = ''
  nameForm.value = ''
  lastnameForm.value = ''

  fetch('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name, lastname })
  })
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      console.log("response",response)
      console.log("response.status",response.status)
      if (response.message === 'User Created') {
        Swal.fire('Success!', 'User created.')
        setTimeout(() => {
          const url = window.location.href
          const first = url.split('/')[2]
          window.location.href = `http://${first}/profile`
        }, 1500)
        return
      }
      Swal.fire('Error!', 'User not created.', 'error')
    })
})

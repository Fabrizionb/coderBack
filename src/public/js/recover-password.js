/* eslint-disable */

const emailForm = document.querySelector('#email')
const recoverBtn = document.querySelector('#recoverbtn')

function sendResetLink(event) {
  event.preventDefault()
  const email = emailForm.value

  if (email === '') {
    Swal.fire('Error!', 'Email field is required', 'error')
    return
  }
  fetch('/api/user/restore-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Error on sending reset link');
      }
    })
    .then((response) => {
      Swal.fire('Success!', 'Reset link sent to your email.')
      setTimeout(() => {
        const url = window.location.href
        const first = url.split('/')[2]
        window.location.href = `http://${first}/login`
      }, 5000)
    })
    .catch((error) => {
      if (error.message === 'Error on sending reset link') {
        Swal.fire('Error!', 'Reset link not sent.', 'error')
      } else {
        Swal.fire('Error!', 'An unexpected error occurred.', 'error')
      }
    })

  emailForm.value = ''
}

recoverBtn.addEventListener('click', sendResetLink)

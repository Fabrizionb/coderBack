const socket = io()
let userEmail
let userRole
const chatBox = document.querySelector('#chatBox')

Swal.fire({
  title: 'Identify yourself',
  text: 'Enter your Email',
  input: 'text',
  icon: 'question',
  inputValidator: (value) => {
    if (!value) {
      return 'Please enter an email.'
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address'
    }
  },
  allowOutsideClick: false
}).then((result) => {
  userEmail = result.value
  userRole = document.getElementById('userRole').value
  socket.emit('new_user', userEmail)
})

socket.on('messageLogs', (data) => {
  const log = document.querySelector('#messageLogs')
  let filteredData = data

  if (userRole !== 'admin') {
    filteredData = data.filter(message => message.user === userEmail || message.user === 'admin')
  }

  const messages = filteredData
    .map(
      (message) =>
        `<p class="user">${message.user} dice: <span class="message">${message.message}</span></p>`
    )
    .join('')
  log.innerHTML = messages
})

socket.on('user_connected', (data) => {
  Swal.fire({
    title: `${data} is online`,
    toast: true,
    position: 'top-right'
  })
})

chatBox.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user: userEmail, message: chatBox.value })
      chatBox.value = ''
    }
  }
})

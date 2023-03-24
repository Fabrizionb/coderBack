console.log('desde el chat')
const socket = io()
let user
let message
const chatBox = document.querySelector('#chatBox')

Swal.fire({
  title: 'Identificate',
  text: 'Ingresa tu Email',
  input: 'text',
  icon: 'question',
  inputValidator: (value) => {
    if (!value) {
      return 'Por favor, ingresa una dirección de correo electrónico'
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Por favor, ingresa una dirección de correo electrónico válida'
    }
  },
  allowOutsideClick: false
}).then((result) => {
  user = result.value
  socket.emit('new_user', user)
})

socket.on('messageLogs', (data) => {
  const log = document.querySelector('#messageLogs')
  const messages = data
    .map(
      (message) =>
        `<p class="user">${message.user} dice: <span class="message">${message.message}</span></p>`
    )
    .join('')
  log.innerHTML = messages
})

socket.on('user_connected', (data) => {
  Swal.fire({
    title: `${data} se acaba de conectar`,
    toast: true,
    position: 'top-right'
  })
})

chatBox.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user, message: chatBox.value })
      chatBox.value = ''
    }
  }
})

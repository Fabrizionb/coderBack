import { socketServer } from '../../socket/configure-socket.js'

// eslint-disable-next-line no-unused-vars
async function sendDelete (event) {
  event.preventDefault()
  const id = document.getElementById('form-id').value

  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    const p = document.getElementById('delete-id')
    p.innerText = `producto eliminado ${id}`
    console.log('Emitted productDeleted with ID:', id)
    socketServer.emit('productDeleted', id) // Emit del producto eliminado
  } else {
    const p = document.getElementById('delete-id')
    p.innerText = `producto con ${id} no encontrado`
  }

  // Borrar los valores de los campos del formulario
  document.getElementById('form-title').value = ''
}

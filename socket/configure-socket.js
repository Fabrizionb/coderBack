/* eslint-disable */
import { productModel } from '../models/product.model.js'
import { Server } from 'socket.io'
// import ProductManager from '../controller/productManager.js'
export let socketServer
export default function configureSocket (httpServer) {
  socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('Client connected with id:', socket.id)

    socket.on('productDeleted', (id) => {
      socketServer.emit('productDeletedServer', id)
      console.log("productDeletedServer emitido")
    })

    // Escuchar el mensaje 'productCreatedServer'
    socket.on('productCreated', (updateData, id) => {
      socketServer.emit('productCreatedServer', updateData, id)
      console.log("productCreatedServer emitido",updateData, id )    
    })

    // Escuchar el mensaje 'productModifyServer'
    socket.on('productModifyServer', (updateData) => {
      console.log('productModifyServer escuchado')

      const tableBody = document.getElementById('tableRealTime')
      const rows = tableBody.getElementsByTagName('tr')
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].id === updateData.id) {
          const cols = rows[i].getElementsByTagName('td')
          cols[0].innerText = updateData._id
          cols[1].innerText = updateData.title
          cols[2].innerText = updateData.description
          cols[3].innerText = updateData.category
          cols[4].innerText = updateData.price
          cols[5].innerText = updateData.status
          cols[6].innerText = updateData.stock
          break
        }
      }
    })







    
  })
}

// sintaxis
// socket.broadcast.emit('evento_para_socket_individual', "Solo recibira este mensaje el socket")
// socket.broadcast.emit('evento_para_todos_menos_actual', "Todos los socketes conectados menos el actual")
// socketServer.emit('evento_para_todos', "Este mensaje lo recibiran todos")

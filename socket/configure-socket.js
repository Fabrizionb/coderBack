import { Server } from 'socket.io'
export let socketServer
export default function configureSocket (httpServer) {
  socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('Client connected with id:', socket.id)

    socket.on('productDeleted', (id) => {
      socketServer.emit('productDeletedServer', id)
    })

    // Escuchar el mensaje 'productCreatedServer'
    socket.on('productCreated', (updateData, id) => {
      socketServer.emit('productCreatedServer', updateData, id)
    })

    // Escuchar el mensaje 'productModifyServer'
    socket.on('productModify', (updateData, id) => {
      socketServer.emit('productModifyServer', updateData, id)
    })
  })
}

// sintaxis
// socket.broadcast.emit('evento_para_socket_individual', "Solo recibira este mensaje el socket")
// socket.broadcast.emit('evento_para_todos_menos_actual', "Todos los socketes conectados menos el actual")
// socketServer.emit('evento_para_todos', "Este mensaje lo recibiran todos")

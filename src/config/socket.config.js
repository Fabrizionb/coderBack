import { Server } from 'socket.io'
import { chatModel } from '../Dao/models/chat.model.js'
import Logger from '../log/winston-logger.mjs'

export let socketServer

export default function configureSocket (httpServer) {
  socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    Logger.info('Client connected with id:', socket.id)

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

    // Chat / Mensajes
    socket.on('message', async (data) => {
      const { user, message } = data
      const newMessage = new chatModel({ user, message })
      await newMessage.save()
      socketServer.emit('messageLogs', await chatModel.find())
    })

    socket.on('new_user', async (data) => {
      const messages = await chatModel.find({ user: data })
      socket.emit('messageLogs', messages)
      socket.broadcast.emit('user_connected', data)
    })
  })
}

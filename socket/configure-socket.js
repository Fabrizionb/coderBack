/* eslint-disable */
import { Server } from 'socket.io'
export let socketServer
export default function configureSocket (httpServer) {
  socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('Client connected with id:', socket.id)
  })

  socketServer.on('productCreated', (obj) => {
    console.log('producto agregado', obj)

    // socket.on('nombre_mensaje', (data) => {
    //   console.log('data enviada en nombre_mensaje')
    // })

    // socket.on('prueba_emision', (data) => {
    //   socket.emit('evento_indiviudal',
    //     'mensaje solo para el que envia el mensaje'
    //   )

    //   socket.broadcast.emit('evento_para_el_resto',
    //     'mensaje para todos salvo para el que envia'
    //   )

    //   io.emit('evento_para_todos',
    //     'todos van a recibir este mensaje'
    //   )
    // })

    
  })

  socketServer.on('productDeleted', (id) => {
    console.log('producto eliminado', id)



    
  })

}

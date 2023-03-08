/* eslint-disable */
import { Server } from 'socket.io'
import ProductManager from "../controller/productManager.js"
export let socketServer
export default function configureSocket (httpServer) {
  socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('Client connected with id:', socket.id)

      socket.on('productDeleted', (id) => {
      socketServer.emit('productDeletedServer', id)
    })
    socket.on('productCreated', async (obj) => {
      const productManager = new ProductManager("./data/products.json")
      const updateData = await productManager.getProducts()
      socketServer.emit('productCreatedServer', updateData)
    })
    socket.on('productModify', async (obj) => {
      const productManager = new ProductManager("./data/products.json")
      const updateData = await productManager.getProducts()
      socketServer.emit('productModifyServer', updateData)
    })
   
  })

}





 //sintaxis
    //socket.broadcast.emit('evento_para_socket_individual', "Solo recibira este mensaje el socket")
    //socket.broadcast.emit('evento_para_todos_menos_actual', "Todos los socketes conectados menos el actual")
    //socketServer.emit('evento_para_todos', "Este mensaje lo recibiran todos")
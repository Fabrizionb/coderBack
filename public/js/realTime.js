import { socketServer } from '../../socket/configure-socket'

socketServer.emit('productDeleted', 'Eliminado desde realTime.js')

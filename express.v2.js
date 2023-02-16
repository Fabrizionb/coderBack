// Uso practico req.params
// la ruta / devuelve todos los usuarios en data/usuarios.js
// la ruta /:id devuelve solo el usuario con ese id dentro de todos los usuarios en data/usuarios.js

import express from 'express'
import usuarios from './data/usuarios.js'
const app = express()

app.get('/', (req, res) => {
  res.send(usuarios)
})

app.get('/:userId', (req, res) => {
  const { userId } = req.params
  const usuario = usuarios.find((usuario) => usuario.id === Number(userId))

  if (!usuario) {
    res.send({ error: `User with id ${userId} not found` })
  } else {
    res.send({ usuario })
  }
})

const port = 8080
app.listen(port, () => console.log('escuchando puerto 8080'))

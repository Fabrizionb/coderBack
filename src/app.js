import express from 'express'
import usuarios from './data/usuarios.js'
const app = express()
app.use(express.urlencoded({ extended: true }))

// Filtra por genero
// app.get("/", (req, res) => {
//   const query = req.query;
//   const genderQ = query.gender;

//   if (genderQ !== "male" && genderQ !== "female") {
//     res.send({ usuarios });
//     return;
//   }

//   const filtered = usuarios.filter((u) => u.gender === genderQ);
//   res.send({ filtered });
// });

// Filtrado generico
app.get('/', (req, res) => {
  const query = req.query
  const entries = Object.entries(query)

  if (entries.length === 0) {
    return res.send({ usuarios })
  }

  const filtrados = usuarios.filter((u) => {
    return entries.every(([clave, valor]) => u[clave] == valor)
  })

  res.send({ usuarios: filtrados })
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

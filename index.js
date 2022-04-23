const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'build/index.html'));
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/info', (request, response) =>{
   
    response.send(`<h3>Phonebook has Info of ${persons.length} persons </h3>
    <p>${new Date()}</p>`)

})



const generateId = () => {
    const nextId = persons.length > 0
      ? Math.floor(Math.random() * 10000) + 1
      : 0

    return nextId
  }
  

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'data missing' 
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    persons = persons.concat(person)
  
    response.json(person)
    
  })



app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
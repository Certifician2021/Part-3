const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./mongo')
const path = require('path')
require('dotenv').config()


app.use(cors())
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

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'build/index.html'));
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedperson => {
      response.json(updatedperson)
    })
    .catch(error => console.log(error.name))
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result=> response.json(result))
})


app.get('/info', (request, response) =>{
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  Person.find({}).then(persons => {
      response.send(
          `
          <div>
              <p>Phonebook has info for ${persons.length} people</p>
          </div>
          <div>
              <p>${currentDate} (${timeZone})</p>
          </div>`
      )
      })

})
  

  app.post('/api/persons', (request, response) => {
    const body = request.body


    const person = new Person ({
      name: body.name,
      number: body.number
    }
    )
   person.save(person).then(person => {
     response.json(person)
   }).catch(error => console.log(error.name))
    
  })



app.get('/api/persons/:id', (request, response) => {  
  Person.findById(request.params.id).then(res=>{
      if(res){
        response.json(res)
      }else{
        response.status(404).end()
      }
    }).catch(error => console.log(error.name))
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => console.log(error.name))
  })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./mongo');
const path = require('path');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());


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

app.get('/', (request, response, next) => {
  response.sendFile(path.join(__dirname, 'build/index.html')).catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedperson => {
      response.json(updatedperson)
    }).catch(error => next(error))
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=> response.json(persons)).catch(error=>next(error))
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
  

  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person ({
      name: body.name,
      number: body.number
      })
      
    person.validateSync()

   person.save(person).then(person => {
     response.json(person)
   }).catch(error => next(error))
    
  })



app.get('/api/persons/:id', (request, response, next) => {  
  Person.findById(request.params.id).then(res=>{
      if(res){
        response.json(res)
      }else{
        response.status(404).end()
      }
    }).catch(error => next(error))
  })


  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  
    next(error)
  }

  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
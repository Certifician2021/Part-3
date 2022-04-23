const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./db/mongo')


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
    .catch(error => next(error))
})


app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'build/index.html'));
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result=>{
       response.json(result)
  })
})


app.get('/info', (request, response) =>{
    response.send(`<h3>Phonebook has Info of ${Person.length} persons </h3>
    <p>${new Date()}</p>`)

})
  

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'data missing' 
      })
    }

    const person = new Person ({
      name: body.name,
      number: body.number
    }
    )
   person.save(person).then(person => {
     response.json(person)
   })
    
  })



app.get('/api/persons/:id', (request, response) => {  
  Person.findById(request.params.id).then(res=>{
      if(res){
        response.json(res)
      }else{
        response.status(404).end()
      }
    }).catch(err=>{
      console.log(err)
      response.status(400).send({error: "malformatted id"})
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

// middleware
// Configure morgan so that it also shows the data sent in HTTP POST requests:
// in order to custom log formats, we create our own tokens.
// https://javascript.plainenglish.io/easy-logging-with-the-morgan-express-middleware-4569182ffda4
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

// data
let persons = [
    { 
        "id": 1,
        "name": "Ruby Granger", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Leah Wei", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Moya Mawhinney", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Alex Bondoc", 
        "number": "39-23-6423122"
    }
]

// routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    console.log(persons)
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people </p> <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end() // we didn't find the person
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * (10000 - 0 + 1) + 0)
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }

    const nameAlreadyInPhonebook = persons.map(person => {
        if (person.name === body.name) return true
        else return false
    })
    const exists = nameAlreadyInPhonebook.some(value => value === true)
 
    if (exists === true) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
  
    // ready to add person in phoebook
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

//middleware

// unknownEndpoint: middleware after our routes, that is used for catching 
//requests made to non-existent routes. For these requests, the middleware
// will return an error message in the JSON format.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

// port
const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



// npm start

// process:
// npm install express
// npm install --save-dev nodemon
// put "dev": "nodemon index.js", on scripts in package.json
// npm run dev

//npm install morgan
// npm install cors

// The primary purpose of the backend server in this course is to
//  offer raw data in the JSON format to the frontend.

/* Middleware functions have to be taken into use before routes if we want them 
to be executed before the route event handlers are called. There are also situations
 where we want to define middleware functions after routes. In practice, this means 
 that we are defining middleware functions that are only called if no route handles 
 the HTTP request.*/

 // p3c:
 // npm install mongoose
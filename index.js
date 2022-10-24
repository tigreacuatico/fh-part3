const express = require('express')
const app = express()

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
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
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      content: body.content,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})
  
const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



// process:
// npm install express
// npm install --save-dev nodemon
// put "dev": "nodemon index.js", on scripts in package.json
// npm run dev

// The primary purpose of the backend server in this course is to
//  offer raw data in the JSON format to the frontend. 
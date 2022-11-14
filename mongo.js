const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tigreacuatico:${password}@cluster0.un3163x.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        // process.argv = node mongo.js yourpassword
        if (process.argv.length === 3) {
            // display all the entries in the phonebook
            console.log('phonebook:')
            Person.find({}).then(persons => {
                persons.forEach(person => console.log(`${person.name} ${person.number}`))
                return mongoose.connection.close()
            })
        }
        // process.argv = node mongo.js yourpassword Anna 040-1234556
        else {
            //  save new entry to the phonebook, therefore to the database
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })
            return person.save().then(result => {
                console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
                return mongoose.connection.close()
            })
        }     
    })
    .catch((err) => console.log(err))


//npm install mongoose
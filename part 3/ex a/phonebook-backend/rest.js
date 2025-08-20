const express = require("express")
const morgan = require('morgan')
const app = express()
app.use(morgan('dev'))

let person = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/person', (req, res) => {
    res.json(person)
})

app.get('/info', (req, res) => {
    const totalPerson = person.length
    const now = new Date();
    res.send(`<p> PhoneBook has info for ${totalPerson} people </p> <p>${now}</p>`)
})

app.get('/api/person/:id', (req, res) => {
    const id = Number(req.params.id)
    const result = person.find((p) => p.id === id)
    if (result) {
        res.json(result)
    } else {
        res.status(404).end()
    }
})

app.post('/api/person', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: `Missing field(s): ${!body.name ? 'name' : ''} ${!body.number ? 'number' : ''}`.trim()
        })
    }

    if(isName(body.name)){
        return  res.status(400).json({
            error: 'name must be unique'
        })
    }

    const build = {
        id: newId(),
        name: body.name,
        number: body.number
    }

    person = person.concat(build)
    res.json(build)
})

const newId = () => {
    return Math.floor(Math.random() * 10000) + 1
}

const isName = (name) => {
  return person.find((p) => p.name === name)
}


app.delete('/api/person/:id', (req, res) => {
    const id = Number(req.params.id)
    const result = person.find((p) => p.id === id)
    if (!result) {
        return res.status(404).end()
    }
    person = person.filter((p) => p.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server runing ${PORT}`)
})

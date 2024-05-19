import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

//applies cors and bodyparser middleware

app.use(cors())
app.use(bodyParser.json());

const port = 3000
//retrieves mongodb url using process.env, connection should be stored in .env file
const mongourl = process.env.MONGO_URL
//new mongoclient with the mongourl connection
const mongoclient = new MongoClient(mongourl, {});

//connects to the database basically
mongoclient.connect().then(() => {
    console.log('Connected to MongoDB')
})

app.get('/', (req, res) => {
    res.send('/')
})

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

//this just gets the database
app.get('/todos', async (req, res) => {
    try {
        //await to wait for asynchronous operation to complete
        //.find specifies that all documents in the collection should be return 
        const todos = await mongoclient.db('todo-list').collection('todo').find({}).toArray()
        res.status(200).json(todos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error'})
    }
})

app.post('/add-todo', async (req, res) => {
    try{
        const todo = req.body

        if (!todo.name || Object.keys(todo).length !== 1) {
            res.status(400).json({ message: 'bad request'})
            return
        }
        todo.checked = false;
        await mongoclient.db('todo-list').collection('todo').insertOne(todo)
        res.status(201).json({ message: 'success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error'})
    }
})

app.post('/delete-todo', async(req, res) => {
    try{
        const todo = req.body

        //making sure it only has "name field"
        if (!todo.name || Object.keys(todo).length !==1) {
            res.status(400).json({ message: 'bad request' })
            return
        }

        await mongoclient.db('todo-list').collection('todo').deleteOne(todo)
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error'})
    }
})

app.post('/checked-todo', async(req, res) => {
    try{
        const { name, checked } = req.body;
        if (typeof name !== 'string' || typeof checked!== 'boolean') {
            return res.status(400).json({ message: 'bad request'});
        }

        await mongoclient.db('todo-list').collection('todo').updateOne({ name }, { $set: { checked } });
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
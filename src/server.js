require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const { db } = require('./firebase.js')

//console.log(process.env);

const app = express();
const port = process.env.PORT || 3004;
const hostname = process.env.HOST_NAME;

//config template engine
configViewEngine(app);

//Khai bao router
app.use('/', webRoutes);


app.use(express.json())

const friends = {
    'james': 'friend',
    'larry': 'friend',
    'lucy': 'friend',
    'banana': 'enemy',
}

app.get('/friends', async (req, res) => {
    const peopleRef = db.collection('people').doc('associates')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.sendStatus(400)
    }

    res.status(200).send(doc.data())
})

app.get('/friends/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in friends)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: friends[name] })
})

app.post('/addfriend', async (req, res) => {
    const { name, status } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: status
    }, { merge: true })
    // friends[name] = status
    res.status(200).send(friends)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})



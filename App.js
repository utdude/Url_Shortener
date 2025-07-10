const express = require('express');
const model = require('./Model');
const db = require('./Connection');
const bodyParser = require("body-parser");
const app = express();

db();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/Shorten', (req, res) => {
    const {url} = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const rand =  Math.random().toString(36).substring(2, 8);

    const today = new Date();

    model.create({originalUrl:url, shortCode: rand, createdAt:today});
})

app.get('/short.ly/:shortCode', async (req, res) => {
    const {shortCode} = req.params;

    const data = await model.findOne({shortCode: shortCode});

    if (!data) {
        return res.status(404).json({ error: 'Invalid URL' });
    }
    res.json(data.originalUrl);
    res.redirect(301, data.originalUrl);
})

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.listen(3000);


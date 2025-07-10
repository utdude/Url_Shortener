const express = require('express');
const model = require('./Model');
const db = require('./Connection');
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

db();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/Shorten', (req, res) => {
    const {url} = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const rand =  Math.random().toString(36).substring(2, 8);

    const today = new Date();

    model.create({originalUrl:url, shortCode: rand, createdAt:today});

    return res.json({ originalUrl: url, shortenUrl: 'short.ly/'+rand });
})

app.get('/short.ly/:shortCode', async (req, res) => {
    const {shortCode} = req.params;

    const data = await model.findOne({shortCode: shortCode, expiry: { $gt: new Date() }});

    if (!data) {
        return res.status(404).json({ error: 'Invalid URL Or Expired.' });
    }
    res.redirect(301, data.originalUrl);
})

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.listen(process.env.PORT || 3000, () => {});


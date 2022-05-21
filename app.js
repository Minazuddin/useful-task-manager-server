const path = require('path')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

//Whenever user hits /, it auto redirects to /users/taskManager
app.get(['/'], (req, res) => {
    return res.redirect('/users/taskManager')
})

//Making the public folder static, to server index.html
app.use('/', express.static(path.join(__dirname + '/public')))

//defining route for taskManager
app.use('/users/taskManager', require('./routers/taskManager'))

module.exports = app;
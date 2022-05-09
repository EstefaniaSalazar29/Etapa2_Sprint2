const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();

//Middewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'pages')))

//variables
app.set('PORT', process.env.PORT)

app.get('', (req, res)=> {
    res.sendFile(path.join(__dirname, "pages/index.html"))
})

//escuchador del proyecto
app.listen(app.get('PORT'), ()=> {
    console.log(`server running in port: ${app.get('PORT')}`)
})

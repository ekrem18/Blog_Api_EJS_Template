"use strict"
/* -------------------------------------------------------*/
/*
 * $ npm init -y
 * $ npm i express dotenv express-async-errors
 * $ npm i mongoose
*/

const express = require('express')
const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 8000

/* ------------------------------------------------------- */
// SessionCookies:
//* $ npm i cookie-session
const session = require("cookie-session")                           //---> ejs varsa JWT vs yok. cookie ile güvenlik sağlıyoruz
app.use(session({ secret: process.env.SECRET_KEY || 'secret_keys_for_cookies' }))
/* ------------------------------------------------------- */
//Template   ---> npm i ejs
const ejs = require('ejs')                                          //---> ejs ayarları ile değişiklik yapacaksam require ederim. yoksa gerek yok
ejs.openDelimiter = '{'
ejs.closeDelimiter = '}'                                            //---> {% ...kod... %}

app.set('view engine', 'ejs')
app.set('views', './public')





/* ------------------------------------------------------- */
// Accept form data & convert to object:
app.use(express.urlencoded( {extend: true }))                       //---> Json veride olduğu gibi Form'dan geleni de kabul et demem için bunu çağırıyorum          

// Accept json data & convert to object:
app.use(express.json())

// Connect to MongoDB with Mongoose:
require('./src/dbConnection')

// Searching&Sorting&Pagination:
app.use(require('./src/middlewares/findSearchSortPage'))

// HomePage:
app.all('/', (req, res) => {
    res.send('WELCOME TO BLOG API')
})

// Routes:
app.use('/user', require('./src/routes/userRoute'))
app.use('/blog', require('./src/routes/blogRoute'))

/* ------------------------------------------------------- */
// Synchronization:
// require('./src/sync')()

// errorHandler:
app.use(require('./src/errorHandler'))

app.listen(PORT, () => console.log('Running: http://127.0.0.1:' + PORT))
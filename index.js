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

// Accept form data & convert to object:
app.use(express.urlencoded({ extended: true }))                     //---> Json veride olduğu gibi Form'dan geleni de kabul et demem için bunu çağırıyorum  

// Statik Dosya Çağırma
app.use('/assets', express.static('./public/assets'))               //---> blogControllerView 27.satır



/* ------------------------------------------------------- */
// Accept json data & convert to object:
app.use(express.json())

//tinymce statik çaĞIRMA
app.use('/tinymce', express.static('./node_modules/tinymce'))

// Connect to MongoDB with Mongoose:
require('./src/dbConnection')

// Searching&Sorting&Pagination:
app.use(require('./src/middlewares/findSearchSortPage'))

// Routes:
app.use('/api/user', require('./src/routes/userRoute'))
app.use('/api/blog', require('./src/routes/blogRoute'))
app.use('/', require('./src/routes/view'))

/* ------------------------------------------------------- */
// Synchronization:
// require('./src/sync')()

// errorHandler:
app.use(require('./src/errorHandler'))

app.listen(PORT, () => console.log('Running: http://127.0.0.1:' + PORT))
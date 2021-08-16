const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const { userSignup, userLogin } = require('./src/users')    // import functions here

const app = express()
app.use(cors())
app.use(express.json())

// routes go here
app.post('/signup', userSignup)
app.post('/login', userLogin)

exports.app = functions.https.onRequest(app)
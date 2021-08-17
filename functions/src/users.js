const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const creds = require('../credentials.json')    // import credentials
const secret = require('../secrets')

function connectDb() {
  if(!admin.apps.length) {    // check to see if we havent connected already
    admin.initializeApp({       // initializes the app
      credential: admin.credential.cert(creds)     // creates the certificate for your API key
    })
  }
  return admin.firestore()
}

exports.userSignup = (req, res) => {
  // check to see that email and password is present in the request
  if(!req.body || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'Invalid Request: missing email or password',
      status: 400,
      success: false
    })
    return
  }
  // connect to the database
  const db = connectDb()
  // if valid, then insert into database and return success
  db.collection('users')
    .doc(req.body.email.toLowerCase())
    .set(req.body)
    .then(() => {
      const token = jwt.sign({ email: req.body.email }, secret)
      res.send({
        message: 'User created succesfully',
        status: 200,
        success: true,
        token: token
      })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error: ' + err.message,
        status: 500,
        success: false
      })
    })
}

exports.userLogin = (req, res) => {
// check that email and password present
if(!req.body || !req.body.email || !req.body.password) {
  res.status(400).send({
    message: 'Invalid Request: missing email or password',
    status: 400,
    success: false
  })
  return
}
// connect to database
  const db = connectDb()
// check to see if user exists with email and password
db.collection('users')
  .where('email', '==', req.body.email.toLowerCase())
  .where('password', '==', req.body.password)
  .get()
  .then(userCollection => {
    if(userCollection.docs.length) {
      let user = userCollection.docs[0].data()
      user.password = undefined
      //create a token for the user
      const token = jwt.sign(user, secret)
      res.send({
        message: 'User logged in successfully',
        status: 200,
        success: true,
        token: token
      })
    } else {
      res.status(401).send({
        message: 'Invalid email or password',
        status: 401,
        success: false
      })
    }
  })
  .catch(err => {
    res.status(500).send({
      message: 'Error: ' + err.message,
      status: 500,
      success: false
    })
  })
}
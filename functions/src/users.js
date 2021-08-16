const admin = require('firebase-admin')
const creds = require('../credentials.json')    // import credentials

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
      res.send({
        message: 'User created succesfully',
        status: 200,
        success: true
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
  res.send('ok')
}
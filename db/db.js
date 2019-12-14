const admin = require('firebase-admin');
const key = require('./key.js');

admin.initializeApp({
  credential: admin.credential.cert(key)
});

const db = admin.firestore();

module.exports = db;
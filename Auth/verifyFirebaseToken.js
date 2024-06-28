// Auth/verifyFirebaseToken.js

const admin = require('firebase-admin');

async function verifyFirebaseToken(req, res, next) {

  try{
  const idToken = req.headers.authorization.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }

  try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
      } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(403).send('Unauthorized');
      }

  }catch(error)
  {
    console.log(error.message);
    res.send(error.message);
  }

}

module.exports = verifyFirebaseToken;

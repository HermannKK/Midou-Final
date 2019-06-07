const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.firestore
  .document("Notifications/{document}")
  .onCreate((snapshot,context) => {
    // gets standard JavaScript object from the new write
    const data = snapshot.data();
    // access data necessary for push notification 
    const recipient = data.recipient.token;
    const title = data.recipient.title;
    const body = data.recipient.body;

    let payload = {
      notification: {
      title: title,
      body: body,
      sound:'default',
     }
    }  
    return admin.messaging().sendToDevice(recipient, payload);
});

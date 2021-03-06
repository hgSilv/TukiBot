// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// jokeBot: gets random joke from database
exports.getRandomJoke = functions.https.onRequest(async (req, res) => {
    let jokeCollection = [];

    const documents = await admin.firestore().collection('jokes').get();
    documents.forEach(doc => jokeCollection.push(doc.data()));

    const random = Math.floor(Math.random() * jokeCollection.length); //get random index from collection
    const joke = jokeCollection[random];

    res.send(joke);
});

exports.getReminders = functions.https.onRequest(async (req, res) => {
    let reminderCollection = [];

    const documents = await admin.firestore().collection('reminders').get();
    documents.forEach(doc => reminderCollection.push({
        id: doc.id,
        data: doc.data()
    }));


    res.send(reminderCollection);
});

exports.newReminder = functions.https.onRequest(async (req, res) => {
    console.log(req.body);
    const {
        id
    } = await admin.firestore().collection('reminders').add({
        description: req.body.description,
        date: admin.firestore.Timestamp.fromDate(new Date(req.body.timestamp)),
        channel: req.body.channel
    });

    console.log(id);

    res.status(201).send({
        id: id,
        body: req.body
    });
});

exports.deleteReminder = functions.https.onRequest(async (req, res) => {
    const response = await admin.firestore().collection('reminders').doc(req.query.doc).delete();
    console.log(response);
    res.send(response);
});


//// ==================== EXAMPLES ====================
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({
//         original: original
//     });
//     // Send back a message that we've successfully written the message
//     res.json({
//         result: `Message with ID: ${writeResult.id} added.`
//     });
// });

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//         // Grab the current value of what was written to Firestore.
//         const original = snap.data().original;

//         // Access the parameter `{documentId}` with `context.params`
//         functions.logger.log('Uppercasing', context.params.documentId, original);

//         const uppercase = original.toUpperCase();

//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to Firestore.
//         // Setting an 'uppercase' field in Firestore document returns a Promise.
//         return snap.ref.set({
//             uppercase
//         }, {
//             merge: true
//         });
//     });
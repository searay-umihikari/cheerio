let firebase = require('firebase')

var config = {

};

firebase.initializeApp(config)

let db = firebase.database()
const rootRef = db.ref()

const oneRef = rootRef.child('act').orderByChild('blood').equalTo('O').once('value').then((data)=>{
  console.log(data.val())
})

// return db.ref('/act/').once('value').then(function(snapshot) {
//   console.log(snapshot.child('name').val())
// });

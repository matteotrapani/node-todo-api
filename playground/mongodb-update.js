const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate(
    {
      _id: new ObjectID("5a8eda6b96f58336e0ed238a")
    }, {
      $set: {
        completed: true
      }
    }, 
    {
      returnOriginal: false
    })
    .then(result => {
    console.log(result);
  })

  // client.close();
});

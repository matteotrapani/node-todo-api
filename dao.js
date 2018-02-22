const {MongoClient, ObjectID} = require('mongodb');

module.exports.findUser = (name) => {
  console.log(name);
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp');

    db.collection('Users').find({name}).toArray().then((users) => {
      if (users.length == 0) {
        console.log(`No user found with name ${name}`);
      } else {
        console.log(`Users with name ${name}`);
        console.log(JSON.stringify(users, undefined, 2));
      }
    }, (err) => {
      console.log('Unable to fetch Users', err);
    });


    // client.close();
  });
}

module.exports.delete = (name) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp');

    db.collection('Users').find({name}).toArray().then(users => {
      if (users.length == 0) {
        console.log(`No user found with name ${name}`);
      } else {
        console.log(JSON.stringify(users, undefined, 2));
        users.forEach(user => {
          db.collection('Users').findOneAndDelete({_id: new ObjectID(user._id)}).then(result => {
            console.log(result);
            console.log(`${result.value._id} - ${result.value.name} DELETED`);
          })
        });
      }
    }, err => {
      console.log('Unable to delete Users');
    });

    // client.close();
  });
}

module.exports.deleteAll = (name) => {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')

    const db = client.db('TodoApp');

    // deleteMany
    db.collection('Users').deleteMany({name}).then(result => {
      console.log(result);
    }, err => {
      console.log('Unable to delete Users');
    });

    // client.close();
  });
}

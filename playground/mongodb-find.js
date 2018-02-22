const yargs = require('yargs');

const argv = yargs
  .options({
    n: {
      demand: true,
      alias: 'name',
      address: 'Name to search for',
      string: true,
      default: ''
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp');

  // db.collection('Todos').find({_id: new ObjectID("5a7cd975de9dcc2f6c274875")}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch Todos', err);
  // });
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch Todos', err);
  // });

  var name = argv.name;
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

const {MongoClient, ObjectID} = require('mongodb');
const yargs = require('yargs');
const dao = require('./dao.js');

const name = {
  describe: 'Name to search for or new name to set',
  demand: true,
  alias: 'n'
};
const age = {
  describe: 'Age of the user',
  demand: true,
  alias: 'a'
};
const location = {
  describe: 'Location of the user',
  demand: true,
  alias: 'l'
};

const old = {
  describe: 'Name to search for',
  demand: true,
  alias: 'o'
};

const index = {
  describe: 'Age increment to apply',
  alias: 'i',
  default: 1
};

const argv = yargs
  // .command('add', 'Add a new ToDo', {
  //   title,
  //   body
  // })
  // .options(optionName)
  // .command('list', 'Fetches all notes')
  .command('insert', 'Inserts a user', {
    name,
    age,
    location
  })
  .command('find', 'Finds a user', {
    name
  })
  .command('delete', 'Removes a user', {
    name
  })
  .command('deleteMany', 'Removes a user', {
    name
  })
  .command('update', 'Updates a user', {
    old,
    name,
    index
  })
  .help()
  .alias('help', 'h')
  .argv;

var command = argv._[0];

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp');
  const collection = db.collection('Users');

  if (command === 'insert') {
    dao.insert(collection, {
      name: argv.name,
      age: argv.age,
      location: argv.location
    });
  } else if (command === 'find') {
    dao.findUser(collection, argv.name);
  } else if (command === 'delete') {
    dao.delete(collection, argv.name);
  } else if (command === 'deleteMany') {
    dao.deleteAll(collection, argv.name);
  } else if (command === 'update') {
    dao.update(collection, argv.old, argv.name, argv.index);
  } else {
    console.log(`"${command}" not recognized`)
  }

  // client.close();
});

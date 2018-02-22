const yargs = require('yargs');
const dao = require('./dao.js');

const name = {
  describe: 'Name to search for',
  demand: true,
  alias: 'n'
};


const argv = yargs
  // .command('add', 'Add a new ToDo', {
  //   title,
  //   body
  // })
  // .options(optionName)
  // .command('list', 'Fetches all notes')
  .command('find', 'Finds a user', {
    name
  })
  .command('delete', 'Remove a user', {
    name
  })
  .command('deleteMany', 'Remove a user', {
    name
  })
  .help()
  .alias('help', 'h')
  .argv;

var command = argv._[0];

if (command === 'find') {
  dao.findUser(argv.name);
} else if (command === 'delete') {
  dao.delete(argv.name);
} else if (command === 'deleteMany') {
  dao.deleteAll(argv.name);
} else {
  console.log(`"${command}" not recognized`)
}

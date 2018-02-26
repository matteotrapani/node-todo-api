const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(result => {
//    console.log(result);
// });

// Todo.findOneAndRemove({}).then(doc => {

// })

Todo.findByIdAndRemove('6a93d4b209500347dc0febb2').then(todo => {
    console.log(todo);
});
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var _id = '5a8fdc13b04ea1326c9dd46a';

// Todo.find({ _id }).then(todos => console.log('Todos', JSON.stringify(todos, undefined, 2)));

// Todo.findOne({ _id }).then(todo => console.log('Todo', JSON.stringify(todo, undefined, 2)));

// Todo.findById(_id).then(todo => {
//     if (!todo)
//         console.log('ID not found!');
//     console.log('Todo by ID', JSON.stringify(todo, undefined, 2))
// }).catch(e => console.log(e));;

User.findById(_id).then(user => {
    if (!user)
        return console.log('User not found');
    console.log('User by ID', JSON.stringify(user, undefined, 2));
}, e => console.log(e));
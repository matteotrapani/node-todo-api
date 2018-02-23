const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var saveOnSuccess = doc => {
    console.log(JSON.stringify(doc, undefined, 2));
};

var saveOnError = err => {
    console.log('Unable to save Todo');
};

// var newTodo = new Todo({
//     text: 'Exercise 1',
// });

// newTodo.save().then(doc => {
//     console.log('Saved Todo', doc);
// }, err => {
//     // console.log(err);
//     console.log('Unable to save Todo');
// });

var newTodo = new Todo({
    text: 'Exercise 1',
    completed: true,
    completedAt: 123
});

newTodo.save().then(saveOnSuccess, saveOnError);

newTodo = new Todo({
    text: 'Exercise 2 - fail',
    completed: true,
    completedAt: "test"
});

newTodo.save().then(saveOnSuccess, saveOnError);
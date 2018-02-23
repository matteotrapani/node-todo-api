const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var saveOnSuccess = doc => {
    console.log(JSON.stringify(doc, undefined, 2));
};

var saveOnError = err => {
    console.log('Unable to save Todo', err);
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

// var newTodo = new Todo({
//     text: 'Check your code!!!'
// });

// newTodo.save().then(saveOnSuccess, saveOnError);

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

var newUser = new User({
});

newUser.save().then(saveOnSuccess, saveOnError);
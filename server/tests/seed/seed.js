const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const dummyTodos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const dummyUsers = [{
    _id: userOneId,
    email: 'test@example.com',
    password: 'test123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'test2@example.com',
    password: 'test123'
}];

const populateTodos = (done) => {
        return Todo.remove({}).then(() => {
            return Todo.insertMany(dummyTodos);
        }).then(() => done());
};

const populateUsers = (done) => {
    return User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();
        var userTwo = new User(dummyUsers[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {
    dummyTodos,
    dummyUsers,
    populateTodos,
    populateUsers
}
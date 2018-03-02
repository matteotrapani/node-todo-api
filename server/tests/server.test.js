const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

var _id = new ObjectID();
var _id2 = new ObjectID();
const dummyTodos = [{
    _id,
    text: 'first test todo'
}, {
    _id: _id2,
    text: 'second test todo',
    completed: true,
    completedAt: 333
}]

const dummyUsers = [{
    _id,
    email: 'test@example.com',
    password: 'test123'
}, {
    _id: _id2,
    email: 'test2@example.com',
    password: 'test123'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos);
    }).then(() => done());

    User.remove({}).then(() => {
        return User.insertMany(dummyUsers);
    }).then(() => done());
})

describe('POST /todos', () => {
    test('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) 
                    return done(err);
                
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });
    });

    test('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
                done();
            }).catch(e => done(e));
    })
});

describe('GET /todos/:id', () => {
    it('should get specific todo', (done) => {
        request(app)
            .get(`/todos/${_id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
                done();
            }).catch(e => done(e));
    });

    it('should check invalid ObjectID', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
    
    it('should pass a not existing ID and return no todo', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove specific todo', (done) => {
        var hexId = _id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(_id).then(todo => {
                    expect(todo).toBeFalsy();
                    done();
                })
                    .catch(e => done(e));
            })
    });

    it('should check invalid ObjectID and return 404', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
    
    it('should pass a not existing ID and return no todo with code 404', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a specific todo, setting completed to true and completedAt value', (done) => {
        var hexId = _id.toHexString();
        var text = "test";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: true})
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
                done();
            }).catch(e => done(e));
    });

    it('should update a specific todo, setting completed to false and clear completedAt value', (done) => {
        var hexId = _id2.toHexString();
        var text = "test";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: false})
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
                done();
            }).catch(e => done(e));
    });

    it('should check invalid ObjectID and return 404', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
    
    it('should pass a not existing ID and return no todo with code 404', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect(res => {
                expect(res.body).toEqual({});
                done();
            }).catch(e => done(e));
    });
});

describe('POST /users', () => {

    var userRequest = {
        email: 'request@exam.com',
        password: 'password'
    }
    test('should create a new user', (done) => {
        request(app)
            .post('/users')
            .send(userRequest)
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(userRequest.email);
            })
            .end((err, res) => {
                if (err) 
                    return done(err);
                
                User.find({
                    email: userRequest.email
                }).then(users => {
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe(userRequest.email);
                    done();
                }).catch(e => done(e));
            });
    });

    test('should not create users with invalid body data', (done) => {
        request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });

    test('should not create users with same email', (done) => {
        request(app)
            .post('/users')
            .send(userRequest)
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(userRequest.email);
            })
            .end((err, res) => {
                if (err) 
                    return done(err);
                
                User.find({
                    email: userRequest.email
                }).then(users => {
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe(userRequest.email);
                }).catch(e => done(e));
            });
            request(app)
                .post('/users')
                .send(userRequest)
                .expect(400)
                .end((err, res) => {
                    if (err) 
                        return done(err);
                    
                    User.find({
                        email: userRequest.email
                    }).then(users => {
                        expect(users.length).toBe(1);
                        expect(users[0].email).toBe(userRequest.email);
                        done();
                    }).catch(e => done(e));
                });
    });

    test('should not create users with invalid email', (done) => {
        request(app)
            .post('/users')
            .send({email: 'aaa'})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                User.find().then(users => {
                    expect(users.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });

    test('should not create users with invalid password', (done) => {
        request(app)
            .post('/users')
            .send({email: 'example@test.com', password: ''})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                User.find().then(users => {
                    expect(users.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, dummyUsers, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
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
        var hexId = dummyTodos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(dummyTodos[0]._id).then(todo => {
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
        var hexId = dummyTodos[0]._id.toHexString();
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
        var hexId = dummyTodos[1]._id.toHexString();
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

describe('GET /users/me', () => {
    test('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.user.email).toBe(dummyUsers[0].email);
                expect(res.body.user._id).toBe(dummyUsers[0]._id.toHexString());
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                done();
            });
    });

    test('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if (err)
                    done(err);
                done();
            });
    })
});

describe('POST /users/login', () => {
    test('should login and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: dummyUsers[1].email,
                password: dummyUsers[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(dummyUsers[1].email);
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) 
                    return done(err);
                
                User.findById(dummyUsers[1]._id).then(user => {
                    expect(user.email).toBe(dummyUsers[1].email);
                    expect(user.tokens.length).toBe(1);
                    expect(user.tokens[0]).toEqual(expect.objectContaining({
                        access: 'auth',
                        token: res.headers['x-auth']
                    }));
                    done();
                }).catch(e => done(e));
            });
    });

    test('should not login with invalid data', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'email@test.com',
                password: dummyUsers[1].password
            })
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) 
                    return done(err);
                done();
                User.findById(dummyUsers[1]._id).then(user => {
                    expect(user.email).toBe(dummyUsers[1].email);
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should logout user if logged', (done) => {
        var token = dummyUsers[0].tokens[0].token;
        request(app)
            .delete(`/users/me/token`)
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                User.findById(dummyUsers[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            })
    });
});
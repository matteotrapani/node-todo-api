const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummyTodos = [{
    text: 'first test todo'
}, {
    text: 'second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos)
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
})
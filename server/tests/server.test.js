const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

let {app} = require('./../server.js');
let {toDo} = require('./../models/toDo.js');


let testToDos = [{
    _id: new ObjectID(),
    text: 'Text1'
}, {
    _id: new ObjectID(),
    text: 'Text2',
    completed: true,
    completedAt: 123
}];

beforeEach((done) => {
    toDo.deleteMany({}).then(() => {
        return toDo.insertMany(testToDos);
    }).then(() => done());
});

describe('POST', () => {
    it('Should return a new to-do', (done) => {
        let text = 'doDo test';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            toDo.find({text}).then((docs) => {
                expect(docs.length).toBe(1);
                expect(docs[0].text).toBe(text);
                done();
            }).catch((err) => done(err));

        });
    });


    it('Should not create new to-do if given data is invalid', (done) => {
        request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
    
            toDo.find().then((todos) => {
              expect(todos.length).toBe(2);
              done();
            }).catch((err) => done(err));
          });
      });

});

describe('GET', () => {
    it('Should get to-dos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
        })
        .end(done)
    })
});


describe('GET /todos/:id', () => {

it('Should return to-dos', (done) => {

    request(app)
    .get(`/todos/${testToDos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
        expect(res.body.docs.text).toBe(testToDos[0].text)
    })
    .end(done);
});

it('Should return 404 if to-do not found', (done) => {
    request(app)
    .get(`/todos/5b8b1b80106791380041aab0`)
    .expect(404)
    .expect((res) => {
       expect(res.body).toEqual({})
    })
    .end(done)
})

it('Should return 404 fo non object ids', (done) => {
    request(app)
    .get(`/todos/1233`)
    .expect(404)
    .expect((res) => {
        expect(res.body).toEqual({})
     })
    .end(done)
})
    
});


describe('DELETE', () => {

    it('Should remove a to-do', (done) => {
        let hexID = testToDos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.doc._id).toBe(hexID);
        })
        .end((err ,res) => {
            if (err) {
                return done(err);
            }

            toDo.findById(hexID).then((todos) => {
                expect(todos).toBeFalsy();
                done();
            }).catch(err => done(err));
        })
    });

     it('Should return 404 if to-do not found', (done) => {
        request(app)
        .delete(`/todos/1233`)
        .expect(404)
        .expect((res) => {
            expect(res.body).toEqual({})
         })
        .end(done);
     });

     it('Should return 404 if object id not valid', (done) => {
        request(app)
        .delete(`/todos/1233`)
        .expect(404)
        .expect((res) => {
            expect(res.body).toEqual({})
         })
        .end(done);
     });

});

describe('PATCH', () => {

    it('Should upadte a to-do', (done) => {
        let hexID = testToDos[0]._id.toHexString();
        let text = 'Text here';
        let completed = true;
        let completedAt = new Date().getTime();

        request(app)
        .patch(`/todos/${hexID}`)
        .send({text, completed, completedAt})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end((err) => {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('Should clear completedAt, when to-do is not completed', (done) => {
        let hexID = testToDos[1]._id.toHexString();
        let text = 'Text here2';
        let completed = false;

        request(app)
        .patch(`/todos/${hexID}`)
        .expect(200)
        .send({text, completed})
        .expect((res) => {
            if (!res.body.todo.completed) {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBeFalsy();
            }
        })
        .end((err) => {
            if (err) {
                return done(err);
            }
            done();
        });
    });


    
});

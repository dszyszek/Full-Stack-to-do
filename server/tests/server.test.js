const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

let {app} = require('./../server.js');
let {toDo} = require('./../models/toDo.js');
let {populateTodos, testToDos, populateUsers, users} = require('./seed/seed.js');
let {user} = require('./../models/user.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

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


describe('GET users/me', () => {
    it('Should return users (authenticated)', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
        
    });

    it('Should return 401', (done) => {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        let email = 'qwe@ex.org';
        let password = '1qazxsw2';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            user.findOne({email}).then((user) => {
                expect(user.password).not.toEqual(password);
                expect(user).toBeTruthy();

                done();
            }).catch((err) => done(err));
            
        })
    });


    it('Should not create a user if email in use', (done) => {
        let email = users[0].email;
        let password = '1qazxsw2';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect((res) => {
            expect(res.body._id).toBeFalsy();
        })
        .end(done);


    });


    it('Should return validation errors if request invalid', (done) => {

        let email = 'ljsdlfj';
        let password = 'qwertyuiop';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
       
        
    });
});

describe('POST users/login', () => {
    it('Should login user and return auth token', (done) => {

        request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if (err) {
              return done(err);
            }
            user.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toHaveProperty('access', 'auth');
                expect(user.tokens[0]).toHaveProperty('token', res.headers['x-auth'])
                
                done();
              }).catch((e) => done(e));
            });
        });



    it('Should reject invalid login', (done) => {

        request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password + 'qwertyuiop'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if (err) {
              return done(err);
            }
            user.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                    done();
              }).catch((e) => done(e));
            });
        });

    });


    describe('DELETE users/me/token', () => {

        it('Should remove token on logout', (done) => {
            request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {

                if (err) {
                    return done(err)
                }

                user.findById(users[0]._id).then((usr) => {
                    expect(usr.tokens.length).toEqual(0);
                    done();
                }).catch(err => done(err));
            });
        });

    });

    
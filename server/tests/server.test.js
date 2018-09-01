const expect = require('expect');
const request = require('supertest');

let {app} = require('./../server.js');
let {toDo} = require('./../models/toDo.js');


let testToDos = [{
    text: 'Text1'
}, {
    text: 'text2'
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


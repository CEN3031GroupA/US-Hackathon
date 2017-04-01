'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Question = mongoose.model('Question'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  question;

/**
 * Question routes tests
 */
describe('Question CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Question
    user.save(function () {
      question = {
        name: 'Question name'
      };

      done();
    });
  });

  it('should be able to save a Question if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Question
        agent.post('/api/questions')
          .send(question)
          .expect(200)
          .end(function (questionSaveErr, questionSaveRes) {
            // Handle Question save error
            if (questionSaveErr) {
              return done(questionSaveErr);
            }

            // Get a list of Questions
            agent.get('/api/questions')
              .end(function (questionsGetErr, questionsGetRes) {
                // Handle Questions save error
                if (questionsGetErr) {
                  return done(questionsGetErr);
                }

                // Get Questions list
                var questions = questionsGetRes.body;

                // Set assertions
                (questions[0].user._id).should.equal(userId);
                (questions[0].name).should.match('Question name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Question if not logged in', function (done) {
    agent.post('/api/questions')
      .send(question)
      .expect(403)
      .end(function (questionSaveErr, questionSaveRes) {
        // Call the assertion callback
        done(questionSaveErr);
      });
  });

  it('should not be able to save an Question if no name is provided', function (done) {
    // Invalidate name field
    question.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Question
        agent.post('/api/questions')
          .send(question)
          .expect(400)
          .end(function (questionSaveErr, questionSaveRes) {
            // Set message assertion
            (questionSaveRes.body.message).should.match('Please fill Question name');

            // Handle Question save error
            done(questionSaveErr);
          });
      });
  });

  it('should be able to update an Question if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Question
        agent.post('/api/questions')
          .send(question)
          .expect(200)
          .end(function (questionSaveErr, questionSaveRes) {
            // Handle Question save error
            if (questionSaveErr) {
              return done(questionSaveErr);
            }

            // Update Question name
            question.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Question
            agent.put('/api/questions/' + questionSaveRes.body._id)
              .send(question)
              .expect(200)
              .end(function (questionUpdateErr, questionUpdateRes) {
                // Handle Question update error
                if (questionUpdateErr) {
                  return done(questionUpdateErr);
                }

                // Set assertions
                (questionUpdateRes.body._id).should.equal(questionSaveRes.body._id);
                (questionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Questions if not signed in', function (done) {
    // Create new Question model instance
    var questionObj = new Question(question);

    // Save the question
    questionObj.save(function () {
      // Request Questions
      request(app).get('/api/questions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Question if not signed in', function (done) {
    // Create new Question model instance
    var questionObj = new Question(question);

    // Save the Question
    questionObj.save(function () {
      request(app).get('/api/questions/' + questionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', question.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Question with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/questions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Question is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Question which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Question
    request(app).get('/api/questions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Question with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Question if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Question
        agent.post('/api/questions')
          .send(question)
          .expect(200)
          .end(function (questionSaveErr, questionSaveRes) {
            // Handle Question save error
            if (questionSaveErr) {
              return done(questionSaveErr);
            }

            // Delete an existing Question
            agent.delete('/api/questions/' + questionSaveRes.body._id)
              .send(question)
              .expect(200)
              .end(function (questionDeleteErr, questionDeleteRes) {
                // Handle question error error
                if (questionDeleteErr) {
                  return done(questionDeleteErr);
                }

                // Set assertions
                (questionDeleteRes.body._id).should.equal(questionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Question if not signed in', function (done) {
    // Set Question user
    question.user = user;

    // Create new Question model instance
    var questionObj = new Question(question);

    // Save the Question
    questionObj.save(function () {
      // Try deleting Question
      request(app).delete('/api/questions/' + questionObj._id)
        .expect(403)
        .end(function (questionDeleteErr, questionDeleteRes) {
          // Set message assertion
          (questionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Question error error
          done(questionDeleteErr);
        });

    });
  });

  it('should be able to get a single Question that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Question
          agent.post('/api/questions')
            .send(question)
            .expect(200)
            .end(function (questionSaveErr, questionSaveRes) {
              // Handle Question save error
              if (questionSaveErr) {
                return done(questionSaveErr);
              }

              // Set assertions on new Question
              (questionSaveRes.body.name).should.equal(question.name);
              should.exist(questionSaveRes.body.user);
              should.equal(questionSaveRes.body.user._id, orphanId);

              // force the Question to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Question
                    agent.get('/api/questions/' + questionSaveRes.body._id)
                      .expect(200)
                      .end(function (questionInfoErr, questionInfoRes) {
                        // Handle Question error
                        if (questionInfoErr) {
                          return done(questionInfoErr);
                        }

                        // Set assertions
                        (questionInfoRes.body._id).should.equal(questionSaveRes.body._id);
                        (questionInfoRes.body.name).should.equal(question.name);
                        should.equal(questionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Question.remove().exec(done);
    });
  });
});

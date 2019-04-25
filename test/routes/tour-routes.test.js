require('dotenv').config();
const connect = require('../../lib/utils/connect');
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');

describe('Tour routes', () => {
  const launchDate = new Date();

  const mockStop = {
    location: {
      lat: '43.041809',
      lon: '-87.906837'
    },
    attendance: 1
  };


  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/tours', {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true
    });
  });

  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  afterAll(() => {
    return mongoose.connection.close();
  });
  
  beforeAll(() => {
    return connect();
  });

  it('creates a tour', () => {
    return request(app)
      .post('/tours')
      .send({
        title: 'Coolest Tour',
        activities: ['cool', 'stuff'],
        launchdate: launchDate
      })
      .then(res => {
        expect(res.body).toEqual({
          title: 'Coolest Tour',
          activities: ['cool', 'stuff'],
          launchdate: launchDate.toISOString(),
          _id: expect.any(String),
          __v: 0,
          stops: []
        });
      });
  });

  it('gets a tour by its id', () => {
    return request(app)
      .post('/tours')
      .send({
        title: 'Coolest Tour',
        activities: ['cool', 'stuff'],
        launchdate: launchDate
      })
      .then(res => {
        console.log(res.body);
        return request(app)
          .post(`/tours/${res.body._id}/stops`)
          .send(mockStop)
          .then(() => {
            console.log(res.body);
            return res.body._id;
          });
      });
  });
});
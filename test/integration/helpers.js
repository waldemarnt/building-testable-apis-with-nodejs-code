import supertest from 'supertest';
import chai from 'chai';
import application from '../../src/app.js';

global.application = application;
global.supertest = supertest;
global.expect = chai.expect;

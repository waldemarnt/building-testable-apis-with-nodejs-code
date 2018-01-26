import mongooseLib from 'mongoose';
import Users from './config/seeders/users.seeder'

mongooseLib.Promise = global.Promise;

// Export the mongoose lib
export const mongoose = mongooseLib;

// Export the mongodb url
export const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/shop';

/*
  Seeders List
  ------
  order is important
*/
export const seedersList = {
  Users
};

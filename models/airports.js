const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airports = Schema({
  airportId: {type: String},
  airportName: {type: String},
  airportNameEng: {type: String},
  cityName: {type: String},
  cityNameEng: {type: String},
  countryName: {type: String},
  countryNameEng: {type: String},
  difficulty: {type: Number},
});

module.exports = mongoose.model('airports', airports);

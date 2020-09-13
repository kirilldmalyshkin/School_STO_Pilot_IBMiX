const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pilot = Schema({
  firstName: { type: String },
  lastName: { type: String },
  patronymic: { type: String },
  email: { type: String },
  crewRole: { type: String },
  standingFromDate: { type: String },
  standingFromDateInRole: { type: String },
  reliabilityIndex: { type: String },
  rewardsAndPunishments: { type: String },
  phone: { type: String },
  password: { type: String },
  keyForNewPassword: { type: String },
  wishForm: { type: Array },
  arrWish: { type: Array },
  arrFlights: {type: Array},
  flagVisit: { type: Boolean },
});

module.exports = mongoose.model('Pilot', pilot);

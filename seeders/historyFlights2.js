const mongoose = require('mongoose');

mongoose.connect(
    `mongodb+srv://igorg:ibmix4@cluster0.aev79.azure.mongodb.net/IBMiX4?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
);

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
});

const flight = Schema({
  where_to: {type: String},
  where_from: {type: String},
  flight_time: {type: String},
  time_of_departure: {type: String},
  time_of_arrival: {type: String},
  level_flights: {type: String},
  city_photo: {type: String},
  airport_name: {type: String},
});

const Pilot = mongoose.model('Pilot', pilot);
const Flight = mongoose.model('Flight', flight)

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

async function foo() {
  const pilotCollection = await Pilot.find()
  const flightsClollection = await Flight.find()
  // const pilotCollection = await Pilot.findOne({ email: 'igordg30.07.19861@gmail.com' });

  for (let j = 0; j < pilotCollection.length; j++) {
    let arrFlights = [];

    for (let j = 0; j < 10; j++){
      arrFlights.push(flightsClollection[ getRandomIntInclusive(0, 19)]);
    }

    pilotCollection[j].arrFlights = arrFlights
    await pilotCollection[j].save();
  }
}

//foo()
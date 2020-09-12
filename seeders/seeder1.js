// const config = require('config')
// const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const faker = require('faker');

// // Способ 2

// /*
// mongoose.connect(
//   config.get('mongoUri'),
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   },
// );

// const Schema = mongoose.Schema;

// const user = Schema({
//   firstName: { type: String },
//   lastName: { type: String },
//   email: { type: String },
//   phone: { type: String },
//   photo: { type: String },
//   username: { type: String },
//   password: { type: String },

// });

// const User = mongoose.model("User", user)

// seedUsers = async () => {
//   const saltRounds = 10;
//   for (let i = 0; i < 10; i++) {
//     const users = new User({
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName(),
//       email: faker.internet.email(),
//       phone: faker.phone.phoneNumberFormat(),
//       photo: faker.internet.avatar(),
//       username: faker.internet.userName(),
//       password: await bcrypt.hash('123', saltRounds)
//     });
//     users.save();
//   }
// };

// seedUsers();
// */
// //Способ 3

// mongoose.connect(config.get('mongodb+srv://igorg:ibmix4@cluster0.aev79.azure.mongodb.net/IBMiX4?retryWrites=true&w=majority'), {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true
// });

// mongoose.connect(
//   `mongodb+srv://igorg:ibmix4@cluster0.aev79.azure.mongodb.net/IBMiX4?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   },
// );

// const User = mongoose.model('User', {
//   firstName: { type: String },
//   lastName: { type: String },
//   email: { type: String },
//   phone: { type: String },
//   photo: { type: String },
//   username: { type: String },
//   password: { type: String },
// });


const Airport = mongoose.model('Airport', {
  airportId: { type: String },
  airportName: { type: String },
  airportName: { type: String },
  airportNameEng: { type: String },
  cityNameEng: { type: String },
  countryName: { type: String },
  countryNameEng: { type: String },
  difficulty: { type: Number },
});

const Flights = mongoose.model('Flights', {
  where_to: { type: String },
  where_from: { type: String },
  time_of_departure: { type: String },
  time_of_arrival: { type: String },
  flight_time: { type: String },
  level_flights: { type: String },
  city_photo: { type: String },
  airport_name: { type: String },
});

seedFlights = async () => {
  for (let i = 0; i < 20; i++) {
    const departureDate = faker.date.future().toISOString().substring(10, -10);
    const daysToAdd = 2;
    const date = new Date(departureDate);
    date.setDate(date.getDate() + daysToAdd);
    const arrivalDate = date.toISOString().substring(10, -10);

    const flights = new Flights({
      where_to: faker.address.city(),
      where_from: 'Moscow',
      flight_time: faker.random.number({ min: 1, max: 48 }),
      time_of_departure: departureDate,
      time_of_arrival: arrivalDate,
      level_flights: faker.random.number({ min: 1, max: 10 }),
      city_photo: faker.image.city(),
      airport_name: faker.name.firstName(),
    });
    flights.save().then(() => console.log(`+ flight ${i}`));
    console.log(i);
  }
};

// seedUsers = async () => {
//   const saltRounds = 10;
//   for (let i = 0; i < 20; i++) {
//     const user = new User({
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName(),
//       email: faker.internet.email(),
//       phone: faker.phone.phoneNumberFormat(),
//       photo: faker.internet.avatar(),
//       username: faker.internet.userName(),
//       password: await bcrypt.hash('123', saltRounds)
//     });
//     user.save().then(() => console.log('+'));
//   }
// }

// seedFlights()
// // seedUsers()


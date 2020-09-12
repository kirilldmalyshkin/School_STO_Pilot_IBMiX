const express = require('express');
const router = express.Router();

const Flights = require('../models/flights');
const Airports = require('../models/airports');

router.post('/api/getAllFly', async (req, res) => {

  try {
    const flights = await Flights.find();
    // здесь будет обращение к базе
    // console.log('Пустой массив', flights);
    return res.status(200).json({ response: flights });
  } catch (e) {
    res.status(400).json({ response: 'fail' });
  }
});

router.post('/api/getAirports/russia', async (req, res) => {
  console.log('есть запрос', req.body.reliabilityIndex)
  try {
    const airports = await Airports.find({ 'countryName': "Российская Федерация" });
    console.log(airports.length)
    return res.status(200).json({ response: airports });
  } catch (e) {
    res.status(400).json({ response: 'fail' });
  }
});

router.post('/api/getAirports', async (req, res) => {
  console.log('есть запрос', req.body.reliabilityIndex)
  try {
    const airports = await Airports.find();
    let worldAirports = [];
    for (let i = 0; i < airports.length; i++) {
      if (airports[i].countryName === "Российская Федерация") {
        continue
      } else {
        worldAirports.push(airports[i])
      }
    }
    console.log(worldAirports.length)
    return res.status(200).json({ response: worldAirports });
  } catch (e) {
    res.status(400).json({ response: 'fail' });
  }
});

module.exports = router;


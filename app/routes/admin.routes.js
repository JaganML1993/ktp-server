const express = require("express");
const router = express.Router();

const weatherSearchValidation = require("../validators/WeatherSearchValidation");
const Weather = require("../controllers/app.weatherController");

// Attach middleware and controller methods
router.get("/current", weatherSearchValidation, Weather.currentToday);
router.get("/forecast-days", weatherSearchValidation, Weather.forecastDays);

module.exports = router;

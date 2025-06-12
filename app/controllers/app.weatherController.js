const { validationResult } = require("express-validator");
const axios = require("axios");
require("dotenv").config();

exports.forecastDays = async (req, res) => {
  const { lat, lon, date } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  try {
    if (!lat || !lon) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Please provide lat and lon",
      });
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    let forecast = response.data.daily;

    if (date) {
      const targetDate = new Date(date).setHours(0, 0, 0, 0);
      forecast = forecast.filter((day) => {
        const forecastDate = new Date(day.dt * 1000).setHours(0, 0, 0, 0);
        return forecastDate === targetDate;
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      data: forecast,
      message: "Forecast retrieved successfully",
    });
  } catch (error) {
    console.error(
      error.response ? error.response.data : error.message || error
    );
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch forecast",
    });
  }
};

exports.currentToday = async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  try {
    if (!lat || !lon) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Please provide lat and lon",
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log("Requesting:", url);

    const response = await axios.get(url);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: response.data,
      message: "Weather data retrieved successfully",
    });
  } catch (error) {
    console.error(
      error.response ? error.response.data : error.message || error
    );
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch weather data",
    });
  }
};

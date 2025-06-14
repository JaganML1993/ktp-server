const { validationResult } = require("express-validator");
const axios = require("axios");
require("dotenv").config();
const Location = require("../model/admin/Location");

exports.forecastDays = async (req, res) => {
  const { cityId, date } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  try {
    if (!cityId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing cityId" });
    }

    const location = await Location.findById(cityId);
    if (!location) {
      return res
        .status(404)
        .json({ status: "error", message: "Location not found" });
    }

    const { lat, lng } = location;

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    // Process daily forecast data
    const dailyForecast = response.data.daily.map((day) => ({
      dt: day.dt,
      temp: {
        day: day.temp.day,
        night: day.temp.night,
        min: day.temp.min,
        max: day.temp.max,
      },
      feels_like: day.feels_like.day,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
      weather: day.weather.map((w) => ({
        description: w.description,
        icon: w.icon,
      })),
      pop: day.pop,
    }));

    // Process hourly forecast data
    const hourlyForecast = response.data.hourly.map((hour) => ({
      dt: hour.dt,
      temp: hour.temp,
      feels_like: hour.feels_like,
      humidity: hour.humidity,
      wind_speed: hour.wind_speed,
      weather: hour.weather.map((w) => ({
        description: w.description,
        icon: w.icon,
      })),
      pop: hour.pop,
    }));

    let filteredDaily = dailyForecast;
    let filteredHourly = hourlyForecast;

    if (date) {
      const targetDate = new Date(date).setHours(0, 0, 0, 0);

      // Filter daily forecast for specific date
      filteredDaily = dailyForecast.filter((day) => {
        const forecastDate = new Date(day.dt * 1000).setHours(0, 0, 0, 0);
        return forecastDate === targetDate;
      });

      // Filter hourly forecast for specific date
      filteredHourly = hourlyForecast.filter((hour) => {
        const hourDate = new Date(hour.dt * 1000).setHours(0, 0, 0, 0);
        return hourDate === targetDate;
      });
    }

    res.status(200).json({
      status: "success",
      data: filteredDaily,
      hourly: filteredHourly,
    });
  } catch (error) {
    console.error("Forecast error:", error.message || error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch forecast" });
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

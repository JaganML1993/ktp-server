const { body } = require("express-validator");

const WeatherSearchValidation = [
  body("city")
    .notEmpty()
    .withMessage("City is required.")
    .isString()
    .withMessage("City must be a string.")
    .trim()
    .escape(),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date."),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date."),
];

module.exports = WeatherSearchValidation;

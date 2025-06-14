const { body } = require("express-validator");

const LocationValidation = [
  body("locationName")
    .notEmpty()
    .withMessage("Location name is required.")
    .trim()
    .escape(),
  body("lat")
    .notEmpty()
    .withMessage("Latitude is required.")
    .isFloat()
    .withMessage("Latitude must be a number."),
  body("lng")
    .notEmpty()
    .withMessage("Longitude is required.")
    .isFloat()
    .withMessage("Longitude must be a number."),
  body("itineraryTip").optional().trim().escape(),
  body("whatToPack").optional().trim().escape(),
  body("photogenicForecastContent").optional().trim().escape(),
  body("bestTimeToVisit").optional().trim().escape(),
];

module.exports = LocationValidation;
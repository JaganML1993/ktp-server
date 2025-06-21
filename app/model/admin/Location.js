const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true, unique: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    itineraryTip: { type: String },
    photogenicForecastContent: { type: String },
    additionalField: { type: String },
    bestTimeToVisit: { type: String },
    photogenicForecastLink: { type: String },
    photogenicForecastImages: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", LocationSchema);

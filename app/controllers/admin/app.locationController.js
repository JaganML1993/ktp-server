const { validationResult } = require("express-validator");
const Location = require("../../model/admin/Location");

exports.save = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      code: 422,
      errors: errors.array(),
    });
  }

  try {
    const {
      locationName,
      lat,
      lng,
      itineraryTip,
      whatToPack,
      photogenicForecastContent,
      bestTimeToVisit,
    } = req.body;

    // 🔍 Check for duplicate location
    const existingLocation = await Location.findOne({
      locationName: locationName.trim(),
    });
    if (existingLocation) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: `Location "${locationName}" already exists.`,
      });
    }

    const photogenicForecastImages = req.files?.map((file) => file.path) || [];

    const newLocation = new Location({
      locationName,
      lat,
      lng,
      itineraryTip,
      whatToPack,
      photogenicForecastContent,
      bestTimeToVisit,
      photogenicForecastImages,
      createdAt: new Date(),
    });

    await newLocation.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      data: newLocation,
      message: "Location saved successfully",
    });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to save location",
    });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      code: 422,
      errors: errors.array(),
    });
  }

  const locationId = req.params.id;

  try {
    const {
      locationName,
      lat,
      lng,
      itineraryTip,
      whatToPack,
      photogenicForecastContent,
      bestTimeToVisit,
    } = req.body;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Location not found",
      });
    }

    // Check for name conflict with other locations
    const existing = await Location.findOne({
      locationName: locationName.trim(),
      _id: { $ne: locationId },
    });
    if (existing) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: `Another location with the name "${locationName}" already exists.`,
      });
    }

    // Update fields
    location.locationName = locationName?.trim() || location.locationName;
    location.lat = lat || location.lat;
    location.lng = lng || location.lng;
    location.itineraryTip = itineraryTip || location.itineraryTip;
    location.whatToPack = whatToPack || location.whatToPack;
    location.photogenicForecastContent =
      photogenicForecastContent || location.photogenicForecastContent;
    location.bestTimeToVisit = bestTimeToVisit || location.bestTimeToVisit;

    // Replace images if new ones are uploaded
    if (req.files?.length) {
      location.photogenicForecastImages = req.files.map((file) => file.path);
    }

    await location.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to update location",
    });
  }
};

exports.delete = async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Location not found",
      });
    }

    // Delete document from DB
    await Location.findByIdAndDelete(locationId);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to delete location",
    });
  }
};

exports.details = async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      data: location,
      message: "Location details retrieved successfully",
    });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch location details",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = {};
    if (search) {
      filter.locationName = { $regex: search.trim(), $options: "i" }; // Case-insensitive
    }

    const total = await Location.countDocuments(filter);
    const locations = await Location.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Locations fetched successfully",
      data: {
        locations,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch locations",
    });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({}, { locationName: 1 }).sort({
      locationName: 1,
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "All locations retrieved successfully",
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error.message || error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch all locations",
    });
  }
};

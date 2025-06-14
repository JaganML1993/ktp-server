const express = require("express");
const router = express.Router();
const multer = require("multer");

const Auth = require("../controllers/admin/app.authController.js");
const loginValidation = require("../validators/admin/loginValidation");

const LocationValidation = require("../validators/admin/LocationValidation");
const Location = require("../controllers/admin/app.locationController");

router.post("/login", loginValidation, Auth.login);

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
});

// Route with up to 3 images upload
router.post(
  "/save-location",
  upload.array("photogenicImages", 3),
  LocationValidation,
  Location.save
);
// PUT /api/admin/update-location/:id
router.put(
  "/update-location/:id",
  upload.array("photogenicImages", 3),
  LocationValidation,
  Location.update
);
router.delete("/delete-location/:id", Location.delete);
router.get("/location-details/:id", Location.details);
router.get("/location-list", Location.list);
router.get("/all-locations", Location.getAllLocations);

module.exports = router;

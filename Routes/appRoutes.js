const express = require("express");
const appController = require("../Controllers/appController");

const appRouter = express.Router();
const Multer = require("multer");

// sharp library for image compression
const sharp = require("sharp");
const {
  GetAllTemplates,
  SaveTemplate,
} = require("../Controllers/idCardController");

// Middleware to compress the image before uploading
const compressImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Compress the image to max 1MB size and save it back to the request object
  sharp(req.file.buffer)
    .resize(1024, 1024) // Set your desired image dimensions here
    .toBuffer((err, data) => {
      if (err) {
        return next(err);
      }
      req.file.buffer = data;
      next();
    });
};

// Multer middleware for handling file uploads
const multer = Multer({
  storage: Multer.memoryStorage(),
});

appRouter.post(
  "/upload",
  multer.single("image"),
  compressImage,
  appController.uploadImageAndSaveDataServer
);
appRouter.post(
  "/uploadteacher",
  multer.single("image"),
  compressImage,
  appController.uploadImageAndSaveTeachersDataServer
);
appRouter.get("/getimages/:id", appController.getSignedUrl);
appRouter.post("/saveinvoice", appController.saveInvoice);
appRouter.get("/getallinvoice", appController.getAllInvoice);
appRouter.get("/admindashboard", appController.dashboardData);
appRouter.get("/idcard", GetAllTemplates);
appRouter.post("/idcard", SaveTemplate);

module.exports = appRouter;

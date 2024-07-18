const express = require("express");
const appController = require("../Controllers/appController");

const appRouter = express.Router();
const Multer = require("multer");

// sharp library for image compression
const sharp = require("sharp");
const {
  GetAllTemplates,
  SaveTemplate,
  updateTemplate,
} = require("../Controllers/idCardController");

const compressImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  sharp(req.file.buffer)
    .resize(1024, 1024)
    .toBuffer((err, data) => {
      if (err) {
        return next(err);
      }
      req.file.buffer = data;
      next();
    });
};

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
  "/addnewstudent",
  multer.single("image"),
  compressImage,
  appController.AddNewStudent
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
appRouter.post("/updatetemplate", updateTemplate)
module.exports = appRouter;

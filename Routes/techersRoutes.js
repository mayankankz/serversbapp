const express = require('express');
const { check } = require('express-validator');
const teachers = require('../Controllers/teachersController')
const teachersRouter = express.Router();
const Multer = require("multer");
const sharp = require('sharp');
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
  
  // Multer middleware for handling file uploads
  const multer = Multer({
    storage: Multer.memoryStorage(),
  });
  


teachersRouter.post('/teachers' ,teachers.GetAllTeachers)
teachersRouter.get('/getteachersphotos' ,teachers.downloadteachersphotos)
teachersRouter.patch('/updateteacherdata/:id',multer.single("image"),teachers.updateTeacherData)
teachersRouter.get('/getalltechersdatawithimages/:schoolCode',teachers.getSignedUrlsForStudents )
teachersRouter.delete('/deleteteacher/:id', teachers.deleteTeacher);

module.exports =  teachersRouter;
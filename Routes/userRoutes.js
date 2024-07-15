const express = require('express');
const { check } = require('express-validator');

const user = require('../Controllers/userController')
const Multer = require("multer");
const sharp = require('sharp');
const userRouter = express.Router();

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



userRouter.post('/createuser', user.createUser);
userRouter.post('/finduser', user.findUserByID);
userRouter.post('/createschool', [
    check('schoolname').notEmpty().withMessage('School name is required.'),
    check('schoolcode').notEmpty().withMessage('School code is required.'),
    check('schoolcode').isInt().withMessage('School code should be a number.')
  ], user.createSchool);

userRouter.get('/getallSchools',user.getAllSchools)
userRouter.post('/getstudentsdata',user.getStudentsData)
userRouter.get('/getallstudentsdata',user.getStudentAllData)
userRouter.get('/getallstudentsdatabyschoolcode/:schoolCode',user.getStudentDataBySchoolCode )
userRouter.get('/getSchoolvalidationoptions/:schoolCode',user.getSchoolvalidationoptions )
userRouter.get('/downloaddata',user.downloadStudentsData )
userRouter.patch('/updatestudentdata/:id',multer.single("image"),compressImage,user.updateStudentData)
userRouter.get('/getallusers',user.getAllUsers )
userRouter.get('/downloadphotos' , user.downloadphotos)
userRouter.delete('/deleteschool/:id', user.deleteSchool);
userRouter.delete('/deleteinvoice/:id', user.deleteInvoice);
userRouter.delete('/deleteuser/:id', user.deleteUser);
userRouter.get('/getallstudentsdatawithimages/:schoolCode/:className',user.getSignedUrlsForStudents )
userRouter.post('/addClass',user.addClass )
module.exports =  userRouter;
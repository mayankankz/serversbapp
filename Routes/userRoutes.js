const express = require('express');
const { check } = require('express-validator');

const user = require('../Controllers/userController')

const userRouter = express.Router();

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
userRouter.patch('/updatestudentdata/:id',user.updateStudentData)
userRouter.get('/getallusers',user.getAllUsers )
userRouter.get('/downloadphotos' , user.downloadphotos)
userRouter.post('/deleteschool' , user.downloadphotos)
module.exports =  userRouter;
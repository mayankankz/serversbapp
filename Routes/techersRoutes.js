const express = require('express');
const { check } = require('express-validator');
const teachers = require('../Controllers/teachersController')
const teachersRouter = express.Router();

teachersRouter.post('/teachers' ,teachers.GetAllTeachers)
teachersRouter.get('/getteachersphotos' ,teachers.downloadteachersphotos)
teachersRouter.patch('/updateteacherdata/:id',teachers.updateTeacherData)

module.exports =  teachersRouter;
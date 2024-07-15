const express = require('express');
const auth = require('../Controllers/authController')
const user = require('../Controllers/userController');
const multer = require('multer');
const authRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

authRouter.post('/login', auth.userLogin);
authRouter.post('/import-excel', upload.single('file'), user.importDataFromXlsx)

module.exports =  authRouter;
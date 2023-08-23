const express = require('express');
const auth = require('../Controllers/authController')

const authRouter = express.Router();

authRouter.post('/login', auth.userLogin);

module.exports =  authRouter;
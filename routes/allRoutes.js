const express = require('express');
const routes = express.Router();

const loginRoutes = require('./loginRoutes');
const signupRoutes = require('./signUpRoutes');
const infoRoutes = require('./infoRoutes');
const examRoutes = require('./examRoutes');
const userRoutes = require('./userRoutes')

routes.use('/login', loginRoutes);
routes.use('/signup', signupRoutes);
routes.use('/info', infoRoutes);
routes.use('/exam', examRoutes);
routes.use('/user', userRoutes);

module.exports = routes;
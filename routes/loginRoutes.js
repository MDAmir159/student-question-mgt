const express = require('express');
const HTTPStatus = require('../HTTPStatus');
const logInQueries = require('../queries/loginQueries');
const routes = express.Router();

routes.post('/login-info', async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                message : "insufficient information"
            })
        }
        const inputArray = [email];
        const response = await logInQueries.logInQuery(inputArray);
    
        if(response.length == 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                message : "User does not exist"
            })
        } else {
            const respondedPassword = response[0].password;
            if(respondedPassword === password) {
                res.status(HTTPStatus.OK).json({
                    data : response[0]
                })
            } else {
                res.status(HTTPStatus.BAD_REQUEST).json({
                    message : "wrong password"
                })
            }
        }
    } catch (error) {
        next(error);
    }
})

module.exports = routes;
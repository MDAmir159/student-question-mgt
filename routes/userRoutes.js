const express = require('express');
const { BASE_LINK } = require('../config');
const upload = require('../config/multerConfig');
const { UNPROCESSABLE_ENTITY, NOT_FOUND, NOT_ACCEPTABLE, FORBIDDEN, EXPECTATION_FAILED, INTERNAL_SERVER_ERROR, OK, NOT_MODIFIED } = require('../HTTPStatus');
const { getLoggedIn, getUserDetailsById, insertNewUser, updateUserInfo } = require('../queries/userQueries');
const routes = express.Router();

routes.post('/add_user', async (req, res) => {
    const {mobile, password} = req.body
    if (!mobile || !password ) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }

    const inputArray = [[mobile, password]]

    try {
        const response = await insertNewUser(inputArray);
        if (response) {
            if(response.affectedRows !== 1){
                ////////////////// roll back /////////////////
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated without expectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created",
                userId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from database"
            })
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while inserting new user"
        })
    }
})

routes.patch('/update_user', upload, async (req, res) => {
    const {userId, name, bn_name, plan_id, email, mobile, password, last_paid} = req.body
    if (!userId || !name || !bn_name || !email || !mobile || !password) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    let image_url;
    if (req.file) {
        image_url = BASE_LINK + 'images/' + `${req.file.filename}`;
    } else {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "image missing"
        })
    }

    const inputObject = {userId, name, bn_name, email, mobile, password, image_url}

    try {
        const response = await updateUserInfo(inputObject)
        if (response) {
            // console.log(response);
            if(response.affectedRows === 0){
                ////////////////// roll back !!!!!!!!!!!!!!! /////////////////
                
            }
            
            else if(response.affectedRows !== 1){
                ////////////////// roll back !!!!!!!!!!!!!!! /////////////////
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated without expectation"
                })
            }

            return res.status(OK).json({
                message: "OK...updated",
                userId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from database"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message:"error occured while inserting new user"
        })
    }
})

module.exports = routes;
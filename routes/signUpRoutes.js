const express = require('express');
const { BASE_LINK } = require('../config');
const upload = require('../config/multerConfig');
const HTTPStatus = require('../HTTPStatus');
const signUpQueries = require('../queries/signUpQueries');
const routes = express.Router();

routes.post('/add-new', upload ,async (req, res, next) => {
    try {
        const {
            name,
            email,
            mobile_number,
            password,
            class_id,
            institute,
            district_id,
            present_address,
        } = req.body;

        let image;

        if(req.file) image = BASE_LINK + 'images/' + `${req.file.filename}`;

        if(!name || !mobile_number || !password || !class_id || !district_id){
            res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({
                message : "insufficent informations"
            })
        }

        if(!institute) institute = null;
        if(!email) email = null;
        if(!present_address)  present_address=null;
        if(!image) image = null;
        
        const inputArray = [name,email,mobile_number,password,class_id,institute,district_id,present_address,image];

        const response = await signUpQueries.addNewMember([inputArray]);
        
        if(response !== null && response.affectedRows == 1){
            res.status(HTTPStatus.CREATED).json({
                message : "Created"
            })
        } else {
            res.status(HTTPStatus.EXPECTATION_FAILED).json({
                message : "More than 1 rows affected"
            })
        }

    } catch (error) {
        next(error);
    }
})

module.exports = routes;
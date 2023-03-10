const express = require('express');
const { INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY, EXPECTATION_FAILED, OK, NOT_FOUND } = require('../HTTPStatus');
const { createExam, saveExams, findExam, prepExamForUser, getExamInfo, assemblingExamInfo, saveExamInfo, getAllUserExamInfo } = require('../MiddleWares/examMiddleWares');
const { examModelToBeSaved } = require('../Models/examModel');
const { getAllExamInfo, insertNewExamDetails, insertNewQuestion, insertNewOption, insertOptionQuestionRelQuery, insertExamQuestionRelQuery, searchExamForUser, setUserGivenExamDetails } = require('../queries/examQueries');
const routes = express.Router();

routes.get('/details' , async (req, res) => {
    try {
        const response = await getAllExamInfo();

        return res.status(OK).json(response)
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "ERROR OCCURED WHILE FETCHING EXAM DETAILS",
            error: error
        })
    }
    // res.send({message: "asdasdasd"})
})

routes.post('/add', createExam,  async (req, res) => {
    const examId = req.examId
    
    const rawQuestionData = req.body.question

    if (!rawQuestionData) {
        
        //////////////  roll back the exam info  //////////////////
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "question not set"
        })
    }

    const questionInfo = JSON.parse(rawQuestionData).question
    let questionIdArray = []
    try {
        for (let indexForQuestionInfo = 0; indexForQuestionInfo < questionInfo.length; indexForQuestionInfo++) {
            const {details, is_description, correct_answer_key, options} = questionInfo[indexForQuestionInfo]
            let optionIdArray = []
    
            if (!details || !is_description || !correct_answer_key) {
    
                ////////////// roll back previous calculations ///////////
                return res.status(UNPROCESSABLE_ENTITY).json({
                    message: "necessary information missing while inserting questions"
                })
            }
    
            const inputArray = [[details, is_description, correct_answer_key]]
            const response = await insertNewQuestion(inputArray);
            if(response){
                const questionId = response.insertId
                questionIdArray.push(questionId)
                for (let indexForOptionsArray = 0; indexForOptionsArray < options.length; indexForOptionsArray++) {
                    const {opt_nm, details, is_description} = options[indexForOptionsArray]
                    const optionInputArray = [[opt_nm, details, is_description]]
                    const optionResponse  = await insertNewOption(optionInputArray);
                    if(optionResponse){
                        optionIdArray.push(optionResponse.insertId)
                    } else {
                        return res.status(EXPECTATION_FAILED).json({
                            message: "no response from the server while inserting an option"
                        })
                    }
                }
                
                optionIdArray = optionIdArray.map((entity) => {
                    return [questionId, entity]
                })
                const questionOptionRelInputArray = [optionIdArray]
                const questionOptionRelResponse = await insertOptionQuestionRelQuery(questionOptionRelInputArray)
                if(questionOptionRelResponse){
                    if (questionOptionRelResponse.affectedRows !== optionIdArray.length) {
                        return  res.status(EXPECTATION_FAILED).json({
                            message: "database not updated as expected while updating option question rel"
                        })
                    } 
                } else {
                    return res.status(EXPECTATION_FAILED).json({
                        message: "no response from the server while inserting an option"
                    })
                }
            } else {
                return res.status(EXPECTATION_FAILED).json({
                    message: "options not successfully inserted"
                })
            }
    
        }
        questionIdArray = questionIdArray.map((entity) => {
            return [examId, entity]
        })
        const examQuestionRelInputArray = [questionIdArray]
        const examQuestionRelResponse = await insertExamQuestionRelQuery(examQuestionRelInputArray);
        if (examQuestionRelResponse) {
            if (examQuestionRelResponse.affectedRows !== questionIdArray.length) {
                return  res.status(EXPECTATION_FAILED).json({
                    message: "database not updated as expected while updating exam question rel"
                })
            } 
            return res.status(OK).json({
                message: "OK. Question created"
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the server while inserting exam question relations"
            })
        }
    
    } catch (error) {
        // console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while managing qustions"
        })
    }
    
})

routes.get('/find_exam', findExam)

routes.get('/give_exam', prepExamForUser, getExamInfo, assemblingExamInfo)

routes.patch('/save_exam', saveExamInfo);

routes.get('/user_exams', getAllUserExamInfo)

module.exports = routes;
const { OK, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY, EXPECTATION_FAILED, NOT_FOUND, BAD_REQUEST, NOT_MODIFIED } = require("../HTTPStatus");
const { getAllExamInfo, insertNewExamDetails, insertNewQuestion, searchExamForUser, setUserGivenExamDetails, getExamDeailsWithOptions, saveGivenExamInfo, getAllExamsOfUserByID } = require("../queries/examQueries");

const examMiddleWares = {
    createExam,
    saveExams,
    findExam,
    prepExamForUser,
    getExamInfo,
    assemblingExamInfo,
    saveExamInfo,
    getAllUserExamInfo
}

async function createExam(req, res, next) {
    const{
        main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id
    } = req.body

    if (!main_exam_id || !marks_id || !subject_id || !topic_id || !exam_type_id || !time_id) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }

    const inputData = [[main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id]]

    try {
        const response = await insertNewExamDetails(inputData);
        
        
        if (response.affectedRows !== 1) {
            ////////// operation should be rolled back ////////////////
            return res.status(EXPECTATION_FAILED).json({
                message: "multiple rows affected while inserting "
            })
        }
        req.examId = response.insertId
        next()
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while inserting new exam info",
            error: error
        })
    }
}

async function saveExams(req, res, next) {
    const examId = req.examId
    const rawQuestionData = req.body.question
    const questionInfo = JSON.parse(rawQuestionData).question
    req.question = questionInfo
    let questionIdArray = []

    for(let index = 0; index < questionInfo.length ; index++) {
        const {details, is_description, correct_answer_key, options} = questionInfo[index]
        
        if (!details || !is_description || !correct_answer_key) {
    
            ////////////// roll back previous calculations ///////////
            return res.status(UNPROCESSABLE_ENTITY).json({
                message: "necessary information missing while inserting questions"
            })
        }

        const inputArray = [[details, is_description, correct_answer_key]]

        try {
            const response = await insertNewQuestion(inputArray);
            
            if (response) {
                const questionId = response.insertId
                console.log(questionId, 78);
                questionIdArray.push(questionId)
            } else {
                return res.status(EXPECTATION_FAILED).json({
                    message: "No response from DB while inserting a question"
                })
            }
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                message: "error occured while inserting questions"
            })
        }   
    }; 
    // console.log(questionIdArray, 91);
    req.questionIdArray = questionIdArray
    next()
}

async function findExam(req, res, next) {
    const {main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id} = req.query
    if (!main_exam_id || !marks_id || !subject_id || !topic_id || !exam_type_id || !time_id) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {main_exam_id, marks_id, subject_id, topic_id, exam_type_id, time_id}
    try { 
        const response = await searchExamForUser(inputObject)
        if (response) {
            if(response.length === 0){
                
                return res.status(NOT_FOUND).json({
                    message: "No such exam is created"
                })
            } else {
                req.examId = response[0].id
                return res.status(OK).json({
                    message: "ok... there is an exam",
                    examId: response[0].id
                })
            }
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while searching for exam",
            error: error
        })
    }
}

async function prepExamForUser(req, res, next) {
    const {userId, examId} = req.query
    if (!userId || !examId) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputArray = [[userId, examId]]
    try {
        const response = await setUserGivenExamDetails(inputArray)
        
        if (response) {
            if(response.affectedRows !== 1){
                return res.status(EXPECTATION_FAILED).json({
                    message: "multiple rows affected"
                })
            }
            req.examDetailsId = response.insertId
            // return res.status(OK).json({
            //     message: "OK. Exam started"
            // })
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from database"
            })
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while preparing an exam"
        })
    }
    next()
}

async function getExamInfo(req, res, next) {
    const {examId} = req.query
    try {
        const response = await getExamDeailsWithOptions(examId);
        if (response) {
            if(response.length === 0){
                return res.status(NOT_FOUND).json({
                    message: "exam not found"
                })
            }
            req.examInfo = response
            // console.log(response);
            next()
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function assemblingExamInfo(req, res, next) {
    const examInfo = req.examInfo
    let questionArray = []
    let indexOfExamInfoData = 0
    let examDuration = examInfo[indexOfExamInfoData].exam_duration
    // console.log(examInfo.length, 198);
    
    while (indexOfExamInfoData < examInfo.length) {
        const element = examInfo[indexOfExamInfoData];
        const key = element.question_id
        let indexOfOptionInfoData = indexOfExamInfoData
        let noOfOptions = 0
        while (indexOfOptionInfoData < examInfo.length && key === examInfo[indexOfOptionInfoData].question_id) {
            indexOfOptionInfoData++;
            noOfOptions++;
        }

        // console.log(indexOfExamInfoData ,indexOfOptionInfoData, 211);

        // if (indexOfOptionInfoData === examInfo.length) { break; }
        
        const options = []
        while (indexOfExamInfoData < indexOfOptionInfoData) {
            const {
                options_opt_nm, options_details, options_is_description, option_id
            } = examInfo[indexOfExamInfoData]

            let optionObject = {}

            optionObject.option_id = option_id
            optionObject.options_opt_nm = options_opt_nm
            optionObject.options_details = options_details
            optionObject.options_is_description = options_is_description

            options.push(optionObject)
            indexOfExamInfoData++;
        }


        let questionObjectEntity = {}
        questionObjectEntity.question_details = element.question_details
        questionObjectEntity.question_is_description = element.question_is_description
        questionObjectEntity.correct_answer_key = element.correct_answer_key
        questionObjectEntity.options = options
        questionObjectEntity.explain_is_description = element.explain_is_description
        questionObjectEntity.question_explanation = element.question_explanation
        questionArray.push(questionObjectEntity)

        // console.log(indexOfExamInfoData ,indexOfOptionInfoData, 241);

        // indexOfExamInfoData += noOfOptions
        // console.log(indexOfExamInfoData, 237);
    }

    return res.status(OK).json({
        data: {
            exam_id : req.query.examId,
            question: questionArray,
            examDuration: examDuration
        }
    })

}

async function saveExamInfo(req, res, next) {
    let {total_answered, total_corrects, total_wrongs, userId, examId} = req.body

    if (!total_answered || !total_corrects || !total_wrongs ||!userId || !examId) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    total_answered = Number(total_answered)
    total_corrects = Number(total_corrects)
    total_wrongs = Number(total_wrongs)

    // console.log(total_answered, total_corrects, total_wrongs, typeof(total_answered) ,265);

    
    if (total_answered !== total_corrects + total_wrongs) {
        return res.status(BAD_REQUEST).json({
            message: "invalid information"
        })
    }

    const inputObj = {total_answered, total_corrects, total_wrongs, userId, examId}

    try {
        const response = await saveGivenExamInfo(inputObj);
        // console.log(response);
        if (response) {
            if (response.affectedRows === 0) {
                return res.status(NOT_MODIFIED).json({
                    message: "not modified"
                })
                
            } else if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "multiple rows affected while updating"
                })
            } 
            else {
                return res.status(OK).json({message: "OK.exam info updated"})
            }
        } else {
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database after update operation"
            })
        }
    } catch (error) {
        // console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating exam info"
        })
    }
}

async function getAllUserExamInfo(req, res, next) {
    const {userId} = req.query

    if (!userId) {
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }

    try {
        const response = await getAllExamsOfUserByID(userId)
        if (response) {
            if (response.length === 0) {
                return res.status(NOT_FOUND).json({
                    message: "no exam info with this userId"
                })
            } else {
                return res.status(OK).json(response)
            }
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "no response from the server"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "occor happened while  fetching all info of exams of an user"
        })
    }
}
module.exports = examMiddleWares;
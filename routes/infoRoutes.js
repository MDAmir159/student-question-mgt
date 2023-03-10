const { json } = require('body-parser');
const express = require('express');
const { BASE_LINK } = require('../config');
const upload = require('../config/multerConfig');
const { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY, EXPECTATION_FAILED, NOT_MODIFIED } = require('../HTTPStatus');
const { getAllMarksInfo, insertNewMark, updateMarks, getAllMainExamInfo, insertNewMainExam, updateMainExam, getAllExamTypeInfo, insertNewExamType, updateExamType, getAllSubjectInfo, insertNewSubject, updateSubject, getAllTimeInfo, insertNewTime, updateTime, getAllTopicInfo, insertNewTopic, updateTopic, getAllPlans, insertNewPlan, updatePlan, getAllSyllabuses, insertNewSyllabus, updateSyllabus, getAllNotices, insertNewNotice, updateNotice } = require('../queries/infoQueries');
const routes = express.Router();

routes.get('/marks', async (req, res) => {
    try {
        const response = await getAllMarksInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/marks', async (req, res) => {
    const {
        number, bn_name
    } = req.body;

    if(!number || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[number, bn_name]]

    try {
        const response = await insertNewMark(inputArray);
        if (response) {
            console.log("INSIDE");
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new marks entity",
                marksId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/marks', async(req, res) => {
    const {
        marksId, number, bn_name
    } = req.body

    // console.log(marksId, number, bn_name);

    if(!marksId || !number || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {marksId, number, bn_name}
    try {
        const response = await updateMarks(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/main_exam', async (req, res) => {
    try {
        const response = await getAllMainExamInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/main_exam', async (req, res) => {
    const {
        slug, bn_name
    } = req.body;

    if(!slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_name]]

    try {
        const response = await insertNewMainExam(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new main_exam entity",
                mainExamId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/main_exam', async(req, res) => {
    const {
        mainExamId, slug, bn_name
    } = req.body

    if(!mainExamId || !slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {mainExamId, slug, bn_name}
    try {
        const response = await updateMainExam(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/exam_type', async (req, res) => {
    try {
        const response = await getAllExamTypeInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/exam_type', async (req, res) => {
    const {
        slug, bn_name
    } = req.body;

    if(!slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_name]]

    try {
        const response = await insertNewExamType(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new exam_type entity",
                examTypeId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/exam_type', async(req, res) => {
    const {
        examTypeId, slug, bn_name
    } = req.body

    if(!examTypeId || !slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {examTypeId, slug, bn_name}
    try {
        const response = await updateExamType(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/subject', async (req, res) => {
    try {
        const response = await getAllSubjectInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/subject', async (req, res) => {
    const {
        slug, bn_name
    } = req.body;

    if(!slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_name]]

    try {
        const response = await insertNewSubject(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new subject entity",
                subjectId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/subject', async(req, res) => {
    const {
        subjectId, slug, bn_name
    } = req.body

    if(!subjectId || !slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {subjectId, slug, bn_name}
    try {
        const response = await updateSubject(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/time', async (req, res) => {
    try {
        const response = await getAllTimeInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/time', async (req, res) => {
    const {
        slug, bn_time, duration
    } = req.body;

    if(!slug || !bn_time || !duration){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_time, duration]]

    try {
        const response = await insertNewTime(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new time entity",
                timeId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark", error: error})
    }

})

routes.patch('/time', async(req, res) => {
    const {
        timeId, slug, bn_time, duration
    } = req.body
    if(!timeId || !slug || !bn_time || !duration){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {timeId, slug, bn_time, duration}
    try {
        const response = await updateTime(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/topic', async (req, res) => {
    try {
        const response = await getAllTopicInfo();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/topic', async (req, res) => {
    const {
        slug, bn_name
    } = req.body;

    if(!slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_name]]

    try {
        const response = await insertNewTopic(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new topic entity",
                topicId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark", error: error})
    }

})

routes.patch('/topic', async(req, res) => {
    const {
        topicId, slug, bn_name
    } = req.body
    if(!topicId || !slug || !bn_name){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {topicId, slug, bn_name}
    try {
        const response = await updateTopic(inputObject)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/plan', async (req, res) => {
    try {
        const response = await getAllPlans();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/plan', async (req, res) => {
    const {
        slug, bn_name, duration
    } = req.body;

    if(!slug || !bn_name || !duration){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_name, duration]]

    try {
        const response = await insertNewPlan(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new plan entity",
                planId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark", error: error})
    }

})

routes.patch('/plan', async(req, res) => {
    const {
        planId, slug, bn_name, duration
    } = req.body
    if(!planId || !slug || !bn_name || !duration){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {planId, slug, bn_name, duration}
    try {
        const response = await updatePlan(inputObject)
        // return res.send(response)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/syllabus', async (req, res) => {
    try {
        const response = await getAllSyllabuses();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/syllabus', async (req, res) => {
    const {
        slug, bn_title, item_link
    } = req.body;

    if(!slug || !bn_title || !item_link){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_title, item_link]]

    try {
        const response = await insertNewSyllabus(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new plan entity",
                syllabusId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/syllabus', async(req, res) => {
    const {
        syllabusId, slug, bn_title, item_link
    } = req.body
    if(!syllabusId || !slug || !bn_title || !item_link){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {syllabusId, slug, bn_title, item_link}
    try {
        const response = await updateSyllabus(inputObject)
        // return res.send(response)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info",
            error: error
        })
    }
})

routes.get('/notice', async (req, res) => {
    try {
        const response = await getAllNotices();
        return res.status(OK).json(response)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(error)
    }
})

routes.post('/notice', async (req, res) => {
    const {
        slug, bn_title, item_link
    } = req.body;

    if(!slug || !bn_title || !item_link){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary info missing"
        })
    }

    const inputArray = [[slug, bn_title, item_link]]

    try {
        const response = await insertNewNotice(inputArray);
        // console.log(response);
        if (response) {
            if (response.affectedRows !== 1) {
                return res.status(EXPECTATION_FAILED).json({
                    message: "database updated with unexpectation"
                })
            }
            return res.status(OK).json({
                message: "OK...created a new plan entity",
                noticeId: response.insertId
            })
        } else {
            return res.status(EXPECTATION_FAILED).json({message: "information not inserted"})
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({message : "error occured during posting a new mark"})
    }

})

routes.patch('/notice', async(req, res) => {
    const {
        noticeId, slug, bn_title, item_link
    } = req.body
    if(!noticeId || !slug || !bn_title || !item_link){
        return res.status(UNPROCESSABLE_ENTITY).json({
            message: "necessary information missing"
        })
    }
    const inputObject = {noticeId, slug, bn_title, item_link}
    try {
        const response = await updateNotice(inputObject)
        // return res.send(response)
        if(!response){
            return res.status(EXPECTATION_FAILED).json({
                message: "no response from the database"
            })
        }

        if (response.changedRows === 0) {
            return res.status(NOT_MODIFIED).json({
                message: "database not updated"
            })
        }
        else if (response.changedRows > 1) {
            return res.status(EXPECTATION_FAILED).json({
                message: "databsae updated unexpectedly"
            })
        }

        return res.status(OK).json({
            message: "OK...updated"
        })

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured while updating marks info"
        })
    }
})

routes.get('/upload_image', upload , async (req, res) => {
    try {
        if (req.file) {
            const image_link = BASE_LINK + 'images/' + `${req.file.filename}`;
            return res.status(OK).json({
                image_link: image_link
            })
        } else {
            return res.status(UNPROCESSABLE_ENTITY).json({
                message: "no image found"
            })
        }
        
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "error occured during image upload"
        })
    }
})

module.exports = routes;